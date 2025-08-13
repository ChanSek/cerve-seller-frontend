import React from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from "@mui/lab";
import {
    Typography,
    Box,
    Tooltip,
    useTheme,
} from "@mui/material";

// Normalize status
const normalizeStatus = (statusString) => {
    if (!statusString) return '';
    return statusString.toLowerCase().replace(/[\s_]+/g, '-');
};

// Timeline dot color
const getDotColor = (status, theme) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
        case "rts-d":
        case "delivered":
        case "deliver":
        case "collect":
            return "success";
        case "cancelled-by-customer":
        case "rts-nd":
        case "customer-return":
        case "seller-return":
            return "error";
        case "ofd":
        case "ofp":
        case "rts-ofd":
        case "update-rider-arrival":
        case "arrived":
        case "arrived-customer-doorstep":
            return "warning";
        case "rts":
            return "secondary";
        case "new":
        case "allot":
        case "assigned-for-seller-pickup":
        case "assigned-for-pickup":
        case "picked":
        case "dispatched":
        case "assigned-for-delivery":
        case "update-rider-location":
            return "info";
        case "bag-in-transit":
        case "in-transit-return":
            return "primary";
        default:
            return "default"; // "grey" is not valid in MUI; use "default" or theme.palette.grey
    }
};

// Status text color
const getOrderStatusColor = (status, theme) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
        case "rts-d":
        case "delivered":
        case "deliver":
        case "collect":
            return theme.palette.success.main;
        case "cancelled-by-customer":
        case "rts-nd":
        case "customer-return":
        case "seller-return":
            return theme.palette.error.main;
        case "ofd":
        case "ofp":
        case "rts-ofd":
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
        case "assigned-for-seller-pickup":
        case "assigned-for-pickup":
        case "picked":
        case "dispatched":
        case "assigned-for-delivery":
        case "update-rider-location":
            return theme.palette.info.dark;
        case "bag-in-transit":
        case "in-transit-return":
            return theme.palette.primary.dark;
        case "item-manifested":
        case "recd-at-rev-hub":
        case "recd-at-fwd-hub":
        case "bag-received":
        case "recd-at-fwd-dc":
        case "recd-at-dc-rts":
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

    const sortedTrackingDetails = [...trackingDetails].sort(
        (a, b) => new Date(a.created) - new Date(b.created)
    );

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
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Logistics Timeline
            </Typography>
            <Timeline
                position="right"
                sx={{
                    p: 0,
                    alignItems: 'flex-start',
                    '& .MuiTimelineItem-root': {
                        minHeight: 'auto',
                        '&::before': { flex: 0, padding: 0 },
                    },
                    '& .MuiTimelineOppositeContent-root': {
                        flex: 'none',
                        width: '65px',
                        textAlign: 'right',
                        paddingRight: '8px',
                        alignSelf: 'flex-start',
                    },
                    '& .MuiTimelineContent-root': {
                        paddingLeft: '8px',
                        flexGrow: 1,
                        alignSelf: 'flex-start',
                    },
                    '& .MuiTimelineSeparator-root': {
                        alignSelf: 'stretch',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                    },
                }}
            >
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
                    const dotColor = getDotColor(item.statusId, theme);
                    const textColor = getOrderStatusColor(item.statusId, theme);

                    return (
                        <TimelineItem
  sx={{
    display: 'flex',
    alignItems: 'stretch',
    '&::before': { flex: 0, padding: 0 },
  }}
  key={index}
>
  <TimelineOppositeContent
    sx={{
      color: "text.secondary",
      fontSize: '0.7rem',
      whiteSpace: 'nowrap',
      paddingTop: '6px',
    }}
  >
    <Typography variant="inherit" sx={{ lineHeight: 1.2 }}>
      {formattedDate}
    </Typography>
    <Typography variant="inherit" sx={{ lineHeight: 1.2 }}>
      {formattedTime.replace(' ', '').toLowerCase()}
    </Typography>
  </TimelineOppositeContent>

  <TimelineSeparator
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .MuiTimelineConnector-root': {
        flex: 1,
        backgroundColor: 'grey.400',
        width: 2,
      },
    }}
  >
    <TimelineDot
      color={getDotColor(item.statusId, theme)}
      variant="filled"
      sx={{
        p: 0.5,
        width: 12,
        height: 12,
        minWidth: 12,
        minHeight: 12,
        margin: '4px 0',
      }}
    />
    {!isLastItem && <TimelineConnector />}
  </TimelineSeparator>

  <TimelineContent
    sx={{
      py: '6px',
      px: 1.5,
    }}
  >
    <Typography
      variant="body2"
      fontWeight="medium"
      sx={{
        color: getOrderStatusColor(item.statusId, theme),
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
            componentsProps={{
                tooltip: {
                    sx: {
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
