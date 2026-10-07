import React, { useState, useEffect } from 'react';
import { Settings, Save, Upload, Phone, Globe, Mail, MapPin, Facebook, Instagram, Image, ImagePlus, Gift, Plus, Pencil, Trash2, X, Building2, Palette } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import axios from 'axios';
import SettingsPageModals from './SettingsPageModals';
import API_BASE_URL from '../../config';
import {
  PageHeader, Card, Button, IconButton, RowActions, Field, Input, Textarea, FileInput,
  FormActions, Alert, LoadingState, EmptyState, inputClass
} from '../ui';

const cx = (...classes) => classes.filter(Boolean).join(' ');

// Vignette d'image du slider (existante ou nouvelle)
const sliderThumbClass = 'relative h-20 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50';
const sliderRemoveClass =
  'absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm ' +
  'ring-1 ring-gray-200 transition hover:bg-red-50 hover:text-red-700';
const sliderAddClass =
  'flex h-20 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 ' +
  'text-xs font-medium text-gray-500 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700';

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
      const response = await axios.post(`${API_BASE_URL}/slider`, formData, {
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
      await axios.delete(`${API_BASE_URL}/slider/${id}`, {
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

  const totalImages = sliderImages.length + newSliderImages.length;

  // Tuile "Ajouter" (même logique de limites qu'auparavant)
  const renderAddTile = () => {
    // Pour les pages "commencer" et "contact" : pas de limite
    if (nomPage === 'commencer' || nomPage === 'contact') {
      return (
        <label className={sliderAddClass}>
          <ImagePlus size={18} />
          Ajouter
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => setNewSliderImages([...newSliderImages, ...Array.from(e.target.files)])}
          />
        </label>
      );
    }

    // Pour les offres d'emploi : maximum 2 images
    if (nomPage === "offres d'emploi") {
      if (totalImages < 2) {
        return (
          <label className={sliderAddClass}>
            <ImagePlus size={18} />
            Ajouter ({totalImages}/2)
            <input
              type="file"
              multiple={totalImages === 0}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const remainingSlots = 2 - totalImages;
                const filesToAdd = files.slice(0, remainingSlots);
                setNewSliderImages([...newSliderImages, ...filesToAdd]);
              }}
            />
          </label>
        );
      }
      return null;
    }

    // Pour les autres pages : maximum 1 image
    if (totalImages === 0) {
      return (
        <label className={sliderAddClass}>
          <ImagePlus size={18} />
          Ajouter
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setNewSliderImages([...newSliderImages, ...Array.from(e.target.files)])}
          />
        </label>
      );
    }

    return null;
  };

  return (
    <div className="border-b border-gray-100 py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2">
        <h3 className="text-sm font-medium capitalize text-gray-800">Page {nomPage}</h3>
        {nomPage === "offres d'emploi" && (
          <span className="text-xs text-gray-500">(Maximum 2 images)</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Images existantes */}
        {sliderImages.map((img, index) => (
          <div key={img.ID_Image || img.id} className={sliderThumbClass}>
            <img src={`${API_BASE_URL.replace('/api', '/storage')}/${img.Path}`} alt={`Slider ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleDeleteSliderImage(img.ID_Image || img.id)}
              className={sliderRemoveClass}
              title="Supprimer cette image"
              aria-label="Supprimer cette image"
            >
              <X size={14} />
            </button>
            {nomPage === "offres d'emploi" && (
              <div className="absolute bottom-1 left-1 rounded bg-brand-700 px-1.5 text-xs font-medium text-white">
                {index + 1}
              </div>
            )}
          </div>
        ))}

        {/* Nouvelles images */}
        {newSliderImages.map((file, index) => (
          <div key={index} className={cx(sliderThumbClass, 'border-dashed border-emerald-300')}>
            <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveNewSliderImage(index)}
              className={sliderRemoveClass}
              title="Supprimer cette image"
              aria-label="Supprimer cette image"
            >
              <X size={14} />
            </button>
            {nomPage === "offres d'emploi" && (
              <div className="absolute bottom-1 left-1 rounded bg-emerald-600 px-1.5 text-xs font-medium text-white">
                {sliderImages.length + index + 1}
              </div>
            )}
          </div>
        ))}

        {/* Ajouter */}
        {renderAddTile()}
      </div>

      {newSliderImages.length > 0 && (
        <Button size="sm" icon={Upload} onClick={uploadSliderImages} className="mt-3">
          Envoyer les nouvelles images
        </Button>
      )}
    </div>
  );
};

// Composant pour gérer les avantages sociaux
const AvantagesSociauxManager = () => {
  const [avantages, setAvantages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAvantage, setEditingAvantage] = useState(null);
  const [formData, setFormData] = useState({
    photo: null,
    paragraphe: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avantageToDelete, setAvantageToDelete] = useState(null);

  const token = localStorage.getItem('token');

  // Récupérer les avantages sociaux
  const fetchAvantages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/avantages-sociaux`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvantages(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des avantages sociaux');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvantages();
  }, []);

  // Gérer les changements du formulaire
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      setFormData(prev => ({ ...prev, photo: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Ajouter un nouvel avantage
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const submitData = new FormData();
      submitData.append('photo', formData.photo);
      submitData.append('paragraphe', formData.paragraphe);

      const response = await axios.post(`${API_BASE_URL}/avantages-sociaux`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSuccess(true);
        setShowAddForm(false);
        resetForm();
        fetchAvantages();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      setError('Erreur lors de l\'ajout de l\'avantage social');
      console.error(error);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Soumettre le formulaire de modification
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      formDataToSend.append('paragraphe', formData.paragraphe);
      formDataToSend.append('_method', 'PUT');

      await axios.post(`${API_BASE_URL}/avantages-sociaux/${editingAvantage.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess(true);
      setShowEditForm(false);
      resetForm();
      fetchAvantages();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  // Supprimer un avantage
  const handleDelete = (avantage) => {
    setAvantageToDelete(avantage);
    setShowDeleteModal(true);
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (!avantageToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/avantages-sociaux/${avantageToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      fetchAvantages();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Erreur lors de la suppression');
      setTimeout(() => setError(null), 3000);
    } finally {
      setShowDeleteModal(false);
      setAvantageToDelete(null);
    }
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAvantageToDelete(null);
  };

  // Modifier un avantage
  const handleEdit = (avantage) => {
    setEditingAvantage(avantage);
    setFormData({
      photo: null,
      paragraphe: avantage.paragraphe
    });
    setPreviewImage(null);
    setShowEditForm(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({ photo: null, paragraphe: '' });
    setPreviewImage(null);
    setEditingAvantage(null);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDeleteModal(false);
    setAvantageToDelete(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div>
      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">Opération réussie !</Alert>}

      <Card
        title="Avantages sociaux"
        description="Avantages présentés aux candidats sur la page des offres d'emploi."
        icon={Gift}
        actions={
          <Button
            icon={Plus}
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setShowAddForm(true);
            }}
          >
            Ajouter un avantage
          </Button>
        }
      >
        {/* Liste des avantages */}
        {isLoading ? (
          <LoadingState />
        ) : avantages.length === 0 ? (
          <EmptyState icon={Gift} title="Aucun avantage social configuré" />
        ) : (
          <ul className="divide-y divide-gray-100">
            {avantages.map((avantage) => (
              <li key={avantage.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {avantage.photo ? (
                    <img
                      src={`${API_BASE_URL.replace('/api', '/storage')}/${avantage.photo}`}
                      alt="Avantage"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image size={20} className="text-gray-400" />
                  )}
                </div>
                <p className="flex-1 text-sm text-gray-700">{avantage.paragraphe}</p>
                <RowActions>
                  <IconButton
                    icon={Pencil}
                    label="Modifier"
                    tone="brand"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(avantage);
                    }}
                  />
                  <IconButton
                    icon={Trash2}
                    label="Supprimer"
                    tone="danger"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(avantage);
                    }}
                  />
                </RowActions>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Modales séparées - HORS du formulaire principal */}
      <SettingsPageModals
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        showDeleteModal={showDeleteModal}
        avantageToDelete={avantageToDelete}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
        formData={formData}
        handleFormChange={handleFormChange}
        previewImage={previewImage}
        editingAvantage={editingAvantage}
        handleAddSubmit={handleAddSubmit}
        handleEditSubmit={handleEditSubmit}
        resetForm={resetForm}
      />
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
    Instagram: '',
    CouleurBackground: '#333333',
    ImageBackground: '',
    backgroundPreview: ''
  });

  const [sliderImages, setSliderImages] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const STORAGE_BASE = API_BASE_URL.replace('/api', '/storage');

  // Charger les paramètres
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/entreprises/1`, {
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
        CouleurBackground: entrepriseData.CouleurBackground || '#333333',
        ImageBackground: entrepriseData.ImageBackground || '',
        logoPreview: entrepriseData.Logo ? `${STORAGE_BASE}/${entrepriseData.Logo}` : '/images/logo.png',
        backgroundPreview: entrepriseData.ImageBackground ? `${STORAGE_BASE}/${entrepriseData.ImageBackground}` : ''
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
      const response = await axios.get(`${API_BASE_URL}/slider`);
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
    } else if (name === 'ImageBackground' && files && files[0]) {
      setSettings(prev => ({ ...prev, [name]: files[0], backgroundPreview: URL.createObjectURL(files[0]) }));
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
        if (key === 'logoPreview' || key === 'backgroundPreview') return;
        if ((key === 'Logo' || key === 'ImageBackground') && settings[key] instanceof File) {
          formData.append(key, settings[key]);
        }
        else if (key !== 'Logo' && key !== 'ImageBackground' && settings[key] != null) {
          formData.append(key, settings[key]);
        }
      });

      await axios.post(`${API_BASE_URL}/entreprises/${settings.ID_Entreprise}`, formData, {
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
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Réseaux sociaux', icon: Globe },
    { id: 'avantages', label: 'Avantages sociaux', icon: Gift }
  ];

  // Libellé de champ précédé d'une icône
  const iconLabel = (Icon, text) => (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={15} className="text-gray-400" />
      {text}
    </span>
  );

  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Paramètres"
        description="Personnalisez les paramètres de votre site web."
      />

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">Les paramètres ont été sauvegardés avec succès.</Alert>}

      {isLoading ? (
        <Card>
          <LoadingState />
        </Card>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Navigation des paramètres */}
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 shadow-sm lg:sticky lg:top-6 lg:w-60 lg:shrink-0 lg:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cx(
                  'flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition lg:w-full',
                  activeTab === id ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          {/* Contenu des onglets */}
          <div className="min-w-0 flex-1">
            {activeTab !== 'avantages' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'general' && (
                  <>
                    <Card title="Identité" description="Nom et logo affichés sur le site." icon={Building2}>
                      <div className="space-y-5">
                        {/* Nom entreprise */}
                        <Field label="Nom de l'entreprise" htmlFor="Nom">
                          <Input
                            type="text"
                            id="Nom"
                            name="Nom"
                            value={settings.Nom}
                            onChange={handleChange}
                            placeholder="Nom de l'entreprise"
                          />
                        </Field>

                        {/* Logo */}
                        <Field label="Logo du site" htmlFor="Logo" hint="PNG, JPG ou GIF. Taille recommandée : 200x200px">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                              {settings.logoPreview ? (
                                <img src={settings.logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
                              ) : (
                                <Image size={28} className="text-gray-400" />
                              )}
                            </div>
                            <FileInput
                              id="Logo"
                              accept="image/*"
                              onChange={handleChange}
                              name="Logo"
                            />
                          </div>
                        </Field>
                      </div>
                    </Card>

                    <Card title="Apparence" description="Couleur et image de fond des sections du site." icon={Palette}>
                      <div className="space-y-5">
                        {/* Couleur Background */}
                        <Field
                          label="Couleur de fond (Hero Global Health)"
                          htmlFor="CouleurBackgroundText"
                          hint={"C'est la couleur qui s'affiche derrière le texte \"GLOBAL HEALTH\"."}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              name="CouleurBackground"
                              value={settings.CouleurBackground}
                              onChange={handleChange}
                              className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white p-1 shadow-sm"
                              aria-label="Choisir la couleur de fond"
                            />
                            <input
                              type="text"
                              id="CouleurBackgroundText"
                              name="CouleurBackground"
                              value={settings.CouleurBackground}
                              onChange={handleChange}
                              className={cx(inputClass, 'w-36 font-mono uppercase')}
                              placeholder="#333333"
                            />
                          </div>
                        </Field>

                        {/* Image Background */}
                        <Field
                          label="Image d'arrière-plan (Section Contact)"
                          htmlFor="ImageBackground"
                          hint={"Cette image s'affiche derrière les boutons \"Prendre RDV\". Taille recommandée : 1920x1080px"}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                              {settings.backgroundPreview ? (
                                <img src={settings.backgroundPreview} alt="Background" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex flex-col items-center gap-1 p-2 text-center text-xs text-gray-400">
                                  <Image size={20} />
                                  Aucune image (image par défaut utilisée)
                                </div>
                              )}
                            </div>
                            <FileInput
                              id="ImageBackground"
                              accept="image/*"
                              onChange={handleChange}
                              name="ImageBackground"
                            />
                          </div>
                        </Field>
                      </div>
                    </Card>

                    <Card
                      title="Images des bannières"
                      description="Les images sont enregistrées dès l'envoi, indépendamment du bouton de sauvegarde."
                      icon={Image}
                    >
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
                    </Card>
                  </>
                )}

                {activeTab === 'contact' && (
                  <Card title="Informations de contact" icon={Phone}>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label={iconLabel(Phone, 'Numéro de téléphone')} htmlFor="Telephone">
                        <Input
                          type="tel"
                          id="Telephone"
                          name="Telephone"
                          value={settings.Telephone}
                          onChange={handleChange}
                          placeholder="+33 1 23 45 67 89"
                        />
                      </Field>
                      <Field label={iconLabel(FaWhatsapp, 'Numéro WhatsApp')} htmlFor="Whatsapp">
                        <Input
                          type="tel"
                          id="Whatsapp"
                          name="Whatsapp"
                          value={settings.Whatsapp}
                          onChange={handleChange}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </Field>
                      <Field label={iconLabel(Mail, 'Email')} htmlFor="Email">
                        <Input
                          type="email"
                          id="Email"
                          name="Email"
                          value={settings.Email}
                          onChange={handleChange}
                          placeholder="contact@example.com"
                        />
                      </Field>
                      <Field label={iconLabel(MapPin, 'Adresse')} htmlFor="Adresse" className="md:col-span-2">
                        <Textarea
                          id="Adresse"
                          name="Adresse"
                          value={settings.Adresse}
                          onChange={handleChange}
                          rows={3}
                          placeholder="123 Rue de la Santé, 75001 Paris, France"
                        />
                      </Field>
                    </div>
                  </Card>
                )}

                {activeTab === 'social' && (
                  <Card title="Réseaux sociaux" icon={Globe}>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label={iconLabel(Facebook, 'Facebook')} htmlFor="Facebook">
                        <Input
                          type="url"
                          id="Facebook"
                          name="Facebook"
                          value={settings.Facebook}
                          onChange={handleChange}
                          placeholder="https://facebook.com/votrepage"
                        />
                      </Field>
                      <Field label={iconLabel(Instagram, 'Instagram')} htmlFor="Instagram">
                        <Input
                          type="url"
                          id="Instagram"
                          name="Instagram"
                          value={settings.Instagram}
                          onChange={handleChange}
                          placeholder="https://instagram.com/votrecompte"
                        />
                      </Field>
                    </div>
                  </Card>
                )}

                <FormActions className="mt-0 border-t-0 pt-0">
                  <Button type="submit" icon={Save} loading={isLoading}>
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                  </Button>
                </FormActions>
              </form>
            )}

            {/* Avantages sociaux HORS du formulaire */}
            {activeTab === 'avantages' && (
              <AvantagesSociauxManager />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
