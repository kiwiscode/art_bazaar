import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate'ı burada import ettiğinizden emin olun

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = () => {
    if (username === "" || email === "" || password === "" || name === "") {
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
      .post(`${API_URL}/auth/signup`, { username, name, email, password })
      .then(() => {
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
    <div className="sign-up-container">
      <h1 className="signup-title">Create account</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="signup-input"
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="signup-input"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        title="Please provide a valid email address."
        className="signup-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="signup-input"
      />
      {error && <p>{error}</p>}

      <button onClick={handleSignUp} className="signup-button">
        Verify email
      </button>
      <p>
        By creating an account, you agree to Canvas's <br />
        <a href="" className="signup-link">
          Conditions of Use
        </a>{" "}
        and{" "}
        <a href="" className="signup-link">
          Privacy Notice.
        </a>{" "}
      </p>
      <hr className="hr-signup" />
      <p>
        Already have an account?{" "}
        <a href="" className="signup-link">
          Sign in ‣
        </a>
      </p>
      <p>
        Buying for work?{" "}
        <a href="" className="signup-link">
          Create a free business account ‣{" "}
        </a>{" "}
      </p>
      <hr className="hr-signup" />
      <a href="" className="signup-link">
        Conditions of use
      </a>
      <a href="" className="signup-link">
        Privacy Notice
      </a>
      <a href="" className="signup-link">
        Help
      </a>
      <p>© 2023, Canvas, Inc. or its affiliates</p>
    </div>
  );
}

export default SignUpPage;
