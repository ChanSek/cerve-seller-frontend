import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);

  // On first load, check localStorage
  useEffect(() => {
    console.log("=============================================")
    const storedStoreId = localStorage.getItem("store_id");
    const storedCategory = localStorage.getItem("store_category");
    const storedLabel = localStorage.getItem("store_label");
 console.log("============================================= storedStoreId ",storedStoreId," - storedCategory ",storedCategory);
    if (storedStoreId && storedCategory) {
      setStore({
        storeId: storedStoreId,
        category: storedCategory,
        label: storedLabel,
      });
    }
  }, []);

  const updateStore = (storeObj) => {
    localStorage.setItem("store_id", storeObj.storeId);
    localStorage.setItem("store_category", storeObj.category);
    localStorage.setItem("store_label", storeObj.label);
    setStore(storeObj);
  };

  return (
    <StoreContext.Provider value={{ store, updateStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
