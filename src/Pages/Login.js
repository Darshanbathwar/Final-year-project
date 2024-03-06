import React, { useEffect, useState } from "react";
import "./Login.css";
import myicon from '../assets/images/user.png';
import myicon1 from '../assets/images/key.png'
import { NavLink } from "react-router-dom";
import { auth,provider } from "../txtImgConfig";
import { app } from "../txtImgConfig";
import { signInWithPopup } from "firebase/auth";
// import myicon from './user.png';
// import myicon1 from './key.png';

function Login() {
  const [value,setValue] = useState('');
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleGoogleLogin = () =>{
    signInWithPopup(auth,provider).then((data)=>{
      setValue(data.user.email)
      console.log(data);
      localStorage.setItem("email", data.user.email)
    })
  }

  useEffect(()=>{
    // setValue(localStorage.getItem('email'));

    // if(value){
    //   window.location.href = '/dashboard';
    // }
  })
  return (
    <>
      <div className="sigin-container place-center">
        <div className="signin-wrapper ">
        <h3 className="head-text">Login to Vnotitia Admin Panel</h3>
          <div className="google-btn">
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

