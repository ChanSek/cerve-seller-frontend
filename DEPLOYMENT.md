# Deployment Guide

## Infrastructure

| Service | Domain | Droplet | Path on Server |
|---|---|---|---|
| Seller App | seller.cerve.in | `seller-prod-web` (159.65.152.159) | `/var/www/seller` |
| Claw Website | claw.cerve.in | `seller-prod-web` (159.65.152.159) | `/var/www/claw` |

Both sites are served by nginx directly on the droplet (no Docker). SSL is managed by Certbot (Let's Encrypt).

SSH config alias: `seller-prod-web` → defined in `~/.ssh/config`

---

## Deploying the Claw Website (`claw/`)

```bash
# 1. Build
cd cerve-seller-frontend/claw
npm run build

# 2. Deploy to server
scp -r dist/* seller-prod-web:/var/www/claw/
```

---

## Deploying the Seller App (`src/`)

```bash
# 1. Build
cd cerve-seller-frontend
npm run build

# 2. Deploy to server
scp -r build/* seller-prod-web:/var/www/seller/
```

---

## First-Time Setup (already done — for reference only)

### Nginx config for a new subdomain
Create `/etc/nginx/sites-available/<subdomain>.config` on the droplet, then:

```bash
sudo ln -s /etc/nginx/sites-available/<subdomain>.config /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL certificate for a new subdomain
Ensure the DNS A record points to the droplet, then:

```bash
sudo certbot --nginx -d <subdomain>.cerve.in
```

### DNS
All subdomains point to `159.65.152.159` via A records in the domain registrar.
