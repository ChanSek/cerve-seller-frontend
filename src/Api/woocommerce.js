import { getCall, postCall } from "./axios";

/**
 * Initiate WooCommerce OAuth flow
 * @param {string} storeUrl - WooCommerce store URL (e.g., mystore.com)
 */
export const initiateWooCommerceOAuth = (storeUrl) => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/v1/adapter/woocommerce/auth/install?storeUrl=${encodeURIComponent(storeUrl)}`;
  window.location.href = url;
};

/**
 * Complete WooCommerce store onboarding
 * @param {string} storeUrl - WooCommerce store URL
 * @param {string} consumerKey - WooCommerce consumer key
 * @param {string} consumerSecret - WooCommerce consumer secret
 * @param {string} merchantId - Cerve merchant ID
 * @param {string} storeId - Cerve store ID
 */
export const completeWooCommerceOnboarding = async (storeUrl, consumerKey, consumerSecret, merchantId, storeId) => {
  try {
    const response = await postCall(
      `/api/v1/adapter/woocommerce/auth/complete-onboarding`,
      {
        storeUrl,
        consumerKey,
        consumerSecret,
        merchantId,
        storeId
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to complete WooCommerce onboarding:", error);
    throw error;
  }
};

/**
 * Trigger product sync from WooCommerce
 * @param {string} wooCommerceStoreId - UUID of the WooCommerce store
 * @param {boolean} syncAll - Whether to sync all products (default: true)
 * @param {number} limit - Maximum products to sync per request (default: 50)
 * @param {number} page - Page number for pagination (optional)
 */
export const syncWooCommerceProducts = async (wooCommerceStoreId, syncAll = true, limit = 50, page = null) => {
  try {
    const requestBody = {
      wooCommerceStoreId,
      syncAll,
      limit
    };

    if (page) {
      requestBody.page = page;
    }

    const response = await postCall('/api/v1/adapter/woocommerce/products/sync', requestBody);
    return response;
  } catch (error) {
    console.error("Failed to sync WooCommerce products:", error);
    throw error;
  }
};

/**
 * Get all product mappings for a WooCommerce store
 * @param {string} wooCommerceStoreId - UUID of the WooCommerce store
 */
export const getWooCommerceProductMappings = async (wooCommerceStoreId) => {
  try {
    const response = await getCall(`/api/v1/adapter/woocommerce/products/mappings/${wooCommerceStoreId}`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch product mappings:", error);
    throw error;
  }
};

/**
 * Get specific product mapping
 * @param {string} wooCommerceStoreId - UUID of the WooCommerce store
 * @param {string} wooCommerceProductId - WooCommerce product ID
 */
export const getWooCommerceProductMapping = async (wooCommerceStoreId, wooCommerceProductId) => {
  try {
    const response = await getCall(
      `/api/v1/adapter/woocommerce/products/mappings/${wooCommerceStoreId}/${wooCommerceProductId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product mapping:", error);
    throw error;
  }
};

/**
 * Get list of connected WooCommerce stores for a merchant
 * @param {string} merchantId - Cerve merchant ID
 */
export const getWooCommerceStores = async (merchantId) => {
  try {
    const response = await getCall(`/api/v1/adapter/woocommerce/auth/stores?merchantId=${merchantId}`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch WooCommerce stores:", error);
    // Return empty array if endpoint doesn't exist yet
    return [];
  }
};