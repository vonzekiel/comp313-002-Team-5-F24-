import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import { MdLocationOn } from "react-icons/md";

function Listing() {
  const [listing, setListing] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 0,
    comment: "",
  });
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListing(data);

      const reviewsRes = await fetch(`/api/listing/${listingId}/reviews`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
    };

    fetchData();
  }, [params.listingId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const listingId = params.listingId;
    const token = localStorage.getItem("token");

    const reviewData = {
      ...newReview,
      user: currentUser.username, // Use currentUser's name
    };

    const res = await fetch(`/api/listing/${listingId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();
    if (data.message === "Review added!") {
      setReviews([...reviews, reviewData]);
      setNewReview({ user: "", rating: 0, comment: "" });
    } else {
      alert(data.message);
    }
  };

  if (!listing.name) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <section className="bg-gray-900 text-white">
      <div className="container px-6 py-10 mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
        <div className="lg:flex lg:items-center">
          <div className="lg:w-1/2">
            <Slider {...settings}>
              {listing.imageUrls.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`listing-${index}`}
                    className="object-cover w-full rounded-xl h-72 lg:h-96"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
            <p className="text-sm text-blue-500 uppercase">{listing.type}</p>
            <h1 className="block mt-4 text-2xl font-semibold hover:underline">
              {listing.name}
            </h1>
            <p className="mt-3 text-sm text-gray-400">{listing.description}</p>

            <div className="flex items-center mt-4">
              <MdLocationOn className="h-6 w-6 text-blue-500" />
              <p className="px-2 text-sm text-gray-300">{listing.address}</p>
            </div>

            <div className="text-slate-500 mt-2 font-semibold">
              ${listing.price.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </div>

            <div className="text-gray-300 flex gap-4 mt-2">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </div>
              {listing.furnished && (
                <div className="font-bold text-xs">Furnished</div>
              )}
              {listing.parking && (
                <div className="font-bold text-xs">Parking Available</div>
              )}
            </div>
          </div>
        </div>
        <section className="bg-white dark:bg-gray-900 mt-12">
          <div className="container px-6 py-12 mx-auto">
            <div className="text-center">
              <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl dark:text-white">
                Get in touch with the owner
              </h1>
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Please always be respectful and professional in your messages.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 mt-10 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </span>

                <h2 className="mt-4 text-lg font-medium text-gray-800 dark:text-white">
                  Email
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Contact the owner directly.
                </p>
                <p className="mt-2 text-blue-500 dark:text-blue-400">
                  {listing.owner}
                </p>
              </div>

              <div className="flex justify-center items-center">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    listing.address
                  )}&output=embed`}
                  className="w-full h-96 border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gray-900 text-white mt-12">
          <div className="container px-6 py-12 mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <div className="flex flex-col gap-4">
              {reviews.length === 0 && (
                <p className="text-slate-400">No reviews yet.</p>
              )}
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="ml-2 text-sm text-gray-400">
                      {review.user}
                    </span>
                  </div>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
            {currentUser && (
              <form onSubmit={handleReviewSubmit} className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Add a Review</h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="hidden"
                    name="user"
                    value={currentUser.username}
                  />
                  <div>
                    <label className="block mb-2">Rating</label>
                    <select
                      name="rating"
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({ ...newReview, rating: e.target.value })
                      }
                      className="p-2 rounded-lg border border-gray-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                    >
                      <option value="0">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Comment</label>
                    <textarea
                      name="comment"
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="p-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                      rows="4"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
            {!currentUser && (
              <p className="mt-6 text-red-500">
                You must be logged in to submit a review.
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default Listing;
