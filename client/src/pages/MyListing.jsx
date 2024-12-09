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

  // // Handle favorite toggle (add/remove from favorites)
  // const handleFavoriteToggle = (listingId) => {
  //   const updatedFavorites = favorites.includes(listingId)
  //     ? favorites.filter((id) => id !== listingId) // Remove if exists
  //     : [...favorites, listingId]; // Add if not exists

  //   setFavorites(updatedFavorites);
  //   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

  //   // Remove listing from favorite listings if unfavorited
  //   if (!updatedFavorites.includes(listingId)) {
  //     setFavoriteListings((prevFavorites) =>
  //       prevFavorites.filter((listing) => listing._id !== listingId)
  //     );
  //   }
  // };

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

      // Remove listing from favorite listings if deleted
      setFavoriteListings((prevFavorites) =>
        prevFavorites.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
          <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
            Bring your Real Estate Ventures to the{" "}
            <span className="text-blue-500">next level.</span>
          </h2>

          <p className="max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300">
            Welcome to our platform where you can create listings to sell or
            rent properties. Start selling or renting your properties today and
            take advantage of our tools and resources to make your real estate
            ventures successful.
          </p>

          <div className="inline-flex w-full mt-6 sm:w-auto">
            <Link
              to="/create-listing"
              className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Create Listing
            </Link>
          </div>
        </div>
      </section>

      {/* My Listings */}
      <h2 className="text-2xl font-bold text-center text-white mb-6 mt-10">
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

      {/* Favorites Section
      <h2 className="text-2xl font-bold text-center text-white mb-6 mt-10">
        Favorites
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {favoriteListings.length === 0 ? (
          <p className="text-center text-white">
            You don't have any favorite listings at the moment. Go to
            marketplace and add some favorites!
          </p>
        ) : (
          favoriteListings.map((listing) => (
            <ListingItem
              key={listing._id}
              listing={listing}
              onFavoriteToggle={() => handleFavoriteToggle(listing._id)}
              isFavorite={true}
            />
          ))
        )}
      </div> */}
    </div>
  );
}
