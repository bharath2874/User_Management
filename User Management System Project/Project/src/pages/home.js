import "./home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
 function Home() 
 {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [errors, setErrors] = useState({});
  const [gen, setSelectedValue] = useState("");
  const [role, setRole] = useState("");
  const [register, setReg] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [visibleSection, setVisibleSection] = useState("Home"); // State to track visible section

  useEffect(() => {
    fetchData();
  }, []);


  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Username is required";
    else if (name.length < 4)
      errors.name = "Username must be at least 4 characters long";

    if (!pwd) errors.pwd = "Password is required";
    else if (pwd.length < 8)
      errors.pwd = "Password must be at least 8 characters long";

    return errors;
  };

  const addOrUpdateData = async (event) => {
    event.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      
      try {
       
        if (isEditing) {
            const response = await axios.put(`http://localhost:5000/update-data/${id}`, {
              name,
              pwd,
              gen,
              role
            });
            
            if (response.data.success) {
              alert("Data updated successfully!");
              setIsEditing(false);
            } else {
              alert("Failed to update the data.");
            }
        } else {
          const response = await axios.post("http://localhost:5000/add-data", {
            id,
            name,
            pwd,
            gen,
            role,
          });
          if (response.data.success) {
            alert("User Added Successfully!"); 
          }
          else
            alert("Form submission failed.");
        }
        resetForm();
        fetchData();
      } catch(err) {
        console.error("Error:", err);
        alert("Form submission failed.");
      }
    }
  };

  const resetForm = () => {
    setId("");
    setName("");
    setPwd("");
    setSelectedValue("");
    setRole("");
    setErrors({});
  };

  const fetchData = async () => {
    axios
      .get("http://localhost:5000/data")
      .then((response) => setReg(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const removeData = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/remove-data/${id}`);
      if(response.data.success)
      {
        alert("Data removed successfully!");
        fetchData();
      }
      }
     catch (error) {
      alert("Failed to remove the data.");
      console.error("Error:", error);
    }
  };

  const editData = (user) => {
    setId(user.id);
    setName(user.uname);
    setPwd(user.pwd);
    //console.log(typeof(user.gender),typeof(user.role));
    setSelectedValue(user.gender);
    setRole(user.role);
    setIsEditing(true);
    setVisibleSection("Add"); // Switch to Add section for editing
  };

  return (
    <div className="container">
      <div className="container p-3 bg-primary text-white">
        <img src="./logo.png" alt="logo" id="logo"></img>
        <h1 id="head">Welcome to User Data Management</h1>
        <span id="user"></span>
        <button id="btn"><i class="bi bi-person-circle"></i></button>
      </div>
      <div className="profile">
      
      <ul class="nav flex-column">
        <li class="nav-item">
        <a class="nav-link Active">Profile</a>
        </li>
      <li class="nav-item">
      <a class="nav-link" href="#">Id</a>
      </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Mail</a>
    </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Contact</a>
  </li>
</ul>
      </div>
      <div className="container p-2 bg-dark text-white">
        <ul className="nav">
        <button onClick={() => setVisibleSection("Home")} className="btn text-white">
              Home
            </button>
          <li>
            <button onClick={() => setVisibleSection("Add")} className="btn  text-white">
              Add
            </button>
          </li>
          <li>
            <button onClick={() => setVisibleSection("Modify")} className="btn text-white">
              Modify
            </button>
          </li>
          <li>
            <button onClick={() => setVisibleSection("View")} className="btn text-white">
              View
            </button>
          </li>
        </ul>
      </div>
      <div className="box">

      {visibleSection === "Home" && (
        <div className="home">
          <h3>This Is an user Management System</h3>
          <img src="./welcome.avif" id="welimg" alt="pic"></img>
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
                disabled={isEditing}
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
                value="Male"
                checked={gen === "Male"}
                onChange={() => setSelectedValue("Male")}
              />
              Male
              <input
                type="radio"
                id="opt2"
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
            <button name="add" onClick={addOrUpdateData}>
              {isEditing ? "Update" : "Add"}
            </button>
            <button type="button" onClick={resetForm}>
              Reset
            </button>
          </form>
        </div>
      )}

      {visibleSection === "Modify" && (
        <div className="modify">
          <h3>Modify Section </h3>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>USERNAME</th>
                <th>PASSWORD</th>
                <th>GENDER</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {register.map((re,index) => (
                <tr key={index}>
                  <td>{re.id}</td>
                  <td>{re.uname}</td>
                  <td>{re.pwd}</td>
                  <td>{re.gender}</td>
                  <td>{re.role}</td>
                  <td>
                    <button onClick={() => editData(re)}><i class="bi bi-pencil-square"></i></button>
                    <button onClick={() => removeData(re.id)}><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visibleSection === "View" && (
        <div className="view">
          <h3>View Section</h3>
          <table border="1">
            <thead>
              <tr>
              <th>ID</th>
                <th>USERNAME</th>
                <th>PASSWORD</th>
                <th>GENDER</th>
                <th>ROLE</th>
              </tr>
            </thead>
            <tbody>
              {register.map((re) => (
                <tr key={re.id}>
                  <td>{re.id}</td>
                  <td>{re.uname}</td>
                  <td>{re.pwd}</td>
                  <td>{re.gender}</td>
                  <td>{re.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}


export default Home;
