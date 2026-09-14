# AWS deployment

Public site: **https://motion.whyjs.com**.

Motion Study uses the existing Grove host. nginx serves committed static assets from a dedicated versioned release directory. The application needs no database, Node process, API keys, or new compute resources.

## Deploy

Prerequisites: Python 3, Node.js 20+, AWS CLI, SSH/SCP, a matching local SSH private/public key pair, and an already-trusted server host key. The `lighthouse` profile needs access to inspect the intended EC2 instance and send a temporary EC2 Instance Connect key.

```sh
python3 deploy/aws.py \
  --profile lighthouse \
  --region ca-central-1 \
  --expected-account YOUR_AWS_ACCOUNT_ID \
  --instance-id YOUR_GROVE_INSTANCE_ID
```

The default key is `~/.ssh/id_rsa`; override it with `--ssh-key`. Account and instance identifiers are maintained in the operator’s deployment records. DNS for `motion.whyjs.com` must already resolve to the selected instance.

The command:

1. Verifies the AWS account, running instance, and public DNS.
2. Rejects uncommitted `dist/` changes and runs `npm run build`.
3. Packages only regular files committed under `HEAD:dist`. Adds `version.json` containing the source commit, release identifier, and SHA-256 hashes.
4. Uses temporary EC2 Instance Connect authorization and uploads the archive over SSH. No credentials are packaged or stored in the repository.
5. Verifies the archive and asset checksums on the server, creates a versioned release, and atomically activates `/opt/motion-study/current`.
6. Configures only the dedicated nginx host, obtaining HTTPS through the server’s existing Certbot account when needed. Syntax-checks nginx before reloads and restores the previous activation on failure.
7. Verifies the HTTPS release manifest and saves the receipt in ignored `.deploy/last-release.json`.

Only `dist/` is deployed. Source, Git metadata, scripts, and documentation are not exposed by the web root. A deployment does not push Git commits automatically.

## Operations

- Release directory: `/opt/motion-study/releases/<timestamp>-<commit>`
- Active release: `/opt/motion-study/current`
- nginx host: `/etc/nginx/sites-available/motion.whyjs.com`
- Logs: `/var/log/nginx/motion-study.{access,error}.log`
- ACME directory: `/var/www/motion-study-acme`
- Renewal: existing Certbot timer plus a nginx reload hook
- Release manifest: https://motion.whyjs.com/version.json

Previous releases are retained. To roll back, point `current` atomically to the chosen existing release, validate nginx, and verify the manifest. Use a fresh temporary link name:

```sh
sudo ln -sT /opt/motion-study/releases/PREVIOUS_RELEASE /opt/motion-study/.manual-rollback
sudo mv -Tf /opt/motion-study/.manual-rollback /opt/motion-study/current
sudo nginx -t
sudo systemctl reload nginx
curl --fail https://motion.whyjs.com/version.json
```

The initial deployment uses `Cache-Control: no-cache` because filenames are stable across releases. nginx provides the byte ranges needed by the video players.

## Verify

Verify the public manifest and asset hashes, video byte-range responses, and the gallery and interactive demos in a browser. Confirm Grove and other shared-host sites remain healthy. See [reference credits](reference.md) for the artwork’s separate reuse limitations.
