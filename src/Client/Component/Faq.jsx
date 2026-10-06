import React, { useEffect, useState } from 'react';
import faqImage from "../assets/images/FAQimage.jpg";
import fb from "../assets/images/fb.png";
import insta from "../assets/images/insta.png";
import kante from "../assets/images/wave.svg";

import 'aos/dist/aos.css';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import API_BASE_URL from '../../config';
function Faq() {
  const { t, i18n } = useTranslation();
  const [sliderImages, setSliderImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Durée de l'animation
      once: true,     // L'animation ne se répète qu'une seule fois
    });
  }, []);

  // Slider interval
  useEffect(() => {
    if (sliderImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages]);

  // Récupération des images du slider depuis l'API
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/slider`, {
          params: {
            nom_page: 'FAQ' // ici tu mets le nom de la page
          }
        });
        const storageBase = API_BASE_URL.replace('/api', '/storage');
        const imagesFromAPI = response.data.map(img => `${storageBase}/${img.Path}`);
        setSliderImages(imagesFromAPI);
      } catch (err) {
        console.error('Erreur lors du chargement des images du slider', err);
      }
    };

    fetchSliderImages();
  }, []);
  return (<>

    <div className="w-full h-screen overflow-hidden relative" name='ss'>
      {sliderImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`absolute w-full h-full object-cover transition-transform duration-1000 ease-in-out ${index === currentIndex
            ? 'translate-x-0'
            : index < currentIndex
              ? '-translate-x-full'
              : 'translate-x-full'
            }`}
        />
      ))}


      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">

        <div
          key={i18n.language} // force le rerender quand la langue change
          data-aos="zoom-in"
          className={`absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 ${i18n.language === 'ar' ? 'lg:mr-14' : 'lg:ml-14'
            }`}
        >          <h1 className="max-sm:text-3xl sm:text-[38px] font-dmsans mb-2">{t("faq.title")}</h1>
          <h2 className="text-customGreen sm:text-[22px] font-dmsans max-sm:text-2xl">
            {t("faq.subtitle")}
          </h2>
        </div>




        <div className="absolute bottom-0 w-full">
          <img src={kante} alt="kante" className="w-full" />
        </div>
      </div>
      {/* Icônes des réseaux sociaux */}
      <div className="hidden md:flex fixed top-2/4 sm:bottom-6 left-24 max-sm:left-6 max-sm:bottom-32 sm:right-16 flex-row items-end justify-self-end gap-4 sm:flex-col w-12 z-40">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
            <img src={fb} alt="facebook" className="w-full" />
          </div>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
            <img src={insta} alt="instagram" className="w-full" />
          </div>
        </a>
      </div>

    </div>
  </>
  );
}

export default Faq;