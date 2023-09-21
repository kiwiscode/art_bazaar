import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate'ı burada import ettiğinizden emin olun

// when working on local version
// const API_URL = "http://localhost:3000";

// when working on deployment version
const API_URL = "https://mern-ecommerce-app-j3gu.onrender.com";

function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState("");

  {
    /* Artist mod geliştiriciliği */
  }

  const [isArtist, setIsArtist] = useState(false);
  const handleArtistCheckboxChange = (e) => {
    setIsArtist(e.target.checked);
  };

  {
    /* Artist mod geliştiriciliği */
  }

  const handleSignUp = () => {
    axios
      .post(`${API_URL}/auth/signup`, {
        username,
        name,
        email,
        password,
        isArtist,
      })
      .then(() => {
        setError("");
        setSuccess("Email verification link has been sent!");
        navigate("/signed");
      })
      .catch((error) => {
        console.log(error);
<<<<<<< HEAD
        if (error.message === "Request failed with status code 501") {
          setError(
            "Username and email need to be unique. Provide a valid username or email."
          );
=======
        const { status } = error.response;
        console.log(status);
        const { errorMessage } = error.response.data;
        console.log(errorMessage);
        if (status === 402) {
          setError(errorMessage);
          setSuccess("");
>>>>>>> development
        }
        if (status === 403) {
          setError(errorMessage);
          setSuccess("");
        }
<<<<<<< HEAD
        if (error.message === "Request failed with status code 500") {
          setError(
            "All fields are mandatory. Please provide username, email and password."
          );
=======

        if (status === 501) {
          setError(errorMessage);
          setSuccess("");
>>>>>>> development
        }
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
      {success}

      {/* Artist mod geliştiriciliği */}
      <div className="artist-checkbox">
        <label htmlFor="isArtist">Are you an artist?</label>
        <input
          type="checkbox"
          id="isArtist"
          name="isArtist"
          checked={isArtist}
          onChange={handleArtistCheckboxChange}
        />
      </div>
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
