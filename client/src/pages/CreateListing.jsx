import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import Loading from "../components/Loading";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

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

  return (
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg shadow-md"
            id="name"
            maxLength={50}
            min={4}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg shadow-md"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg shadow-md"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parking" />
              <span>With Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedroom"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathroom"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <div className="flex flex-col items-center">
                <span>Price</span>
                <span className="text-xs">($ / Month)</span>
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
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
