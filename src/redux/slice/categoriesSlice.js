import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchCategoriesAsync = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/api/v1/categories`,
      );

      if (response.status === 200) {
        return response.data.categories;
      } else {
        toast.error("Failed to fetch categories");
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      throw error;
    }
  }
);

export const categoryAddAsync = createAsyncThunk(
  "categories/categoryAddAsync",
  async (categoryName, { getState }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/admin/add/category`,
        categoryName,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Category added successfully");
        return response.data;
      } else {
        toast.error("Error while adding a category");
        throw new Error("Error while adding a category");
      }
    } catch (error) {
      toast.error("Error while adding a category");
      throw error;
    }
  }
);

export const subCategoryAddAsync = createAsyncThunk(
  "categories/subCategoryAddAsync",
  async ({ categoryId, subCategoryName }, { getState }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/admin/add/categories/${categoryId}/subcategory`,
        subCategoryName,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Subcategory added successfully");
        return response.data;
      } else {
        toast.error("Error while adding a subcategory");
        throw new Error("Error while adding a subcategory");
      }
    } catch (error) {
      toast.error("Error while adding a subcategory");
      throw error;
    }
  }
);

export const deleteSubCategoryAsync = createAsyncThunk(
  "categories/deleteSubCategoryAsync",
  async ({ categoryId, subcategoryId }, { getState }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.delete(
        `${apiEndpoint}/api/v1/admin/delete/categories/${categoryId}/subcategories/${subcategoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subcategory deleted successfully");
        return response.data;
      } else {
        toast.error("Error while deleting subcategory");
        throw new Error("Error while deleting subcategory");
      }
    } catch (error) {
      toast.error("Error while deleting subcategory");
      throw error;
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${apiEndpoint}/api/v1/admin/delete/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Category deleted successfully");
        return "Category deleted successfully";
      } else {
        toast.error("Error while deleting category");
        throw new Error("Error while deleting category");
      }
    } catch (error) {
      toast.error("Error while deleting category");
      throw error;
    }
  }
);

export const searchCategoriesAsync = createAsyncThunk(
  "products/searchProducts",
  async (searchCategory) => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/api/v1/categories/search?searchCategory=${searchCategory}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        toast.error("Failed to search categories");
        throw new Error("Failed to search categories");
      }
    } catch (error) {
      toast.error("Failed to search categories");
      throw error;
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(searchCategoriesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default categoriesSlice.reducer;
