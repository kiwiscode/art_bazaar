import { Routes, Route, useLocation } from "react-router-dom";
import { CollectorProvider } from "./components/CollectorContext";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import ResetPassword from "./pages/ResetPassword";
import ArtistProfile from "./pages/ArtistProfile";
import { useState } from "react";
import Artwork from "./pages/Artwork";
import CollectorProfile from "./pages/CollectorProfile";
import CollectorProfileArtists from "./pages/CollectorProfileArtists";
import CollectorProfileInsights from "./pages/CollectorProfileInsights";
import NewArtwork from "./pages/NewArtwork";
import CollectorArtworkDetail from "./pages/CollectorArtworkDetail";
import EditArtwork from "./pages/EditArtwork";
function App() {
  const location = useLocation();
  const path = location.pathname;

  const [showAuthModal, setShowAuthModal] = useState(false);

  function handleDataFromChildArtistProfile(data) {
    console.log("data:", data);
    setShowAuthModal(data);
  }

  function handleDataFromChildNavbar(data) {
    console.log("data navigation bar:", data);
    setShowAuthModal(data);
  }

  return (
    <CollectorProvider>
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
          {path !== "/reset_password" &&
            path !== "/collector-profile/my-collection/artworks/new" &&
            !path.endsWith("edit") && (
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
          <Route
            path="/artwork/:artworkName"
            element={
              <Artwork sendDataToParent={handleDataFromChildArtistProfile} />
            }
          ></Route>
          <Route
            path="/collector-profile/my-collection"
            element={<CollectorProfile />}
          ></Route>

          <Route
            path="/collector-profile/artists"
            element={<CollectorProfileArtists />}
          ></Route>
          <Route
            path="/collector-profile/insights"
            element={<CollectorProfileInsights />}
          ></Route>
          <Route
            path="/collector-profile/my-collection/artworks/new"
            element={<NewArtwork />}
          ></Route>
          <Route
            path="/collector-profile/my-collection/artwork/:collectedArtworkId"
            element={<CollectorArtworkDetail />}
          ></Route>
          <Route
            path="/collector-profile/my-collection/artworks/:collectedArtworkId/edit"
            element={<EditArtwork />}
          ></Route>
        </Routes>
      </div>
    </CollectorProvider>
  );
}
export default App;
