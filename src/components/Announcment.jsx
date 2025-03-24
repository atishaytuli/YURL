import React from "react";

const Announcement = () => {
  return (
    <div className="w-full bg-indigo-200 text-blue-900 text-center p-2 font-semibold">
      <span className="bg-yellow-400 text-blue-700 px-1 font-bold rounded mr-2">NEW</span>
      Explore innovative ways to connect! Dive into our{" "}
      <a
        href="https://bitly.com/blog/qr-code-inspiration-gallery/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold"
      >
        QR Code Inspiration Gallery
      </a>{" "}
      today.
    </div>
  );
};

export default Announcement;
