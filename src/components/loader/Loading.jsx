import React from "react";
import logoitdose from "../../assets/image/logoitdose.png";
import logo from "../../../public/img/logo2.png"
const Loading = ({ loading }) => {
  // if (!loading) return null;

  return (
    <div className="loading-overlay">
      <img src={logo} alt="Digital Vidya Saarthi" className="dvs-logo" />
      <div className="loadingio-spinner-spinner-nq4q5u6dq7r">
        <div className="ldio-x2uulkbinbj">
          {[...Array(21)].map((_, index) => (
            <div key={index}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
