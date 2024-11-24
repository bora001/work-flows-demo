import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
const Side = () => {
  return (
    <div className="flex flex-col bg-blue-400 w-[50px] h-screen  items-center py-3">
      <Link href="/">
        <HomeIcon className="text-white" />
      </Link>
    </div>
  );
};

export default Side;
