import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import {
  deleteProductAsync,
  fetchProducts,
  searchProductsAsync,
} from "../../../redux/slice/productSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import AddProduct from "./AddProduct";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { BsSearch } from "react-icons/bs";
import Logo from "../../../assets/icons/Logo.svg";
import debounce from "lodash.debounce"; 
import { Loader } from "react-feather";
import { formatCurrency } from "../../../utilities/formatCurrency";
import { useNavigate } from "react-router";

function Products() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.products?.products);
  const status = useSelector((state) => state.products?.status);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate()
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);
  const debouncedHandleSearch = debounce(() => {
    // Dispatch the searchProductsAsync action with the debounced search query
    dispatch(searchProductsAsync(debouncedSearchQuery));
  }, 300); // Adjust the delay time as needed

  useEffect(() => {
    // Only perform the search when debouncedSearchQuery changes
    if (debouncedSearchQuery) {
      debouncedHandleSearch();
    }
  }, [debouncedSearchQuery]) 
  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-5",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const openAddModal = () => {
    setSelectedProduct(null);
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
          dispatch(deleteProductAsync(row._id))
            .then(() => {
              // After successfully deleting the product, refresh the product data
              dispatch(fetchProducts());
            })
            .catch((error) => {
              // Handle any errors that occur during the deletion process
              console.error("Error deleting category:", error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your Category Code is Safe :)", "error");
        }
      });
  };
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const handleEditClick = (row) => {
    setSelectedProduct(row);
    setModalOpen(true);
  };
  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
      maxWidth: "220px"
    },
    {
      name: "Product Image",
      cell: (row) => (
        <img
          src={row.productImages[0]}
          alt={row.productName}
          style={{ width: "50px", height: "50px" }}
        />
      ),
      maxWidth: "120px"

    },
    {
      name: "Price",
      selector: (row) =>(formatCurrency(row.productPrice)) ,
      sortable: true,
      maxWidth: "80px"

    },
    {
      name: "Product Info",
      selector: (row) => row.productInfo,
      maxWidth: "280px"

    },
    {
      name: "Subcategory",
      selector: (row) => row.subcategoryId.name,
      sortable: true,
      maxWidth: "180px"

    },
    {
      name: "Stock",
      selector: (row) => row.productStock,
      sortable: true,
      maxWidth: "50px"

    },
    {
      name: "Edit",
      cell: (row) => (
        <div className="text-primary">
          <FaEdit size={18} onClick={() => handleEditClick(row)} />
        </div>
      ),
      maxWidth: "50px"

    },
    {
      name: "Delete",
      cell: (row) => (
        <div className="text-danger">
          <FaTrash size={18} onClick={() => handleDelete(row)} />
        </div>
      ),
      maxWidth: "50px"

    },
  ];
  return (
    <div className=" mb-5 shadow w-100 justify-content-center align-items-center gap-2 mt-2 border p-5 pt-2">
      <div className="d-flex justify-content-between gap-5 align-items-center gap-5">
        <img src={Logo} alt="Logo" />
        <InputGroup className="d-flex justify-content-between align-items-center inpu w-50">
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
          Add New Product
        </Button>
      </div>
      {status === "loading" && <Loader>Loading...</Loader>}
      {status === "failed" && <Loader>Error: Unable to fetch products.</Loader>}
      {status === "succeeded" && (
        <DataTable
          title="Product List"
          columns={columns}
          data={productData}
          pagination
          fixedHeader
          pointerOnHover
          paginationPerPage={10}
          paginationPerPageOptions={[10, 20, 30]}
          onRowClicked={(row)=>navigate(`/products/viewproduct/${row._id}`)}
        />
      )}

      <AddProduct
        isOpen={isModalOpen}
        toggle={toggleModal}
        isEditing={!!selectedProduct}
        productData={selectedProduct}
        
      />
    </div>
  );
}

export default Products;
