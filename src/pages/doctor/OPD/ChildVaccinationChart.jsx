import React, { useEffect, useState } from 'react'
import { PrescriptionAdviceGetChildVaccineChart } from '../../../networkServices/DoctorApi';

import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';
import Modal from '../../../components/modalComponent/Modal';
import UpdateGivenDateModal from './ChildVaccination/UpdateGivenDateModal';


const ChildVaccinationChart = ({ patientDetail }) => {
  const [t] = useTranslation();
  console.log(patientDetail)
  const [tableData, setTableData] = useState([]);
  const [chartHeading, setChartHeading] = useState([])
  const [handleModelData, setHandleModelData] = useState({});
  


  const getTableHeaders = (data) => {
    if (!data.length) return [];

    // Get keys from the first object
    const allKeys = Object.keys(data[0]);

    // Exclude specific keys
    const excludedKeys = ["DOB", "KeyDescription", "VaccineName"];
    const filteredKeys = allKeys.filter((key) => !excludedKeys.includes(key));

    // Format keys: replace underscores with spaces and capitalize
    const formattedKeys = filteredKeys.map((key) =>
      key
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    );

    // console.log(["",...formattedKeys])
    setChartHeading(["", ...formattedKeys])

  };

  const getChildVaccination = async () => {
    let payload = {

      "patientID": patientDetail?.PatientID || "",

    }

    try {
      const response = await PrescriptionAdviceGetChildVaccineChart(payload);
      // console.log("the department respone is", response);
      if (response.success) {
        setTableData(response.data)
        getTableHeaders(response.data)
        console.log("😁😀got entires ", response.data)


      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setTableData([])

      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTableData([])
    }
  }

  const handleClickReject = (Details) => {
    const { itemLabel, Component } = Details;

    setHandleModelData({
      isOpen: true,
      width: '20vw',
      label: itemLabel,
      Component: Component,

    })
    console.log(Details)

  }

  const handleClose = () => {

    setHandleModelData((val) => ({ ...val, isOpen: false }))
  }

  useEffect(() => {
    getChildVaccination()
  }, [])


  // console.log(props)
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={handleClose}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          // modalData={handleModelData?.modalData}
          // buttons={handleModelData?.extrabutton}
          // buttonName={handleModelData?.buttonName}

          footer={<></>}
        // handleAPI={handleModelData?.RejectPurchaseRequest}

        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card patient_registration border mt-2">
        <Heading
          title={t("Vaccination Chart")}
          isBreadcrumb={false}
        />
        {/* {console.log("chartHeading", chartHeading)} */}
        <Tables
          thead={
            chartHeading
          }
          handleClassOnRow={(ele, name) => { if (!name) return "bg-danger" }}
          // tbody={
          //   tableData.map((item,index)=>({
          //     Vaccine: <div className='bg-danger py-3 text-center'>{item?.VaccineName ||  ""}</div>,

          //   }))
          // }

          tbody={tableData.map((item, index) => {
            const columns = chartHeading.slice(1).map((header, colIndex) => {
              const fieldKey = header.replace(/ /g, "_"); // Convert header back to field key
              const value = item[fieldKey] || "######"; // Handle missing keys

              if (value === "######") {
                return (
                  <div key={`${index}-${colIndex}`}>
                    <span >-</span>
                  </div>
                ); // Render blank if the value is "######"
              }

              // Split the value to extract specific parts
              const parts = value.split("#");
              const expectedDate = parts[3] || ""; // Leave blank if no value
              const vaccineName = parts[0] || ""; // Leave blank if no value
              const duration = parts[1] || ""; // Leave blank if no value
              const mappingID = parts[2] || ""; // Leave blank if no value
              const givenDate = parts[5] === "######" || !parts[5] ? "" : parts[5]; // Handle no given date
              const vaccinationStatus =
                parts[6] === "0"
                  ? "Pending"
                  : parts[6] === "1"
                    ? "Done"
                    : parts[6] === "2"
                      ? "Cancel"
                      : ""; // Leave blank if no status
              const reminder = parts[7] === "1" ? "Yes" : parts[7] === "0" ? "No" : ""; // Handle 1 and 0, else blank

              return (
                <div key={`${index}-${colIndex}`} className={`p-1 ${givenDate !==""? "bg-success" : ""}`}
                  onDoubleClick={() => {
                    handleClickReject({
                      itemLabel: "Update Vaccination Given Date",
                      Component: <UpdateGivenDateModal
                        inputData={{
                          vaccinationMapId:mappingID,
                          patientId: patientDetail?.PatientID || "",
                          transactionId: patientDetail.currentPatient?.TransactionID || "",
                          dob: tableData[0]?.DOB || "",
                          dueDate: expectedDate || "",
                          vaccineName:  vaccineName || "",
                          duration: duration || "",
                          givenDate: ""
                        }}
                        handleClose={handleClose}
                        getChildVaccination={getChildVaccination}
                      

                      />

                    });
                    // console.log("expectedDate",expectedDate)
                  }}
                >
                  <span>Expected Date: {expectedDate}</span>
                  <br />
                  <span>Given Date: {givenDate}</span>
                  <br />
                  <span>Vaccination Status: {vaccinationStatus}</span>
                  <br />
                  <span>Reminder: {reminder}</span>
                </div>
              );
            });

            // Construct each row object for the table
            return {
              Vaccine: (
                <div className="bg-danger py-3 text-center">
                  {item?.VaccineName || ""}
                </div>
              ),
              ...Object.fromEntries(
                chartHeading.slice(1).map((header, colIndex) => [
                  header,
                  columns[colIndex],
                ])
              ),
            };
          })}



        />
      </div>

    </>
  )
}

export default ChildVaccinationChart