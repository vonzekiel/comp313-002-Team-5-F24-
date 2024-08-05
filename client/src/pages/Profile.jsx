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
    <div className="p-3 max-w-lg mx-auto h-screen">
      <h1 className="text-3xl font-bold text-center my-7">My Account</h1>
      <p className="text-center text-sm">
        {fileUploadError ? (
          <span className="text-red-700 font-semibold">
            Unable to change profile picture. Image must be less then 3MB
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
      <form className="flex flex-col" onSubmit={handleSubmit}>
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
          className="rounded-md h-24 w-24 object-cover cursor-pointer self-center mt-2 mx-auto"
        />

        <input
          type="text"
          placeholder="Username"
          className="border p-3 shadow-md rounded-md my-2"
          id="username"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border p-3 shadow-md rounded-md my-2"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 shadow-md rounded-md my-2"
          id="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button
          className="bg-blue-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70"
          disabled={loading}
        >
          {loading && <Loading />}
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button
          className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
        {error && (
          <p className="text-red-500 mt-5 text-center font-bold">
            {error}
            {updateError}
          </p>
        )}
        {updateSuccess && (
          <p className="text-green-500 mt-5 text-center font-bold">
            Account updated successfully!
          </p>
        )}
        <button
          className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
