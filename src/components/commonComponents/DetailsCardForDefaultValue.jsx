import React, { useEffect, useState } from "react";
import LabeledInput from "../formComponent/LabeledInput";
import { useTranslation } from "react-i18next";
import SeeMore from "../UI/SeeMore";
import { useDispatch, useSelector } from "react-redux";
import { BindSeeMoreList } from "../../store/reducers/common/CommonExportFunction";
import SeeMoreList from "./SeeMoreList";
import MultiSelectComp from "../formComponent/MultiSelectComp";
import { notify } from "../../utils/ustil2";
import { Tooltip } from "primereact/tooltip";

function DetailsCardForDefaultValue({
  singlePatientData,
  children,
  // seeMore,
  ModalComponent,
  sendReset,
  show,
  PatientRegistrationArg,
}) {
  const [t] = useTranslation();
  if (!show) {
    singlePatientData[0].icons = (
      <div
        style={{
          border: "1px solid #447dd5",
          padding: "2px 5px",
          borderRadius: "3px",
          backgroundColor: "#447dd5",
          color: "white",
          marginRight: "3px",
        }}
        onClick={sendReset}
      >
        <i className="fa fa-search " aria-hidden="true"></i>
      </div>
    );
  }
  const [seeMore, setSeeMore] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dispatch = useDispatch();
  const { BindSeeMoreListData } = useSelector((state) => state?.CommonSlice);
  // console.log(
  //   "BindSeeMoreListDataBindSeeMoreListData",
  //   BindSeeMoreListData,
  //   PatientRegistrationArg
  // );
  useEffect(() => {
    if (BindSeeMoreListData?.length === 0) {
      dispatch(BindSeeMoreList());
    }
  }, []);

  useEffect(() => {
    let list = SeeMoreList(BindSeeMoreListData, PatientRegistrationArg);
    setSeeMore(list);
  }, [BindSeeMoreListData?.length]);




  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    notify(`${label} copied!`, "success");
  };
  console.log("singlePatientData", singlePatientData)
  return (
    <div className="d-flex ">
      <div className="mt-3 w-100 mr-1">
        <div className="row px-2">
          {singlePatientData?.map((data, index) => {
            const tooltipId = `copy-${index}`;
            return (
              <div
                className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2"
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ position: "relative" }}
              >
                {/* Tooltip for Copy Action */}
                <Tooltip target={`#${tooltipId}`} content="Copy" position="top" />

                <div
                  id={tooltipId}
                  className="d-flex align-items-center copy-text"
                  // onClick={() => handleCopy(data?.value, data?.label)}
                  style={{ cursor: "pointer" }}
                >
                  {data?.icons}
                  <LabeledInput
                    label={data?.label}
                    value={data?.value}
                    className={"w-100"}
                    valueLength={data?.label === "Address" ? "full" : "27"}
                  />
                </div>
              </div>
            );
          })}
          {children}

        </div>
      </div>
      <div>
        {seeMore.length > 0 && (
          <SeeMore
            Header={
              <div style={{ position: "relative", right: "5px", top: "13px" }}>
                <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
              </div>
            }
          >
            <ul className="list-group" style={{ whiteSpace: "nowrap" }}>
              {seeMore?.map((items, index) => {
                return (
                  <li
                    className="list-group-item p-2"
                    key={index}
                    onClick={() =>
                      ModalComponent(items?.name, items?.component)
                    }
                    style={{ cursor: "pointer" }}
                  >{console.log("items.name", items.name)}
                    {items.name}
                  </li>
                );
              })}
            </ul>
          </SeeMore>
        )}
      </div>
    </div>
  );
}

export default DetailsCardForDefaultValue;
