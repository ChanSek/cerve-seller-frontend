import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Typography,
  Button,
  Divider,
  Menu,
  MenuItem
} from "@mui/material";
import moment from "moment";
import { getCall, postCall } from "../../../Api/axios";
import { convertDateInStandardFormat } from "../../../utils/formatting/date";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { ISSUE_TYPES } from "../../../Constants/issue-types";
import cogoToast from "cogo-toast";
import CustomerActionCard from "./actionCard";
import MultiResolutionPage from "./resolutionCard";
import InfoRequestModal from "./InfoRequestModal";

const ComplaintDetails = () => {
  const [complaint, setComplaint] = useState();
  const [user, setUser] = useState();
  const [issueActions, setIssueActions] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [actorInfo, setActorInfo] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [supportActionDetails, setSupportActionDetails] = useState();
  const [toggleActionModal, setToggleActionModal] = useState(false);
  const [toggleResolutionModal, setToggleResolutionModal] = useState(false);
  const [infoRequestModal, setInfoRequestModal] = useState(false);
  const issue = complaint?.issue
  const [isCascaded, setIsCascaded] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [isResolved, setIsResolved] = useState(false)
  const [isEscalate, setEscalate] = useState(false)

  const [expanded, setExpanded] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const AllCategory = ISSUE_TYPES.map((item) => {
    return item.subCategory.map((subcategoryItem) => {
      return {
        ...subcategoryItem,
        category: item.value,
      };
    });
  }).flat();

  const getComplaint = async () => {
    const url = `/api/v1/seller/${params?.id}/getIssueDetails`;
    getCall(url).then((resp) => {
      if (resp.success) {
        const issue_actions = resp.issue?.actions;
        const resolutions = resp.issue?.resolutions;
        const actors = resp.issue?.actors;
        setComplaint(resp);
        setActorInfo(actors);
        mergeRespondantArrays(issue_actions, resolutions);
      }
    });
  };

  useEffect(() => {
    if (params.id) getComplaint();
  }, [params]);

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    setUser(res[0]);
    return res[0];
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    getUser(user_id);
  }, []);

  const mergeRespondantArrays = (mergedarray, resolutions) => {
    //comActions = actions.complainant_actions.map(item => { return ({ ...item, respondent_action: item.complainant_action }) }),
    //mergedarray = [...resActions]
    mergedarray.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
    setIssueActions(mergedarray)
    setResolutions(resolutions);

    const isProcessed = mergedarray?.some(x => x.description?.code === "PROCESSING")
    const isCascaded = (mergedarray[mergedarray?.length - 2]?.respondent_action === "CASCADED" || mergedarray[mergedarray?.length - 1]?.description.code === "CASCADED")
    const isEscalate = mergedarray[mergedarray?.length - 1]?.description.code === "ESCALATE"
    const isResolved = mergedarray[mergedarray?.length - 1]?.description.code === "RESOLVED"
    setProcessed(isProcessed)
    setIsCascaded(isCascaded)
    setIsResolved(isResolved)
    setEscalate(isEscalate)
  }

  const cardClass = `border-2 border-gray-200 rounded-lg p-2 bg-slate-50`;

  const handleInfoModalClose = () => {
    setInfoModalOpen(false);
    setInfoRequestModal(false);
  };
  const renderActionButtons = () => {
    function handleMenuClick() {
      setSupportActionDetails(complaint)
      handleClose()
      setToggleActionModal(true)
    }

    function handleResolution() {
      setSupportActionDetails(complaint)
      handleClose()
      setToggleResolutionModal(true)
    }

    function handleAddInfoClick() {
      setInfoModalOpen(true);
      setInfoRequestModal(true);
    }

    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleAction = () => {
      setLoading(true)
      const body = {
        "respondent_action": "PROCESSING",
        "short_desc": "We are investigating your concern.",
        "updated_by": {
          "org": {
            "name": complaint.bppDomain
          },
          "contact": {
            "phone": user.mobile,
            "email": user.email
          },
          "person": {
            "name": user.name
          }
        }
      }
      postCall(`/api/v1/seller/${complaint._id}/issue_response`, body)
        .then((resp) => {
          setLoading(false)
          if (resp?.status === 200) {
            cogoToast.success("Action taken successfully");
            setProcessed(true)
            getComplaint()
          } else {
            cogoToast.error(resp.message);
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error);
          cogoToast.error(error.response.data.error);
        });
    }

    function checkProcessDisable() {

      // if (processed || loading) {
      //   return true
      // }
      // if (isCascaded) {
      //   return true
      // }

      return false
    }

    function checkResolveDisable() {
      if (expanded === supportActionDetails?.transactionId) {
        return true
      }

      if (isCascaded && !isEscalate) {
        return true
      }

      if (isEscalate && !isResolved && !isCascaded) {
        return false
      }

      if (isResolved) {
        return true
      }

      if (!processed && !isEscalate) {
        return true
      }
      return false
    }

    return (
      <div style={{ display: 'flex', direction: 'row', gap: '8px' }}>
        <Button
          className="!capitalize"
          variant="contained"
          onClick={() => handleAddInfoClick()}
        >
          Request More Info
        </Button>
        {(user?.role?.name !== "Super Admin") &&
          <Button
            variant="contained"
            className="!capitalize"
            onClick={(e) => handleClick(e)}
            disabled={issue.status === "CLOSED"}
          >
            Action
          </Button>
        }
        <Menu
          id="card-actions-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            disabled={checkProcessDisable()}
            onClick={() => {
              handleResolution()
            }}
          >
            Resolution
          </MenuItem>
          <MenuItem
            disabled={checkResolveDisable()}
            onClick={() => handleMenuClick()}>
            Resolve
          </MenuItem>
        </Menu>
        <Button
          className="!capitalize"
          variant="contained"
          onClick={() => navigate(`/application/orders/${issue?.order_details?.id}`)}
        >
          Order Detail
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto my-8">
      {toggleActionModal && (
        <CustomerActionCard
          user={user}
          supportActionDetails={supportActionDetails}
          onClose={() => setToggleActionModal(false)}
          onSuccess={(id) => {
            cogoToast.success("Action taken successfully");
            setToggleActionModal(false);
            setExpanded(id)
            getComplaint()
          }}
        />
      )}
      {toggleResolutionModal && (
        <MultiResolutionPage
          user={user}
          supportActionDetails={supportActionDetails}
          onClose={() => setToggleResolutionModal(false)}
          onSuccess={(id) => {
            cogoToast.success("Action taken successfully");
            setToggleActionModal(false);
            setExpanded(id)
            getComplaint()
          }}
        />
      )}
      {infoRequestModal && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Order  - Request More Information
          </Typography>
          {/* Render the Info Request Modal */}
          <InfoRequestModal user={user} supportActionDetails={complaint} open={infoModalOpen} handleClose={handleInfoModalClose} />
        </Box>
      )}
      <BackNavigationButton onClick={() => navigate("/application/complaints")} />
      <div className="flex flex-col">
        <div className={`${cardClass} my-4 p-4`}>
          <div className="flex justify-between">
            <p className="text-lg font-semibold mb-2">Complaints Summary</p>
            {issue && renderActionButtons()}
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Issue Id</p>
            <p className="text-base font-normal">{complaint?.issue?.id}</p>
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Issue Type</p>
            <p className="text-base font-normal">{issue?.level}</p>
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Product Names</p>
            {/* <p className="text-base font-normal">{issue?.order_details.items.map(x=> x.product_name).toString()}</p> */}
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Created On</p>
            <p className="text-base font-normal">{convertDateInStandardFormat(issue?.created_at)}</p>
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Modified On</p>
            <p className="text-base font-normal">{convertDateInStandardFormat(issue?.updated_at)}</p>
          </div>
          {/* <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Category</p>
            <p className="text-base font-normal">{issue?.category}</p>
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-base font-normal">Subcategory</p>
            <p className="text-base font-normal">{AllCategory.find(x => x.enums === issue?.sub_category)?.value}</p>
          </div> */}
          <div className="flex justify-between mt-3 mb-3">
            <p className="text-base font-normal">Complaint Status</p>
            <p className="text-base font-normal">{issue?.status}</p>
          </div>


          <Divider orientation="horizontal" />

          <p className="text-base font-semibold mt-3">Short description</p>
          <p className="text-md font-normal">{issue?.description?.short_desc}</p>
          <p className="text-base font-semibold mt-3">Long description</p>
          <p className="text-base font-normal">{issue?.description?.long_desc}</p>
          {issue?.description?.images.length > 0 &&
            <div className="flex space-between mt-3 mb-3">
              {
                issue?.description?.images?.map((image) => {
                  return (
                    <div className="container mr-4" style={{ height: "10%", width: "5%" }}>
                      <a href={image} rel="noreferrer" target="_blank">
                        <img src={image} />
                      </a>
                    </div>
                  );
                })
              } </div>
          }
        </div>
        <div className={`${cardClass} my-4 p-4`}>
          <div className="flex h-full">
            <p className="text-lg font-semibold mb-2"> Actions Taken</p>

          </div>
          {issueActions.length > 0 && OppositeContentTimeline(issueActions, resolutions)}

        </div>
        <div className={`${cardClass} my-4 p-4`}>
          <div className="flex h-full">
            <p className="text-lg font-semibold mb-2"> Actor Details</p>

          </div>
          {issueActions.length > 0 && ActorInfo(actorInfo)}

        </div>
        {/* <div className="flex justify-between">
          <div className="w-full">
            <div className={`${cardClass} my-4 p-4`}>
              <p className="text-lg font-semibold mb-2">Customer Details</p>
              <div className="flex items-center">
                <p className="text-lg font-semibold">Name : &nbsp;</p>
                <p className="text-sm font-medium">
                  {issue?.complainant_info?.person?.name}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-semibold">Mobile : &nbsp;</p>
                <p className="text-sm font-medium">
                  +91 {issue?.complainant_info?.contact?.phone}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-semibold">Email : &nbsp;</p>
                <p className="text-sm font-medium">
                  {issue?.complainant_info?.contact?.email}
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};



// Function to get color class for description codes
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
    case "INFO_PROVIDED":
      return "text-teal-500";
    case "RESOLUTION_ACCEPTED":
      return "text-pink-500";
    case "ESCALATED":
      return "text-red-500";
    default:
      return "text-black"; // Default color
  }
};

function OppositeContentTimeline(actions, resolutions) {
  // Function to render resolution details
  const renderResolutions = (refId) => {
    if (!Array.isArray(resolutions) || resolutions.length === 0) {
      return <p>No resolution options available.</p>;
    }
    const relatedResolutions = resolutions.filter((res) => res.ref_id === refId);
    return relatedResolutions.map((res) => (
      <div key={res.id} className="p-2 bg-gray-100 rounded-lg my-2">
        <p className="text-sm font-semibold">{res.descriptor.code}</p>
        <p className="text-sm">{res.descriptor.short_desc}</p>
        {res.tags?.map((tag, index) =>
          tag.list?.map((item, idx) => (
            <p key={idx} className="text-xs text-gray-600">
              {item.descriptor.code}: {item.value}
            </p>
          ))
        )}
        <p className="text-xs text-gray-500">Proposed by: {res.proposed_by}</p>
        <p className="text-xs text-gray-500">
          Updated at: {moment(res.updated_at).format("MMMM Do, YYYY hh:mm a")}
        </p>
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
      }}
    >
      {actions.length > 0 &&
        actions.map((action, i) => {
          const codeColor = getCodeColor(action?.descriptor?.code);
          const isEscalated = action?.descriptor?.code === "ESCALATED"; // Check if the code is "ESCALATED"

          return (
            <TimelineItem key={action.id}>
              <TimelineSeparator>
                <TimelineDot color={i + 1 < actions.length ? "grey" : "info"} />
                {i + 1 < actions.length && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <div className={`flex items-center ${isEscalated ? "bg-red-100 p-2 rounded-lg" : ""}`}>
                  <p
                    className={`text-base font-semibold mr-2 ${
                      isEscalated ? "text-red-600" : codeColor
                    }`}
                  >
                    {action?.descriptor?.code}:
                  </p>
                  <p className="text-md font-normal">{action?.descriptor?.short_desc}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-base font-semibold mr-2">Updated by:</p>
                  <p className="text-md font-normal">{action?.actor_details?.name}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-base font-semibold mr-2">Updated at:</p>
                  <p className="text-md font-normal">
                    {moment(action?.updated_at).format("MMMM Do, YYYY hh:mm a")}
                  </p>
                </div>
                {action?.descriptor?.code === "RESOLUTION_PROPOSED" && (
                  <div className="mt-4">
                    <p className="text-base font-semibold">Resolution Options:</p>
                    {renderResolutions(action?.ref_id)}
                  </div>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
    </Timeline>
  );
}


function ActorInfo(data) {
  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((actor) => (
          <div
            key={actor.id}
            className="p-4 border rounded shadow-sm bg-white"
          >
            <div className="flex items-center mb-2">
              <p className="text-base font-semibold mr-2">ID:</p>
              <p className="text-md font-normal">{actor.id}</p>
            </div>
            <div className="flex items-center mb-2">
              <p className="text-base font-semibold mr-2">Type:</p>
              <p className="text-md font-normal">{actor.type}</p>
            </div>
            <div className="flex items-center mb-2">
              <p className="text-base font-semibold mr-2">Organization:</p>
              <p className="text-md font-normal">
                {actor.info.org.name}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <p className="text-base font-semibold mr-2">Name:</p>
              <p className="text-md font-normal">
                {actor.info.person.name}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-base font-semibold mr-2">Contact:</p>
              <p className="text-md font-normal">
                {actor.info.contact.phone} | {actor.info.contact.email}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No actor information available.</p>
      )}
    </div>
  );
}

export default ComplaintDetails;
