import React from "react";
import ReactSelect from "../../formComponent/ReactSelect";

const DynamicAssessmentSection = ({
  type,
  fields = [],
  state,
  setState,
  parseStringToLabelValueArray,
  sanitizeId,
  data,
  getColor,
}) => {
  // const TotalScore = (name, value, stateData) => {
  //   let total = Object.entries(stateData).reduce((acc, [key, obj]) => {
  //     if (key !== name && obj?.value) {
  //       acc += Number(obj.value);
  //     }
  //     return acc;
  //   }, 0);
  //   total += value?.value ? Number(value.value) : 0;
  //   return total;
  // };
   const TotalScore = (name, value, stateData) => {
  const excludedFields = ["Braden Scale Assessment for Adults", "Pressure ulcer present AT the TIME of admission "]; // keys to skip

  let total = Object.entries(stateData).reduce((acc, [key, obj]) => {
    console.log(key,"dgsgd")
    if (key !== name && !excludedFields.includes(key) && obj?.value) {
      acc += Number(obj.value);
    }
    return acc;
  }, 0);

  if (!excludedFields.includes(name)) {
    total += value?.value ? Number(value.value) : 0;
  }

  return total;
};

  

  const handleSelect = (name, value) => {
    const updatedState = {
      ...state,
      [name]: value,
      TotalScoreSum: TotalScore(name, value, state),
    };
    setState(updatedState);
  };

  return (
    <>
      {fields.map((field) => {
        const selectedValue = state?.[field.LabelName]?.value;

        if (type === "H" && field.ConditionOnAge) {
          const operator = field.ConditionOnAge?.[0];
          const ageValue = parseInt(field.ConditionOnAge?.slice(1));
          const patientAge = parseInt(data?.age?.split(" ")[0]);

          if (
            (operator === ">" && !(patientAge > ageValue)) ||
            (operator === "<" && !(patientAge < ageValue)) ||
            (operator === "=" && !(patientAge === ageValue))
          ) {
            return null;
          }
        }

        return (
          <div
            className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex align-items-center"
            key={field.Id}
          >
            <ReactSelect
              placeholderName={field.LabelName}
              id={sanitizeId(field.LabelName)}
              name={field.LabelName}
              value={selectedValue}
              removeIsClearable={false}
              handleChange={(name, value) => handleSelect(name, value)}
              dynamicOptions={parseStringToLabelValueArray(field?.Values)}
              searchable={true}
              respclass={`${!selectedValue ? "w-100" : "w-75"}`}
            />
            {selectedValue && (
              <div
                className="d-flex align-items-center mb-2 ml-2"
                style={{ gap: "8px", position: "relative" }}
              >
                <span className="hover-label">Score</span>
                <span
                  style={{
                    ...getColor(selectedValue),
                    fontSize: "12px",
                    border: "1px solid #B2B2B2",
                    borderRadius: "4px",
                    height: "24px",
                    minWidth: "40px",
                    padding: "0 10px",
                    textAlign: "center",
                    lineHeight: "24px",
                  }}
                >
                  {selectedValue}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Total Score */}
      {state?.TotalScoreSum > 0 && (
        <div className="col-xl-1 col-md-4 col-sm-4 col-12 d-flex align-items-center">
          <div
            className="d-flex align-items-center mb-2 ml-2 w-100"
            style={{ gap: "8px", position: "relative" }}
          >
            <span className="hover-label">Total Score</span>
            <span
              style={{
                ...getColor(state.TotalScoreSum),
                fontSize: "12px",
                border: "1px solid #B2B2B2",
                borderRadius: "4px",
                height: "24px",
                minWidth: "67px",
                padding: "0 10px",
                textAlign: "center",
                lineHeight: "24px",
              }}
            >
              {state.TotalScoreSum}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicAssessmentSection;
