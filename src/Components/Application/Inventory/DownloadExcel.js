import axios from "axios";
import Cookies from "js-cookie";

const downloadExcel = async (storeId) => {
    try {
        const token = Cookies.get("token");
        const response = await axios.get(`/api/v1/seller/storeId/${storeId}/downloadProductFile`, {
            responseType: 'blob',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }), // Add token if it exists
            },
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/-/g, '')       // Remove all hyphens
            .replace(/[:.]/g, '')    // Remove colons and periods
            .replace('T', '')        // Remove 'T'
            .replace('Z', '');
        link.setAttribute('download', `Products_${timestamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading the file", error);
    }
};
export default downloadExcel;  