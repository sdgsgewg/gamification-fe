import Header from "../components/layout/AuthLayout/Header";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center pt-32 pb-24 transition-colors duration-300">
        {children}
      </div>
    </main>
  );
}
