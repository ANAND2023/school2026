import { apiUrls } from "../SchoolApiEndPoint";

import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import makeApiRequest from "../axiosInstance";

export const GetClassMonthFeeDetails = async (classId, monthTypeId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetClassMonthFeeDetails}?classId=${classId}&monthTypeId=${monthTypeId}`,
      options,
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetClassItemRates = async (
  classId,
  sessionId,
  OrgId,
  BranchId,
  itemName,
) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetClassItemRates}?classId=${classId}&sessionId=${sessionId}&OrgId=${OrgId}&BranchId=${BranchId}&itemName=${itemName}`,
      options,
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const StudentBillingsave = async (param) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: param,
    };
    const data = await makeApiRequest(`${apiUrls.StudentBillingsave}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
