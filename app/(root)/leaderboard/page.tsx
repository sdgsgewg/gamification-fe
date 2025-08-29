import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Leaderboard",
  "Halaman tentang leaderboard pegguna"
);

const LeaderboardPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <p>Welcome to our website! This is the leaderboard page.</p>
      </section>
    </div>
  );
};

export default LeaderboardPage;
