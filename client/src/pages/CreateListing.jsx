import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    price: 50,
    offer: false,
    parking: false,
    furnished: false,
    owner: currentUser.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUploadImages = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setIsLoading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setIsLoading(false);
        })
        .catch((error) => {
          setImageUploadError(
            "Image upload failed. Please only upload images that are below 2MB."
          );
          setIsLoading(false);
        });
    } else {
      setImageUploadError("Please upload up to 6 images only.");
      setIsLoading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.type === "number" || e.target.type === "text") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 w-full mx-auto h-screen mb-auto bg-cover bg-center bg-gray-900">
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create Listing
        </h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg shadow-md text-gray-900"
              id="name"
              maxLength={50}
              min={4}
              required
              onChange={handleChange}
              value={formData.name}
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg shadow-md text-gray-900"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg shadow-md text-gray-900"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="sale"
                  name="type"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <label htmlFor="sale" className="text-white">
                  Sell
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rent"
                  name="type"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent" className="text-white">
                  Rent
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <label htmlFor="parking" className="text-white">
                  With Parking
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <label htmlFor="furnished" className="text-white">
                  Furnished
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <label htmlFor="offer" className="text-white">
                  Offer
                </label>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={10}
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-md text-gray-900"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <label htmlFor="bedrooms" className="text-white">
                  Bedrooms
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={10}
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-md text-gray-900"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <label htmlFor="bathrooms" className="text-white">
                  Bathrooms
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="price"
                  min={50}
                  max={100000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg shadow-md text-gray-900"
                  onChange={handleChange}
                  value={formData.price}
                />
                <label htmlFor="price" className="text-white">
                  Price
                </label>
              </div>
            </div>
          </div>
          <p className="text-gray-300">
            <span className="text-xs">(Max 6 images)</span>
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Listing Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-white bg-red-500 p-1 rounded-full"
                    onClick={() => handleDeleteImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
          <label
            htmlFor="images"
            className="w-full px-4 py-2 tracking-wide text-black transition-colors duration-300 transform bg-white rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
          >
            Choose Images
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
          {imageUploadError && (
            <p className="text-red-500">{imageUploadError}</p>
          )}
          <button
            type="button"
            onClick={handleUploadImages}
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
          >
            Upload Images
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-green-400 focus:ring focus:ring-green-300 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? <Loading /> : "Create Listing"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </main>
  );
}

export default CreateListing;
