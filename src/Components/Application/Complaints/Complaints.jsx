import { useState, useEffect } from "react";
import { getCall, postCall } from "../../../Api/axios";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import ComplaintTable from "./ComplaintTable";
import Button from "../../Shared/Button";
import cogoToast from "cogo-toast";
import AdminComplaintDialog from "./AdminComplaintDialog";

const columns = [
  { id: "issueId", label: "Issue Id", minWidth: 120, align: "center" },
  { id: "created_at", label: "Created On", minWidth: 180, align: "center", format: (value) => value.toLocaleString("en-US") },
  { id: "updated_at", label: "Modified On", minWidth: 180, align: "center", format: (value) => value.toLocaleString("en-US") },
  { id: "status", label: "Status", minWidth: 140, align: "center", format: (value) => value.toLocaleString("en-US") },
  // { id: "provider_name", label: "Provider Store Name", minWidth: 130, align: "center", format: (value) => value.toLocaleString("en-US") },
  { id: "initiatedBy", label: "Initiated By", minWidth: 130, align: "center", format: (value) => value.toLocaleString("en-US") },
  { id: "short_description", label: "Short Description", minWidth: 170, align: "center", format: (value) => value.toLocaleString("en-US") },
];

export default function Complaints() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [user, setUser] = useState(null);
  const [columnList, setColumnList] = useState(columns);
  const [merchantId, setMerchantId] = useState(null);

  const fetchUser = async (id) => {
    try {
      const res = await getCall(`/api/v1/seller/subscriberId/${id}/subscriber`);
      const userData = res[0];
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const initiateSession = async () => {
    try {
      await postCall(`/api/v1/seller/initiateIssue`, {});
      cogoToast.success("New Session Initiated Successfully");
    } catch (error) {
      console.error("Error initiating session:", error);
    }
  };

  const fetchIssues = async () => {
    if (!user) {
      console.error("User not found!");
      return;
    }

    const url = user.role?.name === "Super Admin"
      ? `/api/v1/seller/complaints?limit=${rowsPerPage}&offset=${page}`
      : `/api/v1/seller/complaints?merchantId=${merchantId}&initiatedBy=BUYER&limit=${rowsPerPage}&offset=${page}`;

    try {
      const resp = await getCall(url);
      setComplaints(resp.content || []);
      setTotalRecords(resp.totalElements || 0);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchUser(userId).then((userData) => {
        const organizationId = userData?.organization?._id;
        if (organizationId) {
          setMerchantId(organizationId);
        } else if (userData?.role?.name === "Super Admin") {
          fetchIssues();
        }
      });
    } else {
      console.error("User ID not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (user?.role?.name === "Super Admin" || merchantId) {
      fetchIssues();
    }
  }, [user, merchantId, page, rowsPerPage]);

  useEffect(() => {
    if (user) {
      const filteredColumns = user?.role?.name === "Organization Admin"
        ? columns.filter((item) => item.id !== "provider_name" && item.id !== "initiatedBy")
        : user.role?.name === "Super Admin"
        ? columns.filter((item) => item.id !== "action")
        : columns;
      setColumnList(filteredColumns);
    }
  }, [user]);

  return (
    <div className="container mx-auto my-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
          Complaints
        </h1>
        <div className="flex gap-2">
          {/* <Button title="New Session" onClick={initiateSession} /> */}
          {user?.role?.name === "Super Admin" && <Button variant="contained" icon={<AddIcon />} title="CREATE ISSUE" onClick={() => setOpen(true)} />}
        </div>
      </div>
      <AdminComplaintDialog open={open} onClose={() => setOpen(false)} />

      {complaints.length > 0 ? (
        <ComplaintTable
          columns={columnList}
          data={complaints}
          totalRecords={totalRecords}
          page={page}
          user={user}
          rowsPerPage={rowsPerPage}
          handlePageChange={setPage}
          handleRowsPerPageChange={setRowsPerPage}
          onSuccess={fetchIssues}
        />
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>No Complaints found!</p>
        </div>
      )}
    </div>
  );
}
