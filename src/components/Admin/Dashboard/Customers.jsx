import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchCustomers } from "../../../redux/slice/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "react-feather";
import { Badge } from "reactstrap";
import { Spinner } from "react-bootstrap";

function Customers() {
  const customersData = useSelector((state) => state.customers?.customers);
  console.log(customersData);
  const status = useSelector((state) => state.customers?.status);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name, // Use a selector function
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email, // Use a selector function
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile, // Use a selector function
    },
  
    {
      name: "Verified",
      selector: (row) => (
        <Badge color={row.verfied ? "success" : "danger"}>
          {row.verfied ? "Verified" : "Not Verified"}
        </Badge>
      ),
    },
  ];
  return (
    <div className="container bg-white shadow rounded border border-2">
      {status === "loading" && <Spinner></Spinner>}
      {status === "failed" && <Loader>Error: Unable to fetch products.</Loader>}
      {status === "succeeded" && (
        <DataTable
          title="Customers"
          columns={columns}
          data={customersData}
          pagination
          fixedHeader
          pointerOnHover
          paginationPerPage={10}
        />
      )}
    </div>
  );
}

export default Customers;
