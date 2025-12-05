import moment from "moment";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";


export const SaveAndUpdateLaundryItemMaster = async (params) => {
    try {
        const options = {
            method: "POST",
            data: params,
        };
        const data = await makeApiRequest(
            `${apiUrls.Oswal_LaundrySaveAndUpdateLaundryItemMaster}`,
            options
        );
        return data;
    } catch (error) {
        console.error(error);
    }

};

export const LaundryGetLaundryItemMaster = async () => {

    try {
        const options = {
            method: "Get",
        };

        const url = apiUrls?.Oswal_LaundryGetLaundryItemMaster;
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};

export const LaundryGetLaundryDepartment = async () => {

    try {
        const options = {
            method: "Get",
        };

        const url = apiUrls?.Oswal_LaundryGetLaundryDepartment
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};

export const LaundryGetLaundryCategory = async () => {

    try {
        const options = {
            method: "Get",
        };

        const url = apiUrls?.Oswal_LaundryGetLaundryCategory
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};

export const LaundryGetLaundaryDetails = async (payload) => {

    try {
        const options = {
            method: "Get",
        };

        const url = `${apiUrls?.Oswal_LaundryGetLaundaryDetails}?Date=${moment(payload?.searchDate).format("YYYY-MM-DD")}&DeptId=${payload?.department?.value}&CatId=${payload?.category?.value}`
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};

export const LaundrySaveLaundaryDetails = async (params) => {
    try {
        const options = {
            method: "POST",
            data: params,
        };
        const data = await makeApiRequest(
            `${apiUrls.Oswal_LaundrySaveLaundaryDetails}`,
            options
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const LaundryGetLaundryItemReport = async (payload) => {

    try {
        const options = {
            method: "Get",
        };

        const url = `${apiUrls?.Oswal_LaundryGetLaundryItemReport}?Date=${moment(payload?.searchDate).format("YYYY-MM-DD")}`
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};

export const LaundryDeleteLaundaryDetails = async (ReqID) => {

    try {
        const options = {
            method: "Get",
        };

        const url = `${apiUrls?.Oswal_LaundryDeleteLaundaryDetails}?ReqID=${ReqID}`
        const data = await makeApiRequest(url, options);
        return data;
    } catch (error) {

        console.error(error);
    }
};