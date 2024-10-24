import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div className="container mx-auto py-4 bg-black text-white ">
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center gap-4">
          <Link href={"/"}>Home</Link>
          <Link href={"/login"}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
