# Security Review — Branch: chandra/claw_website

**Date:** 2026-03-01

---

## Vuln 1: RabbitMQ Management UI Exposed Publicly

**File:** `nginx.conf:109-113`
**Severity:** High
**Category:** `service_exposure`

**Description:** The RabbitMQ management dashboard (port 15672) is reverse-proxied to the public internet at `/rabbitmq/` with wildcard CORS:
```nginx
location /rabbitmq/ {
    proxy_pass http://rabbitmq:15672/;
    proxy_read_timeout 240s;
    add_header 'Access-Control-Allow-Origin' '*';
}
```
Even though RabbitMQ has its own authentication, exposing the management interface publicly increases attack surface significantly (brute-force, credential stuffing, known CVEs).

**Exploit Scenario:** An attacker discovers the `/rabbitmq/` endpoint, brute-forces the default `guest/guest` credentials (or any weak credentials), and gains full control over the message broker — reading messages, publishing malicious payloads, or disrupting service.

**Recommendation:** Remove this proxy location entirely, or restrict it with IP allowlisting or HTTP basic auth at the nginx level.

**Status:** [ ] Fixed

---

## Vuln 2: Missing Security Headers on Claw Server Block

**File:** `nginx.conf:161-176`
**Severity:** Low
**Category:** `hardening`

**Description:** The claw server block serving `claw.cerve.in` does not include standard security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

Without `X-Frame-Options`, the site can be embedded in iframes on any domain (clickjacking).

**Recommendation:** Add security headers to the claw server block:
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Status:** [ ] Fixed

---

## Vuln 3: Seller Dockerfile Uses EOL Node 14

**File:** `Dockerfile:2`
**Severity:** Low
**Category:** `outdated_runtime`

**Description:** The seller builder stage uses `node:14`, which reached End-of-Life in April 2023 and no longer receives security patches. The claw builder stage correctly uses `node:18`.
```dockerfile
FROM node:14 AS seller-builder
```

**Recommendation:** Upgrade to at least `node:18` (or `node:20` for current LTS):
```dockerfile
FROM node:18 AS seller-builder
```

**Status:** [ ] Fixed
