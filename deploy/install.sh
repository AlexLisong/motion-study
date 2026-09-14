#!/usr/bin/env bash
set -Eeuo pipefail
umask 022

archive=$1
release=$2
checksum=$3
[[ "$release" =~ ^[0-9]{8}T[0-9]{6}Z-[0-9a-f]{12}$ ]]
[[ "$checksum" =~ ^[0-9a-f]{64}$ ]]
printf '%s  %s\n' "$checksum" "$archive" | sha256sum --check --status
exec 9>/var/lock/motion-study-deploy.lock
flock -n 9 || { echo 'Another Motion Study deployment is running.' >&2; exit 1; }
test -s /etc/letsencrypt/options-ssl-nginx.conf
test -s /etc/letsencrypt/ssl-dhparams.pem

base=/opt/motion-study
host=motion.whyjs.com
config=/etc/nginx/sites-available/motion.whyjs.com
enabled=/etc/nginx/sites-enabled/motion.whyjs.com
acme=/var/www/motion-study-acme
work=$(mktemp -d /var/tmp/motion-study-install.XXXXXX)
previous=$(readlink "$base/current" || true)
had_config=false
had_enabled=false
[[ ! -e "$config" ]] || { cp -a "$config" "$work/previous-nginx"; had_config=true; }
[[ ! -L "$enabled" ]] || had_enabled=true
if [[ -e "$enabled" && ! -L "$enabled" ]]; then echo 'Unexpected non-symlink nginx site.' >&2; exit 1; fi
if [[ -L "$enabled" && "$(readlink "$enabled")" != "$config" ]]; then echo 'Unexpected nginx site target.' >&2; exit 1; fi
if [[ -e "$base/current" && ! -L "$base/current" ]]; then echo 'Unexpected current release directory.' >&2; exit 1; fi
activated=false
next="$base/.next-$release"
rollback_link="$base/.rollback-$release"
rollback() {
    code=$?
    trap - EXIT
    set +e
    restore_failed=false
    if [[ "$code" != 0 && "$activated" == true ]]; then
        if [[ -n "$previous" ]]; then
            ln -sT "$previous" "$rollback_link" && mv -Tf "$rollback_link" "$base/current" || restore_failed=true
        else rm -f "$base/current" || restore_failed=true; fi
        if [[ "$had_config" == true ]]; then cp -a "$work/previous-nginx" "$config" || restore_failed=true; else rm -f "$config" || restore_failed=true; fi
        if [[ "$had_enabled" == true ]]; then ln -sfn "$config" "$enabled" || restore_failed=true; else rm -f "$enabled" || restore_failed=true; fi
        nginx -t && systemctl reload nginx || restore_failed=true
        if [[ "$restore_failed" == true ]]; then
            echo "Deployment failed; rollback needs inspection. Backup retained at $work." >&2
        else echo 'Deployment failed; previous Motion Study activation restored.' >&2; fi
    fi
    rm -f -- "$next" "$rollback_link"
    if [[ "$restore_failed" != true ]]; then rm -rf -- "$work"; fi
    exit "$code"
}
trap rollback EXIT
install -d -m 755 "$base/releases" "$acme/.well-known/acme-challenge"
target="$base/releases/$release"
[[ ! -e "$target" ]] || { echo 'Release already exists; refusing to overwrite.' >&2; exit 1; }
install -d -m 755 "$target"
python3 - "$archive" "$target" <<'PY'
import hashlib, json, pathlib, sys, tarfile
target = pathlib.Path(sys.argv[2])
with tarfile.open(sys.argv[1]) as archive:
    for member in archive.getmembers():
        path = pathlib.PurePosixPath(member.name)
        if not member.isfile() or path.is_absolute() or '..' in path.parts or member.name.startswith('.'):
            raise SystemExit('Archive contains an unsafe or nonregular file.')
        out = target / path
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(archive.extractfile(member).read())
manifest = json.loads((target / 'version.json').read_text())
for name, expected in manifest['sha256'].items():
    if hashlib.sha256((target / name).read_bytes()).hexdigest() != expected:
        raise SystemExit('Asset checksum mismatch: ' + name)
if not (target / 'index.html').is_file():
    raise SystemExit('Missing entrypoint.')
PY
chown -R root:root "$target"
find "$target" -type d -exec chmod 755 {} +
find "$target" -type f -exec chmod 644 {} +

# Bootstrap only this host for the existing Certbot account's HTTP challenge.
cat > "$work/http.conf" <<EOF
server {
    listen 80;
    server_name $host;
    root $base/current;
    index index.html;
    location ^~ /.well-known/acme-challenge/ { root $acme; }
    location / { try_files \$uri \$uri/ =404; }
}
EOF
activated=true
ln -sT "$target" "$next"
mv -Tf "$next" "$base/current"
if [[ ! -s "/etc/letsencrypt/live/$host/fullchain.pem" ]]; then
    install -m 644 "$work/http.conf" "$config"
    ln -sfn "$config" "$enabled"
    nginx -t
    systemctl reload nginx
    timeout 180 certbot certonly --non-interactive --webroot -w "$acme" --cert-name "$host" -d "$host" --keep-until-expiring
fi

cat > "$work/https.conf" <<EOF
server {
    listen 80;
    server_name $host;
    location ^~ /.well-known/acme-challenge/ { root $acme; }
    location / { return 301 https://$host\$request_uri; }
}
server {
    listen 443 ssl;
    server_name $host;
    ssl_certificate /etc/letsencrypt/live/$host/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$host/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    root $base/current;
    index index.html;
    access_log /var/log/nginx/motion-study.access.log;
    error_log /var/log/nginx/motion-study.error.log;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Cache-Control "no-cache" always;
    location ~ /\. { deny all; }
    location / { try_files \$uri \$uri/ =404; }
}
EOF
install -m 644 "$work/https.conf" "$config"
ln -sfn "$config" "$enabled"
nginx -t
systemctl reload nginx
install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
printf '#!/bin/sh\nnginx -t && systemctl reload nginx\n' > /etc/letsencrypt/renewal-hooks/deploy/motion-study-nginx
chmod 755 /etc/letsencrypt/renewal-hooks/deploy/motion-study-nginx
for attempt in $(seq 1 20); do
    if curl --fail --silent --show-error --connect-timeout 3 --max-time 8 --resolve "$host:443:127.0.0.1" "https://$host/version.json" -o "$work/live-version.json" 2>/dev/null && python3 -c 'import json,sys; assert json.load(open(sys.argv[1]))["release"] == sys.argv[2]' "$work/live-version.json" "$release" 2>/dev/null; then
        activated=false
        printf 'Motion Study release %s is active.\n' "$release"
        exit 0
    fi
    sleep 2
done
echo 'HTTPS activation did not become healthy.' >&2
exit 1
