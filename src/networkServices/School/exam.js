import { apiUrls } from "../SchoolApiEndPoint";

import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import makeApiRequest from "../axiosInstance";




export const masterAcademicMastercreate_term = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.masterAcademicMastercreate_term}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const AcademicMasterget_all_term = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.AcademicMasterget_all_term}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};