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
    <div className="h-screen mb-auto">
      <h1 className="text-3xl font-bold text-center pb-5 my-10">My Listings</h1>
      {listings.length === 0 ? (
        <p className="text-center">You don't have any listings at the moment</p>
      ) : (
        listings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4 max-w-xl mx-auto my-5"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold  hover:underline truncate flex-1"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col item-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))
      )}
      <div className="flex">
        <Link
          to={"/create-listing"}
          className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95 mx-auto mt-5"
        >
          Create Listing
        </Link>
      </div>
    </div>
  );
}
