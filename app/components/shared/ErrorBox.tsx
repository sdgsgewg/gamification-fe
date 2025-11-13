"use client";
import React from "react";

export default function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-3 mt-2">
      {message}
    </div>
  );
}
