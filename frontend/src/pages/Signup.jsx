import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  // State for form inputs and error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission for regitraing the user
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check if the field are empty
    if (!email || !password) {
      setError("Please fill in all fields!!");
      return;
    }

    try {
      //Send signup request to the backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          email,
          password,
        }
      );
      //Save the token and go to the Dashboard
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Error Creating user account!!");
    }
  };

  return (
    <div className="container my-4">
      <h2>Signup </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
