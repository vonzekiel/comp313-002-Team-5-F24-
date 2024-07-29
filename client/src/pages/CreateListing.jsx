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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  console.log(formData);
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
            "Image upload failed. Please only upload images that is below 2MB."
          );
          setIsLoading(false);
          console.log(error);
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
      const storageReg = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageReg, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
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

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
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
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg shadow-md"
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
            className="border p-3 rounded-lg shadow-md"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg shadow-md"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>With Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg shadow-md"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                min={50}
                max={100000000}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
                onChange={handleChange}
                value={formData.price}
              />
              <div className="flex flex-col items-center">
                <span>Price</span>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / Month)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Upload Images:{" "}
            <span className="font-normal text-blue-950">
              Please upload up to 6 images
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full shadow-md"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={handleUploadImages}
              className="border border-blue-700 text-blue-600 p-3 rounded-lg uppercase hover:bg-blue-700 hover:text-white disabled:bg-blue-700"
            >
              {isLoading ? <Loading /> : "Upload Images"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="flex justify-between p-3 border items-center"
                key={url}
              >
                <img
                  src={url}
                  alt="uploaded image"
                  className="w-25 h-20 object-contain rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="border border-red-600 text-red-600 font-semibold rounded-md p-2 hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          {imageUploadError && (
            <p className="text-red-600 text-center text-sm uppercase">
              {imageUploadError}
            </p>
          )}
          <button className="p-3 bg-blue-600 text-white rounded-lg shadow-lg">
            {loading ? (
              <span>
                <Loading />
                Creating...
              </span>
            ) : (
              "Create Listing"
            )}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
