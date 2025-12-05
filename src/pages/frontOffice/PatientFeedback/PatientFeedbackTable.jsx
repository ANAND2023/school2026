import React, { useEffect, useRef, useState } from "react";
// import Tables from "..";
// import { OpenPDFURL } from "../../../../networkServices/PDFURL"; 
import Tables from "../../../components/UI/customTable";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import { feedbackOpenCloseRemarksApi, PatientFeedBackReportPrint } from "../../../networkServices/cardPrint";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import TextAreaModal from "../../../components/modalComponent/Utils/TextAreaModal";
import Modal from "../../../components/modalComponent/Modal";
import { useTranslation } from "react-i18next";
import { notify } from "../../../utils/ustil2";
function CardPrintTable({ bodyData, setBodyData, refreshData }) {
  const THEAD = [
    { name: "S.no", width: "2%" },
    { name: "Patient ID", width: "5%" },
    { name: "Type", width: "5%" },
    { name: "Patient Name", width: "" },
    { name: "Doctor Name", width: "" },
    { name: "Contact No", width: "" },
    { name: "FeedBack Date", width: "" },
    { name: "Close", width: "5%" },
    { name: "Audio", width: "2%" },
    { name: "Print Card", width: "2%" },
  ];
  const [modalData, setModalData] = useState({});
  const [handleModelData, setHandleModelData] = useState({});
  const { t } = useTranslation()
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  console.log(bodyData, "bodyData")

  // audio feature 
  const audioRef = useRef(new Audio());
  const [playingId, setPlayingId] = useState(null);
  const urlStoreRef = useRef({});

  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => setPlayingId(null);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", () => {

    });
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("ended", onEnded);

      Object.values(urlStoreRef.current).forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) { }
      });
      urlStoreRef.current = {};
    };
  }, []);


  function parseBase64(input) {
    if (!input) return null;
    if (input.startsWith("data:")) {
      const [meta, data] = input.split(",");
      const mimeMatch = meta.match(/data:(.*);base64/);
      const mime = mimeMatch ? mimeMatch[1] : "audio/mpeg";
      return { mime, data };
    }
    return { mime: "audio/mpeg", data: input };
  }

  function base64ToUint8Array(base64Str) {
    const binary = atob(base64Str);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function makeBlobFromBase64(b64) {
    const parsed = parseBase64(b64);
    if (!parsed) return null;
    const u8 = base64ToUint8Array(parsed.data);
    return new Blob([u8], { type: parsed.mime });
  }


  const getRowId = (row, idx) => row?.SummaryId ?? row?.PatientID ?? `r_${idx}`;

  async function playPauseAudio(row, idx) {
    const id = getRowId(row, idx);


    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }


    if (playingId) {
      audioRef.current.pause();
      setPlayingId(null);
    }

    const b64 = row?.AudioRecord;
    let base64String = b64;
    if (Array.isArray(b64)) {

      base64String = b64[0];
    }

    if (!base64String) return;


    let url = urlStoreRef.current[id];
    if (!url) {
      const blob = makeBlobFromBase64(base64String);
      if (!blob) return;
      url = URL.createObjectURL(blob);
      urlStoreRef.current[id] = url;
    }

    try {
      audioRef.current.src = url;
      await audioRef.current.play();
      setPlayingId(id);
    } catch (err) {

      console.warn("Audio play failed", err);
    }
  }

  function downloadAudio(row, idx) {
    const b64 = row?.AudioRecord;
    let base64String = b64;
    if (Array.isArray(b64)) base64String = b64[0];
    if (!base64String) return notify("Audio not available", "error");

    const blob = makeBlobFromBase64(base64String);
    if (!blob) return notify("Invalid audio", "error");

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filenameBase = row?.PatientName?.replace(/\s+/g, "_") || "recording";
    a.href = downloadUrl;
    a.download = `${filenameBase}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();


    setTimeout(() => URL.revokeObjectURL(downloadUrl), 3000);
  }

  const handlePrintCard = async (data) => {
    const payload = {
      PatientID: data?.PatientID,
      EntryFeedBackDate: data?.EntryFeedBackDate,
      summaryID: data?.SummaryId
    }
    try {
      const res = await PatientFeedBackReportPrint(payload);

      if (res.success) {
        // window.open(res.data.pdfUrl, "_blank");
        RedirectURL(res?.data?.pdfUrl);
      } else {
        console.error("PDF URL not found in response", res);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleOpenCloseRemarksCheckbox = (val, status) => {
    setModalData({ data: val, status: status });
    setHandleModelData({
      label: t("Remarks Modal"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: <TextAreaModal handleChangeModel={setModalData} />,
      handleInsertAPI: handleFeedbackOpenCloseRemarks,
      extrabutton: <></>,
    });
  };

  const handleFeedbackOpenCloseRemarks = async (data) => {
    debugger
    const payload = {
      summaryID: data?.data?.SummaryId,
      closeRemark: data?.modalData?.insufficientRemarks,
      isClose: data?.status

    }
    try {
      const res = await feedbackOpenCloseRemarksApi(payload);
      if (res?.success) {
        notify(res?.message || "Feedback Closed Successfully", "success");
        setIsOpen();
        refreshData();
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify(error?.message, "error");
    }
  };

  const getRowClass = (val) => {

    if (val?.isclose === 1) {
      return "#95d89a";
    }

    if (val?.IsAnyIssue === 1) {
      return "#ffb6c1";
    }
    if (val?.isclose === 1 && val?.IsAnyIssue === 1) {
      return "#95d89a";
    }
    if (val?.IsAverage === 1 && (val?.isclose === 0 && val?.IsAnyIssue === 0)) {
      return "#ffff00";
    }
  };

  return (
    <div className="card">
      <Tables
        style={{ height: "65vh" }}
        thead={THEAD}
        tbody={bodyData.map((row, index) => ({
          //   ...row,
          "S.no": index + 1,
          "Patient ID": row?.PatientID,
          "Patient type": row?.PatientType,
          "Patient Name": row?.PatientName,
          "Doctor Name": row?.DoctorName,
          "Contact No": row?.MobileNo,
          "Date Enrolled": row?.EntryFeedBackDate,
          "Close": (
            <Checkbox
              checked={row.isclose === 1 ? true : false}
              disabled={row.isclose === 1 ? true : false}
              onChange={() => handleOpenCloseRemarksCheckbox(row, 1)}
            />
          ),
          // "recording":  row?.AudioRecord?.length > 0 ? (
          //   <span className="d-flex justify-content-around">

          //   <i class="fa fa-play" aria-hidden="true"></i>
          //   <i class="fa fa-download px-2" aria-hidden="true"></i>
          //    </span>

          // ) : <p className="text-danger   mb-0"> Not Available </p>,
          "recording": row?.AudioRecord && row?.AudioRecord?.length > 0 ? (
            <span className="d-flex justify-content-around align-items-center">
              {/* Play / Pause */}
              <i
                className={`fa ${playingId === getRowId(row, index) ? "fa-pause" : "fa-play"}`}
                style={{ cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => playPauseAudio(row, index)}
              ></i>

              {/* Download */}
              <i
                className="fa fa-download px-2"
                style={{ cursor: "pointer" }}
                aria-hidden="true"
                onClick={() => downloadAudio(row, index)}
              ></i>
            </span>
          ) : (
            <p className="text-danger mb-0"> Not Available </p>
          ),

          "Print Card": (

            <i
              className="fa fa-print card-print-upload-image-icon"
              aria-hidden="true"
              onClick={() => handlePrintCard(row)}
            ></i>


          ),
          colorcode: getRowClass(row),
        }))}
      />

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={() => setHandleModelData({ ...handleModelData, isOpen: false })}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {/* //uguiguiguiguig */}
          {handleModelData?.Component}
        </Modal>
      )}
    </div>
  );
}

export default CardPrintTable;
