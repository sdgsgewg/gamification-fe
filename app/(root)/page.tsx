import React from "react";
import { withMetadata } from "../utils/withMetadata";

export const metadata = withMetadata("Home", "Halaman tentang website ini");

const HomePage = () => {
  return (
    <div>
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          Selamat Datang di Website Kami
        </h1>
        <p className="text-gray-700">
          Ini adalah halaman utama website publik. Kamu bisa menampilkan
          berbagai informasi penting seperti produk, fitur, atau kontak.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
