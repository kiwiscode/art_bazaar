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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .post(`${API_URL}/auth/login`, { username, password })
      .then((response) => {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("cartItems", JSON.stringify(user.carts));
        localStorage.setItem("order", JSON.stringify(user.order));
        console.log(user);

        updateUser(user);
        setError("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.response !== undefined) {
          const { status } = error.response;
          const { errorMessage } = error.response.data;
          if (status === 403) {
            setError(errorMessage);
          }
          if (status === 402) {
            setError(errorMessage);
          }
          if (status === 400) {
            setError(errorMessage);
          }
          if (status === 401) {
            setError(errorMessage);
          }
          if (status === 500) {
            setError("Please try again later.");
          }
        } else {
          return;
        }
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
