import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Form, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../../../redux/slice/categoriesSlice";
import {
  addProductAsync, fetchProducts
} from "../../../redux/slice/productSlice";

function AddProduct({ isOpen, toggle, isEditing, productData }) {
  const [formData, setFormData] = useState({
    productName: "",
    productImages: [],
    productPrice: "",
    productInfo: "",
    productStock: "",
    subcategoryId: "",
  });
  const { categories, isLoading, error } = useSelector((state) => state);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
    if (isEditing && productData) {
      // Initialize the form data with the product information when in edit mode
      setFormData({
        productName: productData.productName,
        productPrice: productData.productPrice,
        productInfo: productData.productInfo,
        productStock: productData.productStock,
        subcategoryId: productData.subcategoryId._id,
      });
      setSelectedCategoryId(productData.subcategoryId.categoryId);
      setSelectedSubcategoryId(productData.subcategoryId._id);
    }
  }, [dispatch, isEditing, productData]);

  const handleCategoryDropdownChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSubcategoryId("");
  };

  const handleSubcategoryDropdownChange = (e) => {
    setSelectedSubcategoryId(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImages" && !isEditing) {
      const newProductImages = Array.from(formData.productImages);
      newProductImages.push(...files);
      setFormData({ ...formData, [name]: newProductImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const productDataToSend = new FormData();
    productDataToSend.append("productName", formData.productName);
    productDataToSend.append("productPrice", formData.productPrice);
    productDataToSend.append("productInfo", formData.productInfo);
    productDataToSend.append("subcategoryId", selectedSubcategoryId);
    productDataToSend.append("productStock", formData.productStock);
    productDataToSend.append("categoryId", selectedCategoryId);


    if (!isEditing) {
      // Append images only when adding a new product
      formData.productImages.forEach((file, index) => {
        productDataToSend.append(`productImages`, file);
      });
    }
    try {
      if (isEditing) {
        const editProductData = {
          productName: formData.productName,
          productPrice: formData.productPrice,
          productInfo: formData.productInfo,
          subcategoryId: selectedSubcategoryId,
          productStock: formData.productStock,
        };
        const config = {
          method: "PATCH",
          body: JSON.stringify(editProductData),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const productId = productData._id;
        const response = await fetch(
          `https://animated-rhythm-399204.el.r.appspot.com/api/v1/admin/products/edit/${productId}`,
          config
        );

        if (!response.ok) {
          throw new Error("Failed to edit the product");
        }
      } else {
        await dispatch(addProductAsync(productDataToSend));
      }
      toggle();
      dispatch(fetchProducts());
    } catch (error) {
      // Handle the error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </ModalHeader>
        <ModalBody>
          {isUploading ? (
            <div className="text-center">
              <Spinner color="primary" />
              {isEditing ? (
                <p> Please Wait...</p>
              ) : (
                <p>Please while adding your product..</p>
              )}
            </div>
          ) : (
            <Form className="d-flex flex-column gap-2" onSubmit={handleSubmit}>
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
              <Label for="CategoryDropdown">Select a Category</Label>
              <Input
                type="select"
                name="category"
                id="CategoryDropdown"
                value={selectedCategoryId}
                onChange={handleCategoryDropdownChange}
              >
                <option value="">Select a category</option>
                {categories.categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Input>
              <Label for="SubcategoryDropdown">Select a Subcategory</Label>
              <Input
                type="select"
                name="subcategory"
                id="SubcategoryDropdown"
                value={selectedSubcategoryId}
                onChange={handleSubcategoryDropdownChange}
                disabled={!selectedCategoryId}
              >
                <option value="">Select a subcategory</option>
                {selectedCategoryId &&
                  categories.categories
                    .find((category) => category._id === selectedCategoryId)
                    ?.subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
              </Input>

              {!isEditing && (
                <>
                  <Label>Product Images</Label>
                  <Input
                    type="file"
                    name="productImages"
                    onChange={handleInputChange}
                    multiple
                    required={!isEditing}
                  />
                </>
              )}

              <Label>Product Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                required
              />
              <Label>Product Info</Label>
              <Input
                type="textarea"
                name="productInfo"
                value={formData.productInfo}
                onChange={handleInputChange}
              />
              <Label>Product Stock</Label>
              <Input
                type="number"
                name="productStock"
                value={formData.productStock}
                onChange={handleInputChange}
                required
              />
              <div className="d-flex justify-content-end gap-3">
                <Button type="submit" variant="success">
                  Save
                </Button>
                <Button variant="danger" onClick={toggle}>
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddProduct;
