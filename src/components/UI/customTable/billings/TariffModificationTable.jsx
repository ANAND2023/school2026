import React from "react";
import Tables from "..";

const TariffModificationTable = ({ THEAD, tbody }) => {
  const getRowClass = (val) => {
    let newtbody = tbody?.find((item) => item?.Id === val?.id);

    if (newtbody?.ProposedGrossBill === 0) {
      return "color-indicator-2-bg";
    }
  };
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Sr No.": index + 1,
          Entrydate: item?.Entrydate,
          Category: item?.Category,
          SubCategory: item?.SubcategoryName,
          ItemName: item?.ItemName,
          "Current Gross Bill": (
            <div className="text-right">{item?.CurrentGrossBill}</div>
          ),

          TotalDiscAmt: <div className="text-right">{item?.TotalDiscAmt}</div>,
          "Proposed Gross Bill": (
            <div className="text-right">{item?.ProposedGrossBill}</div>
          ),
          "Proposed DiscAmt": (
            <div className="text-right">{item?.ProposedDiscAmt}</div>
          ),
          "Gross Amt Diff": (
            <div className="text-right">{item?.GrossAmtDiff}</div>
          ),
          id: item?.Id,
        }))}
        style={{ height: "auto" }}
        tableHeight={"scrollView"}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default TariffModificationTable;
