
// import React, { useState } from "react";
// import "@app/assets/css/login.css";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// // import logo from "@app/assets/image/logo.png"; // Ensure path is correct
// import  logo from "../../../public/img/DIGITALV-removebg-preview.7c847aad42c53321dc7e (1).png"
// import { useDispatch } from "react-redux";
// import { useFormik } from "formik";
// import { notify } from "../../utils/utils";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
// import { speakMessage } from "../../utils/ustil2";
// import ILLUSTRATION_URL from "@app/assets/image/login-image.png";
// import { adminlogin } from "../../networkServices/Admin";
// import { FaUser } from "react-icons/fa";
// import { MdKey } from "react-icons/md";
// import { IoIosEye, IoIosEyeOff } from "react-icons/io";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();



//    const [showPassword, setShowPassword] = useState(false);
// const [values,setValues]=useState({
//   userName:""
// ,password:""
// })
// const handleChange=(e)=>{
//   const {name,value}=e.target;
//   setValues({ ...values, [name]: value });
// }
//  const clickPassword = () => {
//         setShowPassword((prev) => !prev);
//     };
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   const paylod={
//     userNameOrEmail:values.userName,
//     password:values.password
//   }

//   console.log("paylod",paylod);
// try {
//   const response=await adminlogin(paylod);
//   if(response?.success){
//     debugger
//     notify("Login Successfully", "success");
//     speakMessage(`Welcome ${"Login Successfully" ||""}`); 
//      useLocalStorage("userData", "set", response?.data?.userDetails);
//           useLocalStorage("token", "set", response?.data?.accessToken);
//           useLocalStorage("ip", "set", "10.0.2.175")
//           Navigate("/dashboard");
//   }
//   else{
//     notify(response?.message, "error");
//   }
// } catch (error) {
//   console.log("error",error);
// }
// }


//   return (
//     <div className="container-fluid vh-100">
//   <div className="row h-100">

//     {/* LEFT SECTION */}
//     <div className="col-md-7 d-none d-md-flex flex-column justify-content-center align-items-center bg-white border-end">
//       <img src={logo} alt="logo" style={{ height: 180 }} className="mb-4" />

//       <h3 className="fw-bold text-center">
//         <span className="text-primary">VIDYAALAY</span>{" "}
//         <span className="text-danger">MANAGEMENT</span>
//       </h3>

//       <p className="text-muted mt-2 text-center px-5">
//         Smart School ERP to manage Academics, Administration & Growth
//       </p>
//     </div>

//     {/* RIGHT LOGIN CARD */}
//     <div
//      className="col-md-5 d-flex align-items-center justify-content-center "
//      >
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ width: "100%", maxWidth: 420, borderRadius: 12 }}
//       >
//         {/* LOGO */}
//         <div className="text-center mb-3">
//           <img src={logo} alt="logo" height={70} />
//         </div>

//         <h5 className="text-center fw-semibold">
//           Welcome to{" "}
//           <span className="text-danger">DigitalVidyaSaarthi</span>
//         </h5>

//         <p className="text-center text-muted small mb-4">
//           Innovate, Automate, Educate with ease
//         </p>

//         <form onSubmit={handleSubmit}>

//           {/* USERNAME */}
//           <div className="mb-3">
//             <div 
//             className="input-group"
//             >
//               <span className="input-group-text bg-white "
//               style={{height:'32px'}}
//               >
//                 <FaUser className="text-muted " />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter User ID"
//                 name="userName"
//                 value={values.userName}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div className="mb-4">
//             <div className="input-group">
//               <span className="input-group-text bg-white"style={{height:'32px'}}>
//                 <MdKey className="text-muted" />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="form-control"
//                 placeholder="Enter Password"
//                 name="password"
//                 value={values.password}
//                 onChange={handleChange}
//               />
//               <span
//                 className="input-group-text bg-white cursor-pointer"
//                 onClick={clickPassword}
//                 style={{height:'32px'}}
//               >
//                 {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
//               </span>
//             </div>
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="btn btn-primary w-100 fw-semibold py-3"
//             // style={{ borderRadius: 1}}
//           >
//             LOGIN
//           </button>
//         </form>
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };

// export default Login;

// import React, { useState } from "react";
// import "@app/assets/css/login.css";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import logo from "@app/assets/image/logo.png"; // Ensure path is correct
// import { useDispatch } from "react-redux";
// import { useFormik } from "formik";
// import { notify } from "../../utils/utils";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
// import { speakMessage } from "../../utils/ustil2";
// import ILLUSTRATION_URL from "@app/assets/image/login-image.png";
// import { adminlogin } from "../../networkServices/Admin";

// // Optional: You can use a local image or a URL for the illustration
// // If you don't have the specific vector, I've used a placeholder URL below
// // const ILLUSTRATION_URL = "https://cdni.iconscout.com/illustration/premium/thumb/female-student-attending-online-class-illustration-download-in-svg-png-gif-file-formats--virtual-learning-study-education-e-pack-school-illustrations-4437887.png";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();



  
// const [values,setValues]=useState({
//   userName:""
// ,password:""
// })
// const handleChange=(e)=>{
//   const {name,value}=e.target;
//   setValues({ ...values, [name]: value });
// }
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   const paylod={
//     userNameOrEmail:values.userName,
//     password:values.password
//   }

//   console.log("paylod",paylod);
// try {
//   const response=await adminlogin(paylod);
//   if(response?.success){
//     debugger
//     notify("Login Successfully", "success");
//     speakMessage(`Welcome ${"Login Successfully" ||""}`); 
//           Navigate("/dashboard");
//   }
//   else{
//     notify(response?.message, "error");
//   }
// } catch (error) {
//   console.log("error",error);
// }
// }


//   return (
//     <div className="login-page-wrapper">
      
//       {/* LEFT SIDE: Blue Background with Illustration */}
//       <div className="login-left-section">
//         <div className="brand-name">Digital Vidya Saarthi</div>
        
//         <div className="illustration-container">
//           <img src={
//             ILLUSTRATION_URL
//             } alt="Login Illustration" className="hero-image" />
//         </div>

//         <div className="left-content-text">
//           <h1>A few more clicks to <br/> sign in to your account.</h1>
//         </div>

//         {/* The White Curve Overlay */}
//         <div className="curve-overlay"></div>
//       </div>

//       {/* RIGHT SIDE: White Background with Form */}
//       <div className="login-right-section">
//         <div className="form-container">
          
//           <div className="header-text">
//             <h2>Samaritans English Medium Sr. Sec. School</h2>
//             <p className="sub-header">Parents & Students Sign In</p>
//           </div>

//           <form onSubmit={handleSubmit} className="login-form">
            
//             <div className="input-group">
//               <input
//                 type="text"
//                 id="userName"
//                 name="userName"
//                 className="custom-input"
//                 placeholder="User ID"
//                 value={values.userName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="input-group">
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 className="custom-input"
//                 placeholder="Password"
//                 value={values.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-extras">
//               <label className="checkbox-container">
//                 <input 
//                   type="checkbox" 
//                   name="rememberMe"
//                   onChange={handleChange}
//                 />
//                 <span className="checkmark"></span>
//                 Remember me
//               </label>
//               <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
//             </div>

//             <button
//               type="submit"
//               className="login-btn"
//               // disabled={isSubmitting}
//             >
//               {"Login"}
//               {/* {isSubmitting ? "Signing In..." : "Login"} */}
//             </button>

//             <div className="privacy-footer">
//               <p>By signing up, you agree to our</p>
//               <div className="links">
//                 <Link to="/terms">Terms and Conditions</Link> & <Link to="/privacy">Privacy Policy</Link>
//               </div>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import "@app/assets/css/login.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "@app/assets/image/logo.png"; // Ensure path is correct
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { notify } from "../../utils/utils";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
import { speakMessage } from "../../utils/ustil2";
import ILLUSTRATION_URL from "@app/assets/image/login-image.png";

// Optional: You can use a local image or a URL for the illustration
// If you don't have the specific vector, I've used a placeholder URL below
// const ILLUSTRATION_URL = "https://cdni.iconscout.com/illustration/premium/thumb/female-student-attending-online-class-illustration-download-in-svg-png-gif-file-formats--virtual-learning-study-education-e-pack-school-illustrations-4437887.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleChange, values, handleSubmit, isSubmitting } = useFormik({
    initialValues: {
      userName: "",
      password: "",
      // rememberMe: false, // Added to match UI
      DateTime: new Date(),
    },

    onSubmit: async (values) => {
      const errors = {};

      if (!values.userName || !values.password) {
        errors.userName = "Both fields are required";
        notify(errors.userName, "error");
      } else if (values.userName.length < 3) {
        errors.userName = "At least 3 characters are required";
        notify(errors.userName, "error");
      }

      if (Object.keys(errors).length > 0) return;

      try {
        let loginData = await dispatch(signInAction(values));

        if (!loginData?.payload?.success) {
          notify(loginData?.payload?.message, "error");
          return;
        }

        if (loginData?.payload?.data?.userDetails?.themeName) {
          useLocalStorage("theme", "set", loginData?.payload?.data?.userDetails?.themeName);
        } else {
          useLocalStorage("theme", "set", "default_theme");
        }

        if (loginData?.payload?.success) {
          speakMessage(`Welcome ${loginData?.payload?.data?.userDetails?.empName || ""}`);
          navigate("/dashboard");
        }
      } catch (error) {
        notify(error?.message, "error");
      }
    },
  });

  return (
    <div className="login-page-wrapper">
      
      {/* LEFT SIDE: Blue Background with Illustration */}
      <div className="login-left-section">
        <div className="brand-name">Digital Vidya Saarthi</div>
        
        <div className="illustration-container">
          <img src={
            ILLUSTRATION_URL
            } alt="Login Illustration" className="hero-image" />
        </div>

        <div className="left-content-text">
          <h1>A few more clicks to <br/> sign in to your account.</h1>
        </div>

        {/* The White Curve Overlay */}
        <div className="curve-overlay"></div>
      </div>

      {/* RIGHT SIDE: White Background with Form */}
      <div className="login-right-section">
        <div className="form-container">
          
          <div className="header-text">
            <h2>Samaritans English Medium Sr. Sec. School</h2>
            <p className="sub-header">Parents & Students Sign In</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            
            <div className="input-group">
              <input
                type="text"
                id="userName"
                name="userName"
                className="custom-input"
                placeholder="User ID"
                value={values.userName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                className="custom-input"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-extras">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Login"}
            </button>

            <div className="privacy-footer">
              <p>By signing up, you agree to our</p>
              <div className="links">
                <Link to="/terms">Terms and Conditions</Link> & <Link to="/privacy">Privacy Policy</Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
