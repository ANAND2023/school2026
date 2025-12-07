import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";

// export const AdmissionType = async () => {
//   try {
//     const url = `${apiUrls.AdmissionType}`;
//     const data = await makeApiRequest(url, {
//       method: "GET",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };


export const adminlogin = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.loginAdmin}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
