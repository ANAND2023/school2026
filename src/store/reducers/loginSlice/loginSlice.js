import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest from "../../../networkServices/axiosInstance";
// import { apiUrls } from "../../../networkServices/apiEndpoints";
import { getLocalIP, notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";
import { apiUrls } from "../../../networkServices/SchoolApiEndPoint";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk(
  "signIn",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(apiUrls?.loginAdmin, options);
      dispatch(setLoading(false));
      
      const user = jwtDecode(data?.data?.accessToken);
      return {
        userData: user, 
        accessToken: data?.data?.accessToken,
        message: data?.message || "Login Successfully!",
        success: data?.success
      };
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(signInAction.fulfilled, (state, { payload }) => {
        
        state.user = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload.message || "Login Successfully";
        payload?.success === false
          ? notify(payload.message, "error")
          : notify(payload.message, "success");

        if (payload?.accessToken) {
          useLocalStorage("userData", "set", payload?.userData);
          useLocalStorage("accessToken", "set", payload?.accessToken);
          useLocalStorage("ip", "set", "0.0.0.0")
          //   getLocalIP(ip => {
          //     useLocalStorage("ip", "set", ip?ip:"10.0.2.175")
          // });

        }
      })
      .addCase(signInAction.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      });
  },
});

export default authSlice.reducer;
