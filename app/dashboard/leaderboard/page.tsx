import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Leaderboard Kelas",
  "Halaman tentang leaderboard antar kelas"
);

const LeaderboardPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Leaderboard Kelas</h1>
        <p>Welcome to our website! This is the class leaderboard page.</p>
      </section>
    </div>
  );
};

export default LeaderboardPage;
