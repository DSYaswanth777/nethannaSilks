import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Form,
  Input,
  Button,
} from "reactstrap";
import {
  categoryAddAsync,
  deleteSubCategoryAsync,
  fetchCategoriesAsync,
  subCategoryAddAsync,
} from "../../../redux/slice/categoriesSlice";
import { useDispatch } from "react-redux";

function AddCategory({ isOpen, toggle, isEditing, categoriesData }) {
  const [categoryName, setCategoryName] = useState({
    name: "",
  });
  const [subCategoryName, setSubCategoryName] = useState("");

  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryName({ ...categoryName, [name]: value });
  };
  const handleSubCategoryDelete = async (subcategoryId) => {
    const categoryId = categoriesData?._id;
    await dispatch(deleteSubCategoryAsync({ categoryId, subcategoryId }));
    dispatch(fetchCategoriesAsync());
    toggle();
  };
  const handleAddCategory = async () => {
    await dispatch(categoryAddAsync(categoryName));
    dispatch(fetchCategoriesAsync());
    toggle();
  };
  const handleSubAddCategory = async () => {
    const categoryId = categoriesData?._id;
    await dispatch(subCategoryAddAsync({ categoryId, subCategoryName }));
    dispatch(fetchCategoriesAsync());
    toggle();
  };

  const handleSubCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryName({ ...subCategoryName, [name]: value });
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isEditing ? "Edit Category" : "Add New Category"}
        </ModalHeader>
        <ModalBody>
          <Form className="d-flex flex-column gap-2">
            <Label>Category Name</Label>
            <div className="d-flex gap-3">
              <Input
                type="text"
                name="name"
                value={categoriesData?.name}
                onChange={handleInputChange}
                required
              />
              {isEditing ? (
                <Button className="me-2" color="success">
                  Update
                </Button>
              ) : (
                ""
              )}
            </div>
            {categoriesData?.subcategories.map((subcategory) => (
              <div key={subcategory._id} className="input-group mb-2 ">
                <div className="d-flex flex-column">
                  <Label className="">Sub Categories</Label>
                  <div className="d-flex ">
                    <Input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Subcategory Name"
                      value={subcategory?.name}
                    />
                    <Button
                      type="button"
                      color="success"
                      className="mx-2"
                      onClick={() => handleSubCategoryDelete(subcategory._id)}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => handleSubCategoryDelete(subcategory._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {isEditing ? (
              <div>
                <Label>Add New Sub-Category</Label>
                <div className="d-flex">
                  <Input
                    type="text"
                    name="name"
                    onChange={handleSubCategoryInputChange}
                  />
                  <Button
                    type="button"
                    color="success"
                    className="ms-2"
                    onClick={handleSubAddCategory}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="d-flex justify-content-end gap-3">
              {isEditing ? (
                ""
              ) : (
                <Button color="success" onClick={handleAddCategory}>
                  Save
                </Button>
              )}

              <Button color="danger" onClick={toggle}>
                Cancel
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddCategory;
