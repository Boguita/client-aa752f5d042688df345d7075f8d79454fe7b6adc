import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select"

const RegisterAdmin = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    area: "",    
  });
  const [err, setError] = useState(null);  
  

  const navigate = useNavigate();

  const handleChange = (e) => {    
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value,}));        
  };

  const handleSubmit = async (e) => {    
    e.preventDefault();
    try {
      await axios.post("/auth/registeradmin", inputs);           
      navigate("/admin");
    } catch (err) {
      setError(err.response.data);
    }
  };
  const DBArea = [ 
    "Graphic Design",
    "WebSite",
    "Social Media",   
    "Other"
  ]  
 const handleSelect = (e) => {     
      setInputs((prev) => ({ ...prev, area: e.area}));        
  };
  
  return (
    <div className="auth">
      <h1>Register</h1>     
      <form>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <div>
          <p>Area: {inputs.area} </p>
        <Select  
        default= {[]}    
        options = {DBArea.map(value => ({label: value, area: value}))}
        onChange={handleSelect}        
        />
        </div>           
        <button onClick={handleSubmit}>Register</button>
        {err && <p>{err}</p>}
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterAdmin;
