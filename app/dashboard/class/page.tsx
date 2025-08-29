import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata("Kelas Saya", "Halaman tentang kelas");

const ClassPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Kelas Saya</h1>
        <p>Welcome to our website! This is the class page.</p>
      </section>
    </div>
  );
};

export default ClassPage;
