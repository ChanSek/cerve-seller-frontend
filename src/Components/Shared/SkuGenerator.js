// utils/skuGenerator.js

/**
 * Generate a unique SKU based on domain, category, product name.
 * Ensures uniqueness for rapid generations using a micro-timestamp slice and a random alphanumeric string.
 *
 * - Format: <DOMAIN_3_CHARS><CATEGORY_3_CHARS><PRODUCT_4_CHARS><UNIQUE_SUFFIX_4_CHARS>
 * - Total Length: Always 14 characters
 */

// Helper to generate a random alphanumeric string of a given length
const generateRandomAlphanumeric = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export function generateSKU(domain, category) {
    // 1. Fixed Domain Prefix (3 characters)
    const domainPrefix = (domain || "XXX").substring(0, 3).toUpperCase();

    // Helper to clean and abbreviate strings
    const cleanAndAbbreviate = (str, length) => {
        if (!str) return 'X'.repeat(length);

        const stopWords = ["and", "of", "the", "for", "with", "a", "an", "in", "on", "at", "by", "to", "from", "ml", "g", "kg", "pc", "ltr", "gm", "drink", "fresh", "pack", "pkt", "pkt", "super"]; // Added more common product related stop words
        const words = str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric except spaces
            .split(/\s+/)
            .filter(word => word.length > 0 && !stopWords.includes(word.toLowerCase()));

        let abbreviation = "";
        if (words.length > 0) {
            // Take first few letters of words, prioritizing longer words or first few words
            let tempAbbr = "";
            for (let i = 0; i < words.length; i++) {
                tempAbbr += words[i].substring(0, Math.ceil(length / words.length) || 1); // Distribute length across words
            }
            abbreviation = tempAbbr;
        }

        // Fallback to initial if abbreviation is too short (e.g., from very short words or many stop words)
        if (abbreviation.length < length && words.length > 0) {
             abbreviation = words.map(word => word[0]).join(''); // Fallback to initials
        }


        // Pad or truncate to desired length
        return abbreviation.substring(0, length).padEnd(length, "0").toUpperCase();
    };

    const categoryCode = cleanAndAbbreviate(category, 3);

    const timestampPart = Date.now().toString().slice(-4);
    console.log("timestampPart "+timestampPart);
    console.log("Date.now().toString() "+Date.now().toString());
    const randomPart = generateRandomAlphanumeric(2); // 2 random alphanumeric characters

    const uniqueSuffix = `${timestampPart}${randomPart}`;

    // 5. Combine parts to form final SKU
    return `${domainPrefix}${categoryCode}${uniqueSuffix}`;
}