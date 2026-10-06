import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';

import Wave from '../../assets/images/wave.svg'
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import API_BASE_URL from '../../../config';

function Services1({ serviceData }) {
  const { i18n } = useTranslation();
  const [firstRowService, setFirstRowService] = useState(null);
  const [otherRows, setOtherRows] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (serviceData?.row_services) {
      setFirstRowService(serviceData.row_services.find(s => s.Classement === 1));
      setOtherRows(serviceData.row_services
        .filter(s => s.Classement !== 1)
        .sort((a, b) => a.Classement - b.Classement)
      );
    }
  }, [serviceData]);

  const getLocalizedText = (item, field) => {
    if (i18n.language === 'ar' && item[`${field}AR`]) {
      return item[`${field}AR`];
    }
    return item[field];
  };

  return (
    <div>
      {/* Hero */}
      <div className="w-full h-screen overflow-hidden relative">
        <img
          src={`${API_BASE_URL}/services/${serviceData.ID_Service}/photo`}
          alt="Service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between">
          <div
            key={i18n.language}
            data-aos="zoom-in"
            className={`absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 ${i18n.language === 'ar' ? 'lg:mr-14' : 'lg:ml-14'}`}
          >
            <h1 className="max-sm:text-4xl sm:text-[48px] font-dmsans mb-2">{getLocalizedText(serviceData, 'Nom')}</h1>
            <h2 className="text-customGreen sm:text-[28px] font-dmsans max-sm:text-2xl">{getLocalizedText(serviceData, 'Descriptions')}</h2>
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

          <div className="absolute bottom-0 w-full">
            <img src={Wave} alt="wave" className="w-full" />
          </div>
        </div>
      </div>

      {/* First Row */}
      {/* FIRST ROW — même organisation que la capture */}
      {firstRowService && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            {/* Titre (prend le titre du row s’il existe, sinon le nom du service) */}
            <h2 className="text-2xl md:text-3xl font-dmsans text-[#1f3e8a] mb-6">
              {getLocalizedText(firstRowService, 'Titre') ||
                getLocalizedText(serviceData, 'Nom')}
            </h2>

            {/* Paragraphe */}
            <div
              className="prose max-w-none text-base mb-10"
              dangerouslySetInnerHTML={{
                __html:
                  i18n.language === 'ar' && firstRowService.TextAR
                    ? firstRowService.TextAR
                    : firstRowService.Text,
              }}
            />

            {/* Deux images côte-à-côte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstRowService.photos?.[0] && (
                <div data-aos="fade-right" className="rounded-md overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/photos/${firstRowService.photos[0].ID_Photo}/image`}
                    alt="row-1"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              )}
              {firstRowService.photos?.[1] ? (
                <div data-aos="fade-left" className="rounded-md overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/photos/${firstRowService.photos[1].ID_Photo}/image`}
                    alt="row-2"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              ) : (
                // Garde la grille équilibrée si une seule image
                <div className="hidden md:block" />
              )}
            </div>
          </div>
        </section>
      )}


      {/* Alternance strict texte/image */}
      {otherRows.map((service, index) => {
        const isEven = index % 2 === 0; // alternance
        return (
          <div key={service.ID_Row_Service} className={`flex max-sm:flex-col ${isEven ? 'bg-gray-100' : 'bg-customBleu'}`}>
            {isEven ? (
              <>
                {/* Texte */}
                <div className="w-3/5 p-10 max-sm:p-6 max-sm:w-full">
                  <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' && service.TextAR ? service.TextAR : service.Text }} />
                </div>
                {/* Image */}
                <div data-aos="fade-left" className="w-2/5 max-sm:w-full max-sm:p-4">
                  {service.photos && service.photos.length > 0 && (
                    <img src={`${API_BASE_URL}/photos/${service.photos[0].ID_Photo}/image`} alt="service" className="w-full h-auto object-cover" />
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Image */}
                <div data-aos="fade-right" className="w-2/5 max-sm:w-full max-sm:p-4">
                  {service.photos && service.photos.length > 0 && (
                    <img src={`${API_BASE_URL}/photos/${service.photos[0].ID_Photo}/image`} alt="service" className="w-full h-auto object-cover" />
                  )}
                </div>
                {/* Texte */}
                <div className="w-3/5 p-10 max-sm:p-6 max-sm:w-full text-white">
                  <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' && service.TextAR ? service.TextAR : service.Text }} />
                </div>
              </>
            )}
          </div>
        );
      })}

    </div>
  );
}

export default Services1;
