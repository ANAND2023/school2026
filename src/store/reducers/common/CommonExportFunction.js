import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import { apiUrls } from "../../../networkServices/SchoolApiEndPoint";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import store from "../../store";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";



export const getEmployeeWise = createAsyncThunk(
  "centre",
  async ({ employeeId, OrganizationId }, { dispatch }) => {
    const options = {
      method: "POST",
      data: {
        "employeeId": employeeId,
        "organisationID": OrganizationId,
        "isAll": 0
      }
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls?.BranchMastersGetBranch}`,
        options
      );
      
      // FIX: Handle LocalStorage update safely
      const prevData = useLocalStorage("userData", "get");
      
      // Check if we have branches
      if(data?.data && data.data.length > 0) {
          // If defaultCentre exists in storage and is valid in this list, keep it. 
          // Otherwise, set to the first branch [0].
          const currentCentreValid = data.data.find(b => b.id == prevData?.defaultCentre);
          const newDefaultCentre = currentCentreValid ? prevData.defaultCentre : data.data[0].id;

          const newData = { ...prevData, defaultCentre: newDefaultCentre };
          useLocalStorage("userData", "set", newData);
      }

      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      throw e; // Throw so RenderRoute catches it
    }
  }
);

export const GetRoleListByEmployeeIDAndCentreID = createAsyncThunk(
  "GetRoleList",
  async ({ orgId, branchId }, { dispatch }) => {
    const options = {
      method: "POST",
      data: {
        "searchText": "",
        "isAll": 0,
        "orgId": orgId,
        "branchId": branchId,
        "isActive": 1
      }
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.getModules}`,
        options
      );
      
      // FIX: Handle Role Default Logic
      const prevData = useLocalStorage("userData", "get");
      
      if(data?.data && data.data.length > 0) {
           // If defaultRole exists and is valid, keep it, else take first [0]
           const currentRoleValid = data.data.find(r => r.id == prevData?.defaultRole);
           const newDefaultRole = currentRoleValid ? prevData.defaultRole : data.data[0].id;

           const newData = { ...prevData, defaultRole: newDefaultRole };
           useLocalStorage("userData", "set", newData);
      }

      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);
export const GetBindMenu = createAsyncThunk(
  "BindMenu",
  async ({ RoleID }, { dispatch }) => {
    // console.log("RoleID", RoleID);
    const options = {
      method: "GET",
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(
        `${apiUrls.BindMenuList}?RoleID=${RoleID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

