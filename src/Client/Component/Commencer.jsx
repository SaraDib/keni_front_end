import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import image1 from '../assets/images/image1.webp';
import image2 from '../assets/images/image2.webp';
import image3 from '../assets/images/wave.svg';
import wave from '../assets/images/wave-white-bottom.svg';
import fbGreen from '../assets/images/F-facebook.png';
import instaGreen from '../assets/images/F-instagram.png';
import fb from '../assets/images/fb.png';
import insta from '../assets/images/insta.png';
import calendar from '../assets/icons/calendar.png';
import OpacityComponent from './util/OpacityComponent';
import axios from 'axios';

export default function Commencer() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [expertData, setExpertData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [mediaError, setMediaError] = useState({ video: false, image: false, updateImage: false });
  const images = [image1, image2];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    const fetchExpertData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/experts');
        const activeExpert = response.data.find((expert) => expert.Etat);
        setExpertData(activeExpert || null);
      } catch (error) {
        console.error('Erreur lors de la récupération des données experts:', error);
      }
    };

    const fetchUpdateData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/updates');
        const data = response.data
          ? { ...response.data, ID_Updates: response.data.id || response.data.ID_Updates }
          : null;
        console.log('Fetched update data:', data);
        setUpdateData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de mise à jour:', error);
      }
    };

    fetchServices();
    fetchExpertData();
    fetchUpdateData();
  }, []);

  // Function to sanitize HTML, removing unwanted <h1> tags
  const sanitizeDescription = (html) => {
    if (!html) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h1Elements = doc.getElementsByTagName('h1');
    while (h1Elements.length > 0) {
      const p = doc.createElement('p');
      while (h1Elements[0].firstChild) {
        p.appendChild(h1Elements[0].firstChild);
      }
      h1Elements[0].parentNode.replaceChild(p, h1Elements[0]);
    }
    return doc.body.innerHTML;
  };

  return (
    <>
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

        <div className="z-90 bg-black bg-opacity-100 flex flex-col gap-10">
          {/* Texte principal */}
          <div
            data-aos="zoom-in"
            className="absolute bottom-1/4 flex flex-col max-sm:left-2 sm:flex sm:justify-start text-white p-4 lg:ml-14"
          >
            <h1 className="max-sm:text-4xl sm:text-5xl font-dmsans mb-2">
              {t('header.title')}
            </h1>
            <h2 className="text-customGreen sm:text-3xl font-dmsans max-sm:text-2xl">
              {t('header.subtitle')}
            </h2>

            <div className="flex mb-4 mr-40">
              <button
                className="inline-flex items-center gap-2 max-sm:gap-0 md:gap-3 bg-customGreen border-2 border-customGreen 
                          rounded-full py-2 md:py-0 px-4 max-sm:px-0 md:px-6 mt-4 md:mt-5 text-white font-semibold 
                          transition-all duration-300 ease-in-out 
                          hover:bg-customBleu h-16 md:h-20 hover:border-customGreen hover:text-white 
                          focus:outline-none mx-auto md:mx-0 z-10
                          w-52 md:w-60 lg:w-80"
                aria-label="Prendre rendez-vous"
                onClick={() => navigate('/contact')}
              >
                <img
                  src={calendar}
                  className="w-6 md:w-8 h-6 max-sm:ml-1 md:h-8 transition-all duration-300 ease-in-out pointer-events-none"
                  alt="Icône calendrier"
                  aria-hidden="true"
                />
                <span className="transition-all duration-300 ease-in-out lg:text-xl md:text-base">
                  {t('header.appointment')}
                </span>
              </button>
            </div>
          </div>

          {/* Icônes des réseaux sociaux */}
          <div className="absolute top-2/4 sm:bottom-6 left-24 max-sm:left-6 max-sm:bottom-32 sm:right-16 flex flex-row items-end justify-self-end gap-4 sm:flex-col w-16">
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

          {/* Image décorative */}
          <div className="absolute bottom-0 w-full">
            <img src={image3} alt="wave" className="w-full" />
          </div>
        </div>
      </div>

      {/* Experts en santé et bien-être */}
      {expertData && (
        <>
          <div className="h-[40px] md:h-[70px] bg-white" />
          <section className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-4 md:p-8 bg-white">
            {/* Conteneur Vidéo */}
            {expertData.ID_Expert && !mediaError.video && (
              <div className="w-full md:w-1/3 flex-shrink-0">
                <video
                  controls
                  muted
                  autoPlay={false}
                  className="w-full h-48 md:h-64 object-cover rounded-lg shadow-xl"
                  poster={
                    expertData.ID_Expert && !mediaError.image
                      ? `http://localhost:8000/api/experts/${expertData.ID_Expert}/image`
                      : undefined
                  }
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    setMediaError((prev) => ({ ...prev, video: true }));
                  }}
                >
                  <source
                    src={`http://localhost:8000/api/experts/${expertData.ID_Expert}/video`}
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas les vidéos HTML.
                </video>
              </div>
            )}

            {/* Contenu Texte */}
            {(expertData.TitleFR || expertData.TitleAR || expertData.DescriptionFR || expertData.DescriptionAR) && (
              <article className="flex-1 space-y-3 md:space-y-4 max-w-2xl mt-6 md:mt-0">
                <h2 className="text-[#1a2a7b] text-2xl md:text-3xl font-semibold mb-2 md:mb-4 font-open-sans text-center md:text-left">
                  {expertData.TitleAR && i18n.language === 'ar' ? expertData.TitleAR : expertData.TitleFR || t('experts.title')}
                </h2>
                {(expertData.DescriptionFR || expertData.DescriptionAR) && (
                  <p
                    className="text-gray-800 lg:text-base md:text-base leading-relaxed font-sans text-center md:text-left"
                    dangerouslySetInnerHTML={{
                      __html: expertData.DescriptionAR && i18n.language === 'ar'
                        ? expertData.DescriptionAR
                        : expertData.DescriptionFR || t('experts.description'),
                    }}
                  />
                )}
              </article>
            )}

            {/* Image */}
            {expertData.ID_Expert && !mediaError.image && (
              <div className="w-full md:w-1/4 flex justify-center mt-6 md:mt-0">
                <img
                  className="w-full max-w-xs md:max-w-2xl h-auto object-cover rounded-lg shadow-md"
                  src={`http://localhost:8000/api/experts/${expertData.ID_Expert}/image`}
                  alt={expertData.TitleFR}
                  onError={(e) => {
                    console.error('Image load error:', `http://localhost:8000/api/experts/${expertData.ID_Expert}/image`);
                    setMediaError((prev) => ({ ...prev, image: true }));
                  }}
                />
              </div>
            )}
          </section>
        </>
      )}
      <div className="h-[40px] md:h-[70px] bg-white" />
      <div className="bg-gray-100 h-36 md:h-72">
        <img src={wave} alt="---" className="w-full h-full object-cover" />
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 mt-0 py-8 md:py-0 h-auto md:h-[900px]">
        <div className="text-[#1a2a7b] text-2xl md:text-4xl font-semibold mb-2 md:mb-4 font-open-sans pl-4 md:pl-10 text-center md:text-left">
          {t('services.title')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mx-2 md:mx-10" data-aos="fade-up">
          {services.map((service) => (
            <div key={service.ID_Service} className="m-2 md:m-4">
              <div
                className="overflow-hidden w-full h-[150px] md:h-[250px] cursor-pointer"
                onClick={() => {
                  navigate(`service/${service.ID_Service}`);
                  window.scrollTo(0, 0);
                }}
              >
                <img
                  src={`http://localhost:8000/api/services/${service.ID_Service}/photo`}
                  alt={service.Nom}
                  className="w-full h-full object-cover transform transition-transform duration-300 scale-125 hover:scale-100"
                />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-[#1a2a7b] font-open-sans mt-1 md:mt-2 ml-2 md:ml-4">
                {i18n.language === 'ar' && service.NomAR ? service.NomAR : service.Nom}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Updates Section */}
      {updateData && (
        <div className="h-auto md:h-[500px] w-full bg-[#1a2a7b] flex flex-col md:flex-row">
          {updateData.ID_Updates && updateData.image_path && !mediaError.updateImage && (
            <img
              src={`http://localhost:8000/api/updates/${updateData.ID_Updates}/image`}
              alt={updateData.title_fr || 'Mise à jour'}
              data-aos="fade-right"
              className="w-full md:w-auto h-auto object-contain mx-auto md:mx-0"
              onError={(e) => {
                console.error('Update image load error:', `http://localhost:8000/api/updates/${updateData.ID_Updates}/image`);
                setMediaError((prev) => ({ ...prev, updateImage: true }));
                e.target.src = '/default-image.png'; // Fallback image
              }}
            />
          )}
          <div className="flex flex-col p-6 md:p-10 lg:p-20">
            {(updateData.title_fr || updateData.title_ar) && (
              <h2 className="text-xl md:text-2xl lg:text-3xl text-white font-open-sans mt-2 ml-2 text-center md:text-left">
                {updateData.title_ar && i18n.language === 'ar' ? updateData.title_ar : updateData.title_fr || t('updates.title')}
              </h2>
            )}
            {(updateData.description_fr || updateData.description_ar) && (
              <div
                className="text-white font-sans mt-4 md:mt-7 ml-2 font-thin text-center md:text-left lg:text-base md:text-base"
                dangerouslySetInnerHTML={{
                  __html: sanitizeDescription(
                    updateData.description_ar && i18n.language === 'ar'
                      ? updateData.description_ar
                      : updateData.description_fr || t('updates.description1')
                  ),
                }}
              />
            )}
            <div className="text-white font-open-sans mt-2 ml-2 font-thin text-center md:text-left text-sm md:text-base">
              {t('updates.description2')}
              <div className="flex flex-row mt-5 justify-center md:justify-start">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src={fbGreen} alt="facebook" className="w-10 md:w-12 mr-3 mt-4" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src={instaGreen} alt="instagram" className="w-10 md:w-12 mr-3 mt-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <OpacityComponent top="none" />
    </>
  );
}