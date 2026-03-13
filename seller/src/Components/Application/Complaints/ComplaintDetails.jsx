import React, { useEffect, useState } from "react";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { useNavigate, useParams } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import { convertDateInStandardFormat } from "../../../utils/formatting/date";
import ComplaintActions from "./ComplaintActions";
import OrderDetailsDialog from "../Order/OrderDetailsDialog";

import {
  Box, Typography,
  Button,
  Divider,
  Menu,
  MenuItem
} from "@mui/material";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [complaint, setComplaint] = useState();
  const issue = complaint?.issue;
  const orderRef = issue?.refs?.find((ref) => ref.ref_type === "ORDER");

  const getComplaint = async () => {
    const url = `/api/v1/seller/${params?.id}/complaintDetails`;
    getCall(url).then((resp) => {
      if (resp.success) {
        setComplaint(resp);
      }
    });
  };

  useEffect(() => {
    if (params.id) getComplaint();
  }, [params]);

  const handleRefresh = () => {
    getComplaint();
  };

  return (
    <div className="container mx-auto my-8">
      <BackNavigationButton onClick={() => navigate("/application/complaints")} />
      <div className="flex flex-wrap gap-4 p-4">
        {/* First Row */}
        <div className="flex-1 bg-white shadow rounded-2xl p-4 min-w-[600px]">
          {/* Title */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Complaints Summary</h2>
            {orderRef?.ref_id && <OrderDetailsDialog
              orderId={orderRef?.ref_id}
              triggerComponent={<Typography
                variant="h6"
                sx={{
                  color: "#1565c0", // Bluish text color
                  cursor: "pointer", // Pointer cursor for hover effect
                  "&:hover": {
                    textDecoration: "underline", // Underline on hover for emphasis
                  },
                }}
              >
                {orderRef?.ref_id}
              </Typography>}
            />}
          </div>

          {/* Complaint Details */}
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Issue ID</p>
              <p className="text-sm">{issue?.id || '-'}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Issue Type</p>
              <p className="text-sm">{issue?.level || '-'}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Product Names</p>
              <p className="text-sm">
                {issue?.order_details?.items?.map((x) => x.product_name).join(', ') || '-'}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Created On</p>
              <p className="text-sm">{convertDateInStandardFormat(issue?.created_at) || '-'}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Modified On</p>
              <p className="text-sm">{convertDateInStandardFormat(issue?.updated_at) || '-'}</p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <p className="text-sm font-medium">Complaint Status</p>
              <p className="text-sm">{issue?.status || '-'}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t"></div>

          {/* Descriptions */}
          <div className="text-gray-800">
            <h3 className="text-base font-semibold mb-2">Short Description</h3>
            <p className="text-sm text-gray-700">{issue?.descriptor?.short_desc || '-'}</p>

            <h3 className="text-base font-semibold mt-4 mb-2">Long Description</h3>
            <p className="text-sm text-gray-700">{issue?.descriptor?.long_desc || '-'}</p>
          </div>
          {(issue?.descriptor?.images?.length > 0 ||
            issue?.descriptor?.media?.length > 0 ||
            issue?.descriptor?.additional_desc) && (
              <div className="mt-4">
                {/* Images Section */}
                {issue?.descriptor?.images?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Images</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {issue.descriptor.images.map((img, index) => (
                        <div key={`image-${index}`} className="image-preview-container">
                          <a href={img.url} rel="noreferrer" target="_blank">
                            <img
                              src={img.url}
                              alt={`Image ${index + 1}`}
                              style={{ height: "80px", width: "80px", objectFit: "contain" }}
                            />
                          </a>
                          <img
                            src={img.url}
                            alt={`Image Zoom ${index + 1}`}
                            className="image-preview-large"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Media Section */}
                {issue?.descriptor?.media?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Media</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {issue.descriptor.media.map((mediaItem, index) => {
                        const url = new URL(mediaItem.url);
                        const extension = url.pathname.split('.').pop().toLowerCase();

                        const isImage = ['jpeg', 'jpg', 'gif', 'png', 'svg'].includes(extension);
                        const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(extension);

                        return (
                          <div key={`media-${index}`} className="image-preview-container">
                            {isImage && (
                              <>
                                <a href={mediaItem.url} rel="noreferrer" target="_blank">
                                  <img
                                    src={mediaItem.url}
                                    alt={`Media ${index + 1}`}
                                    style={{ height: "100px", width: "100px", objectFit: "contain" }}
                                  />
                                </a>
                                <img
                                  src={mediaItem.url}
                                  alt={`Media Zoom ${index + 1}`}
                                  className="image-preview-large"
                                />
                              </>
                            )}
                            {isVideo && (
                              <video
                                controls
                                style={{ height: "100px", width: "100px", objectFit: "contain" }}
                              >
                                <source src={mediaItem.url} type={`video/${extension}`} />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Additional Description Section */}
                {issue?.descriptor?.additional_desc && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Additional Description</h3>
                    <div className="image-preview-container">
                      <a href={issue.descriptor.additional_desc.url} rel="noreferrer" target="_blank">
                        <img
                          src={issue.descriptor.additional_desc.url}
                          alt="Additional Description"
                          style={{ height: "80px", width: "80px", objectFit: "contain" }}
                        />
                      </a>
                      <img
                        src={issue.descriptor.additional_desc.url}
                        alt="Additional Description Zoom"
                        className="image-preview-large"
                      />
                    </div>
                  </>
                )}
              </div>
            )}


        </div>
        <div className="flex-1 bg-white shadow rounded-2xl p-4 min-w-[600px]">
          <h2 className="text-xl font-semibold mb-2">Actions Taken</h2>
          <ComplaintActions
            actors={issue?.actors}
            actions={issue?.actions}
            resolutions={issue?.resolutions}
            complaintId={complaint?._id}
            initiatedBy={complaint?.initiatedBy}
            refreshComplaints={handleRefresh}
          />
        </div>

        {/* Second Row */}
        <div className="flex-1 bg-white shadow rounded-2xl p-4 min-w-[600px]">
          <h2 className="text-xl font-semibold mb-2">Actor Details</h2>
          {issue?.actors && actorsInfo(issue?.actors)}
        </div>
        {/* <div className="flex-1 bg-white shadow rounded-2xl p-4 min-w-[600px]">
          <h2 className="text-xl font-semibold mb-2">Actions Taken</h2>
          <p className="text-sm text-gray-600">Details about actions taken go here.</p>
        </div> */}
      </div>
    </div>
  );
};

function actorsInfo(data) {
  return (
    <div className="overflow-x-auto">
      {data && data.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((actor, index) => (
              <tr
                key={actor.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
              >
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {actor.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {actor.info.org.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {actor.info.person.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 border-b">
                  {actor.info.contact.phone} <br />
                  {actor.info.contact.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-500">No actor information available.</p>
      )}
    </div>
  );
}

export default ComplaintDetails;
