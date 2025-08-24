import {useCallback, useState} from "react";

export const useProductSelection = (masterProducts) => {
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [productDetails, setProductDetails] = useState({});

    // Handle product selection
    const handleProductSelect = useCallback((productId, checked) => {
        const newSelected = new Set(selectedProducts);
        
        if (checked) {
            newSelected.add(productId);
            
            // Find the product and its parent
            const product = masterProducts.find(p => p.pid === productId);
            const parentId = product?.parent_id || productId;
            
            // Check if any sibling variants are already selected to inherit GST
            const siblingVariants = masterProducts.filter(p => (p.parent_id || p.pid) === parentId);
            const selectedSibling = siblingVariants.find(variant => 
                variant.pid !== productId && selectedProducts.has(variant.pid)
            );
            
            const inheritedGST = selectedSibling ? productDetails[selectedSibling.pid]?.gstPercentage || "" : "";
            
            // Initialize default values for new selection
            setProductDetails(prev => ({
                ...prev,
                [productId]: {
                    sellingPrice: "",
                    gstPercentage: inheritedGST,
                    ...prev[productId]
                }
            }));
        } else {
            newSelected.delete(productId);
            setProductDetails(prev => {
                const { [productId]: removed, ...rest } = prev;
                return rest;
            });
        }
        
        setSelectedProducts(newSelected);
    }, [selectedProducts, masterProducts, productDetails]);

    // Handle detail changes for selected products
    const handleDetailChange = useCallback((productId, field, value) => {
        setProductDetails(prev => {
            const updated = { ...prev };
            
            // If changing GST, apply to all variants of the same parent
            if (field === 'gstPercentage') {
                const product = masterProducts.find(p => p.pid === productId);
                if (product) {
                    const parentId = product.parent_id || product.pid;
                    
                    // Find all variants of the same parent and update their GST
                    masterProducts.forEach(p => {
                        const pParentId = p.parent_id || p.pid;
                        if (pParentId === parentId && selectedProducts.has(p.pid)) {
                            updated[p.pid] = {
                                ...updated[p.pid],
                                [field]: value
                            };
                        }
                    });
                }
            } else {
                // For other fields, update only the specific product
                updated[productId] = {
                    ...updated[productId],
                    [field]: value
                };
            }
            
            return updated;
        });
    }, [masterProducts, selectedProducts]);

    // Reset selection
    const resetSelection = useCallback(() => {
        setSelectedProducts(new Set());
        setProductDetails({});
    }, []);

    return {
        selectedProducts,
        productDetails,
        handleProductSelect,
        handleDetailChange,
        resetSelection
    };
};