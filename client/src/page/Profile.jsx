import React, { useEffect, useState } from "react";
import Layout from "../component/Layout/Layout";
import Spinner from "../component/Spinner";
import { FaUserCircle, FaUpload } from "react-icons/fa"; // Import the user icon and upload icon
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          `https://voteeasy-backend.onrender.com/api/users/get-profile/${userDetails._id}`
        );
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [userDetails._id, changed]);

  const imageValidate = (image) => {
    const validationErrors = [];

    if (image.size > 2097152) {
      validationErrors.push("Size too large (above 2 MB)");
    }

    const filetypes = /jpg|jpeg|png/;
    const mimetype = filetypes.test(image.type);
    if (!mimetype) {
      validationErrors.push(
        "Incorrect file type (should be jpg, jpeg, or png)"
      );
    }

    return validationErrors.length > 0 ? { errors: validationErrors } : null;
  };

  const handleUploadPicture = (event) => {
    const file = event.target.files[0];
    const validateResult = imageValidate(file);

    if (validateResult !== null) {
      validateResult.errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    if (file) {
      setImage(file);
    }
  };

  const handleSetAsProfilePicture = () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "chz1skwr");

    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dsjmm6114/image/upload";

    fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(async (data) => {
        try {
          const response = await axios.post(
            `https://voteeasy-backend.onrender.com/api/users/upload/${userDetails._id}`,
            data
          );

          if (response.status === 201) {
            setChanged(true);
            setImage(null);

            toast.success("Profile picture updated successfully");
          } else {
            console.log("Upload failed:", response);
          }
        } catch (err) {
          console.log(err.message);
        }
      })
      .catch((err) => {
        console.log("Error uploading image to Cloudinary: " + err.message);
      });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout>
      <div className="flex justify-center py-8">
        <div className="bg-white max-w-2xl overflow-hidden sm:rounded-lg w-3/4 md:w-1/2 pl-8 shadow-lg shadow-gray-400 pb-3">
          <div className="px-4 py-4 sm:px-6 flex justify-center items-center relative">
            {user.profilePicture === "none" ? (
              image ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`uploaded profile`}
                    className="object-cover rounded-full w-48 h-48"
                  />
                  <label
                    htmlFor="profilePictureUpload"
                    className="cursor-pointer p-2 bg-blue-500  text-white rounded-full hover:bg-blue-600 absolute top-[157px] right-5 "
                  >
                    <FaUpload />
                  </label>
                  <input
                    type="file"
                    id="profilePictureUpload"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={handleUploadPicture}
                  />
                </div>
              ) : (
                <div className="relative">
                  <FaUserCircle className="w-48 h-48 mx-auto text-gray-400 mb-4" />
                  <label
                    htmlFor="profilePictureUpload"
                    className="cursor-pointer p-2 bg-blue-500  text-white rounded-full hover:bg-blue-600 absolute top-[157px] right-5 "
                  >
                    <FaUpload />
                  </label>
                  <input
                    type="file"
                    id="profilePictureUpload"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={handleUploadPicture}
                  />
                </div>
              )
            ) : (
              <img
                src={user.profilePicture}
                className="w-48 h-48 mx-auto object-cover border-2 border-gray-400 rounded-full mb-4"
                alt="profile"
              />
            )}
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${user.firstName} ${user.lastName}`}
                </dd>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.phoneNumber}
                </dd>
              </div>
              {/* <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Is Admin?</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.isAdmin ? "Yes" : "No"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Is Super Admin?</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.isSuperAdmin ? "Yes" : "No"}
                </dd>
              </div> */}
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Vote status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.hasVoted ? <p>Voted</p> : <p>Pending</p>}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {image && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              setSubmit(true);
              handleSetAsProfilePicture();
            }}
            disabled={submit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Set as Profile Picture
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
