import { apiUrls } from "../SchoolApiEndPoint";

import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import makeApiRequest from "../axiosInstance";




export const StudentRegister = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.StudentRegister}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const StudentGetstudent = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.StudentGetstudent}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const EnquiryCreate = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.EnquiryCreate}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllEnquiries = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getallenquiries}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetEnquiriesByRange = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetEnquiriesByRange}/startDate=${params.startDate}&endDate=${params.endDate}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};