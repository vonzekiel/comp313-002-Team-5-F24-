import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function MyListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchListings();
    }
  }, [currentUser]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        My Listings
      </h1>
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
