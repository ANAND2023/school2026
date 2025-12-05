import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const createPreRegistrationApi = async (payload) => {
    try {
        store.dispatch(setLoading(true));
        const options = {
            method: "post",
            data: payload,
        };

        const data = await makeApiRequest(
            `${apiUrls?.createPreRegistrationApi}`,
            options
        );

        return data;
    } catch (error) {
        console.error(error, "SomeThing Went Wrong");
    }
    finally {
        store.dispatch(setLoading(false));
    }
}

export const getPreRegistrationByMobileApi = async (mobileNo) => {
    try {
        store.dispatch(setLoading(true));
        const options = {
            method: "get",
        };

        const data = await makeApiRequest(
            `${apiUrls?.getPreRegistrationByMobile}?mobileNo=${mobileNo}`,
            options
        );

        return data;
    } catch (error) {
        console.error(error, "SomeThing Went Wrong");
    }
    finally {
        store.dispatch(setLoading(false));
    }
}
export const centreWiseCacheDisplayApi = async (type) => {
    try {
        store.dispatch(setLoading(true));
        const options = {
            method: "get",
        };

        const data = await makeApiRequest(
            `${apiUrls?.centreWiseCacheDisplay}?type=${type}`,
            options
        );

        return data;
    } catch (error) {
        console.error(error, "SomeThing Went Wrong");
    }
    finally {
        store.dispatch(setLoading(false));
    }
}


export const DoctorDisplayGetPreRegisteredUsers = async (payload) => {
    try {
        const { mobileNo,requestId,fromDate, patientName,toDate } = payload;
        store.dispatch(setLoading(true));
        const options = {
            method: "get",
        };

        const data = await makeApiRequest(
            `${apiUrls?.DoctorDisplayGetPreRegisteredUsers}?mobileNo=${mobileNo}&requestId=${requestId}&fromDate=${fromDate}&patientName=${patientName}&toDate=${toDate}`,
            options
        );

        return data;
    } catch (error) {
        console.error(error, "SomeThing Went Wrong");
    }
    finally {
        store.dispatch(setLoading(false));
    }
}