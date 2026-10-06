import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import image3 from '../assets/images/wave.svg';
import wave from '../assets/images/wave-white-bottom.svg';
import fbGreen from '../assets/images/F-facebook.png';
import instaGreen from '../assets/images/F-instagram.png';
import fb from '../assets/images/fb.png';
import insta from '../assets/images/insta.png';
import calendar from '../assets/icons/calendar.png';
import OpacityComponent from './util/OpacityComponent';
import axios from 'axios';
import API_BASE_URL from '../../config';

export default function Commencer() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [expertData, setExpertData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [mediaError, setMediaError] = useState({ video: false, image: false, updateImage: false });
  const [sliderImages, setSliderImages] = useState([]);
  const [primaryColor, setPrimaryColor] = useState("#1a2a7b");
  const [secondaryColor, setSecondaryColor] = useState("#9FB873");
  const [backgroundColor, setBackgroundColor] = useState("#333333");
  const navigate = useNavigate();

  // Récupération des images du slider depuis l'API
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/slider`, {
          params: { nom_page: 'commencer' }
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

  // Changement automatique des slides
  useEffect(() => {
    if (sliderImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderImages]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    const fetchExpertData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/experts`);
        const activeExpert = response.data.find(expert => expert.Etat);
        setExpertData(activeExpert || null);
      } catch (error) {
        console.error('Erreur lors de la récupération des données experts:', error);
      }
    };

    const fetchUpdateData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/updates`);
        const data = response.data
          ? { ...response.data, ID_Updates: response.data.id || response.data.ID_Updates }
          : null;
        setUpdateData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de mise à jour:', error);
      }
    };

    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/entreprises/1`);
        const data = response.data.data || response.data;
        if (data.CouleurPrimaire) setPrimaryColor(data.CouleurPrimaire);
        if (data.CouleurSecondaire) setSecondaryColor(data.CouleurSecondaire);
        if (data.CouleurBackground) setBackgroundColor(data.CouleurBackground);
      } catch (error) {
        console.error('Erreur lors de la récupération des données entreprise:', error);
      }
    };

    fetchServices();
    fetchExpertData();
    fetchUpdateData();
    fetchEntreprise();
  }, []);

  // Fonction pour nettoyer les <h1> dans les descriptions
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

  const [smoothScrollY, setSmoothScrollY] = useState(0);

  // Gestion du scroll avec LERP pour une animation ultra fluide
  useEffect(() => {
    let requestRef;
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    const updateScroll = () => {
      targetScrollY = window.scrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;
      setSmoothScrollY(currentScrollY);
      requestRef = requestAnimationFrame(updateScroll);
    };

    requestRef = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(requestRef);
  }, []);

  // Calcul des valeurs basées sur le scroll lissé
  const scrollThreshold = 1000;
  const progress = Math.min(smoothScrollY / scrollThreshold, 1);

  // Le scale doit être exponentiel pour un effet fluide de "passage à travers"
  const scale = 1 + Math.pow(progress, 4) * 60;

  // Détection du mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const textOpacity = 1 - Math.min(progress * 2, 1);
  const overlayOpacity = 1 - Math.pow(progress, 3);
  const dynamicY = 45 + (progress * 5);

  return (
    <>
      <div className="relative" style={{ height: '220vh' }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden" style={{ backgroundColor: backgroundColor }}>
          {/* Arrière-plan : Diaporama d'images (Nettes) */}
          <div className="absolute inset-0">
            {sliderImages.length > 0 && sliderImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  zIndex: 1,
                  transform: `scale(${1 + progress * 0.15})`, // Léger zoom parallax sur l'image
                  willChange: 'transform, opacity'
                }}
              />
            ))}
          </div>

          {/* Calque de Masque SVG (Le Portal - Blur sur le gris) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center', WillChange: 'transform' }}
            >
              <defs>
                <mask id="portalMask">
                  <rect width="1000" height="500" fill="white" />
                  <text
                    x="50%"
                    y={`${dynamicY}%`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-black uppercase italic"
                    style={{
                      fontSize: isMobile ? '28px' : '70px', // Réduit encore la taille pour un aspect plus fin
                      fill: 'black',
                      fontWeight: 900,
                      letterSpacing: isMobile ? '-0.05em' : '-0.06em'
                    }}
                  >
                    {t('header.title')}
                  </text>
                </mask>
              </defs>
              {/* Le rectangle gris avec effet de flou (Glassmorphism sur ce qui est caché) */}
              <rect
                width="1000"
                height="500"
                fill={backgroundColor}
                fillOpacity="1"
                mask="url(#portalMask)"
                style={{
                  opacity: overlayOpacity,
                  willChange: 'opacity'
                }}
              />
            </svg>
          </div>

          {/* Sous-titre et éléments décoratifs qui s'effacent */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            style={{ opacity: textOpacity }}
          >
            {/* Ajustement de la marge mobile pour le sous-titre */}
            <div className={`${isMobile ? 'mt-24' : 'mt-24 md:mt-32'} text-center`}>
              <h2 className={`${i18n.language === 'ar' ? 'text-[20px] md:text-[40px] tracking-[0.8em] font-light' : 'text-[10px] md:text-xl tracking-[0.3em] font-dmsans uppercase'} opacity-90 drop-shadow-xl px-4`} style={{ color: secondaryColor }}>
                {t('header.subtitle')}
              </h2>
            </div>
          </div>

          {/* Image de vague en bas qui s'efface */}
          <div className="absolute bottom-0 w-full z-30" style={{ opacity: 1 - progress * 3 }}>
            <img src={image3} alt="wave" className="w-full" />
          </div>
        </div>
      </div>

      {/* Icônes des réseaux sociaux et Réservation - Masquées sur mobile pour éviter l'encombrement, z-index 40 pour être derrière le menu */}
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
        {/* Bouton de réservation style icône */}
        <div
          onClick={() => navigate('/contact')}
          title={t('header.appointment')}
          className="rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-3 flex items-center justify-center group"
          style={{ backgroundColor: secondaryColor }}
        >
          <img
            src={calendar}
            alt="reservation"
            className="w-full brightness-0 invert"
          />
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
                      ? `${API_BASE_URL}/experts/${expertData.ID_Expert}/image`
                      : undefined
                  }
                  onError={(e) => setMediaError((prev) => ({ ...prev, video: true }))}
                >
                  <source
                    src={`${API_BASE_URL}/experts/${expertData.ID_Expert}/video`}
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas les vidéos HTML.
                </video>
              </div>
            )}

            {/* Contenu Texte */}
            {(expertData.TitleFR || expertData.TitleAR || expertData.DescriptionFR || expertData.DescriptionAR) && (
              <article className="flex-1 space-y-3 md:space-y-4 max-w-2xl mt-6 md:mt-0">
                <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 font-open-sans text-center md:text-left" style={{ color: primaryColor }}>
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
                  src={`${API_BASE_URL}/experts/${expertData.ID_Expert}/image`}
                  alt={expertData.TitleFR}
                  onError={(e) => setMediaError((prev) => ({ ...prev, image: true }))}
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
      <div className="bg-gray-100 mt-0 py-8 md:py-16 h-auto">
        <div className="text-xl md:text-3xl font-semibold mb-2 md:mb-4 font-open-sans pl-4 md:pl-10 text-center md:text-left" style={{ color: primaryColor }}>
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
                  src={`${API_BASE_URL}/services/${service.ID_Service}/photo`}
                  alt={service.Nom}
                  className="w-full h-full object-cover transform transition-transform duration-300 scale-125 hover:scale-100"
                />
              </div>
              <h3 className="text-base md:text-xl font-bold font-open-sans mt-1 md:mt-2 ml-2 md:ml-4" style={{ color: primaryColor }}>
                {i18n.language === 'ar' && service.NomAR ? service.NomAR : service.Nom}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Updates Section */}
      {updateData && (
        <div className="h-auto md:h-[500px] w-full flex flex-col md:flex-row" style={{ backgroundColor: primaryColor }}>
          {updateData.ID_Updates && updateData.image_path && !mediaError.updateImage && (
            <img
              src={`${API_BASE_URL.replace('/api', '/storage')}/${updateData.image_path}`}
              alt={updateData.title_fr || 'Mise à jour'}
              data-aos="fade-right"
              className="w-full md:w-auto h-auto object-contain mx-auto md:mx-0"
              onError={(e) => {
                setMediaError((prev) => ({ ...prev, updateImage: true }));
                e.target.src = '/default-image.png';
              }}
            />
          )}
          <div className="flex flex-col p-6 md:p-10 lg:p-20">
            {(updateData.title_fr || updateData.title_ar) && (
              <h2 className="text-lg md:text-xl lg:text-2xl text-white font-open-sans mt-2 ml-2 text-center md:text-left">
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
