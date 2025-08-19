import React, { useState, useEffect } from 'react';
import 'aos/dist/aos.css'; 
import AOS from 'aos';

import photo1 from "../assets/images/shutterstock_1487135780-1920w.jpg";
import photo2 from "../assets/images/shutterstock_1628797483-1920w.jpg"
import amwaj1 from "../assets/images/wave.svg";
import fb from "../assets/images/fb.png";
import insta from "../assets/images/insta.png";

// First, import useTranslation at the top of the file
import { useTranslation } from 'react-i18next';

// Then modify the component to use translation keys:
export default function Contact(){
  const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        photo1,
        photo2,
      ];
    
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
    
        return () => clearInterval(interval);
      }, [images.length]);


       useEffect(() => {
          AOS.init({
            duration: 1000, // Durée de l'animation
            once: true,     // L'animation ne se répète qu'une seule fois
          });
        }, []);
    return(
        <div className="w-full h-screen overflow-hidden relative">
      {/* Diaporama en arrière-plan */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`absolute w-full h-full object-cover transition-transform duration-1000 ease-in-out ${
            index === currentIndex
              ? 'translate-x-0'
              : index < currentIndex
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
        {/* Texte principal */}
        <div
          data-aos="zoom-in"
          className="absolute bottom-1/2 sm:bottom-1/3 lg:ml-14 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4">
          <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">
            {t('contact.title')}
          </h1>
          <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl">
            {t('contact.subtitle')}
          </h2>
        </div>

        

        {/* Image décorative */}
        <div className="absolute bottom-0 w-full">
          <img src={amwaj1} alt="wave" className="w-full" />
        </div>
      </div>
    </div>  
    )
}