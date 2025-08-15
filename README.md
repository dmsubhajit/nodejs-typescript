# Node.js TypeScript Backend

## Features

- Express.js API with TypeScript
- PostgreSQL database using Sequelize ORM
- Dockerized for easy deployment
- CI/CD pipeline with GitHub Actions

## Getting Started

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.

```sh
cp .env.example .env
```

### 2. Run PostgreSQL Locally with Docker

You can start a PostgreSQL container for local development:

```sh
docker run --name postgres-db \ 
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=appdb \
  -p 5432:5432 \
  -d postgres:16 \
  -c 'password_encryption=md5' \
  -c 'listen_addresses=*'
```

Update your `.env` file to match these credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=appdb
```

### 3. Local Development

Install dependencies and run the app:

```sh
npm install
npm run build
npm start
```

### 4. Docker

Build and run the Docker container:

```sh
docker build -t node-backend .
docker run --env-file .env -p 3000:3000 node-backend
```

### 5. CI/CD

GitHub Actions workflow (`.github/workflows/cicd.yml`) builds and pushes Docker images to GHCR on every push to `main`.

## Project Structure

```
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── test/
├── public/
├── dist/
├── .env.example
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- Ensure your PostgreSQL server is running and accessible.
- The Dockerfile uses a multi-stage build for smaller images and runs as a non-root user.
- The CI/CD pipeline tags images with the short commit SHA and branch name.

## Deploying to Google Cloud Platform (GCP) with PostgreSQL

#### Prerequisites
- A Google Cloud project and billing enabled.
- Domain (optional) if you want a hostname.
- Local shell with ssh

### Create Ubuntu 22.04 VM on GCP
GCP Console (point & click)

1) Compute Engine → VM instances → Create instance
2) Name: node-pg-prod, Region/Zone: asia-south1.
3) Machine type: e2-standard-2.
4) Boot disk → Ubuntu 22.04 LTS → Standard persistent disk → Size 30 GB.
5) Networking → Network tags: add app-server
6) Firewall: check Allow HTTP and Allow HTTPS (optional; you can also use custom rules below).
7) Create the VM.
8) Reserve a static IP: VPC Network → External IP addresses → change the VM’s ephemeral IP to Static (name it ip-node-pg-prod).

### Create an SSH key pair (local) and add to VM
On your local machine:
```sh
ssh-keygen -t ed25519 -C "deploy@node-pg-prod" -f ~/.ssh/gcp-node-deploy -N ""
```
The command produces:
Private key: ~/.ssh/gcp-node-deploy
Public key:  ~/.ssh/gcp-node-deploy.pub

#### Add the public key to the VM
Quick way via Console: VM instances → INSTANCE_NAME → Edit → SSH Keys → paste the contents of ~/.ssh/gcp-node-deploy.pub

Test SSH from local:
```sh
ssh -i ~/.ssh/gcp-node-deploy deploy@<VM_PUBLIC_IP>

# Update base system
sudo apt update && sudo apt -y upgrade
```
You will also add the private key to GitHub repo secrets later for CI deploys.


### Install PostgreSQL
```sh
sudo apt -y install curl ca-certificates gnupg
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(. /etc/os-release && echo $UBUNTU_CODENAME)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt -y install postgresql-16 postgresql-client-16
```
#### Create database, user, and password

```sh 
sudo -u postgres psql <<'SQL'
CREATE USER db_user WITH PASSWORD 'db_pass' LOGIN;
CREATE DATABASE db_name OWNER db_user;
GRANT ALL PRIVILEGES ON DATABASE db_name TO db_user;
ALTER ROLE db_user SET client_min_messages TO WARNING;
SQL
```
change db_user,db_pass,db_name accouding to your requrement 
```sh
#Restart to be safe:
sudo systemctl enable postgresql
sudo systemctl restart postgresql
```

### Install Docker Engine & Compose plugin
```sh
# Remove old packages if any
sudo apt -y remove docker docker-engine docker.io containerd runc || true

# Install using Docker’s official repo
sudo apt -y update
sudo apt -y install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt -y update
sudo apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow $APP_USER (deploy) to use docker without sudo
sudo usermod -aG docker deploy
sudo usermod -ag docker $USER
newgrp docker

# Enable services
sudo systemctl enable docker
sudo systemctl start docker
```
The ```docker run hello-world``` command should download and run a test image, printing a "Hello from Docker!" message.