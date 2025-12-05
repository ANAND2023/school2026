import React, { useEffect } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { t } from 'i18next'
import Input from '../../../components/formComponent/Input'
import TextAreaInput from '../../../components/formComponent/TextAreaInput'
import { filterByTypes } from '../../../utils/utils'
import { useSelector } from 'react-redux'
import { CentreWiseCacheByCenterID, CentreWisePanelControlCache } from '../../../store/reducers/common/CommonExportFunction'
import { useDispatch } from 'react-redux'
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage'

const ReferDoctorModal = ({ isProName,setModalData, DropDownState }) => {
    debugger
  const { CentreWiseCache, CentreWisePanelControlCacheList, BindResource } = useSelector(
    (state) => state.CommonSlice
  );
   const localdata = useLocalStorage("userData", "get");
   const dispatch = useDispatch();
    const [values, setValues] = React.useState({
        title: { label: "", value: "" },
        name: '',
        contactNo: '',
        proName: { label: "", value: "" },
        address: ''
    });

     const CentreWiseCacheByCenterIDAPI = async () => {
        let data = await dispatch(CentreWiseCacheByCenterID({}));
        if (data?.payload?.success) {
          let countryCode = filterByTypes(
            data?.payload?.data,
            [7, BindResource?.BaseCurrencyID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField",
            "STD_CODE"
          );
          let defaultState = filterByTypes(
            data?.payload?.data,
            [8, BindResource?.DefaultStateID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultDistrict = filterByTypes(
            data?.payload?.data,
            [9, BindResource?.DefaultDistrictID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
          let defaultCity = filterByTypes(
            data?.payload?.data,
            [10, BindResource?.DefaultCityID],
            ["TypeID", "ValueField"],
            "TextField",
            "ValueField"
          );
    
          setValues((val) => ({
            ...val,
            District: values?.districtID
              ? values?.districtID?.label
              : defaultDistrict?.length > 0 && defaultDistrict[0]?.label,
            State: values?.StateID
              ? values?.StateID?.label
              : defaultState?.length > 0 && defaultState[0]?.label,
            City: values?.cityID
              ? values?.cityID?.label
              : defaultCity?.length > 0 && defaultCity[0]?.label,
            Phone_STDCODE: values?.Phone_STDCODE
              ? values?.Phone_STDCODE
              : countryCode?.length
                ? countryCode[0]?.extraColomn
                : "+91",
          }));
        }
      };
      useEffect(() => {
        if (CentreWiseCache?.length === 0) {
          CentreWiseCacheByCenterIDAPI();
        }
        if (CentreWisePanelControlCacheList?.length === 0) {
          dispatch(
            CentreWisePanelControlCache({
              centreID: localdata?.defaultCentre,
            })
          );
        }
      }, [dispatch]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactNo" && value?.length > 15) {

            return
        }


        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));


    }
    const handleReactSelectChange = (name, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }

    useEffect(() => {
        setModalData(values);
    }, [values]);

    console.log(values," values in refer doctor modal");


    return (
        <>
            {isProName ? <div className="row">
                    <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12">
                        
                        <Input
                            type="text"
                            className="form-control"

                            removeFormGroupClass={false}
                            name="name"
                            lable={t("Name")}
                            required={true}
                            onChange={handleInputChange}
                            //   onKeyDown={handleKeyDown} // Add keydown event handler
                            //   inputRef={inputRef}
                            value={values?.name}
                            respclass="col-xl-12 col-md-12 col-sm-12 col-12"
                        />
                    </div> </div> : 
                <div className="row">
                    <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12">
                        <ReactSelect
                            placeholderName={t("Title")}

                            searchable={true}
                            name={"title"}
                            respclass="col-xl-3 col-md-3 col-sm-3 col-3"
                             dynamicOptions={filterByTypes(
                                                CentreWiseCache,
                                                [1],
                                                ["TypeID"],
                                                "TextField",
                                                "ValueField",
                                                "Department"
                                              )}
                            // dynamicOptions={[
                            //     { label: t("Dr."), value: "Dr." },
                            //     { label: t("Prof Dr."), value: "Prof Dr." },
                            // ]}
                            handleChange={handleReactSelectChange}
                            value={values?.title?.value}
                            removeIsClearable={false}
                        />
                        <Input
                            type="text"
                            className="form-control"

                            removeFormGroupClass={false}
                            name="name"
                            lable={t("Name")}
                            required={true}
                            onChange={handleInputChange}
                            //   onKeyDown={handleKeyDown} // Add keydown event handler
                            //   inputRef={inputRef}
                            value={values?.name}
                            respclass="col-xl-9 col-md-9 col-sm-10 col-9"
                        />
                    </div>
                    <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12">

                        <Input
                            type="Number"
                            className="form-control"

                            removeFormGroupClass={false}
                            name="contactNo"
                            lable={t("Contact No.")}
                            required={true}
                            onChange={handleInputChange}
                            //   onKeyDown={handleKeyDown} // Add keydown event handler
                            //   inputRef={inputRef}
                            value={values?.contactNo}
                            respclass="col-xl-6 col-md-6 col-sm-12"
                        />
                        <ReactSelect
                            placeholderName={t("Pro Name")}

                            searchable={true}
                            name={"proName"}
                            respclass="col-xl-6 col-md-6 col-sm-12"
                            dynamicOptions={DropDownState?.getBindProList}
                            handleChange={handleReactSelectChange}
                            value={values?.proName}
                            removeIsClearable={false}
                        />
                    </div>
                    <div className="d-flex justify-content-start align-items-center col-xl-12 col-md-12 col-sm-12 col-12">
                        <TextAreaInput
                            type="text"
                            className="form-control min-h-70"
                          
                            removeFormGroupClass={false}
                            name="address"
                            lable={t("Address")}
                            required={true}
                              onChange={handleInputChange}
                              value={values?.address}
                            respclass="col-xl-12 col-md-12 col-sm-12 col-12 "


                        />
                    </div>
                </div>
            }
        </>


    )
}

export default ReferDoctorModal