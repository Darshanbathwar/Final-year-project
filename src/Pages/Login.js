import React, { useEffect, useState } from "react";
import "./Login.css";
import myicon from '../assets/images/user.png';
import myicon1 from '../assets/images/key.png'
import { NavLink } from "react-router-dom";
import { auth,provider } from "../txtImgConfig";
import { app } from "../txtImgConfig";
import { signInWithPopup } from "firebase/auth";
// import myicon from './user.png';
import { FcGoogle } from 'react-icons/fc';

import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
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



  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Signed in with Google:', user);
  
      // Store user information in Firestore
      const db = getFirestore();
      const userDocRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        role: 'admin' // Assuming all users logging in via Google should have the role of admin
        // You can adjust the role logic as per your requirement
      });
  
      // Store email in localStorage
      localStorage.setItem('email', user.email);
  
      // Update state or perform any other actions as needed
      setValue(user.email);
    } catch (error) {
      // Handle error
      console.error('Error signing in with Google:', error);
    }
  };
  

  

  useEffect(()=>{
    // setValue(localStorage.getItem('email'));

    // if(value){
    //   window.location.href = '/dashboard';
    // }
  })
  return (
    <>
      <div className="sigin-container place-center">
      <div className="bg-[#313338] rounded-xl  w-[40vh] h-[40vh]  lg:w-[25rem] lg:h-[25rem] flex items-center  flex-col  justify-center">
          <h1 className="pb-10 text-2xl font-[poppins] text-white">Login to Vnotitia</h1>
          <div  style={{textDecoration:'none'}} className={`no-underline hover:no-underline`}>
            <button onClick={handleGoogleLogin} style={{textDecoration:'none'}} className="sign-in outline-none  bg-white  w-[150px] text-[13px] lg:[18px] h-12 lg:w-[250px] lg:h-12 rounded-full text-semibold flex justify-center items-center lg:space-x-3 no-underline	text-black " >
              <FcGoogle className="mr-2 no-underline" /> <p className='no-underline '>Sign in with Google </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

