import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Phone, Globe, Mail, MapPin, Facebook, Instagram, Image } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import axios from 'axios';

// Composant pour gérer les sliders
const SliderUploader = ({ sliderImages, setSliderImages, nomPage }) => {
  const [newSliderImages, setNewSliderImages] = useState([]);

  const token = localStorage.getItem('token');

  // Upload des nouvelles images
  const uploadSliderImages = async () => {
    if (newSliderImages.length === 0) return;
    try {
      const formData = new FormData();
      newSliderImages.forEach(file => formData.append('sliderImages[]', file));
      formData.append('nom_page', nomPage);
      const response = await axios.post('http://localhost:8000/api/slider', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setSliderImages(prev => [...prev, ...response.data.data]);
      setNewSliderImages([]);
    } catch (err) {
      console.error('Erreur upload slider', err);
    }
  };

  // Supprimer une image existante
  const handleDeleteSliderImage = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/slider/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSliderImages(prev => prev.filter(img => img.ID_Image !== id && img.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du slider', err);
    }
  };

  // Supprimer une nouvelle image non uploadée
  const handleRemoveNewSliderImage = (index) => {
    setNewSliderImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="block text-sm font-medium text-gray-700 mb-2">Images de la page {nomPage}</h3>
      <div className="flex flex-wrap gap-4">
        {/* Images existantes */}
        {sliderImages.map((img) => (
          <div key={img.ID_Image || img.id} className="relative w-32 h-20 border rounded overflow-hidden">
            <img src={`http://localhost:8000/storage/${img.Path}`} alt="Slider" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDeleteSliderImage(img.ID_Image || img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}

        {/* Nouvelles images */}
        {newSliderImages.map((file, index) => (
          <div key={index} className="relative w-32 h-20 border rounded overflow-hidden">
            <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveNewSliderImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}

{/* Ajouter */}
{(nomPage === 'commencer' || nomPage === 'contact') || 
 (sliderImages.length === 0 && newSliderImages.length === 0) ? (
  <label className="w-32 h-20 flex items-center justify-center border border-dashed rounded cursor-pointer text-gray-400 hover:text-gray-600">
    + Ajouter
    <input
      type="file"
      multiple={nomPage === 'commencer' || nomPage === 'contact'}
      accept="image/*"
      className="hidden"
      onChange={(e) => setNewSliderImages([...newSliderImages, ...Array.from(e.target.files)])}
    />
  </label>
) : null}



      </div>

      {newSliderImages.length > 0 && (
        <button
          type="button"
          onClick={uploadSliderImages}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Upload nouvelles images
        </button>
      )}
    </div>
  );
};

// Composant principal SettingsPage
const SettingsPage = () => {
  const [settings, setSettings] = useState({
    ID_Entreprise: '',
    Nom: '',
    Logo: '',
    logoPreview: '/images/logo.png',
    Telephone: '',
    Whatsapp: '',
    Email: '',
    Adresse: '',
    Facebook: '',
    Instagram: ''
  });

  const [sliderImages, setSliderImages] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const STORAGE_BASE = "http://localhost:8000/storage";

  // Charger les paramètres
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/entreprises/1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const entrepriseData = response.data.data || response.data;

      setSettings({
        ID_Entreprise: entrepriseData.ID_Entreprise || '',
        Nom: entrepriseData.Nom || '',
        Logo: entrepriseData.Logo || '',
        Telephone: entrepriseData.Telephone || '',
        Whatsapp: entrepriseData.Whatsapp || '',
        Email: entrepriseData.Email || '',
        Adresse: entrepriseData.Adresse || '',
        Facebook: entrepriseData.Facebook || '',
        Instagram: entrepriseData.Instagram || '',
        logoPreview: entrepriseData.Logo ? `${STORAGE_BASE}/${entrepriseData.Logo}` : '/images/logo.png'
      });

      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des paramètres');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les images du slider
  const fetchSliderImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/slider');
      setSliderImages(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des images du slider', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchSliderImages();
  }, []);

  // Gestion des changements des champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'Logo' && files && files[0]) {
      setSettings(prev => ({ ...prev, [name]: files[0], logoPreview: URL.createObjectURL(files[0]) }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // Soumettre les settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      Object.keys(settings).forEach(key => {
        if (key === 'logoPreview') return;
        if (key === 'Logo' && settings[key] instanceof File) formData.append('Logo', settings[key]);
        else if (key !== 'Logo' && settings[key] != null) formData.append(key, settings[key]);
      });

      await axios.post(`http://localhost:8000/api/entreprises/${settings.ID_Entreprise}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      await fetchSettings();
    } catch (err) {
      setError('Erreur lors de la sauvegarde des paramètres');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Settings size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Phone size={18} /> },
    { id: 'social', label: 'Réseaux sociaux', icon: <Globe size={18} /> }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Settings className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Paramètres</h1>
      </div>

      <p className="mb-6 text-gray-600">Personnalisez les paramètres de votre site web.</p>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">Les paramètres ont été sauvegardés avec succès.</div>}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Onglets */}
            <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="flex-1 p-6 max-h-[60vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h2>

                    {/* Nom entreprise */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                      <input
                        type="text"
                        name="Nom"
                        value={settings.Nom}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Nom de l'entreprise"
                      />
                    </div>

                    {/* Logo */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo du site</label>
                      <div className="flex items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden mr-4 flex items-center justify-center">
                          {settings.logoPreview ? (
                            <img src={settings.logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                          ) : (
                            <Image size={32} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <label className="block">
                            <span className="sr-only">Choisir un logo</span>
                            <input
                              type="file"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              accept="image/*"
                              onChange={handleChange}
                              name="Logo"
                            />
                          </label>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG ou GIF. Taille recommandée: 200x200px</p>
                        </div>
                      </div>
                    </div>

                    {/* Slider */}
                    <SliderUploader
                      sliderImages={sliderImages.filter(img => img.nom_page === 'commencer')}
                      setSliderImages={setSliderImages}
                      nomPage="commencer"
                    />
                    <SliderUploader
                      sliderImages={sliderImages.filter(img => img.nom_page === 'qui sommes nous')}
                      setSliderImages={setSliderImages}
                      nomPage="qui sommes nous"
                    />
                    <SliderUploader
                      sliderImages={sliderImages.filter(img => img.nom_page === "offres d'emploi")}
                      setSliderImages={setSliderImages}
                      nomPage="offres d'emploi"
                    />
                    <SliderUploader
                      sliderImages={sliderImages.filter(img => img.nom_page === "FAQ")}
                      setSliderImages={setSliderImages}
                      nomPage="FAQ"
                    />
                    <SliderUploader
                      sliderImages={sliderImages.filter(img => img.nom_page === 'contact')}
                      setSliderImages={setSliderImages}
                      nomPage="contact"
                    />

                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="Telephone" className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone size={16} className="inline mr-1" />
                          Numéro de téléphone
                        </label>
                        <input
                          type="tel"
                          id="Telephone"
                          name="Telephone"
                          value={settings.Telephone}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                      <div>
                        <label htmlFor="Whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                          <FaWhatsapp size={16} className="inline mr-1" />
                          Numéro WhatsApp
                        </label>
                        <input
                          type="tel"
                          id="Whatsapp"
                          name="Whatsapp"
                          value={settings.Whatsapp}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail size={16} className="inline mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          id="Email"
                          name="Email"
                          value={settings.Email}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="Adresse" className="block text-sm font-medium text-gray-700 mb-1">
                          <MapPin size={16} className="inline mr-1" />
                          Adresse
                        </label>
                        <textarea
                          id="Adresse"
                          name="Adresse"
                          value={settings.Adresse}
                          onChange={handleChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="123 Rue de la Santé, 75001 Paris, France"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="Facebook" className="block text-sm font-medium text-gray-700 mb-1">
                          <Facebook size={16} className="inline mr-1 text-blue-600" />
                          Facebook
                        </label>
                        <input
                          type="url"
                          id="Facebook"
                          name="Facebook"
                          value={settings.Facebook}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="https://facebook.com/votrepage"
                        />
                      </div>
                      <div>
                        <label htmlFor="Instagram" className="block text-sm font-medium text-gray-700 mb-1">
                          <Instagram size={16} className="inline mr-1 text-pink-600" />
                          Instagram
                        </label>
                        <input
                          type="url"
                          id="Instagram"
                          name="Instagram"
                          value={settings.Instagram}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="https://instagram.com/votrecompte"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white flex items-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Sauvegarder...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Sauvegarder les modifications
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
