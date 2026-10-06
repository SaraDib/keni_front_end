import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import React from 'react'

const Page = ({ title, subtitle, image, imagefb, imageinsta, imagevaque, title1, subtitle1, title2, subtitle2 }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,  // Durée de l'animation
      once: true,      // L'animation ne se répète qu'une seule fois
    });
  }, []);
  return (
    <div>
      <div className="w-full h-screen overflow-hidden relative z-80">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between ">
          <div data-aos="zoom-in" className="absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4">
            <h1 className="max-sm:text-5xl sm:text-[56px] font-dmsans mb-2 ">{title}</h1>
            <h2 className="text-customGreen sm:text-[32px] font-dmsans max-sm:text-2xl">
              {subtitle}
            </h2>
          </div>

          <div className="hidden md:flex absolute top-2/4 sm:bottom-6 left-24 max-sm:left-6 max-sm:bottom-44 sm:right-16 flex flex-row items-end justify-self-end gap-4 sm:flex-col w-12 z-40">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={imagefb} alt="facebook" className="w-full" />
              </div>
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={imageinsta} alt="instagram" className="w-full" />
              </div>
            </a>
          </div>

          <div className="absolute bottom-0 w-full">
            <img src={imagevaque} alt="vague" className="w-full" />
          </div>
        </div>

      </div>
      <div className="bg-white px-44 py-10 flex flex-col gap-10 max-sm:px-4 max-sm:py-6">
        <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">{title1}</h1>
        <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
          {subtitle1}
        </h2>
      </div>
      <div className="bg-white px-44 py-10 flex flex-col gap-10 max-sm:px-4 max-sm:py-6">
        <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">{title2}</h1>
        <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
          {subtitle2}
        </h2>
      </div>
    </div>
  )
}

export default Page  
