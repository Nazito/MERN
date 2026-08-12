#!/usr/bin/env bash
# Run on the Oracle Always Free VM (Ubuntu 22.04 ARM recommended).
# Usage:
#   chmod +x setup-vm.sh
#   ./setup-vm.sh /opt/circle-backend
set -euo pipefail

APP_DIR="${1:-/opt/circle-backend}"
ENV_FILE="${APP_DIR}/.env"

echo "==> Installing Docker (if missing)"
if ! command -v docker >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo usermod -aG docker "$USER" || true
fi

echo "==> App dir: ${APP_DIR}"
sudo mkdir -p "${APP_DIR}"
sudo chown -R "$USER":"$USER" "${APP_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<'EOF'
NODE_ENV=production
PORT=5001
JWT_SECRET=change-me-to-a-long-random-string
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/app?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend.vercel.app
CLIENT_URLS=["https://your-frontend.vercel.app","http://localhost:3000"]
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EOF
  echo "Created ${ENV_FILE} — edit secrets before starting the container."
  echo "    nano ${ENV_FILE}"
  exit 0
fi

echo "==> Building image"
cd "${APP_DIR}"
if [[ ! -f Dockerfile ]]; then
  echo "Put backend sources (with Dockerfile) into ${APP_DIR} first."
  exit 1
fi

docker build -t circle-backend:latest .

echo "==> Starting container on :5001"
docker rm -f circle-backend 2>/dev/null || true
docker run -d \
  --name circle-backend \
  --restart unless-stopped \
  --env-file "${ENV_FILE}" \
  -p 5001:5001 \
  circle-backend:latest

echo "==> Done. Health check:"
sleep 2
curl -sS -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:5001/api/humans" || true
PUBLIC_IP="$(curl -sS ifconfig.me || true)"
echo "Public URL (open Security List port 5001): http://${PUBLIC_IP}:5001"
