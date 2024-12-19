import { useState, useEffect } from "react";
import ReturnOrderTable from "./ReturnOrderTable";
import { getCall } from "../../../Api/axios";
import columns from './colDefs';
import { useTheme } from '@mui/material/styles';

export default function Returns() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [user, setUser] = useState();
  const [merchantId, setMerchantId] = useState(null);

  const getReturnOrders = (merchantId) => {
    const url = `/api/v1/seller/${merchantId}/orders/return/request?limit=${rowsPerPage}&offset=${page}`;
    getCall(url)
      .then((resp) => {
        setData(resp.content);
        setTotalRecords(resp.totalElements);
      })
      .catch((error) => {
        console.log(error.response);
      })
  };

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    setUser(res[0]);
    return res[0];
  };

  useEffect(() => {
    if (!merchantId) {
      const user_id = localStorage.getItem("user_id");
      getUser(user_id).then((user) => {
        getReturnOrders(user?.organization?._id);
        setMerchantId(user?.organization?._id);
        // if(user && user?.role?.name === "Organization Admin"){
        //   const data = columns.filter((item) => item.id !== "provider_name")
        //   setColumnList(data);
        // }
      });
    }
  }, [merchantId]);

  // useEffect(() => {
  //   if (params.id) {
  //     getReturnOrders(rowsPerPage, page);
  //   }
  // }, [page, rowsPerPage]);

  const handleRefresh = () => {
    getReturnOrders(merchantId);
  };

  return (
    <>
      <div className="container mx-auto my-8">
        <div className="mb-4 flex flex-row justify-between items-center">
          <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">Returns</label>
        </div>
        <ReturnOrderTable
          columns={columns}
          data={data}
          totalRecords={totalRecords}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={(val) => setPage(val)}
          handleRowsPerPageChange={(val) => setRowsPerPage(val)}
          handleRefresh={handleRefresh}
        />
      </div>
    </>
  );
}
