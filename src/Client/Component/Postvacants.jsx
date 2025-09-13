import React, { useState, useEffect } from "react"
import imagego from '../assets/images/T+2+2023-11-08+10_33_40-2880w.webp';
import fb from "../assets/images/fb.png";
import insta from "../assets/images/insta.png";
import kante from "../assets/images/wave.svg";
import kulosfski from "../assets/images/wave-grey (1).svg";

import icon1 from '../assets/images/offerEmplois/Saving-Piggy-Coins--Streamline-Ultimate.svg';
import icon2 from '../assets/images/offerEmplois/Performance-Money-Increase--Streamline-Ultimate.svg';
import icon3 from '../assets/images/offerEmplois/Insurance-Document-Edit--Streamline-Ultimate.svg';
import icon4 from '../assets/images/offerEmplois/Certified-Diploma-2--Streamline-Ultimate.svg';
import icon5 from '../assets/images/offerEmplois/Fitness-Dumbbell--Streamline-Ultimate.svg';
import icon6 from '../assets/images/offerEmplois/Sunbathe--Streamline-Ultimate.svg';
import icon7 from '../assets/images/offerEmplois/Time-Play-Time-1--Streamline-Ultimate.svg';
import icon8 from '../assets/images/offerEmplois/Mountain-Bike-2--Streamline-Ultimate.svg';
import icon9 from '../assets/images/offerEmplois/Idea-Settings-1--Streamline-Ultimate.svg';

import 'aos/dist/aos.css';
import AOS from 'aos';
import Per2 from '../assets/images/p2.webp';
import OpacityComponent from "./util/OpacityComponent";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Postvacants() {
  const { t ,i18n} = useTranslation();

  // Updated state variables to match backend requirements
  const [formData, setFormData] = useState({
    ID_Entreprise: 1, // Default value, adjust as needed
    Salutation: 'M.',
    Nom: '',
    Rue: '',
    Code_Postal: '',
    Ville: '',
    Email: '',
    Telephone: '',
    Profession: ''
  });

  const [lettre, setLettre] = useState(null);
  const [CV, setCV] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file changes
  const handleFileChange = (e, fileType) => {
    if (fileType === 'CV') {
      setCV(e.target.files[0]);
    } else if (fileType === 'lettre') {
      setLettre(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for submission
    const submitData = new FormData();

    // Add all form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add files if they exist
    if (lettre) {
      submitData.append("lettre", lettre);
    }

    if (CV) {
      submitData.append("CV", CV);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/offres-emploi", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Formulaire soumis avec succès !");

      // Reset form after successful submission
      setFormData({
        ID_Entreprise: 1,
        Salutation: 'M.',
        Nom: '',
        Rue: '',
        Code_Postal: '',
        Ville: '',
        Email: '',
        Telephone: '',
        Profession: ''
      });
      setLettre(null);
      setCV(null);

      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error);

      // Show more detailed error message if available
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else {
        toast.error("Erreur lors de l'envoi du formulaire");
      }
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const advantages = [
    { icon: icon1, text: "Salaire 3 500 – 3 900€ pour 37 heures par semaine" },
    { icon: icon2, text: "600€ net en plus grâce aux avantages non monétaires" },
    { icon: icon3, text: "Régime de retraite d'entreprise avec subvention allant jusqu'à 100 €" },
    { icon: icon4, text: "Prise en charge de la totalité des frais de formation" },
    { icon: icon5, text: "Activités passionnantes en thérapie, formations, groupes, conférences, cours de formation" },
    { icon: icon6, text: "30 jours de récupération" },
    { icon: icon7, text: "Vendredi 14 h : début de la fin de semaine" },
    { icon: icon8, text: "Location de vélos avec jusqu'à 40 € de subvention" },
    { icon: icon9, text: "Apportez vos idées" }
  ];

  return (
    <div>
      <Toaster position="bottom-left" reverseOrder={false} />
      {/* section 1 */}
      <div className="w-full h-full overflow-hidden relative">
        <img
          src={imagego}
          alt="FAQ"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">

<div
  key={i18n.language} // force le rerender quand la langue change
  data-aos="zoom-in"
  className={`absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-7 ${
    i18n.language === 'ar' ? 'lg:mr-14' : 'lg:ml-14'
  }`}
>            <h1 className="max-sm:text-4xl sm:text-6xl font-dmsans mb-2 ">{t('jobOffers.pageTitle')}</h1>
            <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl">
              {t('header.subtitle')}
            </h2>
          </div>



          <div className="absolute bottom-0 w-full">
            <img src={kante} alt="kante" className="w-full" />
          </div>
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
         
      {/* section 2 */}
      <div className="flex flex-col md:flex-row items-center bg-white 
        lg:pt-10 max-sm:py-14 sm:py-10
        lg:px-56 max-sm:px-8 sm:px-10">
        {/* Left Side - Form */}
        <div className="md:w-3/4 w-full" data-aos="fade-right">
          <h2 className="text-3xl text-blue-800 font-semibold">
            {t('jobOffers.formTitle')}
          </h2>
          <p className="text-customGreen text-lg mt-2">
            {t('jobOffers.formSubtitle')}
          </p>

          <p className="text-blue-800 font-semibold ">
            {t('jobOffers.formCallToAction')}
          </p>

          {/* Form */}
          <form className="mt-6 mx-6 mr-20 max-sm:mr-0 max-sm:mx-0" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Salutation */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.salutationLabel')}</h2>
                <select
                  className="border border-blue-800 p-2"
                  name="Salutation"
                  value={formData.Salutation}
                  onChange={handleChange}
                  required
                >
                  <option value="M.">{t('jobOffers.salutationM')}</option>
                  <option value="Mme.">{t('jobOffers.salutationMme')}</option>
                  <option value="Mlle.">{t('jobOffers.salutationMlle')}</option>
                </select>
              </div>

              {/* Nom */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.nameLabel')}</h2>
                <input
                  type="text"
                  placeholder={t('jobOffers.namePlaceholder')}
                  className="border border-blue-800 p-2"
                  name="Nom"
                  value={formData.Nom}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Rue */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.streetLabel')}</h2>
                <input
                  type="text"
                  placeholder={t('jobOffers.streetPlaceholder')}
                  className="border border-blue-800 p-2"
                  name="Rue"
                  value={formData.Rue}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Code postal */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.zipCodeLabel')}</h2>
                <input
                  type="text"
                  placeholder={t('jobOffers.zipCodePlaceholder')}
                  className="border border-blue-800 p-2"
                  name="Code_Postal"
                  value={formData.Code_Postal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Ville */}
            <div className="flex flex-col gap-2 mt-5">
              <h2>{t('jobOffers.cityLabel')}</h2>
              <input
                type="text"
                placeholder={t('jobOffers.cityPlaceholder')}
                className="border border-blue-800 p-2"
                name="Ville"
                value={formData.Ville}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {/* E-mail */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.emailLabel')}</h2>
                <input
                  type="email"
                  placeholder={t('jobOffers.emailPlaceholder')}
                  className="border border-blue-800 p-2"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Téléphone */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.phoneLabel')}</h2>
                <input
                  type="text"
                  placeholder={t('jobOffers.phonePlaceholder')}
                  className="border border-blue-800 p-2"
                  name="Telephone"
                  value={formData.Telephone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-6 gap-6">
              {/* Profession */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.professionLabel')}</h2>
                <input
                  type="text"
                  placeholder={t('jobOffers.professionPlaceholder')}
                  className="border border-blue-800 p-2 col-span-2"
                  name="Profession"
                  value={formData.Profession}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Lettre de motivation */}
              <div className="flex flex-col gap-2">
                <h2>{t('jobOffers.motivationLetterLabel')}</h2>
                <input
                  type="file"
                  className="mt-2 block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    hover:file:border border-customBleu
                    file:bg-[#ebf6e0] file:text-[#152a7e]
                    file:cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'lettre')}
                />
              </div>
            </div>

            <div className="my-8">
              <label className="block">{t('jobOffers.cvLabel')}</label>
              <input
                type="file"
                className="mt-6 block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  hover:file:border border-customBleu
                  file:bg-[#ebf6e0] file:text-[#152a7e]
                  file:cursor-pointer"
                onChange={(e) => handleFileChange(e, 'CV')}
              />
            </div>

            <button
              className="mt-6 bg-customGreen transition-all duration-300 hover:bg-blue-900 text-white py-3 px-16 rounded-full"
              type="submit"
            >
              {t('jobOffers.submitButton')}
            </button>
          </form>
        </div>

        {/* Right Side - Image & Contact */}
        <div className="md:w-1/4 w-full flex flex-col items-center md:items-start mt-6 md:mt-0">
          <div className="flex justify-center md:justify-start">
            <div className="w-72 h-72 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
              <img
                src={Per2}
                alt="Person smiling"
                className="w-full h-full object-contain object-center"
              />
            </div>
          </div>


          <p className="mt-4 text-blue-800 text-center md:text-left">
            {t('jobOffers.contactPersonText')}
          </p>
        </div>
      </div>

      {/* section 3 */}
      <div className="w-full bg-white">
        <div className="w-full">
          <img src={kulosfski} alt="kulosfski" className="w-full" />
        </div>

        <div className="mx-auto bg-[#f3f3f3] py-12 px-6 sm:px-16 md:px-32 text-2xl">
          <div className="justify-start flex flex-col" data-aos="fade-up">
            <h1 className="text-4xl font-bold text-[#1a2a7b]">{t('jobOffers.advantagesTitle')}</h1>
            <h2 className="text-2xl text-customGreen mt-2">{t('jobOffers.advantagesSubtitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {t('jobOffers.advantagesList', { returnObjects: true }).map((adv, index) => (
              <div key={index} className="flex flex-col items-center p-4" data-aos="fade-up">
                <img src={advantages[index].icon} alt="" className="w-24 h-24 object-contain hover:scale-125 transition-all" />
                <p className="text-blue-900 mt-4 text-center">{adv}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* section 4 */}
      <div className="relative pt-8 md:pt-12 lg:pt-16 bg-gray-100" />
      <OpacityComponent />
      <div className="bg-white h-[30px] md:h-[50px] lg:h-[100px]" />
    </div>
  );
}