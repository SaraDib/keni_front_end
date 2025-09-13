import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import fleche from '../assets/icons/icons8-forward-26.png';
import qsn from '../assets/images/QuiSommeNous.webp';
import wave from '../assets/images/wave.svg';
import wavewhite from '../assets/images/wave-white-bottom.svg';
import fb from '../assets/images/fb.png';
import insta from '../assets/images/insta.png';
import OpacityComponent from './util/OpacityComponent';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function QuiSommeNous() {
  const { t, i18n } = useTranslation();
  const [aboutUsList, setAboutUsList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(null);

  const fetchAboutUs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/about-us');
      setAboutUsList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading about us:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipes');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  useEffect(() => {
    fetchAboutUs();
    fetchEmployees();
  }, []);

  // Filter employees by type
  const gestionEmployees = employees.filter(emp => emp.Profession === 'gestion');
  const medicalEmployees = employees.filter(emp => emp.Profession === 'medical');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Open modal with the clicked employee's index
  const openModal = (index) => {
    setCurrentEmployeeIndex(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployeeIndex(null);
  };

  // Move to the next employee
  const nextEmployee = () => {
    setCurrentEmployeeIndex((prevIndex) =>
      prevIndex === employees.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Move to the previous employee
  const prevEmployee = () => {
    setCurrentEmployeeIndex((prevIndex) =>
      prevIndex === 0 ? employees.length - 1 : prevIndex - 1
    );
  };

  // Handle click outside modal to close it
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Parse HTML description into list items
  const parseDescription = (html) => {
    if (!html) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('p, li')).map((el) =>
      el.innerText.trim()
    );
    return items.filter((item) => item.length > 0);
  };

  // Combine descriptions from all active sections
  const descriptionItems = aboutUsList
    .filter(section => section.active)
    .flatMap(section => 
      parseDescription(i18n.language === 'ar' ? section.description_ar : section.description_fr)
    );

  return (
    <>
      {/* Header Section */}
      <div className="w-full h-screen overflow-hidden relative">
        <img src={qsn} alt="Qui Sommes-Nous" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">
          <div
  key={i18n.language} // force le rerender quand la langue change
  data-aos="zoom-in"
  className={`absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 ${
    i18n.language === 'ar' ? 'lg:mr-14' : 'lg:ml-14'
  }`}
>
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">{t('aboutUs.pageTitle')}</h1>
            <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl">
              {t('header.subtitle')}
            </h2>
          </div>
          
          <div className="absolute bottom-0 w-full">
            <img src={wave} alt="kante" className="w-full" />
          </div>
        </div>
      </div>

      <div className="bg-white h-[30px] md:h-[50px] lg:h-[70px]" />
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
             
      {/* Historique Section */}
      <div className="bg-white py-8 md:py-12 px-4 md:px-8 lg:px-10">
        {descriptionItems.length > 0 && (
          <div className="text-blue-800 text-2xl md:text-3xl font-open-sans mb-6 md:mb-8 text-center md:text-left">
            {t('aboutUs.pageTitle')}
          </div>
        )}
        <div className="space-y-4 md:space-y-5 mx-auto max-w-3xl description-content">
          {descriptionItems.length > 0 ? (
            descriptionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center text-sm md:text-base lg:text-lg font-thin text-center md:text-left"
              >
                <img src={fleche} alt="Flèche" className="inline h-3 md:h-4 mr-3 md:mr-4" />
                {item}
              </div>
            ))
          ) : null}
        </div>
      </div>

      {/* Wave Transition */}
      <div className="bg-gray-100 h-24 md:h-48 lg:h-72">
        <img src={wavewhite} alt="Vague décorative" className="w-full h-full object-cover" />
      </div>

      {/* Équipe Section */}
      <div className="bg-gray-100 px-4 md:px-8 lg:px-10 pb-12 md:pb-16">
        <div className="text-blue-800 text-2xl md:text-3xl font-open-sans mb-8 md:mb-10 text-center md:text-left">
          {t('aboutUs.teamTitle')}
        </div>

        {/* Gestion Subsection */}
        <div id="gestion" className="text-blue-800 text-lg md:text-xl font-open-sans mb-6 md:mb-8 text-center md:text-left">
          {t('aboutUs.managementTitle')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mx-auto max-w-4xl">
          {gestionEmployees.map((employee, index) => (
            <div key={employee.ID_Equipe} className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={index * 100}>
              <div
                className="w-40 h-40 md:w-44 md:h-44 bg-white rounded-full overflow-hidden cursor-pointer flex items-center justify-center border-4 border-[#1e40af] hover:border-customGreen transition-all duration-300"
                onClick={() => openModal(employees.findIndex(emp => emp.ID_Equipe === employee.ID_Equipe))}
              >
                <img
                  src={`http://localhost:8000/api/equipes/${employee.ID_Equipe}/image`}
                  className="w-full h-full object-contain rounded-full"
                  alt={employee.Nom}
                />
              </div>
              <div className="text-blue-800 text-lg md:text-xl mt-2">{i18n.language === 'ar' ? employee.NomAR : employee.Nom}</div>
              <div className="text-blue-800 text-xs md:text-sm mt-1">{i18n.language === 'ar' ? employee.ProfessionAR : employee.Profession}</div>
            </div>
          ))}
        </div>

        {/* Équipe (Medical) Subsection */}
        <div id="equipe" className="text-blue-800 text-lg md:text-xl font-open-sans mt-12 md:mt-16 mb-6 md:mb-8 text-center md:text-left">
          {t('aboutUs.medicalTeamTitle')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto max-w-6xl">
          {medicalEmployees.map((employee, index) => (
            <div key={employee.ID_Equipe} className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={index * 50}>
              <div
                className="w-40 h-40 md:w-44 md:h-44 bg-white rounded-full overflow-hidden cursor-pointer flex items-center justify-center border-4 border-[#1e40af] hover:border-customGreen transition-all duration-300"
                onClick={() => openModal(employees.findIndex(emp => emp.ID_Equipe === employee.ID_Equipe))}
              >
                <img
                  src={`http://localhost:8000/api/equipes/${employee.ID_Equipe}/image`}
                  className="w-full h-full object-contain rounded-full"
                  alt={employee.Nom}
                />
              </div>
              <div className="text-blue-800 text-lg md:text-xl mt-2">{i18n.language === 'ar' ? employee.NomAR : employee.Nom}</div>
              <div className="text-blue-800 text-xs md:text-sm mt-1">{i18n.language === 'ar' ? employee.ProfessionAR : employee.Profession}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && currentEmployeeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6 lg:p-8" onClick={handleOverlayClick}>
          <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg w-full max-w-xs md:max-w-sm lg:max-w-md relative">
            <div className="w-full h-full bg-white rounded-full overflow-hidden">
              <img
                src={`http://localhost:8000/api/equipes/${employees[currentEmployeeIndex].ID_Equipe}/image`}
                alt={i18n.language === 'ar' ? employees[currentEmployeeIndex].NomAR : employees[currentEmployeeIndex].Nom}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-blue-800 text-lg md:text-xl font-open-sans">
                {i18n.language === 'ar' ? employees[currentEmployeeIndex].NomAR : employees[currentEmployeeIndex].Nom}
              </h3>
              <p className="text-blue-800 text-xs md:text-sm">
                {i18n.language === 'ar' ? employees[currentEmployeeIndex].ProfessionAR : employees[currentEmployeeIndex].Profession}
              </p>
              {employees[currentEmployeeIndex].Description && (
                <p className="text-gray-600 text-sm mt-2">
                  {i18n.language === 'ar' ? employees[currentEmployeeIndex].DescriptionAR : employees[currentEmployeeIndex].Description}
                </p>
              )}
            </div>
            <button
              onClick={prevEmployee}
              className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white border-2 border-customGreen p-2 md:p-3 rounded-full hover:bg-blue-800 transition-all duration-300"
              aria-label={t('aboutUs.prevEmployee')}
            >
              <img src={fleche} alt="Flèche précédente" className="w-4 md:w-5 h-4 md:h-5 transform rotate-180" />
            </button>
            <button
              onClick={nextEmployee}
              className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white border-2 border-customGreen p-2 md:p-3 rounded-full hover:bg-blue-800 transition-all duration-300"
              aria-label={t('aboutUs.nextEmployee')}
            >
              <img src={fleche} alt="Flèche suivante" className="w-4 md:w-5 h-4 md:h-5" />
            </button>
            <button
              onClick={closeModal}
              className="mt-6 bg-customGreen text-white py-2 px-4 md:py-3 md:px-6 rounded-full w-full font-semibold transition-all duration-300 hover:bg-blue-900"
            >
              {t('aboutUs.closeButton')}
            </button>
          </div>
        </div>
      )}
      <div className="pt-8 md:pt-12 lg:pt-16 bg-gray-100" />
      <OpacityComponent />
      <div className="bg-white h-[30px] md:h-[50px] lg:h-[100px]" />
    </>
  );
}
