import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const storedStoreId = localStorage.getItem("store_id");
    const storedCategory = localStorage.getItem("store_category");
    const storedLabel = localStorage.getItem("store_label");
    const storedStoreName = localStorage.getItem("store_name");

    if (storedStoreId && storedCategory) {
      setStore({
        storeId: storedStoreId,
        category: storedCategory,
        label: storedLabel,
        storeName: storedStoreName || "",
      });
    }
  }, []);

  const updateStore = (storeObj) => {
    localStorage.setItem("store_id", storeObj.storeId);
    localStorage.setItem("store_category", storeObj.category);
    localStorage.setItem("store_label", storeObj.label);
    localStorage.setItem("store_name", storeObj.storeName || "");

    setStore(storeObj);
  };

  return (
    <StoreContext.Provider value={{ store, updateStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
