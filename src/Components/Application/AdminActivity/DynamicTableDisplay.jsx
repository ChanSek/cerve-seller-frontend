// src/components/AdminDetails/DynamicTableDisplay.jsx

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/system';

// Styled TableCell for consistent header and body styles
const StyledTableCell = styled(TableCell)(({ theme, header }) => ({
    // *** CHANGES START HERE ***
    // Replaced theme.palette.primary.main, theme.palette.background.paper,
    // theme.palette.text.primary, theme.spacing, and theme.palette.divider
    // with hardcoded CSS values to prevent TypeError if theme properties are undefined.
    backgroundColor: header ? '#1976d2' : '#FFFFFF', // Hardcoded primary blue or white
    color: header ? '#FFFFFF' : 'rgba(0, 0, 0, 0.87)', // Hardcoded white or dark grey text
    fontWeight: header ? 'bold' : 'normal',
    fontSize: header ? '1rem' : '0.875rem',
    padding: '12px', // Hardcoded pixel value (approx theme.spacing(1.5))
    borderBottom: `1px solid rgba(0, 0, 0, 0.12)`, // Hardcoded light grey for divider
    wordBreak: 'break-word',
    // *** CHANGES END HERE ***
}));

// Styled TableRow for hover effect and alternating background
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        // Hardcoded light grey
        backgroundColor: '#F5F5F5',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        // Hardcoded hover transparency
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}));

const DynamicTableDisplay = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    height: '200px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: 3,
                    mt: 2
                }}
            >
                <Typography variant="h6" color="textSecondary">No details to display.</Typography>
            </Box>
        );
    }

    const formatCodeAsTitle = (code) => {
        const parts = code.split('.');
        let lastPart = parts[parts.length - 1];

        switch (lastPart) {
            case "short_desc": return "Short Description";
            case "long_desc": return "Long Description";
            case "gstin": return "GSTIN";
            case "name": return "SNP Name";
            case "accountHolderName": return "Account Holder Name";
            case "accountNumber": return "Account Number";
            case "ifscCode": return "IFSC Code";
            case "bankName": return "Bank Name";
            case "images": return "Image";
            case "email": return "Email";
            case "phone": return "Phone";
            case "buyer_fee_tax": return "Tax on Buyer Fee";
            default:
                return lastPart
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
        }
    };

    const renderValue = (code, value) => {
        if (code === 'images' && value) {
            return (
                <a href={value} target="_blank" rel="noopener noreferrer">
                    <img
                        src={value}
                        alt="Detail"
                        style={{
                            maxWidth: '60px',
                            maxHeight: '60px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }}
                    />
                </a>
            );
        }

        const displayValue = String(value);
        const maxLength = 100;

        if (displayValue.length > maxLength) {
            return (
                <Tooltip title={displayValue} arrow>
                    <span>{displayValue.substring(0, maxLength)}...</span>
                </Tooltip>
            );
        }

        return displayValue;
    };


    return (
        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: '8px', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 450 }} aria-label="dynamic details table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell header>Field</StyledTableCell>
                        <StyledTableCell header>Value</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={row.code || index}>
                            <StyledTableCell component="th" scope="row">
                                {formatCodeAsTitle(row.code)}
                            </StyledTableCell>
                            <StyledTableCell>
                                {renderValue(row.code, row.value)}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DynamicTableDisplay;