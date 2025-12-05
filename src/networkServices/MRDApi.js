import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { PrintBedOccupancyReport } from "./ReportsAPI";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";

export const MRDBindPatientType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientType}?roomID=1`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const getDocDepartmentApi = async (doctorId) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.getDocDepartment}?doctorId=${doctorId}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindCaseType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindCaseType}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindPanelIPD = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindPanelIPD}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindParentPanel = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindParentPanel}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDischargeType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDischargeType}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchGrid = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchGrid, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDPatientSearchMRDRecieved = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.MRDPatientSearchMRDRecieved,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDocuments = async (TID) => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDocuments}?TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDFileRegisterSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDFileRegisterSave, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindgrd = async (PID, TID) => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDBindgrd}?PID=${PID}&TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDScanFileUpload = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDScanFileUpload, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDScanFileView = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDScanFileView, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRoomCMB = async () => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(apiUrls?.MRDBindRoomCMB, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindAlmirah = async (RmID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDBindAlmirah}?RmID=${RmID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindShelf = async (AlmID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDBindShelf}?AlmID=${AlmID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSetLocation = async (TID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDSetLocation}?TID=${TID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSetLocationSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const response = await makeApiRequest(`${apiUrls?.MRDSaveLoation}`, option);
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchPatient = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchPatient, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveSentFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveSentFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMRDSentfilestatus = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMRDSentfilestatus, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMRDRequisitionSearch = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMRDRequisitionSearch, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveMRDRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveMRDRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSaveMRDReturnFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.SaveMRDReturnFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDGetFileStatus = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDGetFileStatus, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMLCDetailUpdate = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMLCDetailUpdate, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDetails = async (TID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDetails}?TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchMRDRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchMRDRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDApprovedRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDApprovedRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchIssueFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchIssueFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDPatientInfoApi = async (regNo) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientDetails}?patientId=${regNo}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MRDBindPatientDetail = async (TransactionID, PatientID) => {
  store.dispatch(setLoading(true));

  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientDetail}?TransactionID=${TransactionID}&PatientID=${PatientID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const MRDCreateIssueFileApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDCreateIssueFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MRDPatientIssuedListApi = async (patientId) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDPatientIssuedList}?patientId=${patientId}&type=0`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MRDIssueFilleSearchApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDIssueFilleSearch}?patientId=${payload?.PatientID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MRDIssueFileStatusApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDGetFileStatus, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MRDReceivedFilleSearchApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDReceivedFilleSearch, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const getFileIssueReportpdfApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.getFileIssueReportpdf, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const MRDBindFileDetail = async (TransactionID, PatientID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindFileDetailURL}?TransactionID=${TransactionID}&PatientID=${PatientID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const BindMRDRequisitionDetail = async (RequestedID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindRequisitionDetailURL}?RequestedID=${RequestedID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindFileDoc = async (TransactionID, FileID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindFileDocURL}?TransactionID=${TransactionID}&FileID=${FileID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindEmployeeAPI = async (RoleID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindEmployeeURL}?RoleID=${RoleID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const handleMRDFileIssueSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDFileIssueSaveURL}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const handleFileReturnSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(`${apiUrls?.MRDFileReturnSave}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const handleEnDisableSave = async (TransactionID, RequestID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.EnDisableSave}?TransactionID=${TransactionID}&RequestID=${RequestID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSearch = async (PID, TID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDSearch}?PID=${PID}&TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSavedocument = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSavedocument, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDocumentlist = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(apiUrls?.MRDBindDocumentlist, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDEditDcouementName = async (documentID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDEditDcouementName}?documentID=${documentID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRoom = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(apiUrls?.MRDBindRoom, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveNewRoom = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveNewRoom, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindMRDRack = async (roomID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindMRDRack}?roomID=${roomID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveNewRack = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.MRDSaveNewRack, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRackDetail = async (RackID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindRackDetail}?RackID=${RackID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBedOccupancyReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintBedOccupancyReport, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDPatientICDCodeReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.PrintPatientICDCodeReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const BindNABH = async () => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(`${apiUrls?.BindNABH}`, option);
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const BillingReportsAdmitDischargeList = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingReportsAdmitDischargeList}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingLabSummaryReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingLabSummaryReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingReportsLabCollectionDetail = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingReportsLabCollectionDetail}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
// export const BillingLabSummaryReport = async (payload) => {
//   try {
//     store.dispatch(setLoading(true));
//     const option = {
//       method: "POST",
//       data: payload,
//     };
//     const response = await makeApiRequest(`${apiUrls?.BillingLabSummaryReport}`,
//       option
//     );
//     return response;
//   } catch (error) {
//     console.log(error, "SomeThing Went Wrong");
//   }finally{
//     store.dispatch(setLoading(false));
//   }
// };
export const BillingSubCategoryDiscription = async () => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "GET",
      // data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingSubCategoryDiscription}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingRateListReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingRateListReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const EDPRateListReportSearch = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.EDPRateListReportSearch}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const EDPEDPReportsGetLoadCategory = async (id) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "GET",
      // data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.EDPEDPReportsGetLoadCategory}?obj=${id}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const EDPReportsGetBindCenter = async (PanelId) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "GET",
      // data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.EDPReportsGetBindCenter}?PanelId=${PanelId}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const EDPReportsGetLoadScheduleCharges = async (PanelId) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "GET",
      // data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.EDPReportsGetLoadScheduleCharges}?PanelId=${PanelId}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const EDPReportsGetDepartment = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };

    const response = await makeApiRequest(
      `${apiUrls?.EDPReportsGetCategorySelect}`,
      // const response = await makeApiRequest(`${apiUrls?.EDPReportsGetCategorySelect}?CategoryID=${payload?.CategoryID}&Name=${payload?.Name}&CenterId=${payload?.CenterId}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBindReportOption = async (ID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingBindReportOption}?ReportTypeID=${ID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const BillingCTBDetailReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingCTBDetailReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingDischargeCancelReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingDischargeCancelReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillCancelReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingBillCancelReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingAdmissionProcessTAT = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingAdmissionProcessTAT}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingDischargeProcessTAT = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingDischargeProcessTAT}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingOPDPatientTimewiseReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingOPDPatientTimewiseReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingOPDTATReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingOPDTATReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const ReportsSumCollectionReportCash = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.ReportsSumCollectionReportCash}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingAdmittedPatientWithoutDischarg = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingAdmittedPatientWithoutDischarg}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingOperationReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingOperationReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingOperationReportNew = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingOperationReportNew}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingRoomRentGST = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingRoomRentGST}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingCreditPanelPatientsReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingCreditPanelPatientsReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingDiscountReportPanelWiseReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingDiscountReportPanelWiseReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingReportsPharmacyDetailReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingReportsPharmacyDetailReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingEnvoiceReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingEnvoiceReport}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingAdmittedPanelPatient = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingAdmittedPanelPatient}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingReportsBindReportType = async () => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.BillingReportsBindReportType}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const PrintNBHReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintNBHReport, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const BillingBillingReportsCensusReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsCensusReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingCMSUtilizationReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingCMSUtilizationReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BillingReportsOutstandingPatient = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingReportsOutstandingPatientReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsOPDDoctorFeedingReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsOPDDoctorFeedingReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsOPDAdmissionDoneReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsOPDAdmissionDoneReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsStatewisePatients = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsStatewisePatients,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDiscountReportDetail = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsDiscountReportDetail,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDoctorIncomeReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsDoctorIncomeReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsOPDAdmissionConvertedReport = async (
  payload
) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsOPDAdmissionConvertedReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDoctorDeptInvestigationBusinessReport =
  async (payload) => {
    try {
      store.dispatch(setLoading(true));
      const option = {
        method: "post",
        data: payload,
      };
      const data = await makeApiRequest(
        apiUrls?.BillingBillingReportsDoctorDeptInvestigationBusinessReport,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };
export const BillingBillingReportsSubCategoryName = async () => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "GET",
      // data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsSubCategoryName,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsReferredPatientReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsReferredPatientReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDocterInvestigationBusinessDetails = async (
  payload
) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsDocterInvestigationBusinessDetails,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsCMSUtilizationDetailReport = async (
  payload
) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsCMSUtilizationDetailReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDoctorPharmacyIPDPkgDetail = async (
  payload
) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsDoctorPharmacyIPDPkgDetail,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsItemWisePurchase = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsItemWisePurchase,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsVendorWisePurchase = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsVendorWisePurchase,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicalStoreReportHSNwisePurchaseSummaryReport = async (
  payload
) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.MedicalStoreReportHSNwisePurchaseSummaryReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicalStoreReportStockSaltWiseReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.MedicalStoreReportStockSaltWiseReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const PharmacyPharmacyReportReOrderLevelReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.PharmacyPharmacyReportReOrderLevelReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsIPDBillingReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsIPDBillingReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsManufactureReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsManufactureReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BillingBillingReportsDrugFormularyReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.BillingBillingReportsDrugFormularyReport,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BillingBillingReportsDrugFormularyCount = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(apiUrls?.BillingBillingReportsDrugFormularyCount,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  } finally {
    store.dispatch(setLoading(false));
  }
};
