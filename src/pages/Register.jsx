import React, { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData
      );

      // If successful, update message and isError
      if (response.status === 201) {
        setMessage(response.data.message);
        setIsError(false);
        navigate("/login");
      }
    } catch (err) {
      // If error, capture the message
      if (err.response && err.response.status === 409) {
        setMessage(err.response.data.message);
        setIsError(true);
      } else {
        setMessage("An unexpected error occurred.");
        setIsError(true);
      }
      console.error(err);
    }
  };

  useEffect(function () {
    document.title = "Register";
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h4>Register</h4>
            </div>
            <div className="card-body">
              {message && (
                <div
                  className={`alert ${
                    isError ? "alert-danger" : "alert-success"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <FormInput
                  id="name"
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <small>
                Already have an account? <a href="/login">Go to Login</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
