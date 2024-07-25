import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MyListing from "../pages/MyListing";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const isLoggedIn = !!(currentUser && currentUser.username);

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
          <Link to="/about">
            <li className="hidden font-bold sm:inline text-white hover:underline">
              About
            </li>
          </Link>
        </ul>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search... "
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul>
          <Link to="/profile">
            {isLoggedIn ? (
              <li className="text-white font-bold hover:underline">
                My Account
              </li>
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
