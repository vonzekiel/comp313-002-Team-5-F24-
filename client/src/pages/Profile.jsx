import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const userAvatarRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
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
      <form className="flex flex-col">
        <input
          type="file"
          ref={userAvatarRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          onClick={() => userAvatarRef.current.click()}
          src={formData.avatar ? formData.avatar : currentUser.avatar}
          alt="account logo"
          className="rounded-md h-24 w-24 object-cover cursor-pointer self-center mt-2 mx-auto"
        />

        <input
          type="text"
          placeholder="Username"
          className="border p-3 shadow-md rounded-md my-2"
          id="username"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border p-3 shadow-md rounded-md my-2"
          id="email"
        />
        <input
          type="text"
          placeholder="Password"
          className="border p-3 shadow-md rounded-md my-2"
          id="password"
        />
        <button className="bg-blue-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70">
          Delete Account
        </button>
        <button className="bg-red-600 text-white p-3 rounded-md my-2 hover:opacity-95 disabled:opacity-70">
          Sign Out
        </button>
      </div>
    </div>
  );
}
