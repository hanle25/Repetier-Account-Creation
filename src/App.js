import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "./App.css";
import flagImage from "./assets/images/index.png";
import headerIcon from "./assets/images/logo-60.png";

const App = () => 
{
  const [broncoId, setBroncoId] = useState(""); // For login
  const [userName, setUserName] = useState(""); // For name
  const [password, setPassword] = useState(""); // For password
  const [confirmPassword, setConfirmPassword] = useState(""); // For password confirmation
  const [message, setMessage] = useState(""); // For success/error messages

  const handleResetForm = () => 
  {
    // Clear all form states:
    setBroncoId("");
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };
  
  const handleSubmit = async (e) => 
  {
    // Create a new SIIL account form
    e.preventDefault(); // Prevent page reload
    setMessage("Processing...");

    // Password validation
    if (password && password.length < 8) 
    {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    // Password match validation
    if (password !== confirmPassword) 
    {
      setMessage("Passwords do not match!");
      return;
    }

    const hashedPassword = CryptoJS.MD5(broncoId + password).toString()

    // If password is not provided, set it to the Bronco ID
    // const defaultPassword = password || broncoId;

    // API endpoint and API key
    const apiUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    

    // Data for the API request
    const requestData = 
    {
      login: broncoId,
      password: hashedPassword, // Use user-provided password or default password as Bronco ID
      permissions: 4097, // User permissions (adjust as needed)
      name: userName || broncoId, // Use Bronco ID as the fallback for name
    };

    try 
    {
      // Make the API request
      const response = await fetch(`${apiUrl}?a=createUser&data=${encodeURIComponent(JSON.stringify(requestData))}&apikey=${apiKey}`,
        {
          method: "POST",
        }
      );

      if (response.ok)
      {
        const data = await response.json();
        if (data.success || data.status === "ok") 
        {
          console.log("API Response:", data);
          setMessage("Account created successfully!");
        }
        else 
        {
          console.error("API Error Response:", data);
          setMessage("User creation failed. Please try again.");
        }
      } 
      else 
      {
        console.error("Error:", response.statusText);
        setMessage("Error: Unable to create account.");
      }
    } 
    catch (error) 
    {
      console.error("Error:", error);
      setMessage("Error: Something went wrong.");
    }
  };

  const handleToggleFullScreen = () => 
  {
    // Check if we’re already in full screen
    if (!document.fullscreenElement) {
      // Enter full screen
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Failed to enter fullscreen: ${err.message}`);
      });
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (

    // Form for creating an account
    <div className = "App">
      {/* Header Section */}
      <header className = "app-header">
        <div className = "header-left" onClick = {handleResetForm} style = {{cursor: 'pointer'}}>
          <img
            src = {headerIcon}
            alt = "Logo"
            className = "header-logo"
          />
          <span className = "header-title">Repetier-Server Pro 1.4.15 - SIIL</span>
        </div>
        <div className = "header-right">
          <i className = "fas fa-expand-arrows-alt" onClick = {handleToggleFullScreen} style = {{cursor: 'pointer'}}></i>
          <img
            src = {flagImage}
            alt = "Language"
            className = "header-flag"
          />
        </div>
      </header>

      {/* Form Section */}
      <div className = "form-container">
        <div className = "form-header">
          <i className = "fas fa-user form-header-icon"></i>
          <span className = "form-header-title">Please create account</span>
        </div>
        <form onSubmit = {handleSubmit}>
          <div className = "form-group">
            <label htmlFor = "login">Login:</label>
            <input
              type = "text"
              id = "login"
              placeholder = "Login"
              value = {broncoId}
              onChange = {(e) => setBroncoId(e.target.value)}
              className = "form-input"
              required
            />
          </div>
          <div className = "form-group">
            <label htmlFor = "userName">User Name (Optional):</label>
            <input
              type = "text"
              id = "userName"
              placeholder = "User Name"
              value = {userName}
              onChange = {(e) => setUserName(e.target.value)}
              className = "form-input"
            />
          </div>
          <div className = "form-group">
            <label htmlFor = "password">Password:</label>
            <input
              type = "password"
              id = "password"
              placeholder = "Password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              className = {`form-input`}
              required
            />
          </div>
          <div className = "form-group">
            <label htmlFor = "confirmPassword">Confirm Password:</label>
            <input
              type = "password"
              id = "confirmPassword"
              placeholder = "Confirm Password"
              value = {confirmPassword}
              onChange = {(e) => setConfirmPassword(e.target.value)}
              className = {`form-input`}
              required
            />
          </div>
          <button type = "submit" className = "form-button">Create Account</button>

          <div className = "form-message">
            {message && (<div className = {message === "Account created successfully!" ? "success-box" : "error-box"}><p>{message}</p></div>)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;