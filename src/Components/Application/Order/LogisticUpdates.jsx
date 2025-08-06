import React from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from "@mui/lab";
import { Typography, Box, Tooltip, useTheme } from "@mui/material";

// Helper function to normalize status strings for consistent lookup
const normalizeStatus = (statusString) => {
    if (!statusString) return '';
    return statusString.toLowerCase().replace(/ /g, '-').replace(/_/g, '-');
};

// Function to get color for timeline dots
const getDotColor = (status, theme) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
        case "delivered":
        case "deliver":
        case "collect":
            return "success";
        case "cancelled_by_customer":
        case "rts_nd":
        case "customer-return":
        case "seller-return":
            return "error";
        case "ofd":
        case "ofp":
        case "rts_ofd":
        case "update-rider-arrival":
        case "arrived":
        case "arrived-customer-doorstep":
            return "warning";
        case "rts":
            return "secondary";
        case "new":
        case "allot":
        case "assigned_for_seller_pickup":
        case "assigned_for_pickup":
        case "picked":
        case "dispatched":
        case "assigned_for_delivery":
        case "update-rider-location":
            return "info";
        case "bag_in_transit":
        case "in_transit_return":
            return "primary";
        default:
            return "grey";
    }
};

// Function to get text color for status
const getOrderStatusColor = (status, theme) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
        case "delivered":
        case "deliver":
        case "collect":
            return theme.palette.success.main;
        case "cancelled_by_customer":
        case "rts_nd":
        case "customer-return":
        case "seller-return":
            return theme.palette.error.main;
        case "ofd":
        case "ofp":
        case "rts_ofd":
        case "update-rider-arrival":
        case "arrived":
        case "arrived-customer-doorstep":
            return theme.palette.warning.dark;
        case "rts":
            return theme.palette.secondary.dark;
        case "new":
        case "allotted":
        case "allot":
            return theme.palette.info.main;
        case "assigned_for_seller_pickup":
        case "assigned_for_pickup":
        case "picked":
        case "dispatched":
        case "assigned_for_delivery":
        case "update-rider-location":
            return theme.palette.info.dark;
        case "bag_in_transit":
        case "in_transit_return":
            return theme.palette.primary.dark;
        case "item_manifested":
        case "recd_at_rev_hub":
        case "recd_at_fwd_hub":
        case "bag_received":
        case "recd_at_fwd_dc":
        case "recd_at_dc_rts":
            return theme.palette.text.primary;
        default:
            return theme.palette.text.secondary;
    }
};


const LogisticUpdates = ({ statusDisplay, trackingDetails }) => {
    const theme = useTheme();

    if (!trackingDetails || trackingDetails.length === 0) {
        if (statusDisplay === 'New' || statusDisplay === 'ACCEPTED') {
            return <Typography variant="body2" color="text.secondary"><strong>Pickup Request Accepted</strong></Typography>;
        }
        return <Typography variant="body2" color="text.secondary">-</Typography>;
    }

    const sortedTrackingDetails = [...trackingDetails].sort((a, b) => new Date(a.created) - new Date(b.created));

    const timelineTooltipContent = (
        <Box
            sx={{
                padding: 1.5,
                maxWidth: 350,
                bgcolor: 'background.paper',
                borderRadius: 1.5,
                boxShadow: 6,
                overflowY: 'auto',
                maxHeight: 300,
            }}
        >
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 1 }}>
                Logistics Timeline
            </Typography>
            <Timeline position="right" sx={{
                p: 0,
                // Ensure flex items are aligned to the start of the cross axis (top)
                alignItems: 'flex-start',
                '& .MuiTimelineItem-root': {
                    minHeight: 'auto',
                    '&::before': {
                        flex: 0,
                        padding: 0,
                    },
                },
                // Refined TimelineOppositeContent styling
                '& .MuiTimelineOppositeContent-root': {
                    flex: 'none', // Reset flex to let content size itself
                    width: '65px', // Fixed width for date/time column to ensure alignment
                    textAlign: 'right',
                    paddingRight: '8px',
                    alignSelf: 'flex-start', // Align to the top of the timeline item
                },
                // Refined TimelineContent styling
                '& .MuiTimelineContent-root': {
                    paddingLeft: '8px',
                    flexGrow: 1, // Allow content to take remaining space
                    alignSelf: 'flex-start', // Align to the top of the timeline item
                },
                // Ensure TimelineSeparator is vertically centered within its own flex container if necessary
                '& .MuiTimelineSeparator-root': {
                    alignSelf: 'stretch', // Allow separator to stretch vertically if needed
                    marginRight: 'auto', // Adjust margin to fine-tune spacing
                    marginLeft: 'auto',
                }
            }}>
                {sortedTrackingDetails.map((item, index) => {
                    const eventDate = new Date(item.created);
                    const formattedDate = eventDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    });
                    const formattedTime = eventDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });

                    const isLastItem = index === sortedTrackingDetails.length - 1;

                    return (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent
                                sx={{
                                    color: "text.secondary",
                                    fontSize: '0.7rem',
                                    whiteSpace: 'nowrap',
                                    paddingTop: '6px', // Align with the dot
                                }}
                            >
                                <Typography variant="inherit" sx={{ lineHeight: 1.2 }}>
                                    {formattedDate}
                                </Typography>
                                <Typography variant="inherit" sx={{ lineHeight: 1.2 }}>
                                    {formattedTime.replace(' ', '').toLowerCase()}
                                </Typography>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot
                                    color={getDotColor(item.status, theme)}
                                    variant="filled"
                                    sx={{
                                        p: 0.5,
                                        width: 12,
                                        height: 12,
                                        minWidth: 12,
                                        minHeight: 12,
                                        margin: 'auto',
                                    }}
                                />
                                {!isLastItem && (
                                    <TimelineConnector sx={{ bgcolor: 'grey.400', height: '24px' }} />
                                )}
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '6px', px: 1.5 }}>
                                <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{
                                        color: getOrderStatusColor(item.status, theme),
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {item.status}
                                </Typography>
                                {item.remarks && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {item.remarks}
                                    </Typography>
                                )}
                                {item.location && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Location: {item.location}
                                    </Typography>
                                )}
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>
        </Box>
    );

    return (
        <Tooltip
            title={timelineTooltipContent}
            placement="right-start"
            arrow
            enterDelay={300}
            leaveDelay={100}
            PopperProps={{
                sx: {
                    '& .MuiTooltip-tooltip': {
                        backgroundColor: 'transparent',
                        maxWidth: 'none',
                        boxShadow: 'none',
                        padding: 0,
                    },
                },
            }}
        >
            <Typography
                variant="body2"
                color="primary"
                sx={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '250px',
                }}
            >
                {statusDisplay || 'View Timeline'}
            </Typography>
        </Tooltip>
    );
};

export default LogisticUpdates;