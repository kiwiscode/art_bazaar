import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate'ı burada import ettiğinizden emin olun

// const API_URL = "http://localhost:3000";
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log(history);

  const handleSignUp = () => {
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
      .post(`${API_URL}/auth/signup`, { username, email, password })
      .then((response) => {
        console.log(response, "Email verification link has been sent");
        setError("");
        navigate("/signed");
      })
      .catch((error) => {
        console.log(error, "Signup error");
        if (error.response) {
          console.log(error.response);
          console.log(error.response.data);
        }
        setError(
          "Username and email need to be unique. Provide a valid username or email."
        );
      });
  };

  return (
    <div>
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

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

export default SignUpPage;
