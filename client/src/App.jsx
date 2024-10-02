import { Routes, Route, useLocation } from "react-router-dom";
import { CollectorProvider } from "./components/CollectorContext";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import ResetPassword from "./pages/ResetPassword";
import ArtistProfile from "./pages/ArtistProfile";
import { useEffect, useState } from "react";
import Artwork from "./pages/Artwork";
import CollectorProfile from "./pages/CollectorProfile";
import CollectorProfileArtists from "./pages/CollectorProfileArtists";
import CollectorProfileInsights from "./pages/CollectorProfileInsights";
import NewArtwork from "./pages/NewArtwork";
import CollectorArtworkDetail from "./pages/CollectorArtworkDetail";
import EditArtwork from "./pages/EditArtwork";
import Saves from "./pages/Saves";
import SavesAlerts from "./pages/SavesAlerts";
import SavesFollows from "./pages/SavesFollows";
import EditProfile from "./pages/EditProfile";
import EditProfileSettings from "./pages/EditProfileSettings";
import EditProfilePurchases from "./pages/EditProfilePurchases";
import EditProfileDelete from "./pages/EditProfileDelete";
import Sell from "./pages/Sell";
import OrderShipping from "./pages/OrderShipping";
import OrderPayment from "./pages/OrderPayment";
import OrderReview from "./pages/OrderReview";
import { DeliveryProvider } from "./components/DeliveryContext";
import No_Message from "./pages/No_Message";
import Conversations from "./pages/Conversations";
function App() {
  const location = useLocation();
  const path = location.pathname;

  const [showAuthModal, setShowAuthModal] = useState(false);

  function handleDataFromChild(data) {
    setShowAuthModal(data);
  }

  function handleDataFromChildNavbar(data) {
    setShowAuthModal(data);
  }

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [path]);

  return (
    <CollectorProvider>
      <DeliveryProvider>
        <div className="App">
          <div
            style={{
              position: "sticky",
              top: "0px",
              borderBottom: "1px solid rgb(194, 194, 194)",
              zIndex:
                path.startsWith("/settings") || path === "/favorites/saves"
                  ? 2
                  : 1,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            {path !== "/reset_password" &&
              path !== "/collector-profile/my-collection/artworks/new" &&
              !path.endsWith("edit") &&
              !path.endsWith("/shipping") &&
              !path.endsWith("/payment") &&
              !path.endsWith("/review") && (
                <Navbar
                  showAuthModal={showAuthModal}
                  setShowAuthModal={handleDataFromChildNavbar}
                />
              )}
          </div>
          <Routes>
            <Route
              path="/"
              element={<Main sendDataToParent={handleDataFromChild} />}
            />
            <Route path="/reset_password" element={<ResetPassword />}></Route>
            <Route
              path="/artist/:artist_name"
              element={<ArtistProfile sendDataToParent={handleDataFromChild} />}
            ></Route>
            <Route
              path="/artwork/:artworkName"
              element={<Artwork sendDataToParent={handleDataFromChild} />}
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
            <Route path="/favorites/saves" element={<Saves />}></Route>
            <Route path="/favorites/follows" element={<SavesFollows />}></Route>
            <Route path="/favorites/alerts" element={<SavesAlerts />}></Route>
            <Route
              path="/settings/edit-profile"
              element={<EditProfile />}
            ></Route>
            <Route
              path="/settings/edit-settings"
              element={<EditProfileSettings />}
            ></Route>
            <Route
              path="/settings/purchases"
              element={<EditProfilePurchases />}
            ></Route>
            <Route
              path="/settings/delete"
              element={<EditProfileDelete />}
            ></Route>
            <Route
              path="/orders/:artworkToOrder/shipping"
              element={<OrderShipping />}
            ></Route>
            <Route
              path="/orders/:artworkToOrder/payment"
              element={<OrderPayment />}
            ></Route>
            <Route
              path="/orders/:artworkToOrder/review"
              element={<OrderReview />}
            ></Route>
            <Route path="/sell" element={<Sell />}></Route>
            <Route
              path="/user/conversations"
              element={<Conversations />}
            ></Route>
            <Route
              path="/user/conversations/no-messages"
              element={<No_Message />}
            ></Route>
          </Routes>
        </div>
      </DeliveryProvider>
    </CollectorProvider>
  );
}
export default App;
