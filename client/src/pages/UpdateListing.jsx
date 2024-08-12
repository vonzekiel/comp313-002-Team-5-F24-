import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { useSelector } from "react-redux";

export default function MyListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [favoriteListings, setFavoriteListings] = useState([]);

  // Fetch all user listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          console.error("Error fetching listings:", data.message);
          return;
        }
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [currentUser]);

  // Fetch favorite listings based on favorite IDs
  useEffect(() => {
    const fetchFavoriteListings = async () => {
      try {
        const fetchListingPromises = favorites.map(async (listingId) => {
          try {
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
              console.error(
                `Error fetching listing ${listingId}:`,
                data.message
              );
              return null;
            }
            return data;
          } catch (error) {
            console.error(`Error fetching listing ${listingId}:`, error);
            return null;
          }
        });

        const favoriteListingsData = await Promise.all(fetchListingPromises);
        console.log("Favorite listings fetched:", favoriteListingsData);
        setFavoriteListings(
          favoriteListingsData.filter((listing) => listing !== null)
        );
      } catch (error) {
        console.error("Error fetching favorite listings:", error);
      }
    };

    fetchFavoriteListings();
  }, [favorites]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.error("Error deleting listing:", data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        My Listings
      </h1>

      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Favorites
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {favoriteListings.length === 0 ? (
          <p className="text-center text-white">
            You don't have any favorite listings at the moment
          </p>
        ) : (
          favoriteListings.map((listing) => (
            <ListingItem
              key={listing._id}
              listing={listing}
              onFavoriteToggle={() => {}}
              isFavorite={true}
            />
          ))
        )}
      </div>

      <h2 className="text-2xl font-bold text-center text-white mb-6">
        My Listings
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {listings.length === 0 ? (
          <p className="text-center text-white">
            You don't have any listings at the moment
          </p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing._id}
              className="max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="object-cover w-full h-48"
                />
              </Link>
              <div className="px-4 py-2">
                <h1 className="text-xl font-bold text-gray-800 uppercase dark:text-white">
                  {listing.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {listing.description}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {listing.address}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white">
                  ${listing.price}
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
                <div className="flex flex-col">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase text-xs"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase text-xs">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-5">
        <Link
          to={"/create-listing"}
          className="px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
        >
          Create Listing
        </Link>
      </div>
    </div>
  );
}
