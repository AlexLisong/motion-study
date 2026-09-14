#!/usr/bin/env python3
"""Deploy committed static assets to the existing Grove AWS host."""
import argparse
import hashlib
import io
import json
import pathlib
import shlex
import socket
import subprocess
import tarfile
import tempfile
import uuid
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parents[1]


def run(args, **kwargs):
    return subprocess.run(args, cwd=ROOT, check=True, **kwargs)


def output(args):
    return run(args, stdout=subprocess.PIPE, text=True).stdout.strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', default='lighthouse')
    parser.add_argument('--region', default='ca-central-1')
    parser.add_argument('--instance-id', required=True)
    parser.add_argument('--expected-account', required=True)
    parser.add_argument('--ssh-key', type=pathlib.Path, default=pathlib.Path.home() / '.ssh/id_rsa')
    args = parser.parse_args()
    aws = ['aws', '--profile', args.profile, '--region', args.region]
    identity = json.loads(output(aws + ['sts', 'get-caller-identity']))
    if identity['Account'] != args.expected_account:
        raise SystemExit('AWS account does not match --expected-account.')
    instance = json.loads(output(aws + ['ec2', 'describe-instances', '--instance-ids', args.instance_id]))['Reservations'][0]['Instances'][0]
    if instance['State']['Name'] != 'running':
        raise SystemExit('Target instance is not running.')
    ip = instance['PublicIpAddress']
    if ip not in socket.gethostbyname_ex('motion.whyjs.com')[2]:
        raise SystemExit('motion.whyjs.com does not resolve to the target instance.')
    key = args.ssh_key.expanduser().resolve()
    public_key = pathlib.Path(str(key) + '.pub')
    if not key.is_file() or not public_key.is_file():
        raise SystemExit('The SSH key and matching .pub file must exist.')
    if output(['git', 'status', '--porcelain', '--', 'dist']):
        raise SystemExit('Commit changes in dist before deployment.')
    run(['npm', 'run', 'build'])
    commit = output(['git', 'rev-parse', 'HEAD'])
    release = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ') + '-' + commit[:12]
    ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'IdentitiesOnly=yes', '-i', str(key), 'ubuntu@' + ip]
    scp = ['scp', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'IdentitiesOnly=yes', '-i', str(key)]

    def authorize():
        result = json.loads(output(aws + ['ec2-instance-connect', 'send-ssh-public-key', '--instance-id', args.instance_id, '--availability-zone', instance['Placement']['AvailabilityZone'], '--instance-os-user', 'ubuntu', '--ssh-public-key', public_key.as_uri()]))
        if not result.get('Success'):
            raise RuntimeError('EC2 Instance Connect authorization failed.')

    with tempfile.TemporaryDirectory(prefix='motion-study-') as temp:
        bundle = pathlib.Path(temp) / 'site.tar.gz'
        hashes = {}
        with tarfile.open(bundle, 'w:gz') as archive:
            entries = run(['git', 'ls-tree', '-r', '-z', 'HEAD', '--', 'dist'], stdout=subprocess.PIPE).stdout.split(b'\0')
            for entry in filter(None, entries):
                metadata, raw_path = entry.split(b'\t', 1)
                mode, kind, blob = metadata.decode().split()
                if mode not in ('100644', '100755') or kind != 'blob':
                    raise RuntimeError('Only regular committed files are deployable.')
                name = pathlib.PurePosixPath(raw_path.decode()).relative_to('dist').as_posix()
                if name == 'version.json':
                    raise RuntimeError('version.json is reserved for the deployment manifest.')
                data = run(['git', 'cat-file', 'blob', blob], stdout=subprocess.PIPE).stdout
                hashes[name] = hashlib.sha256(data).hexdigest()
                info = tarfile.TarInfo(name)
                info.size, info.mode = len(data), 0o644
                archive.addfile(info, io.BytesIO(data))
            if 'index.html' not in hashes:
                raise RuntimeError('Committed dist/index.html is missing.')
            manifest = json.dumps({'source_commit': commit, 'release': release, 'sha256': hashes}, indent=2).encode()
            info = tarfile.TarInfo('version.json')
            info.size, info.mode = len(manifest), 0o644
            archive.addfile(info, io.BytesIO(manifest))
        checksum = hashlib.sha256(bundle.read_bytes()).hexdigest()
        remote = '/tmp/motion-study-' + uuid.uuid4().hex
        authorize()
        run(ssh + [shlex.join(['mkdir', '-m', '700', remote])])
        try:
            authorize()
            run(scp + [str(bundle), str(ROOT / 'deploy/install.sh'), 'ubuntu@' + ip + ':' + remote + '/'])
            authorize()
            run(ssh + [shlex.join(['sudo', 'bash', remote + '/install.sh', remote + '/site.tar.gz', release, checksum])])
        finally:
            try:
                authorize()
                run(ssh + [shlex.join(['rm', '-rf', '--', remote])])
            except (subprocess.CalledProcessError, RuntimeError, OSError, ValueError):
                print('Temporary upload cleanup was unavailable; deployment result is unchanged.')
        state = ROOT / '.deploy'
        state.mkdir(exist_ok=True)
        (state / 'last-release.json').write_text(json.dumps({'url': 'https://motion.whyjs.com', 'source_commit': commit, 'release': release, 'instance_id': args.instance_id, 'region': args.region}, indent=2) + '\n')
        print('Deployed https://motion.whyjs.com — ' + release)


if __name__ == '__main__':
    main()
