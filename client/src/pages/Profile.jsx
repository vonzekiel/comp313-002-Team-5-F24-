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
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { app } from "../firebase";

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

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Account</h1>
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
          {loading && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70">
          Delete Account
        </button>
        {error && (
          <p className="text-red-500 mt-5 text-center font-bold">
            {updateError}
          </p>
        )}
        {updateSuccess && (
          <p className="text-green-500 mt-5 text-center font-bold">
            Account updated successfully!
          </p>
        )}
        <button className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70">
          Sign Out
        </button>
      </div>
    </div>
  );
}
