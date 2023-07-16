import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const API_URL = "http://localhost:3000";
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
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

      .then(() => {
        console.log(username);
        setError("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error, "Signup error");
        if (error.response) {
          console.log(error.response);
          console.log(error.response.data);
        }
        setError(
          "Username or password wrong. Provide a valid username or password."
        );
      });
  };

  return (
    <div>
      <h1>Login Page</h1>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        title="Please provide a valid email address."
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
}

export default LoginPage;
