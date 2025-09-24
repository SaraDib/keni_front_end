import { useEffect, useState } from 'react';
import axios from 'axios';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';

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
    ID_Entreprise: 1,
  });

  const [typesRecetteOptions, setTypesRecetteOptions] = useState([]);
  const [physiotherapieData, setPhysiotherapieData] = useState([]); // données de l'API
  const [physiotherapieOptions, setPhysiotherapieOptions] = useState([]); // options sélectionnées

  // Nouveaux états pour la logique des packs
  const [hasOrdonnance, setHasOrdonnance] = useState('');
  const [nombreSeances, setNombreSeances] = useState('');
  const [consentement, setConsentement] = useState(false);
  const [packSanteGlobaleSelected, setPackSanteGlobaleSelected] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchOptions = async () => {
      try {
        const [typesRecetteResponse, physiotherapieResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/types-recette'),
          axios.get('http://localhost:8000/api/physiotherapie'),
        ]);

        setTypesRecetteOptions(typesRecetteResponse.data);
        setPhysiotherapieData(physiotherapieResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des options', error);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTherapyChange = (optionNom) => {
    // Vérifier si Pack Santé Globale est sélectionné
    const isPackSanteGlobale = optionNom === 'Pack Santé Globale (5–20 séances : kinésithérapie avec ordonnance + entraînement fonctionnel + bilans de suivi + option massage thérapeutique)';
    
    if (isPackSanteGlobale) {
      if (physiotherapieOptions.includes(optionNom)) {
        // Désélection du Pack Santé Globale
        setPackSanteGlobaleSelected(false);
        setHasOrdonnance('');
        setNombreSeances('');
      } else {
        // Sélection du Pack Santé Globale
        setPackSanteGlobaleSelected(true);
      }
    }

    setPhysiotherapieOptions(prev =>
      prev.includes(optionNom)
        ? prev.filter(item => item !== optionNom)
        : [...prev, optionNom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validation pour Pack Santé Globale
    if (packSanteGlobaleSelected && hasOrdonnance === 'Non') {
      setSubmitError({
        general: 'La kinésithérapie nécessite une ordonnance médicale. Merci de fournir une ordonnance ou de choisir un pack sans kinésithérapie.'
      });
      setIsSubmitting(false);
      return;
    }

    // Validation du consentement
    if (!consentement) {
      setSubmitError({
        general: 'Vous devez accepter que GlobalHealth vous contacte pour confirmer votre réservation.'
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      nombre: nombreSeances ? Number(nombreSeances) : null,
      Type_recette: formData.Type_recette || null,
      Physiotherapie: physiotherapieOptions.join(', ') || null,
      Remarque: formData.Remarque || null,
      hasOrdonnance: hasOrdonnance || null,
     
      consentement: consentement,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/rendez-vous', payload);
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
      setPhysiotherapieOptions([]);
      setHasOrdonnance('');
      setNombreSeances('');
      setConsentement(false);
      setPackSanteGlobaleSelected(false);
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      setSubmitError(error.response?.data?.errors || {
        general: error.response?.data?.message || 'Une erreur s\'est produite lors de la soumission du formulaire'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour déterminer si le bouton doit être désactivé
  const isButtonDisabled = () => {
    // Toujours désactivé si pas de consentement
    if (!consentement) {
      return true;
    }
    
    // Si Pack Santé Globale est sélectionné
    if (packSanteGlobaleSelected) {
      // Désactivé si pas de réponse à la question ordonnance
      if (hasOrdonnance === '') {
        return true;
      }
      // Désactivé si pas d'ordonnance
      if (hasOrdonnance === 'Non') {
        return true;
      }
      // Désactivé si ordonnance "Oui" mais pas de nombre de séances
      if (hasOrdonnance === 'Oui' && (!nombreSeances || nombreSeances === '')) {
        return true;
      }
    }
    
    // Désactivé pendant la soumission
    return isSubmitting;
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
          <div className="pt-4 flex flex-col gap-8 max-sm:pl-4">
            <h1 className="text-4xl text-[#1a2a7b] font-semibold max-sm:text-2xl">
              {t('contactForm.title')}
            </h1>
            <h2 className="text-2xl text-customGreen max-sm:text-xl">
              {t('contactForm.subtitle')}
            </h2>
          </div>

          {/* Nom / Prenom */}
          <div className="relative ml-0 pt-10 flex flex-col gap-5 max-sm:ml-4 max-sm:mt-6">
            {[{ field: 'Nom', label: t('contactForm.labels.lastName') }, { field: 'Prenom', label: t('contactForm.labels.firstName') }].map((item) => (
              <div key={item.field} className="flex flex-col gap-0 justify-center">
                <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">{item.label}</h4>
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

            {/* Date de naissance */}
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

            {/* Tel / Email */}
            <div className="flex flex-row justify-between max-[1280.60px]:flex-col gap-32 max-sm:gap-4 max-sm:flex-col">
              {[{ name: 'Tel', type: 'tel', label: t('contactForm.labels.phone') }, { name: 'Email', type: 'email', label: t('contactForm.labels.email') }].map((field) => (
                <div key={field.name} className="flex flex-col gap-0 justify-center">
                  <h4 className="text-2xl text-gray-600 ml-2 max-sm:text-xl">{field.label}</h4>
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

            {/* Faire */}
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

          {/* Type recette */}
          <div className="mt-6 ml-10 flex flex-col gap-2 max-sm:ml-4">
            <h1 className="text-2xl text-gray-600 max-sm:text-xl">{t('contactForm.labels.prescriptionType')}</h1>
            <div className="flex flex-col gap-2">
              {typesRecetteOptions.map((label) => (
                <div key={label.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="Type_recette"
                    id={`type_recette-${label.id}`}
                    value={label.nom}
                    checked={formData.Type_recette === label.nom}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`type_recette-${label.id}`} className="text-gray-700 text-lg cursor-pointer max-sm:text-base">
                    {label.nom}
                  </label>
                </div>
              ))}
            </div>
            {submitError && submitError.Type_recette && (
              <p className="text-red-500 mt-1">{submitError.Type_recette[0]}</p>
            )}
          </div>

          {/* Physiothérapie */}
          <div className="ml-10 flex flex-col gap-6 max-sm:ml-4 mt-4">
            <h1 className="text-2xl text-gray-600 max-sm:text-xl">{t('contactForm.labels.physiotherapy')}</h1>
            <div className="flex flex-col gap-2">
              {physiotherapieData.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`physio-${option.id}`}
                    value={option.nom}
                    checked={physiotherapieOptions.includes(option.nom)}
                    onChange={() => handleTherapyChange(option.nom)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`physio-${option.id}`} className="text-gray-700 text-lg cursor-pointer max-sm:text-base">
                    {option.nom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions spéciales pour Pack Santé Globale */}
          {packSanteGlobaleSelected && (
            <div className="ml-10 flex flex-col gap-4 max-sm:ml-4 mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-xl text-blue-800 font-semibold">{t('contactForm.globalHealthPackConditions')}</h2>
              
              {/* Question ordonnance médicale */}
              <div className="flex flex-col gap-2">
                <h4 className="text-lg text-gray-700">{t('contactForm.medicalPrescription.question')}</h4>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasOrdonnance"
                      value="Oui"
                      checked={hasOrdonnance === 'Oui'}
                      onChange={(e) => setHasOrdonnance(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{t('contactForm.medicalPrescription.yes')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasOrdonnance"
                      value="Non"
                      checked={hasOrdonnance === 'Non'}
                      onChange={(e) => setHasOrdonnance(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{t('contactForm.medicalPrescription.no')}</span>
                  </label>
                </div>
              </div>

              {/* Champ nombre de séances - affiché seulement si "Oui" est sélectionné */}
              {hasOrdonnance === 'Oui' && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg text-gray-700">Nombre de séances prescrites</h4>
                  <select
                    name="nombreSeances"
                    value={nombreSeances}
                    onChange={(e) => setNombreSeances(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  >
                    <option value="">Sélectionnez le nombre de séances</option>
                    <option value="5">5 séances</option>
                    <option value="10">10 séances</option>
                    <option value="15">15 séances</option>
                    <option value="20">20 séances</option>
                  </select>
                  {submitError && submitError.nombreSeances && (
                    <p className="text-red-500 text-sm">{submitError.nombreSeances[0]}</p>
                  )}
                </div>
              )}



              {/* Message d'erreur si pas d'ordonnance */}
              {hasOrdonnance === 'Non' && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 text-sm">
                    La kinésithérapie nécessite une ordonnance médicale. Merci de fournir une ordonnance ou de choisir un pack sans kinésithérapie.
                  </p>
                </div>
              )}

              {/* Messages de validation en temps réel */}
              {packSanteGlobaleSelected && hasOrdonnance === '' && (
                <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    {t('contactForm.medicalPrescription.pleaseIndicate')}
                  </p>
                </div>
              )}


            </div>
          )}

          

          {/* Remarque et bouton */}
          <div className="pl-4 flex flex-col gap-2 max-sm:ml-4 mt-8 max-sm:pb-5">
            <label htmlFor="remarques" className="text-gray-600 text-2xl max-sm:text-xl">{t('contactForm.remarks')}</label>
            <textarea
              name="Remarque"
              id="remarques"
              value={formData.Remarque}
              onChange={handleInputChange}
              className="w-full max-sm:w-5/6 max-sm:ml-5 h-20 p-2 border border-gray-300 bg-gray-100 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-black"
            ></textarea>
            {/* Message de validation pour le consentement */}
          {!consentement && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg max-sm:ml-4">
              <p className="text-yellow-700 text-sm">
                {t('contactForm.consent.message')}
              </p>
            </div>
          )}
            {/* Consentement obligatoire */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentement"
                  checked={consentement}
                  onChange={(e) => setConsentement(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <label htmlFor="consentement" className="text-gray-700 text-base cursor-pointer">
                  <span className="font-semibold text-red-600">*</span> {t('contactForm.consent.label')}
                </label>
              </div>
              <p className="text-gray-600 text-sm mt-2 ml-8">
                {t('contactForm.consent.message')}
              </p>
            </div>

            {submitError && submitError.Remarque && <p className="text-red-500 mt-1 ml-2">{submitError.Remarque[0]}</p>}
            
            {submitSuccess && <p className="text-green-500 mt-1 ml-2">Votre réservation a été soumise avec succès!</p>}
            {submitError && submitError.general && <p className="text-red-500 mt-1 ml-2">{submitError.general}</p>}
            <button
              type="submit"
              disabled={isButtonDisabled()}
              className={`${isButtonDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-customGreen hover:bg-blue-800'} w-1/4 max-sm:w-5/6 text-white px-6 ml-5 py-3 rounded-full transition-all duration-300 mt-4`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Réserver mon Pack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Inputcontact;
