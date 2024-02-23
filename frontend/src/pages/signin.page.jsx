import React, { useContext } from "react";
import {toast, Toaster } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

function SignInPage() {
  
  let { userAuth: {access_token, profile_img}, setUserAuth} = useContext(UserContext)

  const userAuthThroughServer = (formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/signin", formData).then(({data}) =>{
      storeInSession("user", JSON.stringify(data))
 
      setUserAuth(data);

    }).catch(({response}) => {
      toast.error(response.data.error);
    })
    
  }

  const handleSubmit = (e) =>{

    e.preventDefault();

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const form = new FormData(formElement);
    const formData = {};
    for(let [key, value] of form.entries()){
      formData[key] = value;
    }

    const { email, password} = formData;

    
    if (!email.length) {
        return toast.error("Email is required");
    }
  
    if (!emailRegex.test(email)) {
        return toast.error("Email is invalid" );
    }

    if (!password) {
      return toast.error("Password is required");
  }
  
    if (!passwordRegex.test(password)) {
        return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters")
    }

    userAuthThroughServer(formData)

  }
  return (
    access_token ? 
    <Navigate to="/" />
    :
    <>
      <section className="h-cover flex items-center  justify-center">
        <Toaster/>
        <form id="formElement" className="w-[80%] max-w-[400px] bg-black/[.10] shadow-xl px-10 py-5 rounded ">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-12">
            Welcome Back
          </h1>
 
          <div className="relative w-[100%] mb-4">
            <input
              name="email"
              type="email"
              placeholder="email"
              className="input-box placeholder:capitalize"
            />
            <i className={"fi fi-rr-envelope input-icon"}></i>
          </div>

          <div className="relative w-[100%] mb-4">
            <input
              name="password"
              type="password"
              placeholder="password"
              className="input-box placeholder:capitalize"
            />
            <i className={"fi fi-rr-key input-icon"}></i>
          </div>

          <button className="btn-dark center mt-8" type="submit" onClick={handleSubmit}>
            Sign In
          </button>

          <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account ? 
                <Link to="/signup" className="underline text-black text-xl ml-1">
                    Join now.
                </Link>
            </p> 
        </form>
      </section>
    </>
  );
}

export default SignInPage;
