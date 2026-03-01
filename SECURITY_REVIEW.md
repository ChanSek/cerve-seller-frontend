# Security Review — Branch: chandra/claw_website

**Date:** 2026-03-01

---

## Vuln 1: Shopify Access Token Exposed in POST URL Query Parameters

**File:** `src/Api/shopify.js:23`
**Severity:** High
**Category:** `credential_exposure`

**Description:** The `completeShopifyOnboarding` function sends the Shopify OAuth access token as a URL query parameter rather than in the POST request body:
```javascript
const response = await postCall(
  `/api/v1/adapter/shopify/auth/complete-onboarding?shop=${shop}&accessToken=${accessToken}&scope=${scope}`,
  { merchantId, storeId }
);
```
The `postCall` wrapper passes the URL directly to axios, so the access token remains in the URL. This means the token is logged in web server access logs (nginx), visible in browser developer tools network tab, and potentially captured by proxies, CDNs, or monitoring infrastructure.

**Exploit Scenario:** An attacker with access to nginx access logs, load balancer logs, or any intermediate proxy logs can extract the long-lived Shopify access token. With `write_products` scope, they can modify product listings, read store data, or perform unauthorized operations on the merchant's Shopify store.

**Recommendation:** Move all sensitive parameters into the POST request body:
```javascript
const response = await postCall(
  `/api/v1/adapter/shopify/auth/complete-onboarding`,
  { shop, accessToken, scope, merchantId, storeId }
);
```

**Status:** [ ] Fixed

---

## Vuln 2: Shopify Access Token Passed via Browser Redirect URL

**File:** `src/Components/Application/Shopify/ShopifyCallback.jsx:38`
**Severity:** High
**Category:** `credential_exposure`

**Description:** The OAuth callback flow redirects the browser to a URL containing the actual Shopify access token as a query parameter:
```javascript
const accessToken = searchParams.get("accessToken");
```
This means the backend redirects to something like `/application/shopify/callback?accessToken=shpat_xxxxx&shop=...`. Standard OAuth flows pass short-lived authorization codes in URLs (not long-lived access tokens). The access token is exposed in browser history, the Referer header on subsequent navigation, browser extensions with URL access, and shared/public computer scenarios.

**Exploit Scenario:** (1) A browser extension or tracking script captures the URL containing the access token. (2) If the user navigates to an external link from the callback page, the full URL with the token leaks via the `Referer` header. (3) On a shared computer, the token persists in browser history indefinitely, allowing any subsequent user to extract it.

**Recommendation:** The backend should complete the token exchange entirely server-side, store the token securely, and redirect the browser with only a non-sensitive reference identifier (e.g., a connection ID or status). The access token should never appear in a browser URL.

**Status:** [ ] Fixed
