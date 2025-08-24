import './App.css';
import React,{ useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home.js';

function App() {
  const [id, setId] = useState("");
  const [gen, setSelectedValue] = useState("");
  const [role, setRole] = useState("");
  const [name,setName]=useState('');
  const [pwd,setPwd]=useState('');
  const [errors,setErrors]=useState('');
  const [visibleSection, setVisibleSection] = useState("home");

  const navigate=useNavigate();
  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const resetForm = () => {
    setId("");
    setName("");
    setPwd("");
    setSelectedValue("Male");
    setRole("Fresher");
    setErrors({});
  };
  const check=()=>
    {
      const errors={};
      
      if(!name)
        errors.name='Username is required';
      else if(name.length<4)
        errors.name='Username must have atleast 4 characters';
  
      if(!pwd)
        errors.pwd='Password is required';
      else if(pwd.length<8)
        errors.pwd='Password must have 8 characters';
      
      return errors;
    }

  const handleLogin=async(e)=>{
    e.preventDefault();
    
    const newErrors=check(name,pwd);
    setErrors(newErrors);

    if(Object.keys(newErrors).length>0)
    {
      return;
      
    }
    try {
      // Send login credentials to the backend
      const response = await axios.post("http://localhost:5000/login", {
        name,
        pwd
      });

      // Check the server's response
      if (response.data.success) {
        alert("login Successful");
        navigate('/home');
      } 
      else 
      {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
    }
  };
    const addData = async (event) => {
      event.preventDefault();
  
      const newErrors = check(name,pwd);
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
        try {
            const response = await axios.post("http://localhost:5000/add-data", {
              id,
              name,
              pwd,
              gen,
              role,
            });
            if (response.data.success) {
              alert("User added successfully!");
              setVisibleSection("home");
            } else {
              alert("Form submission failed.");
            }
          resetForm();
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
 
  return (
      
    <Routes>
  <Route path='/' element={
    <div className='app'>
    <header id="head"><h1>Welcome to React Login Page</h1></header>
    
    {visibleSection==="home" && (
    <div className='log'>  
    <form>
    <h2>Login here</h2>
      <label>UserName<input type='text' id="name" name='name'value={name} onChange={(e)=>setName(e.target.value)}></input></label><br></br>
      {errors.name && (<span className='error-message'>{errors.name}</span>)}<br></br>
      <label>Password<input type='password' id="pwd"name="pwd" value={pwd} onChange={(e)=>setPwd(e.target.value)}></input></label><br></br>
      {errors.pwd && (<span className='error-message'>{errors.pwd}</span>)}<br></br>

      <button id="sbtn" onClick={() => setVisibleSection("Add")} className="btn  text-white">
              create an account
            </button><br></br>
      <button  id="lbtn"onClick={handleLogin}>Log in</button>
      <button id="rbtn"onClick={resetForm}>Reset</button>
    </form>
    <img src="logo.png" alt="pic"></img>
    </div>
    )}
    {visibleSection === "Add" && (
        <div className="forms">
          <form className="add">
          <h3>Add Details </h3>
            <label>
              Employee Id :
              <input
                type="text"
                name="id"
                id="eid"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </label>
            <br />
            <label>
              Username :
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            {errors.name && <span className="error-message">{errors.name}</span>}
            <br />
            <label>
              Password :
              <input
                type="password"
                name="pwd"
                id="pwd"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </label>
            {errors.pwd && <span className="error-message">{errors.pwd}</span>}
            <br />
            <label>
              Gender :
              <input
                type="radio"
                id="opt1"
                name="gen"
                value="Male"
                checked={gen === "Male"}
                onChange={() => setSelectedValue("Male")}
              />
              Male
              <input
                type="radio"
                id="opt2"
                name="gen"
                value="Female"
                checked={gen === "Female"}
                onChange={() => setSelectedValue("Female")}
              />
              Female
            </label>
            <br />
            <label>
              Role :
              <select value={role} name="role"id="role" onChange={handleChange}>
                <option value="Fresher">Fresher</option>
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
              </select>
            </label>
            <br />
            <button name="add" onClick={addData}>
              Sign up
            </button>
            <button type="button" onClick={resetForm}>
              Reset
            </button>
          </form>
        </div>
      )}
    </div>

}
/>
<Route path="/home" element={<Home />} />
</Routes>

  );
}

export default App;
