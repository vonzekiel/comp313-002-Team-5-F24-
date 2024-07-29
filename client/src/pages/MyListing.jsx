import { Link } from "react-router-dom";

export default function MyListing() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center pb-5 my-10">My Listings</h1>
      <p className="text-center">You dont have any listings at the moment</p>
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
