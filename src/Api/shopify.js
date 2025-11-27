import { getCall, postCall } from "./axios";

/**
 * Initiate Shopify OAuth flow
 * @param {string} shopName - Shopify store name (without .myshopify.com)
 */
export const initiateShopifyOAuth = (shopName) => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/v1/adapter/shopify/auth/install?shop=${shopName}`;
  window.location.href = url;
};

/**
 * Complete Shopify store onboarding
 * @param {string} shop - Shopify store domain
 * @param {string} accessToken - OAuth access token
 * @param {string} scope - Granted scopes
 * @param {string} merchantId - Cerve merchant ID
 * @param {string} storeId - Cerve store ID
 */
export const completeShopifyOnboarding = async (shop, accessToken, scope, merchantId, storeId) => {
  try {
    const response = await postCall(
      `/api/v1/adapter/shopify/auth/complete-onboarding?shop=${shop}&accessToken=${accessToken}&scope=${scope}`,
      {
        merchantId,
        storeId
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to complete Shopify onboarding:", error);
    throw error;
  }
};

/**
 * Trigger product sync from Shopify
 * @param {string} shopifyStoreId - UUID of the Shopify store
 * @param {boolean} syncAll - Whether to sync all products (default: true)
 * @param {number} limit - Maximum products to sync per request (default: 50)
 * @param {string} sinceId - Only sync products after this Shopify product ID (optional)
 */
export const syncShopifyProducts = async (shopifyStoreId, syncAll = true, limit = 50, sinceId = null) => {
  try {
    const requestBody = {
      shopifyStoreId,
      syncAll,
      limit
    };

    if (sinceId) {
      requestBody.sinceId = sinceId;
    }

    const response = await postCall('/api/v1/adapter/shopify/products/sync', requestBody);
    return response;
  } catch (error) {
    console.error("Failed to sync Shopify products:", error);
    throw error;
  }
};

/**
 * Get all product mappings for a Shopify store
 * @param {string} shopifyStoreId - UUID of the Shopify store
 */
export const getProductMappings = async (shopifyStoreId) => {
  try {
    const response = await getCall(`/api/v1/adapter/shopify/products/mappings/${shopifyStoreId}`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch product mappings:", error);
    throw error;
  }
};

/**
 * Get specific product mapping
 * @param {string} shopifyStoreId - UUID of the Shopify store
 * @param {string} shopifyProductId - Shopify product ID
 */
export const getProductMapping = async (shopifyStoreId, shopifyProductId) => {
  try {
    const response = await getCall(
      `/api/v1/adapter/shopify/products/mappings/${shopifyStoreId}/${shopifyProductId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product mapping:", error);
    throw error;
  }
};

/**
 * Get list of connected Shopify stores for a merchant
 * @param {string} merchantId - Cerve merchant ID
 */
export const getShopifyStores = async (merchantId) => {
  try {
    const response = await getCall(`/api/v1/adapter/shopify/auth/stores?merchantId=${merchantId}`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch Shopify stores:", error);
    // Return empty array if endpoint doesn't exist yet
    return [];
  }
};
