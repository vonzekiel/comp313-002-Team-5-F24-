import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";

export default function ListingItem({ listing }) {
  return (
    <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="object-cover object-center w-full h-56"
        />
      </Link>

      <div
        className={`flex items-center px-6 py-3 ${
          listing.type === "rent" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <h1
          className={`mx-3 text-lg font-semibold ${
            listing.type === "rent" ? "text-black" : "text-white"
          }`}
        >
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </h1>
      </div>

      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {listing.name}
        </h1>

        <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
          <MdLocationOn className="h-6 w-6 fill-current" />
          <p className="px-2 text-sm">{listing.address}</p>
        </div>

        <p className="text-slate-500 mt-2 font-semibold">
          ${listing.price.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>

        <div className="text-slate-50 flex gap-4 mt-2">
          <div className="font-bold text-xs">
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds `
              : `${listing.bedrooms} bed `}
          </div>
          <div className="font-bold text-xs">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths `
              : `${listing.bathrooms} bath `}
          </div>
        </div>
      </div>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
  }).isRequired,
};
