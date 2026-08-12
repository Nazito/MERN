# Oracle Cloud Always Free — Circle backend

## 1. Create Always Free VM (console)

1. Sign up: https://www.oracle.com/cloud/free/
2. **Compute → Instances → Create instance**
   - Image: **Canonical Ubuntu 22.04** (aarch64 if Ampere)
   - Shape: **VM.Standard.A1.Flex** (Ampere) — e.g. 1 OCPU / 6 GB (Always Free eligible)
   - Networking: assign **public IPv4**
   - Upload/download your **SSH key**
3. **Networking → VCN → Security List → Ingress Rules → Add**:
   - Source: `0.0.0.0/0`
   - Protocol: TCP
   - Destination port: **5001**
4. Note **Public IP** of the instance.

## 2. Copy backend to the VM

From your Mac (repo root), after the VM is up:

```bash
# replace values
export VM_IP=x.x.x.x
export SSH_KEY=~/.ssh/oracle_circle

scp -i "$SSH_KEY" -r backend/* ubuntu@$VM_IP:/tmp/circle-backend-upload/
scp -i "$SSH_KEY" deploy/oracle/setup-vm.sh ubuntu@$VM_IP:~/
```

Or clone the git repo on the VM if it is public.

## 3. On the VM

```bash
ssh -i "$SSH_KEY" ubuntu@$VM_IP

chmod +x ~/setup-vm.sh
sudo mkdir -p /opt/circle-backend
sudo chown ubuntu:ubuntu /opt/circle-backend
cp -R /tmp/circle-backend-upload/* /opt/circle-backend/

# first run creates /opt/circle-backend/.env
./setup-vm.sh /opt/circle-backend
nano /opt/circle-backend/.env   # paste Atlas, JWT, Cloudinary, CLIENT_URL

# build + run
./setup-vm.sh /opt/circle-backend
```

## 4. Point frontend at the backend

On Vercel / local frontend env:

```
BACKEND_URL=http://VM_PUBLIC_IP:5001
NEXT_PUBLIC_SOCKET_URL=http://VM_PUBLIC_IP:5001
```

Next.js rewrites should proxy `/api/*` to that `BACKEND_URL` (except `/api/nextauth`).

Backend `.env` `CLIENT_URL` / `CLIENT_URLS` must include your frontend origin (Vercel URL).

## 5. Useful Docker commands on VM

```bash
docker logs -f circle-backend
docker restart circle-backend
```

## Notes

- Atlas Network Access: allow `0.0.0.0/0` or the VM public IP.
- Prefer HTTPS later (nginx + Let's Encrypt on 443); for a first test HTTP `:5001` is enough.
- Always Free Ampere capacity is sometimes unavailable in a region — try another home region or AMD micro shape if create fails.
