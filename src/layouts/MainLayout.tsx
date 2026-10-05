import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <React.Fragment>
        <Navbar/>
      <main>
        <Outlet />
      </main>
      <Footer/>
    </React.Fragment>
  );
}

export default MainLayout;
