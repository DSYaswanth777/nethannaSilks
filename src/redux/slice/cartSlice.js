import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;
export const fetchUsercartAsync = createAsyncThunk(
  "cart/fetchUserCartAsync",
  async (_, { getState }) => {

    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${apiEndpoint}/api/v1/user/cart `,
        config
      );

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please to login to continue");
      } else if (response.status === 404) {
        toast.error("Cart not found"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      throw new Error("Error while fetching the cart");
    } catch (error) {
      toast.error("Error while fetching the cart"); // Display an error toast
      throw error;
    }
  }
);

export const cartAddAsync = createAsyncThunk(
  "cart/cartAddAsync",
  async (productId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        productId: productId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${apiEndpoint}/api/v1/user/cart/add`,
        requestData,
        config
      );

      if (response.status === 201) {
        toast.success("Product added to cart");
        return response.data;
      } else if (response.status === 400) {
        toast.error("Bad request");
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please to login to continue");
        navigate("/login")
      } else if (response.status === 404) {
        toast.error("Product not found");
      } else if (response.status === 500) {
        toast.error("Server error");
      } else {
        throw new Error("Error while adding a product to the cart");
      }
    } catch (error) {
      toast.error("Error while adding a product to the cart");
      throw error;
    }
  }
);

export const cartQuantityIncreaseAsync = createAsyncThunk(
  "cart/cartQuantityIncreaseAsync",
  async (cartItemId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        cartItemId: cartItemId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiEndpoint}/api/v1/user/cart/increase`,
        requestData,
        config
      );

      if (response.status === 200) {
        toast.success("Cart quantity increased");
        return response.data;
      } else if (response.status === 400) {
        toast.error("Bad request");
      } else if (response.status === 404) {
        toast.error("Item not found in the cart");
      } else if (response.status === 500) {
        toast.error("Server error");
      } else {
        throw new Error("Error while increasing cart quantity");
      }
    } catch (error) {
      toast.error("Error while increasing cart quantity");
      throw error;
    }
  }
);

export const cartQuantityDecreaseAsync = createAsyncThunk(
  "cart/cartQuantityDecreaseAsync",
  async (cartItemId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        cartItemId: cartItemId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${apiEndpoint}/api/v1/user/cart/decrease`,
        requestData,
        config
      );

      if (response.status === 200) {
        toast.success("Cart quantity decreased");
        return response.data;
      } else if (response.status === 400) {
        toast.error("Bad request");
      } else if (response.status === 404) {
        toast.error("Item not found in the cart");
      } else if (response.status === 500) {
        toast.error("Server error");
      } else {
        throw new Error("Error while decreasing cart quantity");
      }
    } catch (error) {
      toast.error("Error while decreasing cart quantity");
      throw error;
    }
  }
);

export const deletecartAsync = createAsyncThunk(
  "cart/deletecartAsync",
  async (cartItemId, { getState }) => {
    const token = getState().auth.token;
    try {
      const requestData = {
        cartItemId: cartItemId,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: requestData,
      };

      const response = await axios.delete(
        `${apiEndpoint}/api/v1/user/cart/remove`,
        config
      );

      if (response.status === 200) {
        toast.success("Item removed from the cart");
        return response.data;
      } else if (response.status === 400) {
        toast.error("Bad request");
      } else if (response.status === 404) {
        toast.error("Item not found in the cart");
      } else if (response.status === 500) {
        toast.error("Server error");
      } else {
        throw new Error("Error while removing an item from the cart");
      }
    } catch (error) {
      toast.error("Error while removing an item from the cart");
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsercartAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsercartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchUsercartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(cartAddAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cartAddAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(cartAddAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(cartQuantityIncreaseAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cartQuantityIncreaseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(cartQuantityIncreaseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(cartQuantityDecreaseAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cartQuantityDecreaseAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(cartQuantityDecreaseAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletecartAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletecartAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deletecartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
