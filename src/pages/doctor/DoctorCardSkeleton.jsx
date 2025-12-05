import React from "react";
import "./DisplayDoctor.css";

const DoctorCardSkeleton = () => {
  return (
    <div className="ak-doctor-card skeleton">
      <div className="ak-card-main">
        {/* Left image skeleton */}
        <div className="h-100 moh-p">
          <div className="ak-skeleton-img"></div>
          <div className="ak-skeleton-text short mt-2"></div>
        </div>

        {/* Doctor info skeleton */}
        <div className="ak-doctor-info">
          <div className="ak-skeleton-text"></div>
          <div className="ak-skeleton-text"></div>
          <div className="ak-skeleton-text"></div>
          <div className="ak-skeleton-text short"></div>

          <div className="ak-chips">
            <div className="ak-skeleton-chip"></div>
            <div className="ak-skeleton-chip"></div>
          </div>
        </div>

        {/* Patient list skeleton */}
        <div className="ak-appointments">
          <div className="ak-skeleton-text short"></div>
          <div className="ak-patient-list">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="ak-patient">
                <div className="ak-patient-name">
                  <div className="ak-skeleton-avatar"></div>
                  <div>
                    <div className="ak-skeleton-text short"></div>
                    <div className="ak-skeleton-text tiny"></div>
                  </div>
                </div>
                <div className="ak-skeleton-badge"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCardSkeleton;
