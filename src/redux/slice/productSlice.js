// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`${apiEndpoint}/api/v1/products`);
    const data = await response.json();
    return data;
  }
);
export const addProductAsync = createAsyncThunk(
  "products/addProduct",
  async (formData, { getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      const response = await fetch(
        `${apiEndpoint}/api/v1/admin/add/product`,
        config
      );
      if (!response.ok) {
        throw new Error("Failed to add the product");
      }
      // If the product is successfully added, you can return a success message or status
      return "Product added successfully";
    } catch (error) {
      throw error;
    }
  }
);
export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { getState }) => {
    try {
      const token = getState().auth.token; // Assuming you have a token in your auth state
      const response = await fetch(
        `${apiEndpoint}/api/v1/admin/products/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Include the bearer token in the request headers
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }
      // If the category is successfully deleted, you can return a success message or status
      return "Product deleted successfully";
    } catch (error) {
      throw error;
    }
  }
);
export const editProductAsync = createAsyncThunk(
  "products/editProduct",
  async (editProductData, { getState }) => {
    const { id, ...requestData } = editProductData;
    try {
      const token = getState().auth.token;
      const config = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      };
      const response = await fetch(
        `${apiEndpoint}/api/v1/admin/products/edit/${editProductData.id}`,
        config
      );

      if (!response.ok) {
        throw new Error("Failed to edit the product");
      }
      // If the product is successfully edited, you can return a success message or status
      return "Product edited successfully";
    } catch (error) {
      throw error;
    }
  }
);
export const searchProductsAsync = createAsyncThunk(
  "products/searchProducts",
  async (productName) => {
    try {
      if (!productName) {
        // Handle an empty search query by fetching all products
        const response = await fetch(`${apiEndpoint}/api/v1/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch all products");
        }
        const data = await response.json();
        return data;
      }

      // You can pass the productName as a query parameter to your API endpoint
      const response = await fetch(
        `${apiEndpoint}/api/v1/products/search?productName=${productName}`
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const viewProductAsync = createAsyncThunk(
  "product/viewproduct",
  async (productId) => {
    try {
      // You can pass the productName as a query parameter to your API endpoint
      const response = await fetch(
        `${apiEndpoint}/api/v1/products/viewproduct/${productId}`
      );

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);
export const recentProductAsync = createAsyncThunk(
  "products/recentProducts",
  async () => {
    const response = await fetch(
      `${apiEndpoint}/api/v1/products/recentproducts`
    );
    const data = await response.json();
    return data;
  }
);
export const sortproductsAsync = createAsyncThunk(
  "products/sortProducts",
  async (sortBy) => {
    const response = await fetch(
      `${apiEndpoint}/api/v1/products/sort?sortBy=${sortBy}`
    );
    const data = await response.json();
    return data;
  }
);
export const filterProductsAsync = createAsyncThunk(
  "products/filterProducts",
  async (subcategoriesId) => {
    const response = await fetch(
      `${apiEndpoint}/api/v1/products/filters?subcategoryIds=${subcategoriesId}`
    );
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: null,
    product: null,
    sortedproducts: null,
    recentproducts: null,
    suggestedproducts: null,
    filteredproducts: null,
    relevantproducts: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(recentProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recentProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recentproducts = action.payload;
      })
      .addCase(recentProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(sortproductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sortproductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sortedproducts = action.payload;
      })
      .addCase(sortproductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        toast.success("Product added successfully");
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        toast.success("You have edited the product succesfully");
      })
      .addCase(editProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.success("Editing product failed");
      })
      .addCase(searchProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload
        state.sortedproducts = action.payload;
      })
      .addCase(searchProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(viewProductAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(viewProductAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(viewProductAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(filterProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(filterProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";;
        state.sortedproducts = action.payload;

      })
      .addCase(filterProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
