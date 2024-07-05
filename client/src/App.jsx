import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Navbar from "./components/Navbar";
import Main from "./pages/MainPage";
import ResetPassword from "./pages/ResetPassword";
import ArtistProfile from "./pages/ArtistProfile";
function App() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <UserProvider>
      <div className="App">
        <div
          style={{
            position: "sticky",
            top: "0px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 1,
            width: "100%",
            borderBottom: "1px solid rgb(194, 194, 194)",
          }}
        >
          {path !== "/reset_password" && <Navbar />}
        </div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/reset_password" element={<ResetPassword />}></Route>
          <Route
            path="/artist/:artist_name"
            element={<ArtistProfile />}
          ></Route>
        </Routes>
      </div>
    </UserProvider>
  );
}
export default App;
