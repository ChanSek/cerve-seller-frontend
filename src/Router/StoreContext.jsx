import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);

  // On first load, check localStorage
  useEffect(() => {
    const storedStoreId = localStorage.getItem("store_id");
    const storedCategory = localStorage.getItem("store_category");
    const storedLabel = localStorage.getItem("store_label");

    console.log("🔍 Initial LocalStorage Load:");
    console.log("store_id:", storedStoreId);
    console.log("store_category:", storedCategory);
    console.log("store_label:", storedLabel);

    if (storedStoreId && storedCategory) {
      setStore({
        storeId: storedStoreId,
        category: storedCategory,
        label: storedLabel,
      });
    }
  }, []);

  const updateStore = (storeObj) => {
    console.log("⚡ updateStore called with:", storeObj);

    localStorage.setItem("store_id", storeObj.storeId);
    localStorage.setItem("store_category", storeObj.category);
    localStorage.setItem("store_label", storeObj.label);

    console.log("✅ LocalStorage Updated:");
    console.log("store_id:", localStorage.getItem("store_id"));
    console.log("store_category:", localStorage.getItem("store_category"));
    console.log("store_label:", localStorage.getItem("store_label"));

    setStore(storeObj);
  };

  // Debug whenever store changes
  useEffect(() => {
    if (store) {
      console.log("📦 Store state updated:", store);
    }
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, updateStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
