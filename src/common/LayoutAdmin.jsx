import { Outlet, Navigate } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import Dashboard from "../pages/Dashboard";
import Footer from "../components/Footer";


export const LayoutAdmin = () => { 
  return (
    <>
      <NavbarAdmin />      
      <Outlet />
      
    </>
  );
  };