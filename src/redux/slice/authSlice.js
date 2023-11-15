import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (credentials) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { user, token, message } = response.data;
        toast.success(message); // Display a success toast
        return { user, token, message };
      } else if (response.status === 401) {
        toast.error("Unauthorized:Please Login to continue");
      } else if (response.status === 404) {
        toast.error("User not found"); // Display an error toast
      } else if (response.status === 400) {
        toast.error("Invalid credentials"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      throw new Error("Login failed");
    } catch (error) {
      toast.error("Login failed"); // Display an error toast
      throw error;
    }
  }
);

export const signupAsync = createAsyncThunk(
  "auth/signupAsync",
  async (userData) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/signup `,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Signup successful"); // Display a success toast
      } else if (response.status === 400) {
        toast.error("Bad request"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      if (response.status === 200) {
        const { otp } = response.data;
        return { otp };
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      toast.error("Signup failed"); // Display an error toast
      throw error;
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  "auth/forgotPasswordAsync",
  async (userData) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/forgot-password`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP sent successfully"); // Display a success toast
      } else if (response.status === 400) {
        toast.error("Bad request"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to Send OTP");
      }
    } catch (error) {
      toast.error("Failed to Send OTP"); // Display an error toast
      throw error;
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "auth/resetPasswordAsync",
  async (userData) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/reset-password `,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successful"); // Display a success toast
      } else if (response.status === 400) {
        toast.error("Bad request"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to Reset Password");
      }
    } catch (error) {
      toast.error("Failed to Reset Password"); // Display an error toast
      throw error;
    }
  }
);

export const verifyOtpAsync = createAsyncThunk(
  "auth/verifyOtpAsync",
  async ({ mobile, otp }) => {
    try {
      const response = await axios.post(
        "https://animated-rhythm-399204.el.r.appspot.com/api/v1/verify-otp",
        { mobile, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("OTP verification successful"); // Display a success toast
      } else if (response.status === 400) {
        toast.error("Bad request"); // Display an error toast
      } else if (response.status === 500) {
        toast.error("Server error"); // Display an error toast
      }

      if (response.status !== 200) {
        throw new Error("OTP verification failed");
      }

      return null;
    } catch (error) {
      toast.error("OTP verification failed"); // Display an error toast
      throw error;
    }
  }
);
const loadUserFromSessionStorage = () => {
  const token = sessionStorage.getItem("token");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  if (token && isAuthenticated) {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return { user };
    } catch (error) {
      console.error("Error parsing user data from session storage:", error);
    }
  }

  return null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromSessionStorage()?.user,
    token: sessionStorage.getItem("token"),
    isAuthenticated: loadUserFromSessionStorage() !== null,
    isLoading: false,
    loginMessage: "",
    isUserNotVerified: false,
  },
  reducers: {
    // Your existing reducers here
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.setItem("isAuthenticated", "false");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.loginMessage = action.payload.message;
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        sessionStorage.setItem("isAuthenticated", "true");
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signupAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyOtpAsync.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
