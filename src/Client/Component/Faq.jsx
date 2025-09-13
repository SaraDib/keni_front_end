import React, { useEffect } from 'react';
import faqImage from "../assets/images/FAQimage.jpg"; 
import fb from "../assets/images/fb.png";
import insta from "../assets/images/insta.png";
import kante from "../assets/images/wave.svg";

import 'aos/dist/aos.css'; 
import AOS from 'aos';
import { useTranslation } from 'react-i18next';

function Faq() {
 const { t,i18n } = useTranslation();

  useEffect(() => {
      AOS.init({
        duration: 1000, // Durée de l'animation
        once: true,     // L'animation ne se répète qu'une seule fois
      });
    }, []);

  return (<>

    <div className="w-full h-screen overflow-hidden relative" name='ss'>
      <img 
        src={faqImage} 
        alt="FAQ" 
        className="w-full h-full object-cover"
      />


      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
        
<div
  key={i18n.language} // force le rerender quand la langue change
  data-aos="zoom-in"
  className={`absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 ${
    i18n.language === 'ar' ? 'lg:mr-14' : 'lg:ml-14'
  }`}
>          <h1 className="text-6xl sm:text-6xl font-dmsans mb-2">{t("faq.title")}</h1>
          <h2 className="text-customGreen text-lg sm:text-4xl font-dmsans max-sm:text-2xl">
          {t("faq.subtitle")}
          </h2>
        </div>

        
       

        <div className="absolute bottom-0 w-full">
          <img src={kante} alt="kante" className="w-full"/>
        </div>
      </div>
      {/* Icônes des réseaux sociaux */}
                <div className="fixed top-2/4 sm:bottom-6 left-24 max-sm:left-6 max-sm:bottom-32 sm:right-16 flex flex-row items-end justify-self-end gap-4 sm:flex-col w-16 z-50">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <div className="bg-white rounded-full w-12 sm:w-14 hover:translate-x-4 transition-all cursor-pointer">
                      <img src={fb} alt="facebook" className="w-full" />
                    </div>
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <div className="bg-white rounded-full w-12 sm:w-14 hover:translate-x-4 transition-all cursor-pointer">
                      <img src={insta} alt="instagram" className="w-full" />
                    </div>
                  </a>
                </div>
               
    </div>
    </>
  );
}

export default Faq;