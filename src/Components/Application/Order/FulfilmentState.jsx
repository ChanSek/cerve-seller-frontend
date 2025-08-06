import React from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import moment from "moment";
import { Tooltip, Box, Typography, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Utility function to format strings (e.g., "in-progress" to "In Progress")
const formatString = (str) => {
    if (!str) return "N/A";
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

// Utility function to determine color based on fulfillment state
const getColor = (toState) => {
    switch (toState) {
        case "Created":
            return "gray";
        case "Accepted":
            return "blue";
        case "In-progress":
            return "orange";
        case "Completed":
            return "green";
        default:
            return "black";
    }
};

// Styled Tooltip content box for better control
const StyledTooltipContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    minWidth:400,
    maxHeight: "70vh",               // limit height to 70% of viewport
    overflowY: "auto",               // enable vertical scrolling
    color: theme.palette.text.primary,
    whiteSpace: "normal",
}));

const FulfilmentState = ({ currentState, data }) => {
    const theme = useTheme();
    return (
        <Tooltip
            title={
                <StyledTooltipContent onMouseEnter={(e) => e.stopPropagation()}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        align="center"
                        sx={{ color: theme.palette.primary.main }}
                    >
                        Fulfillment History
                    </Typography>
                    {data && data.length > 0 ? (
                        <Timeline position="right" sx={{ padding: 0 }}> {/* Changed to "right" for cleaner alignment */}
                            {data.map((item, index) => (
                                <TimelineItem key={index}>
                                    <Box sx={{
                                        textAlign: 'right', minWidth: '120px', marginRight: "1rem",
                                        marginTop: "2rem",
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {moment(item.createdDate).format("MMM Do, YYYY")}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {moment(item.createdDate).format("hh:mm a")}
                                        </Typography>
                                    </Box>
                                    <TimelineSeparator>
                                        <TimelineDot style={{ backgroundColor: getColor(item.toState) }} />
                                        {index < data.length - 1 && <TimelineConnector />}
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                                            {formatString(item.fulfilmentState)}
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    ) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>No fulfillment history available.</Typography>
                    )}
                </StyledTooltipContent>
            }
            arrow
            placement="right"
            enterDelay={300}
            leaveDelay={200}
            disableInteractive={false} // ensures tooltip remains interactive
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 15],
                        },
                    },
                ],
            }}
        >
            <Box
                component="span"
                sx={{
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    fontWeight: 'medium',
                    "&:hover": {
                        color: theme.palette.primary.dark,
                        textDecoration: 'underline', // Add a subtle hover effect
                    },
                }}
            >
                {currentState}
            </Box>
        </Tooltip>
    );
};

export default FulfilmentState;