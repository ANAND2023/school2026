import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";




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

export const Rolescreaterole = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Rolescreaterole}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const Rolesgetroles = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Rolesgetroles}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const Rolesdeleterole = async (roleId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "DELETE",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Rolesdeleterole}?${roleId}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};






// permission Start ...................

export const Permissionscreatepermission = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Permissionscreatepermission}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const Permissionsgetallpermissions = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Permissionsgetallpermissions}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const Permissionsdelete = async (roleId) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "DELETE",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Permissionsdelete}?permissionId=${roleId}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

// permission End ...................