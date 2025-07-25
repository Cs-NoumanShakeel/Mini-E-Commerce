import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

import customerImg from "../assets/customer.jpg";
import adminImg from "../assets/admin.jpg";
import staffImg from "../assets/staff.jpg";
import { useUserType } from "../context/UserTypeContext";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { userType, setUserType } = useUserType(); // ✅ FIXED: Extract userType
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload =
      method === "login"
        ? { username, password }
        : { username, email, password };

    const res = await api.post(route, payload);

    if (method === "login") {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
    }

    navigate("/Products");
  } catch (error) {
    alert("❌ " + (error.response?.data?.detail || error.message));
  } finally {
    setLoading(false);
  }
};

  const getBackgroundStyle = () => {
    let backgroundImage;
    switch (userType) {
      case "customer":
        backgroundImage = `url(${customerImg})`;
        break;
      case "admin":
        backgroundImage = `url(${adminImg})`;
        break;
      case "staff":
        backgroundImage = `url(${staffImg})`;
        break;
      default:
        backgroundImage = `url(${customerImg})`;
    }

    return {
      backgroundImage,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "background-image 0.5s ease",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  };

  return (
    <div className="form-wrapper" style={getBackgroundStyle()}>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="tab-buttons">
          <button
            type="button"
            className={`tab-btn ${userType === "customer" ? "active" : ""}`}
            onClick={() => setUserType("customer")}
          >
            CUSTOMER
          </button>
          <button
            type="button"
            className={`tab-btn ${userType === "admin" ? "active" : ""}`}
            onClick={() => setUserType("admin")}
          >
            ADMIN
          </button>
          <button
            type="button"
            className={`tab-btn ${userType === "staff" ? "active" : ""}`}
            onClick={() => setUserType("staff")}
          >
            STAFF
          </button>
        </div>

        <h1>{name}</h1>

        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
          {name}
        </button>

        <div className="form-links">
          <Link to="/login">Already have an account?</Link>
          <Link to="/register">Make an Account</Link>
        </div>
      </form>
    </div>
  );
}

export default Form;
