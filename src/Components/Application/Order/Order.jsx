import { useState, useEffect } from "react";
import Navbar from "../../Shared/Navbar";
import OrderTable from "../Order/OrderTable";
import { OrderData } from "../../../Constants/OrdersData";
import useCancellablePromise from "../../../Api/cancelRequest";
import { getCall } from "../../../Api/axios";
import { useTheme } from '@mui/material/styles';

const columns = [
  { id: "orderId", label: "Order Id", minWidth: 120, align: "left" },
  { id: "transactionId", label: "Transaction Id", minWidth: 120, align: "left" },
  {
    id: "state",
    label: "Status",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 140,
    align: "left",
  },
  {
    id: "provider_name",
    label: "Provider Store Name",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 130,
    align: "left",
  },
  // {
  //   id: "order_items",
  //   label: "Items Ordered",
  //   format: (value) => value.toLocaleString("en-US"),
  //   minWidth: 100,
  //   align: "left",
  // },
  {
    id: "payment_type",
    label: "Payment Type",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 170,
    align: "left",
  },
  {
    id: "total_amt",
    label: "Total Amount",
    minWidth: 120,
    align: "left",
  },
  {
    id: "delivery_info",
    label: "Delivering To",
    format: (value) => value.toLocaleString("en-US"),
    minWidth: 90,
    align: "left",
  },{
    id: "createdAt",
    label: "Created On",
    minWidth: 180,
    format: (value) => value.toLocaleString("en-US"),
    align: "left",
  },
  {
    id: "updatedAt",
    label: "Modified On",
    minWidth: 180,
    format: (value) => value.toLocaleString("en-US"),
    align: "left",
  },
];

export default function Orders() {
  const theme = useTheme();
  const { cancellablePromise } = useCancellablePromise();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [currentTab, setCurrentTab] = useState("ongoing");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [user, setUser] = useState();
  const [columnList, setColumnList] = useState(columns);
  const [merchantId, setMerchantId] = useState(null);

  const fetchUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    setUser(res[0]);
    return res[0];
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchUser(userId).then((userData) => {
        const organizationId = userData?.organization?._id;
        if (organizationId) {
          setMerchantId(organizationId);
        } else if (userData?.role?.name === "Super Admin") {
          getOrders();
        }
      });
    } else {
      console.error("User ID not found in localStorage.");
    }
  }, []);

  const getOrders = () => {
    console.log("current tab "+currentTab);
    if (!user) {
      console.error("User not found!");
      return;
    }
    const url = user.role?.name === "Super Admin"
      ? `/api/v1/seller/orders?currentTab=${currentTab}&limit=${rowsPerPage}&offset=${page}`
      : `/api/v1/seller/orders?merchantId=${merchantId}&currentTab=${currentTab}&limit=${rowsPerPage}&offset=${page}`;
    getCall(url)
      .then((resp) => {
        setOrders(resp.content);
        setTotalRecords(resp.totalElements);
      })
      .catch((error) => {
        console.log(error.response);
      })
  };

  useEffect(() => {
      if (user?.role?.name === "Super Admin" || merchantId) {
        getOrders();
      }
    }, [user, merchantId, page, rowsPerPage, currentTab]);

  useEffect(() => {
    if (user && user?.role?.name === "Organization Admin") {
      const data = columns.filter((item) => item.id !== "provider_name")
      setColumnList(data);
    }
  }, [user]);

  return (
    <>
      <div className="container mx-auto my-8">
        <div className="mb-4 flex flex-row justify-between items-center">
          <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">Orders</label>
        </div>
        <OrderTable
          columns={columnList}
          data={orders}
          totalRecords={totalRecords}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={(val) => setPage(val)}
          handleRowsPerPageChange={(val) => setRowsPerPage(val)}
          onTabChange={(val) => setCurrentTab(val.toLowerCase())}
        />
      </div>
    </>
  );
}
