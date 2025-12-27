import { apiUrls } from "./SchoolApiEndPoint";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";




export const CreateAcademicYearApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreateAcademicYear}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllAcademicYears = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllAcademicYears}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const CreateClass = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreateClass}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllClasses = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllClasses}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const CreateSection = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreateSection}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllSections = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GEt",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllSections}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const CreateSubject = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreateSubject}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};


export const GetAllSubjects = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllSubjects}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};



export const CreateBranch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.CreateBranch}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetAllBranches = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllBranches}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const Createorganisation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.Createorganisation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const GetAllOrganisation = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    //   data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetAllOrganisation}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};