import React, { useState } from 'react';

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('overview');

  const student = {
    name: "Rajesh Kumar",
    rollNo: "2024/CS/101",
    class: "10th Grade - Section A",
    dob: "15 March 2009",
    gender: "Male",
    bloodGroup: "O+",
    email: "rajesh.kumar@school.com",
    phone: "+91 98765 43210",
    address: "123, Model Town, Ludhiana, Punjab - 141001",
    admissionDate: "1 April 2023",
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"
  };

  const academics = {
    currentSemester: "Semester 2",
    overallPercentage: 87.5,
    rank: 5,
    totalStudents: 120,
    subjects: [
      { name: "Mathematics", marks: 92, total: 100, grade: "A+" },
      { name: "Science", marks: 88, total: 100, grade: "A" },
      { name: "English", marks: 85, total: 100, grade: "A" },
      { name: "Hindi", marks: 90, total: 100, grade: "A+" },
      { name: "Social Studies", marks: 82, total: 100, grade: "A" },
      { name: "Computer Science", marks: 95, total: 100, grade: "A+" }
    ]
  };

  const fees = {
    totalFees: 50000,
    paidAmount: 35000,
    pendingAmount: 15000,
    dueDate: "31 March 2025",
    payments: [
      { date: "15 July 2024", amount: 15000, receipt: "REC001" },
      { date: "20 October 2024", amount: 20000, receipt: "REC002" }
    ]
  };

  const attendance = {
    overall: 92,
    present: 165,
    absent: 14,
    late: 3,
    totalDays: 182,
    monthlyData: [
      { month: "July", percentage: 95 },
      { month: "August", percentage: 90 },
      { month: "September", percentage: 88 },
      { month: "October", percentage: 94 },
      { month: "November", percentage: 91 },
      { month: "December", percentage: 93 }
    ]
  };

  const siblings = [
    { name: "Priya Kumar", class: "8th Grade", rollNo: "2024/CS/205" },
    { name: "Amit Kumar", class: "6th Grade", rollNo: "2024/CS/310" }
  ];

  const parents = {
    father: {
      name: "Mr. Suresh Kumar",
      occupation: "Business Owner",
      phone: "+91 98765 11111",
      email: "suresh.kumar@email.com"
    },
    mother: {
      name: "Mrs. Sunita Kumar",
      occupation: "Teacher",
      phone: "+91 98765 22222",
      email: "sunita.kumar@email.com"
    }
  };

  const achievements = [
    { title: "Science Olympiad - Gold Medal", date: "Nov 2024" },
    { title: "Math Competition - 2nd Place", date: "Oct 2024" },
    { title: "Best Student Award", date: "Sep 2024" }
  ];

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      
      <style>{`
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px 0;
        }
        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 0 100px;
          margin-bottom: -80px;
          border-radius: 15px 15px 0 0;
        }
        .profile-img {
          width: 150px;
          height: 150px;
          border: 5px solid white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .stat-card h2 {
          font-size: 2.5rem;
          margin: 0;
        }
        .card-custom {
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .badge-custom {
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: 500;
        }
        .progress-custom {
          height: 30px;
          border-radius: 15px;
          font-weight: bold;
        }
        .nav-pills .nav-link {
          border-radius: 10px;
          margin: 0 5px;
          font-weight: 500;
        }
        .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .info-row {
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .grade-badge {
          min-width: 50px;
        }
        .subject-card {
          transition: all 0.3s;
        }
        .subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="container">
        {/* Header Section */}
        <div className="card card-custom">
          <div className="profile-header">
            <div className="container text-center text-white">
              <h1 className="display-4 fw-bold mb-2">Student Profile</h1>
              <p className="lead">Complete Academic & Personal Information</p>
            </div>
          </div>
          
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-3 text-center mb-4 mb-md-0">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="rounded-circle profile-img"
                />
              </div>
              
              <div className="col-md-6 mb-4 mb-md-0">
                <h2 className="fw-bold mb-1">{student.name}</h2>
                <p className="text-muted mb-2">Roll No: {student.rollNo}</p>
                <p className="text-muted mb-3">{student.class}</p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-success badge-custom">Active Student</span>
                  <span className="badge bg-primary badge-custom">Rank #{academics.rank}</span>
                  <span className="badge bg-info badge-custom">{academics.overallPercentage}% Average</span>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-card">
                      <h2>{attendance.overall}%</h2>
                      <small>Attendance</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card">
                      <h2>{academics.overallPercentage}%</h2>
                      <small>Grade</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card card-custom mt-4">
          <div className="card-body">
            <ul className="nav nav-pills justify-content-center flex-wrap">
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-person-circle me-2"></i>Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center ${activeTab === 'academics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('academics')}
                >
                  <i className="bi bi-book me-2"></i>Academics
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center ${activeTab === 'fees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fees')}
                >
                  <i className="bi bi-currency-rupee me-2"></i>Fees
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link d-flex align-items-center ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                >
                  <i className="bi bi-calendar-check me-2"></i>Attendance
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link  d-flex align-items-center ${activeTab === 'family' ? 'active' : ''}`}
                  onClick={() => setActiveTab('family')}
                >
                  <i className="bi bi-people me-2"></i>Family
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div className="row mt-4">
            {/* Personal Information */}
            <div className="col-lg-6">
              <div className="card card-custom">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-person-vcard me-2"></i>
                    <span>Personal Information</span>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="info-row d-flex justify-content-between">
                    <strong>Date of Birth:</strong>
                    <span>{student.dob}</span>
                  </div>
                  <div className="info-row d-flex justify-content-between">
                    <strong>Gender:</strong>
                    <span>{student.gender}</span>
                  </div>
                  <div className="info-row d-flex justify-content-between">
                    <strong>Blood Group:</strong>
                    <span className="badge bg-danger">{student.bloodGroup}</span>
                  </div>
                  <div className="info-row d-flex justify-content-between">
                    <strong>Admission Date:</strong>
                    <span>{student.admissionDate}</span>
                  </div>
                  <div className="info-row">
                    <strong><i className="bi bi-envelope me-2"></i>Email:</strong>
                    <div className="text-muted">{student.email}</div>
                  </div>
                  <div className="info-row">
                    <strong><i className="bi bi-telephone me-2"></i>Phone:</strong>
                    <div className="text-muted">{student.phone}</div>
                  </div>
                  <div className="info-row">
                    <strong><i className="bi bi-geo-alt me-2"></i>Address:</strong>
                    <div className="text-muted">{student.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="col-lg-6">
              <div className="card card-custom">
                <div className="card-header bg-warning text-dark">

                     <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-person-vcard me-2"></i>
                    <span>Achievements</span>
                  </h5>
                  {/* <h5 className="mb-0">
                    <i className="bi bi-trophy me-2"></i>Achievements
                  </h5> */}
                </div>
                <div className="card-body">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="alert alert-warning mb-3" role="alert">
                      <h6 className="alert-heading">
                        <i className="bi bi-award me-2"></i>{achievement.title}
                      </h6>
                      <small className="text-muted">{achievement.date}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="col-12 mt-3">
              <div className="card card-custom">
                <div className="card-header bg-info text-white">
                      <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-person-vcard me-2"></i>
                    <span>Quick Overview</span>
                  </h5>
                  {/* <h5 className="mb-0">
                    <i className="bi bi-speedometer2 me-2"></i>Quick Overview
                  </h5> */}
                </div>
                <div className="card-body">
                  <div className="row text-center g-3">
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-primary bg-opacity-10 rounded">
                        <i className="bi bi-book-fill text-primary fs-1"></i>
                        <h3 className="mt-2 mb-0">6</h3>
                        <small className="text-muted">Subjects</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-success bg-opacity-10 rounded">
                        <i className="bi bi-calendar-check-fill text-success fs-1"></i>
                        <h3 className="mt-2 mb-0">{attendance.present}</h3>
                        <small className="text-muted">Present Days</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-warning bg-opacity-10 rounded">
                        <i className="bi bi-graph-up text-warning fs-1"></i>
                        <h3 className="mt-2 mb-0">#{academics.rank}</h3>
                        <small className="text-muted">Class Rank</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-info bg-opacity-10 rounded">
                        <i className="bi bi-percent text-info fs-1"></i>
                        <h3 className="mt-2 mb-0">{academics.overallPercentage}%</h3>
                        <small className="text-muted">Percentage</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academics' && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-journal-text me-2"></i>Academic Performance
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                      <div className="alert alert-primary mb-0">
                        <small className="d-block">Current Semester</small>
                        <h5 className="mb-0">{academics.currentSemester}</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-success mb-0">
                        <small className="d-block">Overall %</small>
                        <h5 className="mb-0">{academics.overallPercentage}%</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-warning mb-0">
                        <small className="d-block">Class Rank</small>
                        <h5 className="mb-0">#{academics.rank}</h5>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-info mb-0">
                        <small className="d-block">Total Students</small>
                        <h5 className="mb-0">{academics.totalStudents}</h5>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Subject-wise Performance</h6>
                  {academics.subjects.map((subject, index) => (
                    <div key={index} className="card mb-3 subject-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{subject.name}</h6>
                          <span className={`badge grade-badge ${
                            subject.grade === 'A+' ? 'bg-success' :
                            subject.grade === 'A' ? 'bg-primary' : 'bg-warning'
                          }`}>
                            {subject.grade}
                          </span>
                        </div>
                        <div className="progress progress-custom">
                          <div
                            className="progress-bar bg-gradient"
                            style={{
                              width: `${(subject.marks / subject.total) * 100}%`,
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                            }}
                          >
                            {subject.marks}/{subject.total}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-currency-rupee me-2"></i>Fee Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="alert alert-primary border-start border-5 border-primary">
                        <small>Total Fees</small>
                        <h3 className="mb-0">₹{fees.totalFees.toLocaleString()}</h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="alert alert-success border-start border-5 border-success">
                        <small>Paid Amount</small>
                        <h3 className="mb-0">₹{fees.paidAmount.toLocaleString()}</h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="alert alert-danger border-start border-5 border-danger">
                        <small>Pending Amount</small>
                        <h3 className="mb-0">₹{fees.pendingAmount.toLocaleString()}</h3>
                        <small className="text-muted">Due: {fees.dueDate}</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Payment Progress</strong>
                      <strong>{((fees.paidAmount / fees.totalFees) * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="progress" style={{height: '30px'}}>
                      <div
                        className="progress-bar bg-success"
                        style={{width: `${(fees.paidAmount / fees.totalFees) * 100}%`}}
                      >
                        <strong>₹{fees.paidAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Payment History</h6>
                  {fees.payments.map((payment, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-4">
                            <h5 className="mb-0 text-success">₹{payment.amount.toLocaleString()}</h5>
                            <small className="text-muted">{payment.date}</small>
                          </div>
                          <div className="col-md-4">
                            <span className="badge bg-primary">Receipt: {payment.receipt}</span>
                          </div>
                          <div className="col-md-4 text-end">
                            <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center">
                              <i className="bi bi-download me-1"></i>Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-calendar-check me-2"></i>Attendance Record
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 mb-4 text-center">
                    <div className="col-md-3 col-6">
                      <div className="alert alert-success mb-0">
                        <h2 className="mb-0">{attendance.overall}%</h2>
                        <small>Overall</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-primary mb-0">
                        <h2 className="mb-0">{attendance.present}</h2>
                        <small>Present Days</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-danger mb-0">
                        <h2 className="mb-0">{attendance.absent}</h2>
                        <small>Absent Days</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="alert alert-warning mb-0">
                        <h2 className="mb-0">{attendance.late}</h2>
                        <small>Late Arrivals</small>
                      </div>
                    </div>
                  </div>

                  <h6 className="mb-3">Monthly Attendance</h6>
                  {attendance.monthlyData.map((month, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>{month.month}</strong>
                        <strong>{month.percentage}%</strong>
                      </div>
                      <div className="progress" style={{height: '30px'}}>
                        <div
                          className={`progress-bar ${
                            month.percentage >= 90 ? 'bg-success' :
                            month.percentage >= 75 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{width: `${month.percentage}%`}}
                        >
                          {month.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-people me-2"></i>Parent Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card bg-primary bg-opacity-10">
                        <div className="card-body">
                          <h5 className="card-title text-primary">
                            <i className="bi bi-person-fill me-2"></i>Father Details
                          </h5>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Name:</strong>
                            <span>{parents.father.name}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Occupation:</strong>
                            <span>{parents.father.occupation}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Phone:</strong>
                            <span>{parents.father.phone}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Email:</strong>
                            <span className="text-break">{parents.father.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card bg-danger bg-opacity-10">
                        <div className="card-body">
                          <h5 className="card-title text-danger">
                            <i className="bi bi-person-fill me-2"></i>Mother Details
                          </h5>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Name:</strong>
                            <span>{parents.mother.name}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Occupation:</strong>
                            <span>{parents.mother.occupation}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Phone:</strong>
                            <span>{parents.mother.phone}</span>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <strong>Email:</strong>
                            <span className="text-break">{parents.mother.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-3">
              <div className="card card-custom">
                <div className="card-header bg-warning">
                  <h5 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>Siblings
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {siblings.map((sibling, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <div className="card bg-warning bg-opacity-10">
                          <div className="card-body">
                            <h6 className="card-title">{sibling.name}</h6>
                            <p className="mb-1"><strong>Class:</strong> {sibling.class}</p>
                            <p className="mb-0"><strong>Roll No:</strong> {sibling.rollNo}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
}


// import React, { useState } from 'react';
// import { User, Book, Calendar, Users, DollarSign, Award, Phone, Mail, MapPin, TrendingUp, Clock } from 'lucide-react';

// export default function StudentProfile() {
//   const [activeTab, setActiveTab] = useState('overview');

//   const student = {
//     name: "Rajesh Kumar",
//     rollNo: "2024/CS/101",
//     class: "10th Grade - Section A",
//     dob: "15 March 2009",
//     gender: "Male",
//     bloodGroup: "O+",
//     email: "rajesh.kumar@school.com",
//     phone: "+91 98765 43210",
//     address: "123, Model Town, Ludhiana, Punjab - 141001",
//     admissionDate: "1 April 2023",
//     photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop"
//   };

//   const academics = {
//     currentSemester: "Semester 2",
//     overallPercentage: 87.5,
//     rank: 5,
//     totalStudents: 120,
//     subjects: [
//       { name: "Mathematics", marks: 92, total: 100, grade: "A+" },
//       { name: "Science", marks: 88, total: 100, grade: "A" },
//       { name: "English", marks: 85, total: 100, grade: "A" },
//       { name: "Hindi", marks: 90, total: 100, grade: "A+" },
//       { name: "Social Studies", marks: 82, total: 100, grade: "A" },
//       { name: "Computer Science", marks: 95, total: 100, grade: "A+" }
//     ]
//   };

//   const fees = {
//     totalFees: 50000,
//     paidAmount: 35000,
//     pendingAmount: 15000,
//     dueDate: "31 March 2025",
//     payments: [
//       { date: "15 July 2024", amount: 15000, receipt: "REC001" },
//       { date: "20 October 2024", amount: 20000, receipt: "REC002" }
//     ]
//   };

//   const attendance = {
//     overall: 92,
//     present: 165,
//     absent: 14,
//     late: 3,
//     totalDays: 182,
//     monthlyData: [
//       { month: "July", percentage: 95 },
//       { month: "August", percentage: 90 },
//       { month: "September", percentage: 88 },
//       { month: "October", percentage: 94 },
//       { month: "November", percentage: 91 },
//       { month: "December", percentage: 93 }
//     ]
//   };

//   const siblings = [
//     { name: "Priya Kumar", class: "8th Grade", rollNo: "2024/CS/205" },
//     { name: "Amit Kumar", class: "6th Grade", rollNo: "2024/CS/310" }
//   ];

//   const parents = {
//     father: {
//       name: "Mr. Suresh Kumar",
//       occupation: "Business Owner",
//       phone: "+91 98765 11111",
//       email: "suresh.kumar@email.com"
//     },
//     mother: {
//       name: "Mrs. Sunita Kumar",
//       occupation: "Teacher",
//       phone: "+91 98765 22222",
//       email: "sunita.kumar@email.com"
//     }
//   };

//   const achievements = [
//     { title: "Science Olympiad - Gold Medal", date: "Nov 2024" },
//     { title: "Math Competition - 2nd Place", date: "Oct 2024" },
//     { title: "Best Student Award", date: "Sep 2024" }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
//           <div className="px-6 pb-6">
//             <div className="flex flex-col md:flex-row items-center md:items-start -mt-16 md:-mt-20">
//               <img
//                 src={student.photo}
//                 alt={student.name}
//                 className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
//               />
//               <div className="mt-4 md:mt-8 md:ml-6 text-center md:text-left flex-1">
//                 <h1 className="text-3xl font-bold text-gray-800">{student.name}</h1>
//                 <p className="text-gray-600 mt-1">Roll No: {student.rollNo}</p>
//                 <p className="text-gray-600">{student.class}</p>
//                 <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
//                   <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//                     Active Student
//                   </span>
//                   <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                     Rank #{academics.rank}
//                   </span>
//                   <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
//                     {academics.overallPercentage}% Average
//                   </span>
//                 </div>
//               </div>
//               <div className="mt-4 md:mt-8 grid grid-cols-2 gap-4 text-center">
//                 <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl text-white">
//                   <div className="text-3xl font-bold">{attendance.overall}%</div>
//                   <div className="text-sm opacity-90">Attendance</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl text-white">
//                   <div className="text-3xl font-bold">{academics.overallPercentage}%</div>
//                   <div className="text-sm opacity-90">Grade</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
//           <div className="flex flex-wrap gap-2">
//             {['overview', 'academics', 'fees', 'attendance', 'family'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-3 rounded-lg font-medium transition-all ${
//                   activeTab === tab
//                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content Sections */}
//         {activeTab === 'overview' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Personal Information */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-4">
//                 <User className="w-6 h-6 text-blue-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
//               </div>
//               <div className="space-y-3">
//                 <InfoRow label="Date of Birth" value={student.dob} />
//                 <InfoRow label="Gender" value={student.gender} />
//                 <InfoRow label="Blood Group" value={student.bloodGroup} />
//                 <InfoRow label="Admission Date" value={student.admissionDate} />
//                 <div className="flex items-start pt-2">
//                   <Mail className="w-4 h-4 text-gray-400 mt-1 mr-2" />
//                   <div className="flex-1">
//                     <div className="text-sm text-gray-500">Email</div>
//                     <div className="text-gray-800">{student.email}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Phone className="w-4 h-4 text-gray-400 mt-1 mr-2" />
//                   <div className="flex-1">
//                     <div className="text-sm text-gray-500">Phone</div>
//                     <div className="text-gray-800">{student.phone}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2" />
//                   <div className="flex-1">
//                     <div className="text-sm text-gray-500">Address</div>
//                     <div className="text-gray-800">{student.address}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Achievements */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-4">
//                 <Award className="w-6 h-6 text-yellow-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
//               </div>
//               <div className="space-y-3">
//                 {achievements.map((achievement, index) => (
//                   <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
//                     <Award className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
//                     <div>
//                       <div className="font-semibold text-gray-800">{achievement.title}</div>
//                       <div className="text-sm text-gray-600">{achievement.date}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Overview</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <StatCard icon={<Book />} label="Subjects" value="6" color="blue" />
//                 <StatCard icon={<Calendar />} label="Present Days" value={attendance.present} color="green" />
//                 <StatCard icon={<Users />} label="Class Rank" value={`#${academics.rank}`} color="purple" />
//                 <StatCard icon={<TrendingUp />} label="Percentage" value={`${academics.overallPercentage}%`} color="orange" />
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'academics' && (
//           <div className="space-y-6">
//             {/* Academic Overview */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <Book className="w-6 h-6 text-blue-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Academic Performance</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
//                   <div className="text-sm text-blue-600 font-medium">Current Semester</div>
//                   <div className="text-2xl font-bold text-blue-800 mt-1">{academics.currentSemester}</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
//                   <div className="text-sm text-green-600 font-medium">Overall %</div>
//                   <div className="text-2xl font-bold text-green-800 mt-1">{academics.overallPercentage}%</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
//                   <div className="text-sm text-purple-600 font-medium">Class Rank</div>
//                   <div className="text-2xl font-bold text-purple-800 mt-1">#{academics.rank}</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
//                   <div className="text-sm text-orange-600 font-medium">Total Students</div>
//                   <div className="text-2xl font-bold text-orange-800 mt-1">{academics.totalStudents}</div>
//                 </div>
//               </div>

//               {/* Subject-wise Performance */}
//               <div className="space-y-3">
//                 {academics.subjects.map((subject, index) => (
//                   <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold text-gray-800">{subject.name}</h3>
//                       <span className={`px-3 py-1 rounded-full text-sm font-bold ${
//                         subject.grade === 'A+' ? 'bg-green-100 text-green-700' :
//                         subject.grade === 'A' ? 'bg-blue-100 text-blue-700' :
//                         'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {subject.grade}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="flex-1 bg-gray-200 rounded-full h-3">
//                         <div
//                           className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
//                           style={{ width: `${(subject.marks / subject.total) * 100}%` }}
//                         ></div>
//                       </div>
//                       <span className="font-bold text-gray-700 min-w-[80px] text-right">
//                         {subject.marks}/{subject.total}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'fees' && (
//           <div className="space-y-6">
//             {/* Fee Overview */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <DollarSign className="w-6 h-6 text-green-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Fee Details</h2>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
//                   <div className="text-sm text-blue-600 font-medium">Total Fees</div>
//                   <div className="text-3xl font-bold text-blue-800 mt-2">₹{fees.totalFees.toLocaleString()}</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
//                   <div className="text-sm text-green-600 font-medium">Paid Amount</div>
//                   <div className="text-3xl font-bold text-green-800 mt-2">₹{fees.paidAmount.toLocaleString()}</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-500">
//                   <div className="text-sm text-red-600 font-medium">Pending Amount</div>
//                   <div className="text-3xl font-bold text-red-800 mt-2">₹{fees.pendingAmount.toLocaleString()}</div>
//                   <div className="text-xs text-red-600 mt-1">Due: {fees.dueDate}</div>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="mb-6">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-sm font-medium text-gray-600">Payment Progress</span>
//                   <span className="text-sm font-bold text-gray-800">
//                     {((fees.paidAmount / fees.totalFees) * 100).toFixed(1)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-4">
//                   <div
//                     className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
//                     style={{ width: `${(fees.paidAmount / fees.totalFees) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Payment History */}
//               <div>
//                 <h3 className="font-bold text-gray-800 mb-3">Payment History</h3>
//                 <div className="space-y-3">
//                   {fees.payments.map((payment, index) => (
//                     <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
//                       <div>
//                         <div className="font-semibold text-gray-800">₹{payment.amount.toLocaleString()}</div>
//                         <div className="text-sm text-gray-600">{payment.date}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xs text-gray-500">Receipt No.</div>
//                         <div className="text-sm font-mono text-gray-700">{payment.receipt}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'attendance' && (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <Calendar className="w-6 h-6 text-green-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Attendance Record</h2>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
//                   <div className="text-3xl font-bold text-green-700">{attendance.overall}%</div>
//                   <div className="text-sm text-green-600 mt-1">Overall</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
//                   <div className="text-3xl font-bold text-blue-700">{attendance.present}</div>
//                   <div className="text-sm text-blue-600 mt-1">Present Days</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg text-center">
//                   <div className="text-3xl font-bold text-red-700">{attendance.absent}</div>
//                   <div className="text-sm text-red-600 mt-1">Absent Days</div>
//                 </div>
//                 <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
//                   <div className="text-3xl font-bold text-yellow-700">{attendance.late}</div>
//                   <div className="text-sm text-yellow-600 mt-1">Late Arrivals</div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-bold text-gray-800 mb-3">Monthly Attendance</h3>
//                 <div className="space-y-3">
//                   {attendance.monthlyData.map((month, index) => (
//                     <div key={index} className="flex items-center gap-4">
//                       <div className="w-24 text-sm font-medium text-gray-600">{month.month}</div>
//                       <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
//                         <div
//                           className={`h-8 rounded-full flex items-center justify-end pr-3 text-white font-bold text-sm transition-all ${
//                             month.percentage >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                             month.percentage >= 75 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
//                             'bg-gradient-to-r from-red-400 to-red-600'
//                           }`}
//                           style={{ width: `${month.percentage}%` }}
//                         >
//                           {month.percentage}%
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'family' && (
//           <div className="space-y-6">
//             {/* Parents Information */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <Users className="w-6 h-6 text-purple-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Parent Information</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="border rounded-lg p-5 bg-blue-50">
//                   <h3 className="font-bold text-lg text-blue-800 mb-3">Father Details</h3>
//                   <div className="space-y-2">
//                     <InfoRow label="Name" value={parents.father.name} />
//                     <InfoRow label="Occupation" value={parents.father.occupation} />
//                     <InfoRow label="Phone" value={parents.father.phone} />
//                     <InfoRow label="Email" value={parents.father.email} />
//                   </div>
//                 </div>
//                 <div className="border rounded-lg p-5 bg-pink-50">
//                   <h3 className="font-bold text-lg text-pink-800 mb-3">Mother Details</h3>
//                   <div className="space-y-2">
//                     <InfoRow label="Name" value={parents.mother.name} />
//                     <InfoRow label="Occupation" value={parents.mother.occupation} />
//                     <InfoRow label="Phone" value={parents.mother.phone} />
//                     <InfoRow label="Email" value={parents.mother.email} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Siblings Information */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center mb-6">
//                 <Users className="w-6 h-6 text-orange-600 mr-2" />
//                 <h2 className="text-xl font-bold text-gray-800">Siblings</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {siblings.map((sibling, index) => (
//                   <div key={index} className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
//                     <h3 className="font-bold text-gray-800">{sibling.name}</h3>
//                     <p className="text-sm text-gray-600 mt-1">{sibling.class}</p>
//                     <p className="text-sm text-gray-600">Roll No: {sibling.rollNo}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex justify-between items-center py-2 border-b border-gray-100">
//       <span className="text-sm text-gray-600">{label}</span>
//       <span className="text-sm font-semibold text-gray-800">{value}</span>
//     </div>
//   );
// }

// function StatCard({ icon, label, value, color }) {
//   const colorClasses = {
//     blue: 'from-blue-400 to-blue-600',
//     green: 'from-green-400 to-green-600',
//     purple: 'from-purple-400 to-purple-600',
//     orange: 'from-orange-400 to-orange-600'
//   };

//   return (
//     <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl text-white text-center`}>
//       <div className="flex justify-center mb-2">{React.cloneElement(icon, { className: 'w-8 h-8' })}</div>
//       <div className="text-3xl font-bold">{value}</div>
//       <div className="text-sm opacity-90 mt-1">{label}</div>
//     </div>
//   );
// }