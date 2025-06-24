import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Blue Logo.png';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white p-4"  style={{ backgroundColor: '#1A2A7B' }}>
      <img src={logo} alt="Logo" className="mb-16 w-[600px] h-52" />

<h1 className="text-6xl font-bold mb-4"><span className="text-7xl relative inline-block">
      404</span>  - Page non trouvée</h1>



      <p className="mb-16 mt-10 text-center">
      Oups ! La page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.
      </p>
      <Link to="/" className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold hover:bg-lime-500 border-2 transition duration-300 hover:text-white ">
      Aller à la page Commencer
      </Link>
     
      </div>
  );
}
