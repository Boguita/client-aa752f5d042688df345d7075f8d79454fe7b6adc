import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import Footer from "../components/Footer";


export const Layout = () => { 
  return (
    <>
      <Navbar />      
      <Outlet />
      
    </>
  );
  };