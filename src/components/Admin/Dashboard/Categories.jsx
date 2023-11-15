import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import AddCategory from "./AddCategory";
import { Badge, Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { BsSearch } from "react-icons/bs";
import Logo from "../../../assets/icons/Logo.svg";
import debounce from "lodash.debounce"; 
import { Loader } from "react-feather";
import { deleteCategoryAsync, fetchCategoriesAsync, searchCategoriesAsync } from "../../../redux/slice/categoriesSlice";

function Categories() {
  const dispatch = useDispatch();
  const categoriesData = useSelector((state) => state?.categories?.categories);
  const status = useSelector((state) => state?.categories?.status);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setselectedCategory] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategoriesAsync());
    }
  }, [status, dispatch]);

  const debouncedHandleSearch = debounce(() => {
    dispatch(searchCategoriesAsync(debouncedSearchQuery));
  }, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      debouncedHandleSearch();
    }
  }, [debouncedSearchQuery]) 


  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const openAddModal = () => {
    setselectedCategory(null); 
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
          dispatch(deleteCategoryAsync(row._id))
            .then(() => {
              // After successfully deleting the product, refresh the product data
              dispatch(fetchCategoriesAsync());
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
    setselectedCategory(row);
    setModalOpen(true);
  };
  const columns = [
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Subcategories",
      cell: (row) => (
        <div>
          {row?.subcategories?.map((subcategory) => (
            <Badge  key={subcategory._id} color="primary" className="me-2 mb-2 mt-1 text-center">
              {subcategory.name}
            </Badge>
          ))}
        </div>
      ),
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
            placeholder="Search your Category..."
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
          Add New Category
        </Button>
      </div>
      {status === "loading" && <Loader>Loading...</Loader>}
      {status === "failed" && <Loader>Error: Unable to fetch categories.</Loader>}
      {status === "succeeded" && (
        <DataTable
          title="Categories List"
          columns={columns}
          data={categoriesData}
          pagination
          fixedHeader
          pointerOnHover
          paginationPerPage={10}
          paginationPerPageOptions={[10, 20, 30]}
        />
      )}

      <AddCategory
        isOpen={isModalOpen}
        toggle={toggleModal}
        isEditing={!!selectedCategory} 
        categoriesData={selectedCategory}
      />
    </div>
  );
}

export default Categories;
