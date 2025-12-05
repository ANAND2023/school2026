import React, { useEffect, useState } from 'react'
import { displayDoctorsDropdownApi, getDisplayDoctorsApi } from '../../networkServices/DoctorApi';
import { notify } from '../../utils/ustil2';
import MultiSelectComp from '../../components/formComponent/MultiSelectComp';
import { useNavigate } from 'react-router-dom';

const SetDoctorForDisplay = () => {
    const navigate = useNavigate()
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [doctorsList, setDoctorsList] = useState([])

    console.log(selectedDoctors)
    const handleMultiSelectChange = (name, selectedOptions) => {
        console.log(selectedOptions)
        const ids = selectedOptions.map(option => option.code);

        setSelectedDoctors(prev => ({
            ...prev,
            [name]: ids,   // store only IDs
        }));
    };

    const getDoctorsDropdownAPI = async () => {

        try {
            const dataRes = await displayDoctorsDropdownApi();
            if (dataRes.success) {
                const finalData = dataRes?.data?.map((item) => {

                    return {
                        name: item?.DoctorName,
                        code: item?.DoctorId
                    }
                }
                )
                setDoctorsList(finalData)
            } else {
                notify(dataRes.message, "error");
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleProceedDoctors = async () => {
        if (selectedDoctors?.length < 1) {
            notify("Doctor is required", "error")
            return
        }

        navigate("/display-doctors", { state: { doctorsData: selectedDoctors } });

    };

    useEffect(() => {
        getDoctorsDropdownAPI()
    }, [])

    return (
        <div className="w-100">
            <div className="card card_background pt-1">
                <div className="display-doc-heading p-2" style={{ boxShadow: "0 -2px #0c8566" }}>
                    <h4 className="card-title w-100 d-md-flex align-items-center ">
                        <i className='fa fa-home'></i>
                        <div className=""><label className="text-nowrap m-0 pl-1"> {"Doctors/Display Doctors"} </label> </div></h4>
                </div>
            </div>


            <div className="card">
                <div className="row p-2">
                    <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
                        <MultiSelectComp
                            name="DoctorID"
                            id="DoctorID"
                            placeholderName={"Doctor"}
                            dynamicOptions={doctorsList}
                            handleChange={handleMultiSelectChange}
                            value={doctorsList?.filter(opt =>
                                selectedDoctors?.DoctorID?.includes(opt.code)
                            )} requiredClassName={'required-fields'}
                        />
                    </div>
                    <button className='btn btn-primary' onClick={handleProceedDoctors}>Proceed</button>
                </div>
            </div>
        </div>
    )
}

export default SetDoctorForDisplay