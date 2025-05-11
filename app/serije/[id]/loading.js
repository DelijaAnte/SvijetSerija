import React from "react";

export default function Loading() {
  return (
    <div className="p-4 animate-pulse space-y-4">
      <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto" />
      <div className="h-6 bg-gray-300 rounded w-full" />
      <div className="h-[450px] bg-gray-300 rounded w-full max-w-2xl mx-auto" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
    </div>
  );
}
