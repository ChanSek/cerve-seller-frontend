// textHighlight.js - Utility for highlighting search terms in text
import React from 'react';

/**
 * Highlights search terms in text by wrapping matches in span elements
 * @param {string} text - The text to search within
 * @param {string} searchTerm - The search term(s) to highlight
 * @param {object} highlightStyle - CSS styles for highlighted text
 * @returns {React.Element} JSX with highlighted terms
 */
export const highlightText = (text, searchTerm, highlightStyle = {}) => {
    // Default highlight styling
    const defaultStyle = {
        backgroundColor: '#fff3cd',
        color: '#856404',
        fontWeight: 'bold',
        padding: '1px 2px',
        borderRadius: '2px'
    };

    const style = { ...defaultStyle, ...highlightStyle };

    if (!text || !searchTerm || typeof text !== 'string') {
        return text;
    }

    // Clean and split search term into individual words
    const searchWords = searchTerm
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape regex special chars

    if (searchWords.length === 0) {
        return text;
    }

    // Create a regex pattern that matches any of the search words (case-insensitive)
    const pattern = new RegExp(`(${searchWords.join('|')})`, 'gi');
    
    // Split text by the pattern and create JSX elements
    const parts = text.split(pattern);
    
    return (
        <>
            {parts.map((part, index) => {
                // Check if this part matches any search word
                const isMatch = searchWords.some(word => 
                    part.toLowerCase() === word.toLowerCase()
                );
                
                return isMatch ? (
                    <span key={index} style={style}>
                        {part}
                    </span>
                ) : (
                    part
                );
            })}
        </>
    );
};

export default highlightText;