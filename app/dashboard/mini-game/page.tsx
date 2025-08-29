import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Mini Game",
  "Halaman tentang manajemen mini game"
);

const MiniGamePage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Mini Game</h1>
        <p>Welcome to our website! This is the mini game page.</p>
      </section>
    </div>
  );
};

export default MiniGamePage;
