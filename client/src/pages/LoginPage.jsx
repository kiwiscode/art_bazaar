import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function LoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    if (username === "" || email === "" || password === "") {
      setError(
        "All fields are mandatory. Please provide your username, email and password."
      );
      return;
    }

    if (password.length < 6) {
      setError("Your password needs to be at least 6 characters long.");
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    axios
      .post(`${API_URL}/auth/login`, { username, email, password })
      .then((response) => {
        const { token, user } = response.data;
        console.log(user);

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        updateUser(user);
        setError("");
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response);
        }
        setError(
          "Username or password wrong or email hasn't been verified yet. Provide a valid username or password."
        );
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login Page</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="login-input"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        title="Please provide a valid email address."
        className="login-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="login-input"
      />
      {error && <p className="login-error">{error}</p>}
      <button onClick={handleLogin} className="login-button">
        Log in
      </button>
    </div>
  );
}

export default LoginPage;
