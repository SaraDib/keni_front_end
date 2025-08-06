import { useEffect, useState } from 'react';
import axios from 'axios';
import 'aos/dist/aos.css';
import AOS from 'aos';
// First, import useTranslation at the top of the file
import { useTranslation } from 'react-i18next';

// Then modify the component to use translation keys:
function Inputcontact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Nom: '',
    Prenom: '',
    Date_Naissance: '',
    Tel: '',
    Email: '',
    Faire: '',
    Type_recette: '',
    nombre: '',
    Remarque: '',
    ID_Entreprise: 1, // Valeur par défaut requise par le backend
  });
  const [ergotherapieOptions, setErgotherapieOptions] = useState([]);
  const [physiotherapieOptions, setPhysiotherapieOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    const payload = {
      ...formData,
      nombre: formData.nombre ? Number(formData.nombre) : null,
      Type_recette: formData.Type_recette || null,
      Physiotherapie: physiotherapieOptions.length > 0 ? physiotherapieOptions.join(', ') : null,
      Ergotherapie: ergotherapieOptions.length > 0 ? ergotherapieOptions.join(', ') : null,
      Remarque: formData.Remarque || null
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/rendez-vous',
        payload
      );
      console.log('Submission successful:', response.data);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        Nom: '',
        Prenom: '',
        Date_Naissance: '',
        Tel: '',
        Email: '',
        Faire: '',
        Type_recette: '',
        nombre: '',
        Remarque: '',
        ID_Entreprise: 1,
      });
      setErgotherapieOptions([]);
      setPhysiotherapieOptions([]);

    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      setSubmitError(error.response?.data?.errors || {
        general: error.response?.data?.message || 'Une erreur s\'est produite lors de la soumission du formulaire'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTherapyChange = (option, therapyType) => {
    if (therapyType === 'ergo') {
      setErgotherapieOptions(prev => 
        prev.includes(option) 
          ? prev.filter(item => item !== option) 
          : [...prev, option]
      );
    } else {
      setPhysiotherapieOptions(prev => 
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    }
  };

  return (
    <div className="w-full bg-white">
      <div 
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="100"
        data-aos-offset="50" 
        className="bg-white px-40 max-sm:px-0 justify-center"
      >
        <form onSubmit={handleSubmit}>
          {/* Your existing form JSX remains unchanged */}
          <div className="pt-4 flex flex-col gap-8 max-sm:pl-4">
            <h1 className="text-4xl text-[#1a2a7b] font-semibold max-sm:text-2xl">
              {t('contactForm.title')}
            </h1>
            <h2 className="text-2xl text-customGreen max-sm:text-xl">
              {t('contactForm.subtitle')}
            </h2>
          </div>

          <div className="relative ml-0 pt-10 flex flex-col gap-5 max-sm:ml-4 max-sm:mt-6">
            {[{ field: 'Nom', label: t('contactForm.labels.lastName') }, { field: 'Prenom', label: t('contactForm.labels.firstName') }].map((item) => (
              <div key={item.field} className="flex flex-col gap-0 justify-center">
                <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">
                  {item.label}
                </h4>
                <input
                  name={item.field}
                  type="text"
                  value={formData[item.field]}
                  onChange={handleInputChange}
                  required
                  className="w-full max-sm:w-11/12 px-4 py-2 mt-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
                />
                {submitError && submitError[item.field] && (
                  <p className="text-red-500 mt-1 ml-2">{submitError[item.field][0]}</p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-0 justify-center">
              <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">{t('contactForm.labels.birthDate')}</h4>
              <input
                name="Date_Naissance"
                type="date"
                value={formData.Date_Naissance}
                onChange={handleInputChange}
                required
                className="w-full max-sm:w-11/12 px-4 py-2 mt-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
              />
              {submitError && submitError.Date_Naissance && (
                <p className="text-red-500 mt-1 ml-2">{submitError.Date_Naissance[0]}</p>
              )}
            </div>

            <div className="flex flex-row justify-between  max-[1280.60px]:flex-col  gap-32 max-sm:gap-4 max-sm:flex-col">
              {[
                { name: 'Tel', type: 'tel', label:t('contactForm.labels.phone') },
                { name: 'Email', type: 'email', label: t('contactForm.labels.email') }
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-0 justify-center">
                  <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">
                    {field.label}
                  </h4>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    required
                    className="w-120 max-sm:w-11/12 px-4 py-2 mt-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
                  />
                  {submitError && submitError[field.name] && (
                    <p className="text-red-500 mt-1 ml-2">{submitError[field.name][0]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-0 justify-center">
              <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">{t('contactForm.labels.request')}</h4>
              <input
                name="Faire"
                type="text"
                value={formData.Faire}
                onChange={handleInputChange}
                required
                className="w-full max-sm:w-11/12 px-4 py-2 mt-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
              />
              {submitError && submitError.Faire && (
                <p className="text-red-500 mt-1 ml-2">{submitError.Faire[0]}</p>
              )}
            </div> 
          </div>

          <div className="mt-6 ml-10 flex flex-col gap-2 max-sm:ml-4">
            <h1 className="text-2xl text-gray-600 max-sm:text-xl">{t('contactForm.labels.prescriptionType')}</h1>
            <div className="flex flex-col gap-2">
              {[
                "Privé/statutaire",
                "BG (accident de travail)",
                "Gestion de la sortie (après chirurgie)",
                "visite à domicile",
              ].map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="Type_recette"
                    id={`type_recette-${index}`}
                    value={label}
                    checked={formData.Type_recette === label}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`type_recette-${index}`} className="text-gray-700 text-lg cursor-pointer max-sm:text-base">
                    {label}
                  </label>
                </div>
              ))}
            </div>
            {submitError && submitError.Type_recette && (
              <p className="text-red-500 mt-1">{submitError.Type_recette[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-0 justify-center ml-8 mt-6 max-sm:ml-4">
            <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">Nombre</h4>
            <input
              name="nombre"
              type="number"
              min="0"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full max-sm:w-5/6 px-4 py-2 mt-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
            />
          </div>

          <div className="ml-10 flex flex-row gap-40 max-sm:flex-col max-sm:gap-4 max-sm:ml-4">
            {[
              {
                title: 'Ergothérapie',
                options: [
                  "Fonctionnel sur le plan moteur",
                  "Perceptif sensorimoteur",
                  "Entraînement cérébral",
                ],
                type: 'ergo'
              },
              {
                title: 'Physiothérapie',
                options: [
                  "KG",
                  "MT",
                  "MLD30",
                  "MLD45",
                  "MLD60",
                  "SNC/PNF/Bobath",
                  "thérapie par la chaleur",
                ],
                type: 'physio'
              }
            ].map((section, index) => (
              <div key={index} className="mt-6 flex flex-col gap-4">
                <h1 className="text-2xl text-gray-600 max-sm:text-xl">{section.title}</h1>
                <div className="flex flex-col gap-2">
                  {section.options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${section.type}-${idx}`}
                        checked={
                          section.type === 'ergo' 
                            ? ergotherapieOptions.includes(option)
                            : physiotherapieOptions.includes(option)
                        }
                        onChange={() => handleTherapyChange(option, section.type)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`${section.type}-${idx}`} className="text-gray-700 text-lg cursor-pointer max-sm:text-base">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pl-4 flex flex-col gap-2 max-sm:ml-4 mt-8 max-sm:pb-5">
            <label htmlFor="remarques" className="text-gray-600 text-2xl max-sm:text-xl">
              Remarques
            </label>
            <textarea
              name="Remarque"
              id="remarques"
              value={formData.Remarque}
              onChange={handleInputChange}
              className="w-full max-sm:w-5/6 max-sm:ml-5 h-20 p-2 border border-gray-300 bg-gray-100 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-black"
            ></textarea>
            {submitError && submitError.Remarque && (
              <p className="text-red-500 mt-1 ml-2">{submitError.Remarque[0]}</p>
            )}

            {submitError && submitError.general && (
              <p className="text-red-500 mt-1 ml-2">{submitError.general}</p>
            )}

            {submitSuccess && (
              <p className="text-green-500 mt-1 ml-2">Votre rendez-vous a été soumis avec succès!</p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-gray-400' : 'bg-customGreen hover:bg-blue-800'} w-1/4 max-sm:w-5/6 text-white px-6 ml-5 py-3 rounded-full transition-all duration-300 mt-4`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Inputcontact;