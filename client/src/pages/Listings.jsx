import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Listings() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [filters, setFilters] = useState({
    type: "all",
    furnished: "all",
    parking: "all",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Add filters to the URL parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "all") {
        urlParams.set(key, filters[key]);
      }
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        console.log("Fetched data:", data); // Log the response data
        if (Array.isArray(data)) {
          if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          setListings(data.slice(0, 8));
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search, filters]);

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length < 8) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching more listings:", error);
    }
  };

  const handleFavoriteToggle = (listing) => {
    const updatedFavorites = favorites.some((fav) => fav._id === listing._id)
      ? favorites.filter((fav) => fav._id !== listing._id)
      : [...favorites, listing];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 min-h-screen">
      <button
        onClick={toggleSidebar}
        className="p-2 m-4 bg-blue-500 text-white rounded-lg md:hidden"
      >
        {isSidebarOpen ? "Close Filters" : "Open Filters"}
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white p-7 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 md:relative md:translate-x-0 md:w-1/4`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white md:hidden"
        >
          &larr;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Type</label>
            <select
              name="type"
              onChange={handleFilterChange}
              value={filters.type}
              className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="all">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Furnished</label>
            <select
              name="furnished"
              onChange={handleFilterChange}
              value={filters.furnished}
              className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Parking</label>
            <select
              name="parking"
              onChange={handleFilterChange}
              value={filters.parking}
              className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Sort By</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Sort</label>
            <select
              name="sort"
              onChange={handleFilterChange}
              value={filters.sort}
              className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="createdAt">Date Created</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Order</label>
            <select
              name="order"
              onChange={handleFilterChange}
              value={filters.order}
              className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:text-white w-full"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Favorites</h2>
        <div className="flex flex-col gap-4">
          {favorites.length === 0 && (
            <p className="text-slate-400">No favorites yet.</p>
          )}
          {favorites.map((favorite) => (
            <Link to={`/listing/${favorite._id}`} key={favorite._id}>
              <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                {favorite.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 p-7">
        <div className="flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
                onFavoriteToggle={() => handleFavoriteToggle(listing)}
                isFavorite={favorites.some((fav) => fav._id === listing._id)}
              />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
