import React from "react";
import { Button, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccessA } from "../../redux/admin/adminSlice";

export default function AdminDashProfile() {
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state) => state.admin);
  const backendURL = "https://meddoc-backend-cqw0.onrender.com";
  const handleSignOut = async () => {
    const res = await fetch(`${backendURL}api/admin/logout`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      dispatch(signOutSuccessA());
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentAdmin?.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="name"
          placeholder="username"
          defaultValue={currentAdmin?.name}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentAdmin?.email}
          disabled
        />
        {/*    <Button
          type="submit"
          className="w-full"
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Update
        </Button> */}
      </form>
      <div className="text-blue-500 flex justify-center mt-5">
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}
