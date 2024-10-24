"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const NavBar = ({ session }: any) => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div className="container mx-auto py-4 bg-black text-white ">
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center gap-4">
          <Link href={"/"}>Home</Link>
          {session ? (
            <Button onClick={() => handleSignOut()}>Sign out</Button>
          ) : (
            <Link href={"/login"}>Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
