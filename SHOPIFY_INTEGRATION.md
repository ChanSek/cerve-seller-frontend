# Shopify Integration - Frontend Implementation

## Overview

This document describes the Shopify integration implementation in the Cerve seller frontend application. The integration allows sellers to connect their Shopify stores and sync products directly into the Cerve platform.

## Features Implemented

✅ **Connect Shopify Store** - OAuth-based store connection flow
✅ **Sync Products** - Manual product synchronization from Shopify to Cerve
✅ **OAuth Callback Handling** - Automated callback processing after authorization
✅ **Error Handling** - Comprehensive error handling with user feedback
✅ **Progress Tracking** - Real-time sync status and progress indicators

## Architecture

### Components

#### 1. ConnectShopifyDialog (`src/Components/Application/Shopify/ConnectShopifyDialog.jsx`)

A dialog component that allows users to initiate the Shopify OAuth flow.

**Features:**
- Shop name input with validation
- Automatic removal of `.myshopify.com` suffix
- OAuth flow initiation
- Stores merchant and store IDs in localStorage for callback handling

**Usage:**
```jsx
import ConnectShopifyDialog from "../Shopify/ConnectShopifyDialog";

<ConnectShopifyDialog
  open={shopifyConnectOpen}
  onClose={() => setShopifyConnectOpen(false)}
/>
```

#### 2. SyncShopifyDialog (`src/Components/Application/Shopify/SyncShopifyDialog.jsx`)

A dialog component for triggering product synchronization from connected Shopify stores.

**Features:**
- Lists connected Shopify stores
- Configurable sync options (sync all vs incremental)
- Adjustable product limit per sync (1-250)
- Real-time sync progress indicator
- Detailed sync results with error reporting
- Automatic product list refresh after successful sync

**Usage:**
```jsx
import SyncShopifyDialog from "../Shopify/SyncShopifyDialog";

<SyncShopifyDialog
  open={shopifySyncOpen}
  onClose={() => setShopifySyncOpen(false)}
  refreshProducts={handleRefresh}
  merchantId={merchantId}
  storeId={storeId}
/>
```

#### 3. ShopifyCallback (`src/Components/Application/Shopify/ShopifyCallback.jsx`)

A dedicated page component that handles the OAuth callback redirect from Shopify.

**Features:**
- Processes OAuth authorization code
- Completes store onboarding (if access token provided)
- Shows loading, success, and error states
- Automatic redirect to inventory page
- Cleans up temporary localStorage data

**Route:**
```
/application/shopify/callback
```

### API Functions (`src/Api/shopify.js`)

#### `initiateShopifyOAuth(shopName)`
Redirects user to Shopify OAuth authorization page.

**Parameters:**
- `shopName` (string): Shopify store name without `.myshopify.com`

**Example:**
```javascript
initiateShopifyOAuth('mystore');
// Redirects to: {REACT_APP_BASE_URL}/api/v1/adapter/shopify/auth/install?shop=mystore
```

#### `completeShopifyOnboarding(shop, accessToken, scope, merchantId, storeId)`
Completes the store onboarding after OAuth authorization.

**Parameters:**
- `shop` (string): Full Shopify store domain (e.g., mystore.myshopify.com)
- `accessToken` (string): OAuth access token
- `scope` (string): Granted OAuth scopes
- `merchantId` (string): Cerve merchant UUID
- `storeId` (string): Cerve store UUID

**Returns:**
```javascript
{
  shopifyStoreId: "uuid",
  shopDomain: "mystore.myshopify.com",
  isActive: true,
  onboardedAt: "2025-11-16T12:00:00Z"
}
```

#### `syncShopifyProducts(shopifyStoreId, syncAll, limit, sinceId)`
Triggers product synchronization from Shopify.

**Parameters:**
- `shopifyStoreId` (string): UUID of connected Shopify store
- `syncAll` (boolean): Sync all products vs incremental (default: true)
- `limit` (number): Max products per sync (default: 50, max: 250)
- `sinceId` (string, optional): Only sync products after this Shopify product ID

**Returns:**
```javascript
{
  success: true,
  data: {
    totalProducts: 50,
    syncedProducts: 48,
    failedProducts: 2,
    errors: [
      "Product 123: Invalid price format",
      "Product 456: Missing required field"
    ]
  },
  message: "Product sync completed"
}
```

#### `getProductMappings(shopifyStoreId)`
Retrieves all product mappings between Shopify and Cerve.

**Returns:**
```javascript
[
  {
    shopifyProductId: 123456789,
    cerveProductId: "uuid",
    syncStatus: "SYNCED",
    lastSyncedAt: "2025-11-16T12:30:00Z"
  }
]
```

#### `getShopifyStores(merchantId)`
Gets all connected Shopify stores for a merchant.

**Returns:**
```javascript
[
  {
    shopifyStoreId: "uuid",
    shopDomain: "mystore.myshopify.com",
    isActive: true,
    onboardedAt: "2025-11-16T12:00:00Z"
  }
]
```

## Integration in Inventory Page

The Shopify integration has been added to the Inventory page (`src/Components/Application/Inventory/Inventory.jsx`).

### UI Changes

Two new buttons added in the action toolbar:

1. **CONNECT SHOPIFY** - Opens the ConnectShopifyDialog
2. **SYNC SHOPIFY** - Opens the SyncShopifyDialog

### State Management

```javascript
const [shopifyConnectOpen, setShopifyConnectOpen] = useState(false);
const [shopifySyncOpen, setShopifySyncOpen] = useState(false);
const [merchantId, setMerchantId] = useState('');
```

### LocalStorage Usage

The following keys are used for OAuth flow coordination:

- `organization_id` - Merchant ID
- `store_id` - Store ID
- `shopify_merchant_id` - Temporary storage during OAuth (cleared after callback)
- `shopify_store_id` - Connected Shopify store UUID (persisted)

## OAuth Flow Diagram

```
┌─────────┐                ┌──────────┐                ┌─────────┐
│ Cerve   │                │  Shopify │                │ Backend │
│ Frontend│                │  OAuth   │                │   API   │
└────┬────┘                └────┬─────┘                └────┬────┘
     │                          │                           │
     │ 1. Click "Connect"       │                           │
     ├──────────────────────────┼──────────────────────────►│
     │ /auth/install?shop=xxx   │                           │
     │                          │                           │
     │ 2. Redirect to Shopify   │                           │
     │◄─────────────────────────┼───────────────────────────┤
     │                          │                           │
     │ 3. User authorizes       │                           │
     ├─────────────────────────►│                           │
     │                          │                           │
     │ 4. OAuth callback        │                           │
     │◄─────────────────────────┤                           │
     │ /auth/callback?code=...  │                           │
     │                          │                           │
     │ 5. Backend exchanges code│                           │
     │                          ├──────────────────────────►│
     │                          │ for access token          │
     │                          │                           │
     │ 6. Redirect to frontend  │                           │
     │◄─────────────────────────┼───────────────────────────┤
     │ /shopify/callback        │                           │
     │                          │                           │
     │ 7. Complete onboarding   │                           │
     ├──────────────────────────┼──────────────────────────►│
     │ POST /auth/complete      │                           │
     │                          │                           │
     │ 8. Store connected!      │                           │
     │◄─────────────────────────┼───────────────────────────┤
     │                          │                           │
```

## Product Sync Flow

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ Cerve   │                │ Backend │                │ Shopify │
│ Frontend│                │   API   │                │   API   │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │ 1. Click "Sync Shopify"  │                          │
     ├─────────────────────────►│                          │
     │ POST /products/sync      │                          │
     │                          │                          │
     │                          │ 2. Fetch products        │
     │                          ├─────────────────────────►│
     │                          │ GET /products.json       │
     │                          │                          │
     │                          │ 3. Product list          │
     │                          │◄─────────────────────────┤
     │                          │                          │
     │                          │ 4. Transform & Save      │
     │                          │ to Cerve DB              │
     │                          │                          │
     │ 5. Sync results          │                          │
     │◄─────────────────────────┤                          │
     │ {synced: 48, failed: 2}  │                          │
     │                          │                          │
     │ 6. Refresh inventory     │                          │
     ├─────────────────────────►│                          │
     │ GET /products            │                          │
     │                          │                          │
```

## Backend Configuration Requirements

### Environment Variables

No additional frontend environment variables required! The integration uses the existing `REACT_APP_BASE_URL`.

### Backend Endpoints Required

Ensure the following backend endpoints are available:

- `GET /api/v1/adapter/shopify/auth/install?shop={shop}`
- `GET /api/v1/adapter/shopify/auth/callback` (auto-handled by Shopify)
- `POST /api/v1/adapter/shopify/auth/complete-onboarding`
- `POST /api/v1/adapter/shopify/products/sync`
- `GET /api/v1/adapter/shopify/products/mappings/{shopifyStoreId}`
- `GET /api/v1/adapter/shopify/stores?merchantId={merchantId}` (optional)

### Shopify OAuth Redirect URI

Configure the following redirect URI in your Shopify app settings:

```
{BACKEND_URL}/api/v1/adapter/shopify/auth/callback
```

The backend should then redirect to the frontend callback page:

```
{FRONTEND_URL}/application/shopify/callback?code=...&shop=...
```

## Error Handling

### Common Errors

#### 1. Missing Merchant/Store ID
```
Error: "Missing merchant or store information"
```

**Solution:** Ensure user is logged in and organization/store data is available.

#### 2. Invalid Shop Name
```
Error: "Invalid shop name. Use only lowercase letters, numbers, and hyphens"
```

**Solution:** Enter a valid Shopify store name (e.g., `mystore` not `mystore.myshopify.com`).

#### 3. No Shopify Store Connected
```
Error: "No Shopify store connected. Please connect a store first."
```

**Solution:** Use "Connect Shopify Store" button before attempting to sync.

#### 4. Sync Failures
```
{
  failedProducts: 5,
  errors: ["Product 123: Missing price", ...]
}
```

**Solution:** Review error details and fix product data in Shopify, then retry sync.

### User Feedback

The integration uses two notification systems:

1. **cogo-toast** - Toast notifications for quick feedback
2. **Material-UI Alert** - In-dialog alerts for detailed information

## Testing

### Manual Testing Checklist

- [ ] Click "Connect Shopify Store"
- [ ] Enter valid shop name (e.g., `test-store`)
- [ ] Verify redirect to Shopify OAuth page
- [ ] Authorize app on Shopify
- [ ] Verify redirect back to frontend callback page
- [ ] Verify success message and redirect to inventory
- [ ] Click "Sync Shopify" button
- [ ] Verify store list appears (if connected)
- [ ] Configure sync options
- [ ] Click "Sync Products"
- [ ] Verify sync progress indicator
- [ ] Verify sync results display
- [ ] Verify products appear in inventory list
- [ ] Test error scenarios (invalid shop name, network errors)

### Development Testing

```bash
# Start frontend
npm start

# The app should be running on http://localhost:3000

# Test OAuth flow:
1. Navigate to http://localhost:3000/application/inventory
2. Click "CONNECT SHOPIFY" button
3. Enter shop name: "test-store"
4. Backend should redirect to Shopify OAuth
```

## Future Enhancements

### Planned Features

1. **Automatic Webhook Registration** - Auto-register webhooks after store connection
2. **Real-time Sync** - Webhook-based real-time product updates
3. **Inventory Sync** - Bidirectional inventory synchronization
4. **Order Import** - Import Shopify orders into Cerve
5. **Store Management** - Manage multiple connected Shopify stores
6. **Sync History** - View historical sync operations and logs
7. **Selective Sync** - Choose specific products/collections to sync
8. **Category Mapping** - Map Shopify product types to Cerve categories

### API Enhancements Needed

1. `GET /api/v1/adapter/shopify/stores?merchantId={id}` - List connected stores
2. `DELETE /api/v1/adapter/shopify/stores/{id}` - Disconnect store
3. `GET /api/v1/adapter/shopify/sync-logs/{storeId}` - Sync history
4. `POST /api/v1/adapter/shopify/webhooks/register` - Register webhooks

## Troubleshooting

### OAuth Flow Issues

**Problem:** Redirect loop or stuck on callback page

**Solution:**
1. Check backend logs for OAuth errors
2. Verify Shopify app credentials in backend config
3. Ensure redirect URI matches in Shopify app settings
4. Clear localStorage and retry connection

### Sync Issues

**Problem:** Products not appearing after sync

**Solution:**
1. Check sync results for errors
2. Verify backend product transformation logic
3. Check if products match the current category filter
4. Refresh the inventory page

### Browser Console Errors

**Problem:** CORS errors when calling backend

**Solution:**
1. Ensure backend CORS configuration allows frontend origin
2. Verify `REACT_APP_BASE_URL` is correct
3. Check backend server is running

## Support

For issues or questions:
- Check backend logs: `logs/cerve-seller-service.log`
- Review browser console for frontend errors
- Check Network tab in DevTools for API call details
- Review database: `shopify_sync_log` table

## Summary

The Shopify integration is now fully functional in the frontend! 🎉

**What works:**
✅ OAuth store connection
✅ Manual product sync
✅ Error handling and user feedback
✅ Progress tracking
✅ Automatic redirect after OAuth

**How to use:**
1. Click "CONNECT SHOPIFY" in Inventory page
2. Enter your Shopify store name
3. Authorize on Shopify
4. Click "SYNC SHOPIFY" to import products
5. View synced products in inventory

**That's it!** The backend handles all the heavy lifting.
