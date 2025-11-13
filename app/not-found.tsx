import React from "react";
// import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer";
// import NormalContent from "./components/ContentTemplate/NormalContent";
import PageNotFound from "./components/shared/PageNotFound";

const NotFound = () => {
  return (
    <main className="font-work-sans">
      <PageNotFound image_url="/img/page-not-found.png" message="" />
    </main>
  );
};

// const NotFound = () => {
//   return (
//     <main className="font-work-sans">
//       <Navbar />

//       <NormalContent>
//         <PageNotFound
//           image_url="/img/page-not-found.png"
//           message=""
//         />
//       </NormalContent>

//       <Footer />
//     </main>
//   );
// };

export default NotFound;
