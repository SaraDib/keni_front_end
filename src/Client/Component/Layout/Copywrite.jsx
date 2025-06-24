import React from 'react'
import { useNavigate } from "react-router-dom";

function Copywrite() {

    const navigate = useNavigate();
  return (
    <div className="bg-white w-full text-center">
      {/* Section affichée seulement sur mobile */}
      <div className="block md:hidden p-10">
        <h2 className="text-lg font-semibold">
        GlobalHealth - Therapy & Training Center
        </h2>
        <button className="mt-3 bg-customGreen text-white px-6 py-2 rounded-lg"
        onClick={() => navigate("/contact")}>
          Contact
        </button>
      </div>

      {/* Section visible sur tous les écrans */}
      <div className="bg-[#1a2a7b] text-white p-5">
        <p className="text-1.5xl !font-thin">
          SYS | protection des données | propulsé par{" "}
          <span className="text-customGreen font-semibold"><a href='https://rakopssolutions.com/' target='blank' >RAKOPS SOLUTIONS</a> </span>
        </p>
      </div>
    </div>
  )
}

export default Copywrite;