import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata(
  "Materi Pelajaran",
  "Halaman tentang manajemen materi pelajaran"
);

const MaterialPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Materi Pelajaran</h1>
        <p>Welcome to our website! This is the mmaterial page.</p>
      </section>
    </div>
  );
};

export default MaterialPage;
