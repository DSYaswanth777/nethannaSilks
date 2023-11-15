import React, { useState, useEffect } from "react";
import { Button, Input, Label } from "reactstrap";
import { Edit } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserprofileAsync,
  profileEditAsync,
} from "../../redux/slice/profileSlice";
import { Shimmer } from "react-shimmer";
import { useForm, Controller } from "react-hook-form"; // Import React Hook Form
import { profileEditSchema } from "../../schema/validationSchema";

const Profile = () => {
  const profileData = useSelector((state) => state.profile?.profile);
  const status = useSelector((state) => state.profile?.status);
  const dispatch = useDispatch();
  const [editedEmail, setEditedEmail] = useState(profileData?.email);

  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Initialize React Hook Form

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserprofileAsync());
    }
  }, [status, dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async (data) => {
    if (!isEditing) return;

    if (data.name !== profileData.name || data.email !== profileData.email) {
      await dispatch(profileEditAsync({ name: data.name, email: data.email }));
      dispatch(fetchUserprofileAsync());
    }
    setIsEditing(false);
  };

  return (
    <>
      <div className="container pt-5">
        <div className="border p-4">
          <div className="d-flex justify-content-between py-3">
            <h4 className="text-center"> PROFILE</h4>
            <div className="d-flex"></div>
            <p
              className="fs-5 d-flex gap-2 justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
              onClick={handleEditClick}
            >
              <Edit size={16} className="text-primary" />
              Edit
            </p>
          </div>

          <Label for="name">Name</Label>
          <Controller
            name="name"
            control={control}
            defaultValue={profileData?.name || ""}
            rules={profileEditSchema.name}
            render={({ field }) => (
              <>
                {status === "loading" ? (
                  <Shimmer width={200} height={20} />
                ) : (
                  <Input
                    type="text"
                    name="name"
                    {...field}
                    value={isEditing ? field.value : profileData?.name || ""}
                    className={`mb-3 ${errors.name ? "is-invalid" : ""}`}
                    disabled={!isEditing}
                  />
                )}
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </>
            )}
          />

          <Label for="email">Email</Label>
          <Controller
            name="email"
            control={control}
            defaultValue={profileData?.email || ""}
            rules={profileEditSchema.email}
            render={({ field }) => (
              <>
                {status === "loading" ? (
                  <Shimmer width={200} height={20} />
                ) : (
                  <Input
                    type="text"
                    name="email"
                    {...field}
                    value={isEditing ? field.value : profileData?.email || ""}
                    className={`mb-3 ${errors.email ? "is-invalid" : ""}`}
                    disabled={!isEditing}
                  />
                )}
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </>
            )}
          />

          <Label for="mobile">Mobile</Label>
          <Input
            type="number"
            name="mobile"
            value={profileData.mobile || ""}
            className="mb-3"
            disabled
          />
          <Button
            className="mt-3 text-right"
            color="success"
            onClick={handleSubmit(handleSaveChanges)}
            disabled={
              !isEditing ||
              (editedEmail === profileData.name &&
                editedEmail === profileData.email)
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
