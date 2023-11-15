import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchUserWishlistAsync = createAsyncThunk(
  "wishlist/fetchUserWishlistAsync",
  async (_, { getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
      `${apiEndpoint}/api/v1/wishlist`,
        config
      );
      const data = await response.json();
      return data.wishlistItems;
    } catch (error) {
      throw error;
    }
  }
);
export const wishlistAddAsync = createAsyncThunk(
  "wishlist/wishlistAddAsync",
  async (productId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        productId: productId,
      };

      const response = await fetch(
        `${apiEndpoint}/api/v1/wishlist/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Dispatch a success toast notification for HTTP 200
        toast.success("Product added to wishlist successfully");
        return data;
      } else if (response.status === 400) {
        // Dispatch an error toast notification for HTTP 400 (Bad Request)
        const errorData = await response.json();
        toast.error(errorData.message);
      } else if (response.status === 404) {
        // Dispatch an error toast notification for HTTP 404 (Not Found)
        toast.error("Resource not found");
        throw new Error("Resource not found");
      } else if (response.status === 500) {
        // Dispatch an error toast notification for HTTP 500 (Internal Server Error)
        toast.error("Internal Server Error");
      } else {
        // Dispatch a generic error toast notification for other errors
        toast.error("An unexpected error occurred while adding the product to the wishlist");
      }
    } catch (error) {
      // Dispatch a generic error toast notification for network or API errors
      toast.error("An unexpected error occurred while adding the product to the wishlist");
    }
  }
);
export const deleteWishlistAsync = createAsyncThunk(
  "wishlist/removeProductFromWishlistAsync",
  async (wishlistItemId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        wishlistItemId: wishlistItemId,
      };

      const response = await fetch(
        `${apiEndpoint}/api/v1/wishlist/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Dispatch a success toast notification for HTTP 200
        toast.success("Product removed from wishlist successfully");
        return data;
      } else if (response.status === 400) {
        // Dispatch an error toast notification for HTTP 400 (Bad Request)
        const errorData = await response.json();
        toast.error(`Bad Request: ${errorData.message}`);
        throw new Error("Bad Request");
      } else if (response.status === 404) {
        // Dispatch an error toast notification for HTTP 404 (Not Found)
        toast.error("Resource not found");
        throw new Error("Resource not found");
      } else if (response.status === 500) {
        // Dispatch an error toast notification for HTTP 500 (Internal Server Error)
        toast.error("Internal Server Error");
        throw new Error("Internal Server Error");
      } else {
        // Dispatch a generic error toast notification for other errors
        toast.error("An unexpected error occurred while removing the product from the wishlist");
        throw new Error("Unexpected Error");
      }
    } catch (error) {
      // Dispatch a generic error toast notification for network or API errors
      toast.error("An unexpected error occurred while removing the product from the wishlist");
      throw error;
    }
  }
);

//**  Create a slice for wishlist*/
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWishlistAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserWishlistAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlist = action.payload;
      })
      .addCase(fetchUserWishlistAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default wishlistSlice.reducer;
