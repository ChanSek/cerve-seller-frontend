import { useState, useEffect } from "react";
import { getCall, postCall } from "../../../Api/axios";
import { useTheme } from '@mui/material/styles';
import ComplaintTable from "./ComplaintTable";
import Button from "../../Shared/Button";
import cogoToast from "cogo-toast";

const columns = [
  {
    id: "issueId",
    label: "Issue Id",
    minWidth: 120,
    align: "center",
  },
  {
    id: "created_at",
    label: "Created On",
    minWidth: 180,
    format: (value) => value.toLocaleString("en-US"),
    align: "center",
  },
  {
    id: "updated_at",
    label: "Modified On",
    minWidth: 180,
    format: (value) => value.toLocaleString("en-US"),
    align: "center",
  },
  {
    id: "status",
    label: "Status",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 140,
    align: "center",
  },
  {
    id: "provider_name",
    label: "Provider Store Name",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 130,
    align: "center",
  },
  {
    id: "short_description",
    label: "Short Description",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 170,
    align: "center",
  },
];

export default function Complaints() {
  const theme = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [user, setUser] = useState();
  const [columnList, setColumnList] = useState(columns);
  const [merchantId, setMerchantId] = useState(null);

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    setUser(res[0]);
    return res[0];
  };

  const initiateSession = async () => {
    const url = `/api/v1/seller/initiateIssue`;
    await postCall(url, {}).then(() => {
      cogoToast.success("New Session Initiated Successfully");
    });
  };

  const getIssues = (merchantId) => {
    const url = `/api/v1/seller/${merchantId}/all-issue?limit=${rowsPerPage}&offset=${page}`;
    getCall(url)
      .then((resp) => {
        setComplaints(resp.content || []);
        setTotalRecords(resp.totalElements || 0);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  useEffect(() => {
    if (!merchantId) {
      const user_id = localStorage.getItem("user_id");
      getUser(user_id).then((user) => {
        setMerchantId(user?.organization?._id);
        getIssues(user?.organization?._id);
      });
    }
  }, []);

  useEffect(() => {
    if (merchantId) {
      getIssues(merchantId);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (user && user?.role?.name === "Organization Admin") {
      const data = columns.filter((item) => item.id !== "provider_name");
      setColumnList(data);
    }
    if (user && user?.role?.name === "Super Admin") {
      const data = columns.filter((item) => item.id !== "action");
      setColumnList(data);
    }
  }, [user]);

  const emptyOrdersState = (
    <div className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="py-2">
          <p>No Complaints found!</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto my-8">
        <div className="mb-4 flex flex-row justify-between items-center">
          <label
            style={{ color: theme.palette.primary.main }}
            className="font-semibold text-2xl"
          >
            Complaints
          </label>
          <Button
            type="button"
            title="New Session"
            className="text-black"
            onClick={() => initiateSession()}
          />
        </div>

        {complaints?.length > 0 ? (
          <ComplaintTable
            columns={columnList}
            data={complaints}
            totalRecords={totalRecords}
            page={page}
            user={user}
            rowsPerPage={rowsPerPage}
            handlePageChange={(val) => setPage(val)}
            handleRowsPerPageChange={(val) => setRowsPerPage(val)}
            onSuccess={() => getIssues(merchantId)}
          />
        ) : (
          emptyOrdersState
        )}
      </div>
    </>
  );
}
