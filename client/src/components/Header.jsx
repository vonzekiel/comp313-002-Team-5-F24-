import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const isLoggedIn = !!(currentUser && currentUser.username);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/listings?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-black shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <ul className="flex gap-4">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-white">RealEstate</span>
              <span className="text-blue-400">Ventures</span>
            </h1>
          </Link>
          <Link to="/listings">
            <li className="hidden font-bold sm:inline text-white hover:underline">
              Listings
            </li>
          </Link>
          {isLoggedIn && (
            <Link to="/my-listings">
              <li className="hidden font-bold sm:inline text-white hover:underline">
                My Listings
              </li>
            </Link>
          )}
          <Link to="/contact-us">
            <li className="hidden font-bold sm:inline text-white hover:underline">
              Contact Us
            </li>
          </Link>
        </ul>
        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul>
          <Link to="/profile">
            {isLoggedIn ? (
              <div className="flex gap-2">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <li className="text-white font-bold hover:underline">
                  My Account
                </li>
              </div>
            ) : (
              <li className="text-white font-bold hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
