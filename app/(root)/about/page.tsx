import { withMetadata } from "@/app/utils/withMetadata";
import React from "react";

export const metadata = withMetadata("About Us", "Halaman tentang website ini");

const AboutPage = () => {
  return (
    <div>
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p>Welcome to our website! This is the about page.</p>
      </section>
    </div>
  );
};

export default AboutPage;
