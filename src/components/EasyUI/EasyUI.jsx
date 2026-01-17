import React, { useEffect, useRef } from "react";
import { DataGrid, GridColumn } from "rc-easyui";
import { useTranslation } from "react-i18next";

const EasyUI = ({
  dataBind,
  dataColoum,
  onClick,
  selectedIndex,
  setDataBind,
  cellCss,
}) => {
  console.log("dataBind" , dataBind)
  const [t] = useTranslation();
  const closeEassyUIRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeEassyUIRef.current &&
        !closeEassyUIRef.current.contains(event.target)
      ) {
        setDataBind && setDataBind([]); // Close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Reset classes for all rows
    const rows = document.querySelectorAll(".datagrid-body .datagrid-row");
    rows.forEach((row) => {
      row.classList.remove("selected-row");
    });

    // Apply class to selected row
    if (
      selectedIndex !== null &&
      selectedIndex >= 0 &&
      selectedIndex < dataBind.length
    ) {
      const selectedRow = rows[selectedIndex];
      if (selectedRow) selectedRow.classList.add("selected-row");
    }
  }, [selectedIndex, dataBind]);

  // 🔥 Keyboard Navigation Fix
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      const rows = document.querySelectorAll(".datagrid-body .datagrid-row");
      if (selectedIndex === rows.length - 1) {
        e.preventDefault(); // stop breaking layout
        // Optionally: move to next page instead of breaking
        // document.querySelector(".pagination-next")?.click();
      }
    }
  };

  const handleRowClick = (rowData) => {
    // Find the index of the clicked row in dataBind
    const index = dataBind.findIndex((item) => item === rowData);
    onClick(rowData, index);
  };

  return (
    <div ref={closeEassyUIRef} onKeyDown={handleKeyDown} tabIndex={0}>
      <style>
        {`
    .datagrid-view ::-webkit-scrollbar {
      height: 7px !important;   /* horizontal scrollbar height */
      width: 6px;    /* vertical scrollbar width */
    }
    .datagrid-view ::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 3px;
    }
    .datagrid-view ::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
    /* Optional: track styling */
    .datagrid-view ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
  `}
      </style>
      <DataGrid
        // style={{ maxHeight: 500 }}
        style={{
          maxHeight: 500,
          width: "100%",
          overflowX: "auto",
        }}
        pagination
        selectionMode="single"
        onRowClick={handleRowClick}
        data={dataBind}
        pagePosition="bottom"
        pageOptions={{
          layout: [
            "list",
            "sep",
            "first",
            "prev",
            "next",
            "last",
            "sep",
            "refresh",
            "sep",
            "manual",
            "info",
          ],
        }}
      >
        {dataColoum?.map((data, index) => {
         
          return (
            <GridColumn
              key={index}
              field={data?.field}
              title={t(data?.title)}
              // width={data?.width}
              width={data?.width || 500}
              cellCss={(row, value) => {
                return { backgroundColor: cellCss && cellCss(row, value) };
              }}
            />
          );
        })}
      </DataGrid>
    </div>
  );
};

export default EasyUI;