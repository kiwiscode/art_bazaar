import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import ResetPassword from "./pages/ResetPassword";
import ArtistProfile from "./pages/ArtistProfile";
import { useEffect, useState } from "react";
import Artwork from "./pages/Artwork";
function App() {
  const location = useLocation();
  const path = location.pathname;

  const [showAuthModal, setShowAuthModal] = useState(false);

  function handleDataFromChildArtistProfile(data) {
    setShowAuthModal(data);
  }

  function handleDataFromChildNavbar(data) {
    setShowAuthModal(data);
  }

  return (
    <UserProvider>
      <div className="App">
        <div
          style={{
            position: "sticky",
            top: "0px",
            borderBottom: "1px solid rgb(194, 194, 194)",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          {path !== "/reset_password" && (
            <Navbar
              showAuthModal={showAuthModal}
              setShowAuthModal={handleDataFromChildNavbar}
            />
          )}
        </div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/reset_password" element={<ResetPassword />}></Route>
          <Route
            path="/artist/:artist_name"
            element={
              <ArtistProfile
                sendDataToParent={handleDataFromChildArtistProfile}
              />
            }
          ></Route>
          <Route path="/artwork/:artworkName" element={<Artwork />}></Route>
        </Routes>
      </div>
    </UserProvider>
  );
}
export default App;
