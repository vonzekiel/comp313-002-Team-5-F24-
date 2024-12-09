import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutStart,
  logoutFailure,
  logoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const userAvatarRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatar: currentUser.avatar,
  });

  const dispatch = useDispatch();

  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }))
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateError("An error occurred. Please try again later.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutFailure(data.message));
        return;
      }
      dispatch(logoutSuccess(data));
    } catch (error) {
      dispatch(logoutFailure(error.message));
    }
  };

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat h-screen flex flex-col md:flex-row"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="flex-1 flex items-center justify-center md:p-0">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
              {fileUploadError ? (
                <span className="text-red-700 font-semibold">
                  Unable to change profile picture. Image must be less than 3MB
                </span>
              ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
                <span className="text-green-600 font-semibold">
                  {`Uploading ${uploadPercentage}%`}
                </span>
              ) : uploadPercentage === 100 ? (
                <span className="text-blue-600 font-semibold">
                  Uploaded Successfully
                </span>
              ) : (
                ""
              )}
            </p>
          </div>

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <input
              type="file"
              ref={userAvatarRef}
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              onClick={() => userAvatarRef.current.click()}
              src={formData.avatar}
              alt="account logo"
              className="rounded-full h-24 w-24 object-cover cursor-pointer mx-auto"
            />

            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={handleChange}
                value={formData.username}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Type to change your password"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading && <Loading />} {loading ? "Saving..." : "Save Changes"}
            </button>

            {updateSuccess && !error && (
              <p className="text-green-600 dark:text-green-400">
                Your profile has been updated successfully.
              </p>
            )}
            {updateError && (
              <p className="text-red-600 dark:text-red-400">{updateError}</p>
            )}
          </form>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleDeleteUser}
              className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:bg-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50"
            >
              Delete Account
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:bg-gray-500 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2  bg-gray-900 text-white p-8 md:p-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>

        <div className="w-full max-w-xs mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <img
              className="object-cover w-full h-56"
              src={currentUser.avatar || "https://via.placeholder.com/400x400"}
              alt="avatar"
            />
            <div className="py-5 text-center">
              <a
                href="#"
                className="block text-xl font-bold text-gray-800 dark:text-white"
                role="link"
              >
                {currentUser.username}
              </a>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>
        <section className="bg-white dark:bg-gray-900">
          <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
            <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
              Bring your Real Estate Venture to the{" "}
              <span className="text-blue-500">next level.</span>
            </h2>

            <p className="max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300">
              Whether you are a buyer looking for your dream home or a seller
              aiming to get the best value, we are here to assist you every step
              of the way.
            </p>

            <div className="inline-flex w-full mt-6 sm:w-auto space-x-4">
              <Link
                to="/listings"
                className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Buy
              </Link>
              <Link
                to="/my-listings"
                className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-green-600 rounded-lg hover:bg-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-80"
              >
                Sell
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
