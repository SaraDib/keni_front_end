import { Outlet } from "react-router-dom";
import BlueNavbar from "./BlueNavBar";
import Footer from "../util/Footer";
import Copywrite from "./Copywrite";


export default function Layout() {
  return (
    <>
      <BlueNavbar/>
      <div className="pt-16 "/>
        <Outlet />
      <div className="sm:my-0 max-sm:hidden">
        <Footer/>
      </div>
      <Copywrite />
 </>
 );
}