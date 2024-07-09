import React from "react";
import { Button, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";


export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const handleSignOut = async () => {
    const res = await fetch(`api/users/signout`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      dispatch(signOutSuccess())
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser?.user?.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="name"
          placeholder="username"
          defaultValue={currentUser?.user?.name}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.user?.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button
          type="submit"
          className="w-full"
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}
