import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { BsSearch } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import "react-date-range/dist/styles.css"; // Import the CSS styles
import "react-date-range/dist/theme/default.css"; // Import the default theme
import {
  downloadPDF,
  fetchAdminOrders,
  fetchOrdersByOrderID,
} from "../../../redux/slice/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Logo from "../../../assets/icons/Logo.svg";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router";
import { formatDateForInput } from "../../../utilities/FormatInputDate";


function Orders() {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const ordersData = useSelector((state) => state?.orders?.orders?.orders);
  const status = useSelector((state) => state.orders?.status);
  const navigate = useNavigate()
  const handleDownloadClick = (row) => {
    dispatch(downloadPDF(row.orderID)).then((result) => {
      if (result.payload.success) {
      } else {
        // Handle the case where the download failed
        console.error("PDF download failed:", result.payload.error);
      }
    });
  };

  const debouncedHandleSearch = debounce(() => {
    // Dispatch the searchProductsAsync action with the debounced search query
    dispatch(fetchOrdersByOrderID(debouncedSearchQuery));
  }, 300); // Adjust the delay time as needed

  useEffect(() => {
    // Only perform the search when debouncedSearchQuery changes
    if (debouncedSearchQuery) {
      debouncedHandleSearch();
    }
  }, [debouncedSearchQuery]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdminOrders());
    }
  }, [status, dispatch]);

  const columns = [
    {
      name: "#Order",
      selector: (row) => row.orderID,
      sortable: true,
    },
    {
      name: "Product",
      cell: (row) => row.cartItems[0].product.productName,
      sortable: true,
    },
    {
      name: "Customer Name",
      cell: (row) => row.shippingAddress.fullName,
      sortable: true,

    },
    {
      name: "Product Category",
      cell: (row) => row.cartItems[0].product.subcategoryId.name,
      sortable: true,
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      sortable: true,

    },
    {
      name: "Order Date",
      selector: (row) => formatDateForInput(row.orderDate),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="text-primary">
          <FaDownload size={18} onClick={() => handleDownloadClick(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="mb-5 shadow w-100 justify-content-center align-items-center gap-2 mt-2 border p-5 pt-2">
      <div className="d-flex justify-content-between gap-5 align-items-center gap-5">
        <img src={Logo} alt="Logo" />
        <InputGroup className="d-flex justify-content-between align-items-center inpu w-50">
          <Input
            type="search"
            name=""
            id=""
            placeholder="Search By order ID"
            className="border border-end-0 input-searc w-75"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDebouncedSearchQuery(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <InputGroupText className="p-2 input-tex">
            <BsSearch size={20} className="" onClick={debouncedHandleSearch} />
          </InputGroupText>
        </InputGroup>
        <InputGroup className="w-25">
          <Input type="date" />
        </InputGroup>
      </div>
      <DataTable
        title="Orders"
        columns={columns}
        data={ordersData}
        pagination
        fixedHeader
        pointerOnHover
        onRowClicked={(row)=>navigate(`/view/order/${row.orderID}`)}
        paginationPerPage={10}
      />
    </div>
  );
}

export default Orders;
