import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDisplayDoctorsApi } from "../../networkServices/DoctorApi";
import { notify } from "../../utils/ustil2";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import "./DisplayDoctor.css";
import DoctorCardSkeleton from "./DoctorCardSkeleton";
import patientPlaceholder from "../../assets/image/patientDummy.jpg"
import doctorPlaceholder from "../../assets/image/doctor-default-image.jpg"


const onImageError = (e) => {
    e.target.src = patientPlaceholder;
};
const DoctorCard = ({ doctor, isSingle }) => {


    return (
        <div className={`${isSingle ? '' : 'ak-doctor-card'}`}>
            <div className="ak-card-main">
                {!isSingle ?
                    <>
                        <div className="h-100 moh-p">
                            <img
                                className="ak-doctor-photo"
                                src={doctorPlaceholder}
                                onError={onImageError}
                                alt={doctor?.doctorName}
                            />
                            <h1>MOH Hospital</h1>
                        </div>
                        <div className="ak-doctor-info">
                            <h2>{doctor?.doctorName}</h2>
                            <p>{doctor?.designation}</p>
                            <p>{doctor?.department}</p>
                            <p>{doctor?.degree}</p>

                            <div className="ak-chips">
                                <span className="ak-chip">In-person</span>
                                <span className="ak-chip">Virtual</span>
                            </div>
                        </div>
                    </>
                    :
                    <div className={`${isSingle ? 'ak-single-view' : ''}`}>
                        <div className="h-50 moh-p">
                            <img
                                className={` ${isSingle ? 'ak-doctor-photo1' : 'ak-doctor-photo'}`}
                                src={doctorPlaceholder}
                                onError={onImageError}
                                alt={doctor?.doctorName}
                            />
                            <h1>MOH Hospital</h1>
                        </div>
                        <div className="ak-doctor-info">
                            <h2>{doctor?.doctorName}</h2>
                            <p>{doctor?.designation}</p>
                            <p>{doctor?.department}</p>
                            <p>{doctor?.degree}</p>

                            <div className="ak-chips">
                                <span className="ak-chip">In-person</span>
                                <span className="ak-chip">Virtual</span>
                            </div>
                        </div>
                    </div>
                }
                <div className="ak-appointments">
                    <div className="ak-distance">{"Patients"}</div>
                    <div className="ak-patient-list">
                        {doctor?.appointments?.slice(0, 4)?.map((p, i) => (
                            <div
                                key={i}
                                className={`${i === 0 && p?.p_IN === 1 ? "ak-success-status" : "ak-pending-status"} ak-patient`}
                            >
                                <div className="ak-patient-name">
                                    <img src={p?.patientPhoto ? p?.patientPhoto : patientPlaceholder} alt={p?.pname} onError={onImageError} />
                                    <div>
                                        <p className="p-0 m-0">APPOINTMENT ID: #{p?.appNo}</p>
                                        <span>{p?.pname}</span>
                                    </div>
                                </div>
                                <p
                                    className="ak-patient-status"
                                    style={{
                                        background: i === 0 && p?.p_IN === 1 ? "#32CD32" : "",
                                        color: i === 0 && p?.p_IN === 1 ? "#fff" : "",
                                    }}
                                >
                                    {p?.p_IN === 1 ? "IN" : "Waiting"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DisplayDoctors = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const selectedDoctors = location.state?.doctorsData;

    const [doctorData, setDoctorData] = useState(() => {
        const saved = useLocalStorage("doctorData", "get");
        return saved ? JSON.parse(saved) : null;
    });
    const [loader, setLoader] = useState(false)


    const handleProceedDoctors = async (showLoader = false) => {
        if (showLoader) setLoader(true)
        const payload = {
            DoctorId: selectedDoctors?.DoctorID,
        };
        try {
            const dataRes = await getDisplayDoctorsApi(payload);

            if (dataRes.success) {
                setDoctorData(dataRes?.data);
                useLocalStorage("doctorData", "set", JSON.stringify(dataRes?.data));
            } else {
                notify(dataRes.message, "error");
                navigate("/set-doctors")
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (showLoader) setLoader(false)
        }
    };

    // useEffect(() => {
    //     if (selectedDoctors?.DoctorID?.length > 0) {
    //         handleProceedDoctors(true);

    //         const interval = setInterval(() => {
    //             handleProceedDoctors();
    //         }, 30000);

    //         return () => clearInterval(interval);
    //     }
    // }, [selectedDoctors]);
    useEffect(() => {
        if (selectedDoctors?.DoctorID?.length > 0) {
            let isFetching = false;
            let intervalId;

            const startFetching = async () => {
                if (isFetching) return; // prevent overlapping calls
                isFetching = true;
                await handleProceedDoctors(); // wait for completion
                isFetching = false;
            };

            // initial call with loader
            handleProceedDoctors(true).then(() => {
                // start interval after first one finishes
                intervalId = setInterval(() => {
                    startFetching();
                }, 30000);
            });

            return () => clearInterval(intervalId);
        }
    }, [selectedDoctors]);


    return (
        <div className="ak-display-doctors">
            <div className="ak-cards-container">
                <div className={`ak-cards-grid 
                    ${doctorData?.length === 1
                        ? 'ak-single-card'
                        : doctorData?.length === 2
                            ? 'ak-two-cards'
                            : ''}`
                }>
                    {!loader
                        ? doctorData?.map((item, i) => <DoctorCard key={item?.DoctorId || i} doctor={item} isSingle={doctorData.length === 1} />)
                        : [...Array(4)].map((_, i) => <DoctorCardSkeleton key={i} />)}
                    {/* {doctorData?.map((item, i) => (
        <DoctorCard key={i} doctor={item} />
      ))} */}
                </div>
            </div>
        </div>

    );
};

export default DisplayDoctors;