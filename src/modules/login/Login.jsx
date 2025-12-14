
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
      rememberMe: false, // Added to match UI
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
