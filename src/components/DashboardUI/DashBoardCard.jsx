import React from 'react'

const DashBoardCard = () => {
  return (
 
  <div
   className="row "
  >
    <div 
    className="col-xl-3 col-lg-3"
    >
      <div
       className="dashcard "
      //  className="dashcard l-bg-cherry"
       >
        <div className="dashcard-statistic-3 p-4">
          <div className="dashcard-icon dashcard-icon-large">
            <i className="fas fa-shopping-cart"></i>
          </div>

          <div className="mb-4">
            <h5 className="dashcard-title mb-0">New Orders</h5>
          </div>

          <div className="row align-items-center mb-2 d-flex">
            <div className="col-8">
              <h2 className="d-flex align-items-center mb-0">3,243</h2>
            </div>
            <div className="col-4 text-end">
              <span>
                12.5% <i className="fa fa-arrow-up"></i>
              </span>
            </div>
          </div>

          <div className="progress mt-1" style={{ height: "8px" }}>
            <div
              className="progress-bar l-bg-cyan"
              role="progressbar"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-xl-3 col-lg-3">
      <div
       className="dashcard "
      //  className="dashcard l-bg-blue-dark"
       >
        <div className="dashcard-statistic-3 p-4">
          <div className="dashcard-icon dashcard-icon-large">
            <i className="fas fa-users"></i>
          </div>

          <div className="mb-4">
            <h5 className="dashcard-title mb-0">Customers</h5>
          </div>

          <div className="row align-items-center mb-2 d-flex">
            <div className="col-8">
              <h2 className="d-flex align-items-center mb-0">15.07k</h2>
            </div>
            <div className="col-4 text-end">
              <span>
                9.23% <i className="fa fa-arrow-up"></i>
              </span>
            </div>
          </div>

          <div className="progress mt-1" style={{ height: "8px" }}>
            <div
              className="progress-bar l-bg-green"
              role="progressbar"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-xl-3 col-lg-3">
      <div
       className="dashcard "
      //  className="dashcard l-bg-green-dark"
       >
        <div className="dashcard-statistic-3 p-4">
          <div className="dashcard-icon dashcard-icon-large">
            <i className="fas fa-ticket-alt"></i>
          </div>

          <div className="mb-4">
            <h5 className="dashcard-title mb-0">Ticket Resolved</h5>
          </div>

          <div className="row align-items-center mb-2 d-flex">
            <div className="col-8">
              <h2 className="d-flex align-items-center mb-0">578</h2>
            </div>
            <div className="col-4 text-end">
              <span>
                10% <i className="fa fa-arrow-up"></i>
              </span>
            </div>
          </div>

          <div className="progress mt-1">
            <div
              className="progress-bar l-bg-orange"
              role="progressbar"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-xl-3 col-lg-3">
      <div 
      className="dashcard "
      // className="dashcard l-bg-orange-dark"
      >
        <div className="dashcard-statistic-3 p-4">
          <div className="dashcard-icon dashcard-icon-large">
            <i className="fas fa-dollar-sign"></i>
          </div>

          <div className="mb-4">
            <h5 className="dashcard-title mb-0">Revenue Today</h5>
          </div>

          <div className="row align-items-center mb-2 d-flex">
            <div className="col-8">
              <h2 className="d-flex align-items-center mb-0">$11.61k</h2>
            </div>
            <div className="col-4 text-end">
              <span>
                2.5% <i className="fa fa-arrow-up"></i>
              </span>
            </div>
          </div>

          <div className="progress mt-1">
            <div
              className="progress-bar l-bg-cyan"
              role="progressbar"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  )
}

export default DashBoardCard