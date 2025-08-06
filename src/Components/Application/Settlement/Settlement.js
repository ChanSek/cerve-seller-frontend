import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import cogoToast from "cogo-toast";
import SettlementTable from "./SettlementTable";
import { Tab, Tabs } from "@mui/material";
import { getCall } from "../../../Api/axios";
import useNavigation from "../../../hooks/useNavigation";
import useQueryParams from "../../../hooks/useQueryParams";
import { evalQueryString } from "../../../utils/index";
import { useTheme } from "@mui/material/styles";

const tabs = [
  { value: "pending", label: "PENDING" },
  { value: "settled", label: "SETTLED" },
];

const settlementCols = [
  { id: "merchantId", label: "Merchant" },
  { id: "store", label: "Store Name" },
  { id: "totalAmount", label: "Total Amount" },
  { id: "orderCount", label: "Orders" },
  { id: "Action", label: "Action" },
];

const Settlement = () => {
  const theme = useTheme();
  const queryParams = useQueryParams();
  const [view, setView] = useState(queryParams.view || "pending");
  const [settlement, setSettlement] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigation = useNavigation();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setView(newValue);
  };

  const fetchSettlementOrders = async () => {
    const url = `/api/v1/seller/settlement/${view}/orders?pageSize=${rowsPerPage}&fromIndex=${page}`;
    try {
      const res = await getCall(url);
      setSettlement(res.content);
      setTotalRecords(res.totalElements);
    } catch (error) {
      cogoToast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchSettlementOrders();
  }, [view, page, rowsPerPage]);

  useEffect(() => {
    navigation.toPathWithQuery(`${location.pathname}`, evalQueryString(location.search, { view }));
  }, [view]);

  return (
    <div>
      <div className="container mx-auto my-8">
        <div className="mb-4 flex flex-row justify-between items-center">
          <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
            Order Settlement
          </label>
        </div>

        <div className="flex flex-row justify-between items-center">
          <Tabs
            style={{ marginBottom: 30 }}
            value={view}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </div>

        <SettlementTable
          view={view}
          columns={settlementCols}
          data={settlement}
          totalRecords={totalRecords}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={(val) => setPage(val)}
          handleRowsPerPageChange={(val) => setRowsPerPage(val)}
        />
      </div>
    </div>
  );
};

export default Settlement;
