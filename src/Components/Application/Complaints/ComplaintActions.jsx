import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import moment from "moment";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { TextField, Box } from "@mui/material";
import styled from "@emotion/styled";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import InfoRequestModal from "./InfoRequestModal";
import MultiResolutionModal from "./MultiResolutionModal";

const CssTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "black",
        },
        "&:hover fieldset": {
            borderColor: "#1c75bc",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#1c75bc",
        },
    },
});

const ComplaintActions = ({ actors, actions, resolutions, complaintId, initiatedBy, refreshComplaints }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResolutionResolved, setIsResolutionResolved] = useState(false);
    const [isIssueResolved, setIsIssueResolved] = useState(false);
    const [actionComments, setActionComments] = useState({});
    const [actionType, setActionType] = useState("CLOSE");
    const [descripton, setDescripton] = useState(null);
    const [rating, setRating] = useState({});
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoRequestModal, setInfoRequestModal] = useState(false);
    const [multiModalOpen, setMultiModalOpen] = useState(false);
    const [multiResolutionModal, setMultiResolutionModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // const [toggleResolutionModal, setToggleResolutionModal] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    useEffect(() => {
        if (!Array.isArray(actions)) {
            setIsResolutionResolved(false);
            setIsIssueResolved(false);
            return;
        }

        const checkLastAction = (code) => {
            for (let i = actions.length - 1; i >= 0; i--) {
                if (actions[i].descriptor?.code === code) {
                    if (actions[i + 1])
                        return true;
                    else return false
                }
            }
            return false;
        };

        setIsResolutionResolved(checkLastAction("RESOLUTION_PROPOSED"));
        setIsIssueResolved(checkLastAction("RESOLVED"));
        setIsProcessing(checkLastAction("PROCESSING"));
    }, [actions]);

    const handleInfoModalClose = () => {
        setInfoModalOpen(false);
        setInfoRequestModal(false);
    };

    const handleMultiModalClose = () => {
        setMultiModalOpen(false)
        setMultiResolutionModal(false)
    };

    const handleInputChange = (event, resolutionId) => {
        setActionComments((prev) => ({
            ...prev,
            [resolutionId]: event.target.value,
        }));
    };

    const handleAddInfoClick = () => {
        setInfoModalOpen(true);
        setInfoRequestModal(true);
    }

    const handleResolution = () => {
        setMultiModalOpen(true)
        setMultiResolutionModal(true)
    }


    const createResolution = async (resolutionId, action, comment) => {
        setIsSubmitting(true);
        const body = {
            refId: resolutionId,
            resolutionComment: comment,
            action: action,
        };
        const apiUrl = `/api/v1/seller/complaint/${complaintId}/resolution/action`;
        try {
            const res = await postCall(apiUrl, body);
            if (res?.status !== 200) {
                cogoToast.error(res.message || "An error occurred.", { hideAfter: 5 });
            } else {
                cogoToast.success("Resolution Action Taken successfully!", { hideAfter: 5 });
                refreshComplaints();
            }
        } catch (err) {
            console.error("Error in API call:", err);
            cogoToast.error("Failed to process resolution action.", { hideAfter: 5 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateIssueAction = async () => {
        setIsSubmitting(true);
        const body = {
            actionType: actionType,
            description: descripton,
            rating: rating,
        };
        const apiUrl = `/api/v1/seller/complaint/${complaintId}/resolution/update`;
        try {
            const res = await postCall(apiUrl, body);
            if (res?.status !== 200) {
                cogoToast.error(res.message || "An error occurred.", { hideAfter: 5 });
            } else {
                cogoToast.success("Resolution Action Taken successfully!", { hideAfter: 5 });
                refreshComplaints();
            }
        } catch (err) {
            console.error("Error in API call:", err);
            cogoToast.error("Failed to process resolution action.", { hideAfter: 5 });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcceptResolution = (resolutionId, action) => {
        const comment = actionComments[resolutionId]?.trim();
        if (!comment) {
            cogoToast.error("Resolution comment is required!", { hideAfter: 5 });
            return;
        }
        createResolution(resolutionId, action, comment);
    };


    const handleActionChange = (event) => {
        setActionType(event.target.value);
        setRating(null); // Reset like/dislike if toggling action
    };

    const renderFinalAction = (refId) => {
        return (
            <>
                {/* Toggle Action Type */}
                <div className="mt-4 flex space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={`action-${refId}`}
                            value="CLOSE"
                            checked={actionType === "CLOSE"}
                            onChange={handleActionChange}
                        />
                        <span>Close</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={`action-${refId}`}
                            value="ESCALATE"
                            checked={actionType === "ESCALATE"}
                            onChange={handleActionChange}
                        />
                        <span>Escalate</span>
                    </label>
                </div>
                {actionType === "CLOSE" && (
                    <>
                        {/* Like and Dislike Icons */}
                        <div className="flex mt-3">
                            <span
                                className={`cursor-pointer p-2 rounded-full ${rating === "THUMBS_UP" ? "bg-green-500 text-white" : "text-gray-500"
                                    }`}
                                onClick={() => setRating("THUMBS_UP")}
                                title="Like"
                            >
                                <ThumbUp fontSize="small" />
                            </span>
                            <span
                                className={`cursor-pointer p-2 rounded-full ${rating === "THUMBS_DOWN" ? "bg-red-500 text-white" : "text-gray-500"
                                    }`}
                                onClick={() => setRating("THUMBS_DOWN")}
                                title="Dislike"
                            >
                                <ThumbDown fontSize="small" />
                            </span>
                        </div>
                    </>
                )}

                {/* Resolution Comment Field */}
                <CssTextField
                    variant="standard"
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                    type="text"
                    className="h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
                    required
                    size="small"
                    autoComplete="off"
                    placeholder={actionType === "CLOSE" ? "Closing Description" : "Escalation Description"}
                    onChange={(e) => setDescripton(e.target.value)}
                    inputProps={{
                        maxLength: 256,
                    }}
                />

                {/* Submit Button */}
                <Button
                    className="mt-3 !capitalize"
                    variant="contained"
                    style={{ marginTop: 10 }}
                    disabled={isSubmitting}
                    onClick={() => {
                        if (actionType === "CLOSE" && !rating) {
                            cogoToast.error("Please select Like or Dislike for Close action!", { hideAfter: 5 });
                            return;
                        }
                        if (!descripton) {
                            cogoToast.error("Description is required!", { hideAfter: 5 });
                            return;
                        }
                        updateIssueAction();
                    }}
                >
                    Submit
                </Button>
            </>
        );
    };


    const takeProposedAction = (refId) => {
        return (
            <>
                <CssTextField
                    variant="standard"
                    style={{
                        marginTop: 10,
                        width: "100%",
                    }}
                    type="text"
                    className="h-full px-2.5 py-3.5 text-[#606161] bg-transparent !border-black"
                    required
                    size="small"
                    autoComplete="off"
                    placeholder="Resolution Comment"
                    onChange={(e) => handleInputChange(e, refId)}
                    inputProps={{
                        maxLength: 256,
                    }}
                />
                <br />
                <Button
                    className="mt-3 !capitalize"
                    variant="contained"
                    style={{ marginRight: 10, marginTop: 10 }}
                    disabled={isSubmitting}
                    onClick={() => handleAcceptResolution(refId, "accept")}
                >
                    Accept
                </Button>
                <Button
                    className="mt-3 !capitalize"
                    variant="contained"
                    style={{ marginRight: 10, marginTop: 10 }}
                    disabled={isSubmitting}
                    onClick={() => handleAcceptResolution(refId, "reject")}
                >
                    Reject
                </Button>
            </>
        );
        return null;
    };

    const renderResolutions = (refId) => {
        if (!Array.isArray(resolutions) || resolutions.length === 0) {
            return <p>No resolution options available.</p>;
        }

        const relatedResolutions = resolutions.filter(
            (res) => res.ref_id === refId || (initiatedBy === 'SELLER' && res.id === refId)
        );
        return relatedResolutions.map(({ id, descriptor, tags, proposed_by, updated_at }) => (
            <div key={id} className="p-4 bg-gray-50 rounded-lg shadow-md my-3">
                <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-800">{descriptor?.code}</p>
                    <p className="text-sm text-gray-700">{descriptor?.short_desc}</p>
                </div>
                {tags?.length > 0 && (
                    <div className="mb-2">
                        {tags.map((tag, index) =>
                            tag.list?.map((item, idx) => (
                                <p key={`${index}-${idx}`} className="text-xs text-gray-600">
                                    {item.descriptor?.code}: {item.value || "N/A"}
                                </p>
                            ))
                        )}
                    </div>
                )}
                <div className="text-xs text-gray-500">
                    <p>Proposed by: {proposed_by || "Unknown"}</p>
                    <p>Updated at: {moment(updated_at).format("MMMM Do, YYYY hh:mm a")}</p>
                </div>
            </div>
        ));
    };

    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
                "& .MuiTimelineItem-root": {
                    fontSize: "0.875rem",
                },
                "& .MuiTimelineContent-root": {
                    fontSize: "0.875rem",
                },
                "& .MuiTimelineDot-root": {
                    width: "12px",
                    height: "12px",
                },
                "& .MuiTimelineConnector-root": {
                    height: "1px",
                },
            }}
        >
            {actions?.map((action, i) => {
                const lastActionId = actions[actions.length - 1]?.id;
                const codeColor = getCodeColor(action?.descriptor?.code);
                const isEscalated = action?.descriptor?.code === "ESCALATED";
                const isExpanded = action.id === lastActionId || expandedItems[action.id] || false;
                const ratingTag = action?.descriptor?.code === "CLOSED"
                    ? action?.tags?.find(tag => tag?.descriptor?.code === "CLOSURE_DETAILS")
                        ?.list?.find(item => item?.descriptor?.code === "RATING")
                    : undefined;
                const isThumbsUp = ratingTag?.value === "THUMBS_UP";
                return (
                    <TimelineItem key={action.id}>
                        {/* Timestamp */}
                        <div
                            style={{
                                marginRight: "1rem",
                                marginTop: "2rem",
                                fontSize: "0.875rem",
                                color: "gray",
                                width: "100px", // Fixed width to maintain alignment
                                textAlign: "right", // Ensures right-aligned text
                            }}
                        >
                            <p style={{ margin: 0 }}>{moment(action?.updated_at).format("MMM Do, YYYY")}</p>
                            <p style={{ margin: 0 }}>{moment(action?.updated_at).format("hh:mm a")}</p>
                        </div>

                        {/* Timeline Separator */}
                        <TimelineSeparator>
                            <TimelineDot color={i + 1 < actions.length ? "grey" : "info"} />
                            {i + 1 < actions.length && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Box
                                onClick={() => toggleExpand(action.id)}
                                className={`cursor-pointer ${isExpanded ? "bg-gray-100" : ""}`}
                                sx={{
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    transition: "background-color 0.3s ease",
                                }}
                            >
                                <div className="flex items-center">
                                    <p className={`text-sm font-semibold mr-2 ${isEscalated ? "text-red-600" : codeColor}`}>
                                        {action?.descriptor?.code}
                                    </p>
                                </div>
                                {isExpanded && (
                                    <>
                                        <div className="flex items-center mt-2">
                                            <p className="text-sm font-semibold mr-2">Updated by:</p>
                                            <p className="text-sm font-normal">
                                                {actors.find((actor) => actor.id === action?.action_by)?.info?.person?.name || "Name not found"}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-semibold mr-2">Note:</p>
                                            {action?.descriptor?.name && (
                                                <div className="flex items-start">
                                                    <p className="text-sm font-normal whitespace-nowrap">{action?.descriptor?.name}:</p>
                                                    <p className="text-sm font-normal ml-2">{action?.descriptor?.short_desc}</p>
                                                </div>
                                            )}
                                            {!action?.descriptor?.name && <p className="text-sm font-normal">{action?.descriptor?.short_desc}</p>}
                                        </div>
                                        {action?.descriptor?.code === "CLOSED" && (
                                            <div className="flex items-center">
                                                <p className="text-sm font-normal mr-2">
                                                    Closure Rating:
                                                </p>
                                                {isThumbsUp !== undefined && (
                                                    isThumbsUp ? (
                                                        <ThumbUp style={{ color: "green" }} />
                                                    ) : (
                                                        <ThumbDown style={{ color: "red" }} />
                                                    )
                                                )}
                                            </div>
                                        )}
                                        {/* Additional Details */}
                                        <div className="mt-4">
                                            {action?.descriptor?.code === "INFO_PROVIDED" && action?.descriptor?.images?.length > 0 && (
                                                <>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        <p className="text-sm font-normal">
                                                            Response For:{" "}
                                                            {actions?.find((act) => act?.id === action?.ref_id)?.descriptor?.name || "Name not found"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        {action.descriptor.images.map((imgUrl, index) => (
                                                            <Box key={index} className="image-preview-container">
                                                                <Box
                                                                    component="img"
                                                                    src={imgUrl?.url}
                                                                    alt={`Return image ${index + 1}`}
                                                                    sx={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        objectFit: "cover",
                                                                        borderRadius: 2,
                                                                        boxShadow: 0,
                                                                    }}
                                                                />
                                                                <Box
                                                                    component="img"
                                                                    src={imgUrl}
                                                                    alt={`Zoomed Return image ${index + 1}`}
                                                                    className="image-preview-large"
                                                                />
                                                            </Box>
                                                        ))}
                                                    </div>
                                                </>)}
                                        </div>
                                        {action?.descriptor?.code === "RESOLUTION_PROPOSED" && (
                                            <div className="mt-4">
                                                <p className="text-sm font-semibold">Resolution Options:</p>
                                                {renderResolutions(action?.ref_id)}
                                            </div>
                                        )}
                                        {actions &&
                                            actions.reduce((lastProposedAction, currentAction, index) => {
                                                if (currentAction.descriptor?.code === "RESOLUTION_PROPOSED") {
                                                    lastProposedAction = { action: currentAction, index };
                                                }
                                                return lastProposedAction;
                                            }, null)?.action === action && (
                                                <div className="mt-4">
                                                    {initiatedBy === "SELLER" && !isResolutionResolved && (
                                                        <>
                                                            <p className="text-sm font-semibold">Take Proposed Action:</p>
                                                            {takeProposedAction(action?.ref_id)}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                        {actions &&
                                            actions.reduce((lastProposedAction, currentAction, index) => {
                                                if (currentAction.descriptor?.code === "RESOLVED") {
                                                    lastProposedAction = { action: currentAction, index };
                                                }
                                                return lastProposedAction;
                                            }, null)?.action === action && !isIssueResolved && initiatedBy === "SELLER" && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-semibold">Close/Escalate Issue:</p>
                                                    {renderFinalAction()}
                                                </div>
                                            )}
                                        {actions &&
                                            actions.reduce((lastProposedAction, currentAction, index) => {
                                                if (currentAction.descriptor?.code === "PROCESSING") {
                                                    lastProposedAction = { action: currentAction, index };
                                                }
                                                return lastProposedAction;
                                            }, null)?.action === action && !isProcessing && initiatedBy === "BUYER" && (
                                                <div className="mt-4">
                                                    <Button
                                                        className="!capitalize"
                                                        variant="contained"
                                                        style={{ marginRight: 10 }}
                                                        onClick={() => handleAddInfoClick()}
                                                    >
                                                        Request More Info
                                                    </Button>
                                                    <Button
                                                        className="!capitalize"
                                                        variant="contained"
                                                        onClick={() => handleResolution()}
                                                    >
                                                        Propose Resolution
                                                    </Button>
                                                    {multiResolutionModal && (
                                                        <MultiResolutionModal
                                                            user={actors}
                                                            complaintId={complaintId}
                                                            open={multiModalOpen}
                                                            onClose={handleMultiModalClose}
                                                            refreshComplaints={refreshComplaints}
                                                        />
                                                    )}
                                                    {infoRequestModal && <InfoRequestModal complaintId={complaintId} open={infoModalOpen} handleClose={handleInfoModalClose} refreshComplaints={refreshComplaints} />}
                                                </div>
                                            )}
                                    </>
                                )}
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
};

const getCodeColor = (code) => {
    switch (code) {
        case "OPEN":
            return "text-green-500";
        case "CLOSED":
            return "text-gray-500";
        case "PROCESSING":
            return "text-blue-500";
        case "RESOLVED":
            return "text-indigo-500";
        case "INFO_REQUESTED":
            return "text-orange-500";
        case "RESOLUTIONS":
            return "text-yellow-500";
        case "RESOLUTION_PROPOSED":
            return "text-purple-500";
        case "RESOLUTION_REJECTED":
            return "text-red-500";
        case "INFO_PROVIDED":
            return "text-teal-500";
        case "RESOLUTION_ACCEPTED":
            return "text-pink-500";
        case "ESCALATED":
            return "text-red-500";
        default:
            return "text-black";
    }
};

export default ComplaintActions;
