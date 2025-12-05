import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";

export const AdmissionType = async () => {
  try {
    const url = `${apiUrls.AdmissionType}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const IPDNoByCeilingDetails = async (IPDNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.IPDNoByCeilingDetails}?IPDNo=${IPDNo}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getBloodVolumeOfRequisitionApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getBloodVolumeOfRequisition}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getProductOfRequisitionApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.getProductOfRequisition}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getBloodNatureOfRequisitionApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getBloodNatureOfRequisition}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getBloodRequisitionIndentReportApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getBloodRequisitionIndentReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const recieptWiseCollectionReportApi = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.recieptWiseCollectionReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const addmissionReportApi = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.addmissionReport}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const creditBillPanelwiseApi = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.creditBillPanelwise}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingDocBusinessSummaryReport = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingDocBusinessSummaryReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BillingBedOccupancyReport = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingBedOccupancyReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingRefundReport = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingRefundReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingMisCellaneousReport = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingMisCellaneousReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingPlannedDischargeReport = async (params) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingPlannedDischargeReport}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error Found", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const getDischargeTypeDropdownApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getDischargeTypeDropdown}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const saveRequestRoomDetailApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.saveRequestRoomDetail}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const IPDNoByApprovalDays = async (IPDNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.IPDNoByApprovalDays}?IPDNo=${IPDNo}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getBloodRequisitionApi = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getBloodRequisition}?TransactionID=${TransactionID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const RoomType = async () => {
  try {
    const url = `${apiUrls.RoomType}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const EDPReportsGetRoomList = async (CenterId) => {
  try {
    const url = `${apiUrls.EDPReportsGetRoomList}?CenterId=${CenterId}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const bindPanelRoleWisePanelGroupWise = async () => {
  try {
    const url = `${apiUrls.bindPanelRoleWisePanelGroupWise}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BillingCategory = async () => {
  try {
    const url = `${apiUrls.BillingCategory}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindFloor = async () => {
  try {
    const url = `${apiUrls.BindFloor}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindRoomBed = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindRoomBed}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const updatePatientBloodRequisitionStatusApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.updatePatientBloodRequisitionStatus}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const patientBloodRequisitionApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.patientBloodRequisition}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const markUnderMaintainanceSave = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.saveRoomMaintenance}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const SaveCeilingAmount = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveCeilingAmount}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BillingCeilingAmountHistory = async (IPDNo) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Get",
      // data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingCeilingAmountHistory}?IPDNO=${IPDNo}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const SaveApprovalDays = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveApprovalDays}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const BillingIPDApprovalDaysHistory = async (IPDNO) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
      // data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.BillingIPDApprovalDaysHistory}?IPDNO=${IPDNO}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const PatientSearch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.PatientSearch}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveIPDAdmission = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveIPDAdmission}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const GetPatientAdmissionDetails = async (patientID, transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetPatientAdmissionDetails}?patientID=${patientID}&transactionID=${transactionID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const searchUnderMaintenanceApi = async (IPDCaseTypeID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.searchUnderMaintenance}?IPDCaseTypeID=${IPDCaseTypeID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const searchRoomMaintenance = async (MaintenanceID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.searchRoomMaintenance}?MaintenanceID=${MaintenanceID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const bindMaintenanceApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.bindMaintenance}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const IPDAdmissionReport = async (TID, ReportType) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.IPDAdmissionReport}?TID=${TID}&ReportType=${ReportType}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const UpdatePatientAdmissionDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.UpdatePatientAdmissionDetails}`,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const saveRoomCleaningMaintenanceApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.saveRoomCleaningMaintenance}`,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const requestRoomDetailApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.requestRoomDetail}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const IsReceivedPatient = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.IsReceivedPatient}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const CurrentStockGeneralConsertForm = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.CurrentStockGeneralConsertForm}`,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const CurrentStockDischargeSlip = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.CurrentStockDischargeSlip}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const CurrentStockSelfDeclaration = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.CurrentStockSelfDeclaration}`,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const GetBillDetails = async (transID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetBillDetails}?transID=${transID}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetBindDepartment = async (transID, viewRate) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetBindDepartment}?transID=${transID}&viewRate=${viewRate}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const LoadDetails = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.LoadDetails}?TID=${TID}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const CheckDetails = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.CheckDetails}?TID=${TID}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveClearance = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveClearance}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const SaveUnClearance = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveUnClearance}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const BindCurrencyDetails = async () => {
  try {
    const url = `${apiUrls.BindCurrencyDetails}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetAllAuthorization = async () => {
  try {
    const url = `${apiUrls.GetAllAuthorization}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getBindItem = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BindItem, {
      method: "post",
      data: payload,
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const GetAuthorization = async (Type) => {
  try {
    const url = `${apiUrls.GetAuthorization}?Type=${Type}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const LoadMedetail = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.LoadMedetail}?TID=${TID}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const BindIPDPatientDetails = async (SearchKey) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindIPDPatientDetails}?SearchKey=${SearchKey}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getCTBRequestDetail = async (transactionID, RequestType) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getCTBRequestDetail}?transactionID=${transactionID}&RequestType=${RequestType}`,
      {
        method: "get",
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SelectIPDDetail = async (PatientID, TID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.SelectIPDDetail}?PatientID=${PatientID}&TID=${TID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const GetDiscReason = async (Type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetDiscReason}?Type=${Type}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const SaveDiscReason = async (DiscReason, Type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.SaveDiscReason}?DiscReason=${DiscReason}&Type=${Type}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveIPDAdvance = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveIPDAdvance}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const CommonReceiptPdf = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.CommonReceiptPdf}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const StickersReceiptPdf = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetStickersReceipt}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const GetOnlyStickerPrintPDF = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetOnlyStickerPrintPDF}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const CardPrintPrintCard = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.PrintCard}?pid=${payload?.pid}&LedgerTransactionNo=${payload?.LedgerTransactionNo}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const getIncludeBillApi = async (BillNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.getIncludeBill}?BillNo=${BillNo}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const getBloodGroupApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.getBloodGroups}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const PostIncludeBillApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.getIncludeBill}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const SaveLabPackageDetailsApi = async (payload) => {
  console.log(payload, "paload in api");
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.saveOPDSaveLabPackageDetails}`,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const SendPanelApprovalEmail = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.SendPanelApprovalEmail}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const GetPanelApprovalDetails = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetPanelApprovalDetails}?TransactionID=${params?.TID}&PatientId=${params?.PID}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindPanelDetail = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindPanelDetail}?TransactionID=${params}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindPanels = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindPanels}?TransactionID=${params}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
export const BindCategory = async (Type) => {
  try {
    const data = await makeApiRequest(`${apiUrls.BindCategory}?Type=${Type}`, {
      method: "get",
    });
    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const IPDAdvanceBindPatientDetails = async (PatientID, TranactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls.IPDAdvanceBindPatientDetails}?PatientID=${PatientID}&TranactionID=${TranactionID}`,
      {
        method: "get",
      }
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const BillingShowItemDetails = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls.BillingShowItemDetails, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};

export const BindItemSurgery = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.BindItemSurgery}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const Rate = async (TID, SurgeryID) => {
  try {
    const url = `${apiUrls.Rate}?TID=${TID}&SurgeryID=${SurgeryID}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PatientBillingGetDiscount = async (payload) => {
  try {
    const data = await makeApiRequest(`${apiUrls.PatientBillingGetDiscount}`, {
      method: "post",
      data: payload,
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const BillingGetRateFromFollowedPanel = async (
  ItemID,
  PanelID,
  IPDCaseTypeID,
  IsInternational
) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.BillingGetRateFromFollowedPanel}?ItemID=${ItemID}&PanelID=${PanelID}&IPDCaseTypeID=${IPDCaseTypeID}&IsInternational=${IsInternational}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const BillingGetIPDAlreadyPrescribeItem = async (
  TransactionId,
  ItemID
) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.BillingGetIPDAlreadyPrescribeItem}?TransactionId=${TransactionId}&ItemID=${ItemID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const SaveSurgery = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveSurgery}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const BillingSaveSaveServicesBilling = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BillingSaveSaveServicesBilling, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const BindApprovalData = async (TransactionID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindApprovalData}?TransactionID=${TransactionID} `,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const DischargeLoadDetails = async () => {
  try {
    const data = await makeApiRequest(`${apiUrls.LoadDetailsTracker}`, {
      method: "get",
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const DischargeExport = async (payload) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.DischargeTrackerReport}?FromDate=${payload?.FromDate}&ToDate=${payload?.ToDate}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const BindStoreDepartment = async () => {
  try {
    const url = `${apiUrls.BindStoreDepartment}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ToolBindDepartment = async () => {
  try {
    const url = `${apiUrls.ToolBindDepartment}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
// export const BindDepartmentLIst = async (CategoryID,Name,CenterId) => {
//   debugger
//   try {
//       const encodedName = encodeURIComponent(Name);
//     const encodedCenterId = encodeURIComponent(CenterId); // Assuming CenterId could also be a string with special chars, though less common for IDs

//     const url = `${apiUrls.EDPReportsGetCategorySelect}?CategoryID=${CategoryID}&Name=${encodedName}&CenterId=${encodedCenterId}`;

//     // const url = `${apiUrls.EDPReportsGetCategorySelect}?CategoryID=${CategoryID}& Name=${Name}& CenterId=${CenterId}`;
//     // const url = `${apiUrls.EDPReportsGetCategorySelect}?CategoryID=${payload?.CategoryID}&Name=${payload?.Name}&CenterId=${payload?.CenterId}`;
//     const data = await makeApiRequest(url, {
//       method: "get",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const PanelApprovalReject = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.PanelApprovalReject, {
      method: "get",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const BindSubcategory = async () => {
  try {
    const url = `${apiUrls.BindSubcategory}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindRoute = async () => {
  try {
    const url = `${apiUrls.BindRoute}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetTimeDuration = async () => {
  try {
    const url = `${apiUrls.GetTimeDuration}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getAlreadyPrescribeItem = async (PatientID, ItemID) => {
  try {
    const url = `${apiUrls.getAlreadyPrescribeItem}?PatientID=${PatientID}&ItemID=${ItemID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const LoadIndentMedicine = async (TID) => {
  try {
    const url = `${apiUrls.LoadIndentMedicine}?TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const LoadMedicineSet = async (DoctorID) => {
  try {
    const url = `${apiUrls.LoadMedicineSet}?DoctorID=${DoctorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const LoadMedSetItems = async (SetID) => {
  try {
    const url = `${apiUrls.LoadMedSetItems}?SetID=${SetID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const LoadIndentItems = async (IndentNo) => {
  try {
    const url = `${apiUrls.LoadIndentItems}?IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetMedicineStock = async (MedicineID) => {
  try {
    const url = `${apiUrls.GetMedicineStock}?MedicineID=${MedicineID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindDocType = async (RateType, SurgeryID, panelID) => {
  try {
    const url = `${apiUrls.BindDocType}?RateType=${RateType}&SurgeryID=${SurgeryID}&PanelID=${panelID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const BindRequisitionType = async () => {
  try {
    const url = `${apiUrls.BindRequisitionType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const BindItem = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.PatientBillingBindItem, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveIndent = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveIndent, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const UpdateBilling = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.UpdateBilling, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const PatientBillingReject = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.PatientBillingReject, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const PatientBillingSaveEdit = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.PatientBillingSaveEdit, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const PatientBillingAllTabSave = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.PatientBillingAllTabSave, {
      method: "post",
      data: payload,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getApproveBy = async () => {
  try {
    const url = `${apiUrls.getApproveBy}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PatientBillingGetPackage = async (TransID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.PatientBillingGetPackage}?TransID=${TransID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};

export const PatientBillingItemPackageSave = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.PatientBillingItemPackageSave,
      {
        method: "post",
        data: payload,
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
export const BillingIPDPackageReject = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.BillingIPDPackageReject, {
      method: "post",
      data: payload,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const PatientBillingPayable = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.PatientBillingPayable, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const MISBedManagementSummary = async () => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.MISBedManagementSummary}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};

export const MISBindBedStatus = async (Type) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.MISBindBedStatus}?Type=${Type}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const SaveRequisition = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.SaveRequisition, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const DoctorAndRoomShift = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.DoctorAndRoomShift, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const SaveInvestigationRequisition = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.SaveInvestigationRequisition,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindDocDetails = async (TransactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.BindDocDetails}?TransactionID=${TransactionID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const IPDAdvanceGetCTBList = async (TransactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.IPDAdvanceGetCTBList}?TranactionID=${TransactionID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const IPDAdvanceGetCTBDetails = async (TransactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.IPDAdvanceGetCTBDetails}?LedgerTransactionNo=${TransactionID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const BillingIPDGetCTBDetails = async (TransactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.BillingIPDGetCTBDetails}?LedgerTransactionNo=${TransactionID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const BillingCTBDetail = async (payload) => {
  try {
    const response = await makeApiRequest(`${apiUrls?.BillingCTBDetail}`, {
      method: "post",
      data: payload,
    });

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const BillingIPDSaveBillSheetTiming = async (payload) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.BillingIPDSaveBillSheetTiming}`,
      {
        method: "post",
        data: payload,
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const SearchBillSheetTiming = async (id) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.SearchBillSheetTiming}?TransactionID=${id}`,
      {
        method: "get",
        // data: payload,
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const BillingIPDSaveCTBDetail = async (payload) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.BillingIPDSaveCTBDetail}`,
      {
        method: "post",
        data: payload,
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};
export const IPDAdvanceGetCTBDetailsReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(
      apiUrls?.IPDAdvanceGetCTBDetailsReport,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindRoomDetails = async (TransactionID) => {
  try {
    const response = await makeApiRequest(
      `${apiUrls?.BindRoomDetails}?TransactionID=${TransactionID}`,
      {
        method: "get",
      }
    );

    return response;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};

export const LoadDiffPanelRates = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.LoadDiffPanelRates, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getTariffChangeLog = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.getTariffChangeLog, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const SaveTariffic = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.SaveTariffic, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const PatientBillingEditPackage = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.PatientBillingEditPackage, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const SaveReturnReuisition = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.SaveReturnReuisition, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindOtIndent = async (id) => {
  try {
    const url = `${apiUrls.BindOtIndent}?IsOtType=${id}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const MedBindDetails = async (DepartmentLedgerNo, TID) => {
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls.MedBindDetails}?DepartmentLedgerNo=${DepartmentLedgerNo}&TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    // store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindBloodGroup = async () => {
  try {
    const url = `${apiUrls.BindBloodGroup}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const LoadItems = async () => {
  try {
    const url = `${apiUrls.LoadItems}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const BillingRemarkLoadRemarks = async (TID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls?.BillingRemarkLoadRemarks}?TID=${TID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const BillingRemarkSaveRemark = async (TID, Remarks) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls?.BillingRemarkSaveRemark}?TID=${TID}&Remarks=${Remarks}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const UpdateBloodgroup = async (BloodGroup, PatientID) => {
  try {
    const url = `${apiUrls.UpdateBloodgroup}?BloodGroup=${BloodGroup}&PatientID=${PatientID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveBloodBank = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.SaveBloodBank, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindRequestDetails = async (TransactionID) => {
  try {
    const url = `${apiUrls.BindRequestDetails}?TransactionID=${TransactionID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const IPDAdvanceLoadSurgeryDetail = async (LedgerTnxNo) => {
  try {
    const url = `${apiUrls.IPDAdvanceLoadSurgeryDetail}?LedgerTnxNo=${LedgerTnxNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const IPDAdvanceLoadSurgery = async (LedTnxID) => {
  try {
    const url = `${apiUrls.IPDAdvanceLoadSurgery}?LedTnxID=${LedTnxID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetPatientAdjustmentDetails = async (TransactionID) => {
  try {
    const url = `${apiUrls.GetPatientAdjustmentDetails}?TransactionID=${TransactionID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetPatientReceipt = async (TransactionID) => {
  try {
    const url = `${apiUrls.GetPatientReceipt}?TransactionID=${TransactionID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetApproval = async (TID) => {
  try {
    const url = `${apiUrls.GetApproval}?TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const UpdateApproval = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.UpdateApproval, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindHospLedgerAccount = async () => {
  try {
    const url = `${apiUrls.BindHospLedgerAccount}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const RevenueAnalysisDetail = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.RevenueAnalysisDetail, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const PatientAdmittedList = async (ReportType, EntityID, CentreID) => {
  try {
    const url = `${apiUrls.PatientAdmittedList}?ReportType=${ReportType}&EntityID=${EntityID}&CentreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const DischargeIntimation = async (CentreID) => {
  try {
    const url = `${apiUrls.DischargeIntimation}?CentreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BillFreezedButNotDischarged = async (CentreID) => {
  try {
    const url = `${apiUrls.BillFreezedButNotDischarged}?CentreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const PatientDischarged = async (fromDate, ToDate, CentreID) => {
  try {
    const url = `${apiUrls.PatientDischarged}?fromDate=${fromDate}&ToDate=${ToDate}&CentreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const DischargedButBillNotGenerated = async (
  fromDate,
  ToDate,
  CentreID,
  Type
) => {
  try {
    
    const url = `${apiUrls.DischargedButBillNotGenerated}?fromDate=${fromDate}&ToDate=${ToDate}&CentreID=${CentreID}&Type=${Type}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
 
};
export const BillGenerated = async (
  fromDate,
  ToDate,
  ReportCheck,
  CentreID
) => {
  try {
    const url = `${apiUrls.BillGenerated}?fromDate=${fromDate}&ToDate=${ToDate}&ReportCheck=${ReportCheck}&CentreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const IPDBillRegisterSummary = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.IPDBillRegisterSummary, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const IPDBillRegisterPanelAndBillWise = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const response = await makeApiRequest(
      apiUrls?.IPDBillRegisterPanelAndBillWise,
      {
        method: "post",
        data: payload,
      }
    );

    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }

  //   return response;
  // } catch (error) {
  //   console.log(error);
  // }
};
export const getStoreBindDepartment = async (storetype) => {
  try {
    const url = `${apiUrls.getStoreBindDepartment}?storetype=${storetype}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetCategoryByStoreType = async (storeID) => {
  try {
    const url = `${apiUrls.GetCategoryByStoreType}?storeID=${storeID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetSubCategoryByCategory = async (categoryID) => {
  try {
    const url = `${apiUrls.GetSubCategoryByCategory}?categoryID=${categoryID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetStore = async () => {
  try {
    const url = `${apiUrls.GetStore}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSubGroup = async (storetype) => {
  try {
    const url = `${apiUrls.BindSubGroup}?StorLedgerNo=${storetype}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetDepartment = async (storetype) => {
  try {
    const url = `${apiUrls.BindDepartment}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindStoreRequisitionDepartment = async (storetype) => {
  try {
    const url = `${apiUrls.BindStoreRequisitionDepartment}?storetype=${storetype}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetItems = async (StoreID, Itemtype, DeptLedgerNo, Type) => {
  try {
    const url = `${apiUrls.GetItems}?StoreID=${StoreID}&Itemtype=${Itemtype}&DeptLedgerNo=${DeptLedgerNo}&Type=${Type}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetItemStockDetailsRequisition = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.GetItemStockDetailsRequisition,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getCreateRequisition = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.getCreateRequisition, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const IPDPrintSticker = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.IPDPrintSticker, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const PrintIndent = async (IndentNo) => {
  store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.PrintIndent}?IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const ItemAnalysisDetail = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const response = await makeApiRequest(apiUrls?.ItemAnalysisDetail, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const ReportMenu = async () => {
  try {
    const url = `${apiUrls.ReportMenu}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ReportSubMenu = async (ID, Type) => {
  try {
    const url = `${apiUrls.ReportSubMenu}?ID=${ID}&Type=${Type}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSupplier = async () => {
  try {
    const url = `${apiUrls.BindSupplier}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const StockStatusReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.StockStatusReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const StockLedgerReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.StockLedgerReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const CurrentStockReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.CurrentStockReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const IssueDetailReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.IssueDetailReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const StockBinCardReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.StockBinCardReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const ABCAnalysis = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.ABCAnalysis, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const LowStockDetail = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.LowStockDetail}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const ItemExpiryReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(apiUrls?.ItemExpiryReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const ItemMovementReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.ItemMovementReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const AdjustmentDetailReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.AdjustmentDetailReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const ConsumptionReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.ConsumptionReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const PurchaseSummaryReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.PurchaseSummaryReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindGroupIndentStatusReport = async (StoreNo) => {
  try {
    const url = `${apiUrls.BindGroupIndentStatusReport}?StoreNo=${StoreNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ItemBindIndentStatusReport = async (SubCategoryID, StoreNo) => {
  try {
    const url = `${apiUrls.ItemBindIndentStatusReport}?SubCategoryID=${SubCategoryID}&StoreNo=${StoreNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GRNDetailReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.GRNDetailReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const SupplierReturnReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.SupplierReturnReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const IndentStatusReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.IndentStatusReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getGSTReport = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.getGSTReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const DirectDepartmentReport = async (payload) => {
  const { UserValidateID, CentreIDTo, SalesNo } = payload;
  store.dispatch(setLoading(true));
  try {
    const response = await makeApiRequest(
      `${apiUrls?.DirectDepartmentIssue}?CentreIDTo=${CentreIDTo}&SalesNo=${SalesNo}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const GetAutoPurchaseRequestItemsApi = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.GetAutoPurchaseRequestItemsApi,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BindDepartments = async (transactionID) => {
  try {
    const url = `${apiUrls.BindDepartments}?transactionID=${transactionID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const BillingIPDBindTPA = async () => {
  try {
    const url = apiUrls.BillingIPDBindTPA;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const IPDAdmissionMultipleReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const response = await makeApiRequest(apiUrls?.IPDAdmissionMultipleReport, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BasicMasterSavePro = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.EDPBasicMasterSavePro, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const BillingIPDSaveReferDoctor = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.BillingIPDSaveReferDoctor, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const OPDServiceBookingChecklist = async (payload) => {
  try {
    const url = `${apiUrls.OPDServiceBookinggetChecklist}?PatientID=${payload?.PatientID}&Type=${payload?.Type}&TransactionId=${payload?.TransactionId}&PanelId=${payload?.PannelID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const OPDESIPatientDetail = async (payload) => {
  try {
    const url = `${apiUrls.OPDESIPatientDetail}?PatientID=${payload?.PatientID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const OPDPatientReferProcedureDetail = async (payload) => {
  try {
    const url = `${apiUrls.OPDPatientReferProcedureDetail}?BillNo=${payload?.BillNo}&Type=${payload?.Type}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const OPDSavePatientESINo = async (payload) => {
  try {
    const url = `${apiUrls.OPDSavePatientESINo}?BillNo=${payload?.billNo}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const OPDSavePatientReferProcedure = async (payload) => {
  try {
    const url = `${apiUrls.OPDSavePatientReferProcedure}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BasicMasterBindPro = async () => {
  try {
    const url = `${apiUrls.EDPBasicMasterBindPro}?Status=1`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const PatientBillingGetPackageDetail = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.PatientBillingGetPackageDetail,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const BillingGetIPDPackageAudit = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.BillingGetIPDPackageAudit, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const GetIPDPackageAuditDetailsApi = async (LedgertransactionNo) => {
  try {
    const url = `${apiUrls?.GetIPDPackageAuditDetails}?LedgertransactionNo=${LedgertransactionNo}`;
    const response = await makeApiRequest(url, {
      method: "get",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const BillingIPDFinalDiscount = async (payload) => {
  try {
    const url = `${apiUrls.BillingIPDFinalDiscount}?TransactionID=${payload}`;
    const response = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const ApplyFinalBillDiscount = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.ApplyFinalBillDiscount, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const OPDAddOrRemoveIPDPackage = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.OPDAddOrRemoveIPDPackage, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const IPDDetailgetPharClearanceDetail = async (payload) => {
  try {
    const response = await makeApiRequest(
      apiUrls?.IPDDetailgetPharClearanceDetail,
      {
        method: "post",
        data: payload,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const SaveClearanceApi = async (payload) => {
  try {
    const response = await makeApiRequest(apiUrls?.SaveClearance, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getDiscountApprovalApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.getDiscountApproval}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const updateDiscountApprovalApi = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.approveDiscount}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const PatientBillingGetPatietnBasicData = async (LedtnxNo, Type) => {
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls?.PatientBillingGetPatietnBasicData}?LedtnxNo=${LedtnxNo}&Type=${Type}`;
    const response = await makeApiRequest(url, {
      method: "get",
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsOPDAdvanceReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls?.BillingBillingReportsOPDAdvanceReport}`;
    const response = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const IPDBillingStatusLoadItems = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const url = `${apiUrls?.IPDBillingStatusLoadItems}`;
    const response = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
