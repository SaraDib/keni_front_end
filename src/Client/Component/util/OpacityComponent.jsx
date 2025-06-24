
import wave from "../../assets/images/wave.svg";
import wavegrey from '../../assets/images/wave-grey.svg';
import wavewhite from '../../assets/images/wave-white-bottom.svg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

import tel from '../../assets/images/tel.svg'
import Phone from "../../assets/icons/PhoneIcon.png";
import calendar from '../../assets/icons/calendar.png';
import imageopacity from '../../assets/images/T-2-2023-11-08-10_33_40-1200h.webp'
import { useEffect, useState } from "react";
import axios from "axios";

export default function OpacityComponent({top}){
  const navigate = useNavigate();
  const { t , i18n} = useTranslation(); // Add translation hook
  const [setting, setSetting] = useState([])

  useEffect( ()=>{

    axios.get('http://keniweb.test/api/entreprises')
    .then(response => {
      setSetting(response.data);
    })
    .catch(error => {
        console.log('Error loading centres' , error);
        // setLoading(false);
    });

  }
    ,[])
return(
    <>
    {/* green parte*/}
    <div className="relative min-h-[700px] ">
      {/* Arrière-plan en fixed */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-1]"
        style={{
          backgroundImage: `url(${imageopacity})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Contenu principal avec zone verte */}
      <div className="relative bg-customGray/40 z-10 min-h-[800px] flex flex-col justify-center">
        {/* Ajoutez plus de padding si vous souhaitez encore plus d'espace vertical */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center py-16 px-10 lg:px-52 space-y-6 md:space-y-0 md:space-x-10">
          <img
            src={tel}
            alt={t('opacity.phoneAlt', 'Téléphone de contact')}
            className="h-32 md:h-44 w-auto"
          />

          <div className="flex flex-col text-center md:text-left">
            <p className="text-white text-2xl md:text-3xl font-sans max-w-2xl mb-6">
              {t('opacity.contactMessage', 'Contactez-nous pour prendre rendez-vous et faire le premier pas vers une vie plus saine.')}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button
            className="inline-flex items-center  gap-2 max-sm:gap-0 md:gap-3 bg-customGreen border-2 border-customGreen 
                      rounded-full py-2 md:py-0 px-4 max-sm:px-0 md:px-6 mt-4 md:mt-5 text-white font-semibold 
                      transition-all duration-300 ease-in-out 
                      hover:bg-customBleu h-16 md:h-20 hover:border-customGreen hover:text-white 
                      focus:outline-none mx-auto md:mx-0 z-10
                      w-52 md:w-60 lg:w-80 "
            aria-label={t('opacity.appointmentAriaLabel', 'Prendre rendez-vous')}
            onClick={() => navigate("/contact")}
          >
            <img
              src={calendar}
              className="w-6 md:w-8 h-6 max-sm:ml-1 md:h-8 transition-all duration-300 ease-in-out pointer-events-none"
              alt={t('opacity.calendarIconAlt', 'Icône calendrier')}
              aria-hidden="true"
            />
            <span className="transition-all duration-300 ease-in-out lg:text-xl md:text-base">
              {t('header.appointment', 'Prenez rendez-vous dès maintenant')}
            </span>
          </button>

          <button
            className="inline-flex items-center justify-center gap-2 md:gap-3 bg-customGreen border-2 border-customGreen 
                      rounded-full py-2 md:py-0 px-4 md:px-6 mt-4 md:mt-5 text-white font-semibold 
                      transition-all duration-300 ease-in-out 
                      hover:bg-customBleu w-52 md:w-60 h-16 md:h-20 hover:border-customGreen hover:text-white 
                      focus:outline-none mx-auto md:mx-0 z-10"
            aria-label={t('opacity.callAriaLabel', 'Appeler')}
          >
            <img
              src={Phone}
              className="w-6 md:w-8 h-6 md:h-8 transition-all duration-300 ease-in-out pointer-events-none"
              alt={t('opacity.phoneIconAlt', 'Icône phone')}
              aria-hidden="true"
            />
            <span className="transition-all duration-300 ease-in-out text-sm md:text-base">
            {setting.length > 0 ? <a href={`tel:${setting[0].Telephone}`}>{setting[0].Telephone}</a> : t('common.loading', 'Loading...')}
          </span>
          </button>
            </div>
          </div>
        </div>


      {/* Top wave */}
          {top !== "none" && (
            <div className="absolute top-0 left-0 w-full z-20">
              <img src={top === 'white' ? wavewhite : wavegrey} alt={t('opacity.waveAlt', 'vague')} className="w-full" />
            </div>
            )}

      {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 w-full z-20">
          <img src={wave} alt={t('opacity.waveAlt', 'vague')} className="w-full" />
        </div>
      </div>
    </div>
    </>
)}


