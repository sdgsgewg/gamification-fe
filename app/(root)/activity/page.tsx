import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Aktivitas",
  "Halaman tentang aktivitas dalam website"
);

const ActivityPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Activity</h1>
        <p>Welcome to our website! This is the activity page.</p>
      </section>
    </div>
  );
};

export default ActivityPage;
