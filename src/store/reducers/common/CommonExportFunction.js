import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import { apiUrls } from "../../../networkServices/SchoolApiEndPoint";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import store from "../../store";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

export const CentreWiseCacheByCenterID = createAsyncThunk(
  "CentreWiseCache",
  async ({ centreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };

    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.CentreWiseCacheByCenterID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const CentreWisePanelControlCache = createAsyncThunk(
  "CentreWisePanelControlCache",
  async ({ centreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.CentreWisePanelControlCache}?CentreID=${centreID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

// export const getEmployeeWise = createAsyncThunk(
//   "centre",
//   async ({ employeeID }, { dispatch }) => {
//     const options = {
//       method: "GET",
//     };
//     dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls.EmployeeWiseCentreList}?EmployeeId=${employeeID}`,
//         options
//       );
//       dispatch(setLoading(false));
//       return data;
//     } catch {
//       dispatch(setLoading(false));
//     }
//   }
// );


// export const GetBindMenu = createAsyncThunk(
//   "BindMenu",
//   async ({ RoleID }, { dispatch }) => {
//     // console.log("RoleID", RoleID);
//     const options = {
//       method: "GET",
//     };
//     try {
//       dispatch(setLoading(true));
//       const data = await makeApiRequest(
//         `${apiUrls.BindMenuList}?RoleID=${RoleID}`,
//         options
//       );
//       dispatch(setLoading(false));
//       return data;
//     } catch {
//       dispatch(setLoading(false));
//     }
//   }
// );



export const getNotification = createAsyncThunk(
  "GetNotify",
  async ({ RoleID, EmployeeID, CentreID }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(
        `${apiUrls.getNotificationDetail}?RoleID=${RoleID}&EmployeeID=${EmployeeID}&CentreID=${CentreID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);
export const BindFrameMenuByRoleID = createAsyncThunk(
  "BindFrameMenu",
  async ({ frameName }, { dispatch }) => {
    const options = {
      method: "post",
      data: {
        frameName: frameName,
      },
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(
        `${apiUrls.BindFrameMenuByRoleID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);


// export const getEmployeeWise = createAsyncThunk(
//   "centre",
//   async ({ employeeId, OrganizationId }, { dispatch }) => {

//     const options = {
//       method: "POST",
//       data: {
//         "employeeId": employeeId,
//         "organisationID": OrganizationId,
//         "isAll": 0
//       }
//     };
//     dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls?.BranchMastersGetBranch}`,
//         options
//       );
//       dispatch(setLoading(false));
//       const prevData = useLocalStorage("userData", "get");
//       const newData = { ...prevData, defaultCentre: data?.data[2]?.id };
//       useLocalStorage("userData", "set", newData);
//       debugger
//       return data;
//     } catch {
//       dispatch(setLoading(false));
//     }
//   }
// );
// export const GetRoleListByEmployeeIDAndCentreID = createAsyncThunk(
//   "GetRoleList",
//   async ({ orgId, branchId }, { dispatch }) => {
//     debugger
//     const options = {
//       method: "POST",
//       data: {
//         "searchText": "",
//         "isAll": 0,
//         "orgId": orgId,
//         "branchId": branchId,
//         "isActive": 1
//       }
//     };
//     dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls.getModules}`,
//         options
//       );
//       const prevData = useLocalStorage("userData", "get");
//       const newData = { ...prevData, defaultRole: data?.data[0]?.id };
//       useLocalStorage("userData", "set", newData);
//       dispatch(setLoading(false));
//       return data;
//     } catch {
//       dispatch(setLoading(false));
//     }
//   }
// );


export const GetBindReferDoctor = createAsyncThunk(
  "GetBindDoctorList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      // data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindReferDoctor}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetBindReferalType = createAsyncThunk(
  "getReferTypeList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindRefferalType}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetBindDepartment = createAsyncThunk(
  "GetBindDepartmentList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      // data: {
      //   centreID: "1",
      //   TypeID: "5",
      // },
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDepartment}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);
export const BindSeeMoreList = createAsyncThunk(
  "BindSeeMoreList",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
      data: {
        centreID: "1",
        TypeID: "5",
      },
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindSeeMoreList}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetPanelDocument = createAsyncThunk(
  "getPanelDocumentList",
  async ({ PanelID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPanelDocument}?PanelID=${PanelID}`,
        options
      );

      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

// export const GetPatientUploadDocument = createAsyncThunk(
//   "getPatientUploadDocument",
//   async ({ patientID }, { dispatch }) => {
//     const options = {
//       method: "get",
//     };
//     dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls.GetPatientUploadDocument}?patientID=${patientID}`,
//         options
//       );
//       dispatch(setLoading(false));
//       return data;
//     } catch {
//       dispatch(setLoading(false));
//     }
//   }
// );



export const GetPatientUploadDocument = createAsyncThunk(
  "getPatientUploadDocument",
  async ({ patientID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPatientUploadDocument}?panelId=${patientID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);


// GetPatientDocument PID


export const GetPatientDocument = async (PID) => {
  // store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetPatientDocument}?PID=${PID}`,
      {
        method: "get",
      }
    );
    // store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    // store.dispatch(setLoading(false));
    throw error;
  }
};



export const ReferenceTypeInsert = createAsyncThunk(
  "REFERENCETYPE",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.CreateTypeOfReference, options);
      dispatch(setLoading(false));
      if (data?.status) {
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetAdvanceReason = createAsyncThunk(
  "GetAdvanceReason",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.GetAdvanceReason}`, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const CreateAdvanceReason = createAsyncThunk(
  "CreateAdvanceReason",
  async (data, { dispatch }) => {
    console.log(data);
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.CreateAdvanceReason, options);
      dispatch(setLoading(false));
      if (data?.success) {
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindResourceList = createAsyncThunk(
  "BINDRESOURCELIST",
  async (data, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(apiUrls.BindResourceList, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetAllDoctor = createAsyncThunk(
  "GetAllDoctorList",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDoctorDept}?Department=ALL&CentreID=1`,
        options
      );
      dispatch(setLoading(false));
      return {
        data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindAllDoctorConfirmation = createAsyncThunk(
  "GetBindAllDoctorConfirmation",
  async ({ Department, CentreID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindDoctorDept}?Department=${Department}`,
        options
      );
      dispatch(setLoading(false));
      return data;
      // return {
      //   data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      // };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetBindSubCatgeory = createAsyncThunk(
  "GetBindSubCatgeory",
  async ({ Type, CategoryID }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.getBindSubCategory}?Type=${Type}&CategoryID=${CategoryID}`,
        options
      );
      dispatch(setLoading(false));
      return data;
      // return {
      //   data: handleReactSelectDropDownOptions(data?.data, "Name", "DoctorID"),
      // };
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

// Token Management
export const getBindCentre = createAsyncThunk(
  "getBindCentre",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.getBindCenterAPI}`, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const getBindSpeciality = createAsyncThunk(
  "getBindSpeciality",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.BindSpeciality}`, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const getBindPanelList = createAsyncThunk(
  "getBindPanelList",
  async ({ PanelGroup }, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPanelName}?PanelGroup=${PanelGroup}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const getLoadOPDDiagnosisItems = createAsyncThunk(
  "getLoadOPDDiagnosisItems",
  async (_, { dispatch }) => {
    const options = {
      method: "get",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.LoadOPDDiagnosisItems}?Type=3&CategoryID=0&SubCategoryID=0`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetAuthorization = createAsyncThunk(
  "getAuthorization",

  async ({ Type }, { dispatch }) => {
    const options = {
      method: "GET",
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetAuthorization}?Type=${Type}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);





// ignore Above codes- 

// export const getEmployeeWise = createAsyncThunk(
//   "centre",
//   async ({ employeeId, OrganizationId }, { dispatch }) => {
//     const options = {
//       method: "POST",
//       data: {
//         "employeeId": employeeId,
//         "organisationID": OrganizationId,
//         "isAll": 0
//       }
//     };
//     dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls?.BranchMastersGetBranch}`,
//         options
//       );

//       // FIX: Handle LocalStorage update safely
//       const prevData = useLocalStorage("userData", "get");

//       // Check if we have branches
//       if(data?.data && data.data.length > 0) {
//           // If defaultCentre exists in storage and is valid in this list, keep it. 
//           // Otherwise, set to the first branch [0].
//           const currentCentreValid = data.data.find(b => b.id == prevData?.defaultCentre);
//           const newDefaultCentre = currentCentreValid ? prevData.defaultCentre : data.data[0].id;

//           const newData = { ...prevData, defaultCentre: newDefaultCentre };
//           useLocalStorage("userData", "set", newData);
//       }

//       dispatch(setLoading(false));
//       return data;
//     } catch (e) {
//       dispatch(setLoading(false));
//       throw e; // Throw so RenderRoute catches it
//     }
//   }
// );

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
      dispatch(setLoading(false));

      // Safe update of LocalStorage
      const prevData = useLocalStorage("userData", "get");
      if (data?.data && data.data.length > 0) {
        // If current defaultCentre is invalid, set to 1st one
        const isCurrentValid = data.data.find(b => b.id == prevData?.defaultCentre);

        if (!isCurrentValid) {
          const newData = { ...prevData, defaultCentre: data.data[0].id, defaultCenterName: data.data[0].name };
          useLocalStorage("userData", "set", newData);
        }
      }

      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const GetRoleListByEmployeeIDAndCentreID = createAsyncThunk(
  "GetRoleList",
  async ({ empID }, { dispatch }) => {
    const options = {
      method: "POST",
      data: {
        "employeeId": empID,
        "moduleId": "",
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

      if (data?.data && data.data.length > 0) {
        // If defaultRole exists and is valid, keep it, else take first [0]
        const currentRoleValid = data.data.find(r => r.moduleId == prevData?.defaultRole);
        const newDefaultRole = currentRoleValid ? prevData.defaultRole : data.data[0].moduleId;

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
  async ({ employeeId, roleId, branchId, organizationId }, { dispatch }) => {
    // console.log("RoleID", RoleID);
    const options = {
      method: "POST",
      data: {
        "employeeId": employeeId,
        "roleId": roleId,
        "branchId": branchId,
        "organizationId": organizationId
      }
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(
        `${apiUrls.getMenuWithSubmenus}`,
        options
      );
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

