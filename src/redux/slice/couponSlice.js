import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchCoupons = createAsyncThunk("coupons/fetchcoupons", async (_, { getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${apiEndpoint}/api/v1/admin/coupons`, config);

    if (response.status === 200) {
      return response.data;
    } else {
      toast.error("Failed to fetch coupons");
      throw new Error("Failed to fetch coupons");
    }
  } catch (error) {
    toast.error("Failed to fetch coupons");
    throw error;
  }
});

export const addCouponAsync = createAsyncThunk("coupons/addCoupon", async (couponData, { getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      `${apiEndpoint}/api/v1/admin/add/coupon`, couponData, config);

    if (response.status === 201) {
      toast.success("Coupon added successfully");
      return response.data;
    } else {
      toast.error("Error while adding a coupon");
      throw new Error("Error while adding a coupon");
    }
  } catch (error) {
    toast.error("Error while adding a coupon");
    throw error;
  }
});

export const deleteCouponAsync = createAsyncThunk("coupons/deleteCoupons", async (couponId, { getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(`${apiEndpoint}/api/v1/admin/delete/coupon/${couponId}`, config);

    if (response.status === 200) {
      toast.success("Coupon deleted successfully");
      return response.data;
    } else {
      toast.error("Error while deleting the coupon");
      throw new Error("Error while deleting the coupon");
    }
  } catch (error) {
    toast.error("Error while deleting the coupon");
    throw error;
  }
});

export const editCouponAsync = createAsyncThunk("coupons/editCoupon", async (editCouponData, { getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(
      `${apiEndpoint}/api/v1/admin/coupon/edit/${editCouponData.id}`,
      editCouponData,
      config
    );

    if (response.status === 200) {
      toast.success("Coupon edited successfully");
      return response.data;
    } else {
      toast.error("Error while editing the coupon");
      throw new Error("Error while editing the coupon");
    }
  } catch (error) {
    toast.error("Error while editing the coupon");
    throw error;
  }
});

export const searchCouponAsync = createAsyncThunk("coupons/searchcoupons", async (couponName, { getState }) => {
  const token = getState().auth.token;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(
      `${apiEndpoint}/api/v1/admin/coupons/search?couponCode=${couponName}`,
      config
    );

    if (response.status === 200) {
      return response.data;
    } else {
      toast.error("Failed to search coupons");
      throw new Error("Failed to search coupons");
    }
  } catch (error) {
    toast.error("Failed to search coupons");
    throw error;
  }
});

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCouponAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCouponAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // You can handle the success action here if needed
      })
      .addCase(addCouponAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editCouponAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editCouponAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // You can handle the success action here if needed
      })
      .addCase(editCouponAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchCouponAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCouponAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coupons = action.payload;
      })
      .addCase(searchCouponAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default couponSlice.reducer;
