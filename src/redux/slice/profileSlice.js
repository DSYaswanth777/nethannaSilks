import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;

export const fetchUserprofileAsync = createAsyncThunk(
  "profile/fetchUserprofileAsync",
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
        `${apiEndpoint}/api/v1/profile`,
        config
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);
export const profileEditAsync = createAsyncThunk(
    "profile/profileEditAsync",
    async (profileItemId, { getState }) => {
      const token = getState().auth.token;
      try {
        // Create an object with the productId key

  
        // Make the API call using fetch or axios
        const response = await fetch(
          `${apiEndpoint}/api/v1/profile/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileItemId), // Send the requestData object as JSON
          }
        );
          if(response.ok){
            toast.success("Changes were made succesfully")
          }
        if (!response.ok) {
          toast.error("Error saving the changes")
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }
  );


//**  Create a slice for profile*/
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserprofileAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserprofileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserprofileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(profileEditAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(profileEditAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(profileEditAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;
