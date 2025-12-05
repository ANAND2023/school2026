import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import {
  SortSVGIcon,
  IncreaseIngSortSVGIcon,
  DecreaseIngSortSVGIcon,
} from "../../../components/SvgIcons/index.jsx";
import Input from "../../formComponent/Input.jsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
function Tables({
  thead,
  tbody,
  fs,
  getRowClass,
  style,
  tableHeight,
  scrollView,
  getRowClick,
  WWW,
  tdFontWeight,
  handleClassOnRow,
  handleDoubleClick,
  isSearch,
  notSingleClick = true,
  getWholeArray,
  borderDark
}) {
  const [t] = useTranslation();
  const [bodyData, setBodyData] = useState(tbody);
  const [handleLanguageStatus, setHandleLanguageStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [theadData, setTheadData] = useState([]);
  const isMobile = window.innerWidth <= 768;
  const activeRowRef = useRef(null);

  useEffect(() => {
    setBodyData(tbody);
  }, [tbody]);

  useEffect(() => {
    if (tbody?.length > 0) {
      let data = thead?.map((val, index) => {
        if (typeof val === "object") {
          if (typeof Object?.values(tbody[0])[index] === "object") {
            val.type = "";
          } else {
            val.type = "N";
          }
        } else {
          if (typeof Object?.values(tbody[0])[index] === "object") {
            val = { name: val, type: "" };
          } else {
            val = { name: val, type: "N" };
          }
        }
        return val;
      });
      setTheadData(data);
    }
  }, [tbody, handleLanguageStatus]);

  // i18next.on("languageChanged", (lng) => {
  //   console.log("Asdasd",lag)
  //   setHandleLanguageStatus(!handleLanguageStatus)
  // });

  // Handle Sort Functionality

  // const handleSortTable = (index, type) => {
  //   debugger
  //   let typeName = Object?.keys(bodyData[0])[index];
  //   let data = [...bodyData];
  //   if (type === "DESC") {
  //     data.sort((a, b) => {
  //       if (new Date(a[typeName]).toString() === "Invalid Date") {
  //         return b[typeName]?.localeCompare(a[typeName]);
  //       } else {
  //         return new Date(b[typeName]) - new Date(a[typeName]);
  //       }
  //     });
  //   } else {
  //     data.sort((a, b) => {
  //       if (new Date(a[typeName]).toString() === "Invalid Date") {
  //         return a[typeName]?.localeCompare(b[typeName]);
  //       } else {
  //         return new Date(a[typeName]) - new Date(b[typeName]);
  //       }
  //     });
  //   }
  //   setBodyData(data);

  //   if (typeof theadData[index] === "object") {
  //     let updatedHead = [...theadData]?.map((val, i) => {
  //       if (index === i) {
  //         val.type = type;
  //       } else {
  //         val.type = val.type === "" ? val.type : "N";
  //       }
  //       return val;
  //     });
  //     setTheadData(updatedHead);
  //   }
  // };

  const handleSortTable = (index, type) => {
  let typeName = Object?.keys(bodyData[0])[index];
  let data = [...bodyData];

  data.sort((a, b) => {
    let valA = a[typeName];
    let valB = b[typeName];

    // Try parsing as dates first
    let dateA = new Date(valA);
    let dateB = new Date(valB);
    let isDateA = !isNaN(dateA);
    let isDateB = !isNaN(dateB);

    if (isDateA && isDateB) {
      return type === "DESC" ? dateB - dateA : dateA - dateB;
    }

    // If both are numbers, compare numerically
    if (!isNaN(valA) && !isNaN(valB)) {
      return type === "DESC" ? valB - valA : valA - valB;
    }

    // Otherwise compare as strings (safe conversion)
    let strA = (valA ?? "").toString();
    let strB = (valB ?? "").toString();

    return type === "DESC"
      ? strB.localeCompare(strA)
      : strA.localeCompare(strB);
  });

  setBodyData(data);

  if (typeof theadData[index] === "object") {
    let updatedHead = [...theadData]?.map((val, i) => {
      if (index === i) {
        val.type = type;
      } else {
        val.type = val.type === "" ? val.type : "N";
      }
      return val;
    });
    setTheadData(updatedHead);
  }
};


  // handle Search Item
  const handleItemSearch = (e) => {
    setSearch(e?.target?.value);
    const results = tbody?.filter((obj) =>
      Object.values(obj)?.some(
        (value) =>
          typeof value === "string" &&
          value?.toLowerCase().includes(e?.target?.value.toLowerCase())
      )
    );
    setBodyData(results);
  };

  // Function to handle row click
  const handleRowClick = (rowRef, ele, index) => {
    getRowClick && getRowClick(ele, index);

    if (activeRowRef.current) {
      // Reset the previous active row to its original color
      const originalColor = activeRowRef.current.getAttribute(
        "data-original-color"
      );
      activeRowRef.current.style.backgroundColor = originalColor;
    }

    // Set the new active row style
    if (rowRef) {
      // Store the original color of the new active row
      rowRef.setAttribute("data-original-color", rowRef.style.backgroundColor);
      rowRef.style.backgroundColor = "lightblue";
      activeRowRef.current = rowRef;
    }
  };

  return (
    <>
      {tbody?.length > 0 && isSearch && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

          }}
          className="px-2"
        >
          <Input
            type="text"
            className="table-input my-1"
            respclass={"width-250"}
            removeFormGroupClass={true}
            placeholder={t("Search")}
            onChange={handleItemSearch}
          // placeholderLabel={<i className="fa fa-search search_icon" aria-hidden="true"></i>}
          />
          <div className="mb-0">
            <p className="text-bold mb-0">Total Count : {tbody?.length ? tbody?.length : 0}</p>
          </div>
        </div>
      )}
      {(bodyData?.length > 0 || search) && (
        <div
          id="no-more-tables"
          style={style}
          className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll`}
        >
          <div className="row">
            <div className="col-12">
              <Table className="mainTable pt-2  " bordered>
                <thead style={{ zIndex: 1 }}>
                  <tr>
                    {theadData?.map((headData, index) => (
                      <th
                        key={index}
                         id= {borderDark? "table-td-border" : ""}
                        style={{
                          width: headData?.width ? headData?.width : "",
                          textAlign: headData?.textAlign
                            ? headData?.textAlign
                            : "",
                          marginLeft: "3px",
                        }}
                        className={`${headData?.className ? headData?.className : ""}`}
                      >
                        {headData?.type === "" && (
                          <> {headData?.name ? headData.name : headData}</>
                        )}
                        {headData?.type === "N" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {headData?.name ? headData.name : headData}

                            <SortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "ASC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "DESC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <IncreaseIngSortSVGIcon />
                          </span>
                        )}
                        {headData?.type === "DESC" && (
                          <span
                            className="pointer-cursor"
                            onClick={() => {
                              handleSortTable(index, "ASC");
                            }}
                          >
                            {" "}
                            {headData?.name ? headData.name : headData}
                            <DecreaseIngSortSVGIcon />
                          </span>
                        )}
                        &nbsp;
                      </th>
                    ))}
                  </tr>
                </thead>
                {bodyData?.length > 0 ? (
                  <tbody style={{ backgroundColor: "white" }}>
                    {bodyData?.map((ele, index) => {
                      const keys = Object.keys(ele).filter(
                        (key) => key !== "colorcode"
                      );
                      const rowColor = ele.colorcode || "";
                      // console.log(rowColor)
                      return (
                        <tr
                          key={index}
                          className={getRowClass ? getRowClass(ele, index) : ""}
                          style={{ backgroundColor: rowColor }}
                          onClick={(e) =>
                            notSingleClick
                              ? handleRowClick(e.currentTarget, ele, index)
                              : undefined
                          }
                          onDoubleClick={(e) =>
                            handleDoubleClick && handleDoubleClick(ele, index, getWholeArray)
                          }
                        >
                          {keys?.map((bodyData, inx) => (
                            <td
                              key={inx}
                              id= {borderDark? "table-td-border" : ""}
                              data-title={
                                theadData[inx]?.name
                                  ? theadData[inx]?.name
                                  : theadData[inx]
                              }
                              style={{
                                width: WWW,
                                fontWeight: tdFontWeight
                                
                              }}
                              className={`
                            ${handleClassOnRow
                                  ? handleClassOnRow(
                                    ele,
                                    theadData[inx]?.name
                                      ? theadData[inx]?.name
                                      : theadData[inx]
                                  )
                                  : "px-2"
                                }`}
                            >
                              {ele[bodyData]?.label ? (
                                ele[bodyData]?.label
                              ) : ele[bodyData] ? (
                                ele[bodyData]
                              ) : (
                                <>&nbsp;</>
                              )}
                              {isMobile && <>&nbsp;</>}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <td colSpan="200" className="text-center">
                    {" "}
                    {t("No data found")}
                  </td>
                )}
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tables;
