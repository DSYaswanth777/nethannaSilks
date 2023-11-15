import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { BsSearch } from "react-icons/bs";
import Logo from "../../../assets/icons/Logo.svg";
import debounce from "lodash.debounce";
import { Loader } from "react-feather";
import {
  deleteCouponAsync,
  fetchCoupons,
  searchCouponAsync,
} from "../../../redux/slice/couponSlice";
import AddCoupon from "./AddCoupon";
import { formatDateForInput } from "../../../utilities/FormatInputDate";
function Coupons() {
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.coupons?.coupons);
  
  const status = useSelector((state) => state.coupons?.status);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setselectedCoupon] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCoupons());
    }
  }, [status, dispatch]);
  const debouncedHandleSearch = debounce(() => {
    // Dispatch the searchCouponsAsync action with the debounced search query
    dispatch(searchCouponAsync(debouncedSearchQuery));
  }, 300); 

  useEffect(() => {
    // Only perform the search when debouncedSearchQuery changes
    if (debouncedSearchQuery) {
      debouncedHandleSearch();
    }
  }, [debouncedSearchQuery]);
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const openAddModal = () => {
    setselectedCoupon(null); 
    setModalOpen(true);
  };
  const handleDelete = (row) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to get back!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No, cancel!",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Dispatch the deleteCategoryAsync action with the productId to delete
          dispatch(deleteCouponAsync(row._id))
            .then(() => {
              // After successfully deleting the product, refresh the product data
              dispatch(fetchCoupons());
            })
            .catch((error) => {
              // Handle any errors that occur during the deletion process
              console.error("Error deleting Coupon:", error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your Coupon Code is Safe :)", "error");
        }
      });
  };
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const handleEditClick = (row) => {
    setselectedCoupon(row);
    setModalOpen(true);
  };
  const columns = [
    {
      name: "Coupon Name",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Coupon Discount",
      selector: (row) => row.discountedAmount,
      sortable: true,
    },
    {
      name: "Coupon Max Usage",
      selector: (row) => row.maxUses,
    },
    {
      name: "Coupon Expiration",
      selector: (row) => formatDateForInput(row.expirationDate),

      sortable: true,
    },
    {
      name: "Edit",
      cell: (row) => (
        <div className="text-primary">
          <FaEdit size={18} onClick={() => handleEditClick(row)} />
        </div>
      ),
    },
    {
      name: "Delete",
      cell: (row) => (
        <div className="text-danger">
          <FaTrash size={18} onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ];
  return (
    <div className=" mb-5 shadow w-100 justify-content-center align-items-center gap-2 mt-2 border p-5 pt-2">
      <div className="d-flex justify-content-between gap-5 align-items-center">
        <img src={Logo} alt="" />
        <InputGroup className="d-flex justify-content-center align-items-center inpu w-50">
          <Input
            type="search"
            name=""
            id=""
            placeholder="Search your product..."
            className="border border-end-0 input-searc w-50"
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
        <Button className="h-50" onClick={openAddModal}>
          Add New Coupon
        </Button>
      </div>
      {status === "loading" && <Loader>Loading...</Loader>}
      {status === "failed" && <Loader>Error: Unable to fetch Coupons.</Loader>}
      {status === "succeeded" && (
        <DataTable
          title="Coupon List"
          columns={columns}
          data={couponData}
          pagination
          fixedHeader
          pointerOnHover
          paginationPerPage={10}
          paginationPerPageOptions={[10, 20, 30]}
        />
      )}

      <AddCoupon
        isOpen={isModalOpen}
        toggle={toggleModal}
        isEditing={!!selectedCoupon}
        couponData={selectedCoupon}
      />
    </div>
  );
}

export default Coupons;
