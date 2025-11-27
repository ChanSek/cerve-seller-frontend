import { getBlob } from "../../../Api/axios";
import Cookies from "js-cookie";
import cogoToast from "cogo-toast";

const downloadExcel = async (storeId, category) => {
    try {
        const blob = await getBlob(
            `/api/v1/seller/storeId/${category}/${storeId}/downloadProductFile`
        );
        const url = window.URL.createObjectURL(new Blob([blob]));
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

        // If backend returned JSON but responseType was "blob"
        if (error?.response?.data instanceof Blob) {
            error.response.data.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    cogoToast.error(json.message || "Something went wrong");
                } catch {
                    // Not JSON → show raw text
                    cogoToast.error(text || "Something went wrong");
                }
            });
        } else {
            // Normal axios errors
            cogoToast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

};
export default downloadExcel;  