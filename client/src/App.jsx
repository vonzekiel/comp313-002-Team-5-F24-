import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ContactUs from "./pages/ContactUs";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import MyListing from "./pages/MyListing";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listings from "./pages/Listings";
import Listing from "./pages/Listing";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="pb-16 md:pb-0">
        {" "}
        {/* Add padding to the bottom */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="hidden md:block">
                  <Home />
                </div>
                <div className="block md:hidden">
                  <Listings />
                </div>
              </>
            }
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-listings" element={<MyListing />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
          <Route path="/listings/" element={<Listings />} />
          <Route path="/listing/:listingId" element={<Listing />} />
        </Routes>
      </div>
      <Footer className="hidden md:block" />
    </BrowserRouter>
  );
}
