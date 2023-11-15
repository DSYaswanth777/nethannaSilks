import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async (_, { getState }) => {
  try {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${apiEndpoint}/api/v1/admin/customers`, config);

    if (response.status === 200) {
      return response.data.customers;
    } else {
      toast.error("Failed to fetch customers");
      throw new Error("Failed to fetch customers");
    }
  } catch (error) {
    toast.error("Failed to fetch customers");
    throw error;
  }
});

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
