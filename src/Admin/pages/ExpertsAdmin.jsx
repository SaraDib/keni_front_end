import React, { useState, useEffect } from 'react';
import { Edit, Trash, Check, Plus, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast, { Toaster } from 'react-hot-toast';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background',
  'link', 'image'
];

const ExpertsAdmin = () => {
  const [experts, setExperts] = useState([]);
  const [formData, setFormData] = useState({
    ID_Expert: null,
    VideoURL: null,
    Image: null,
    TitleFR: '',
    TitleAR: '',
    DescriptionFR: '',
    DescriptionAR: '',
    Etat: true,
  });
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_URL = `${API_BASE_URL}/experts`;

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setExperts(response.data);
      // If an expert exists, populate the form with the first entry
      if (response.data.length > 0) {
        const expert = response.data[0];
        setFormData({
          ID_Expert: expert.ID_Expert,
          VideoURL: null,
          Image: null,
          TitleFR: expert.TitleFR || '',
          TitleAR: expert.TitleAR || '',
          DescriptionFR: expert.DescriptionFR || '',
          DescriptionAR: expert.DescriptionAR || '',
          Etat: expert.Etat,
        });
        setPreviewVideo(expert.VideoURL ? `${API_BASE_URL}/experts/${expert.ID_Expert}/video` : null);
        setPreviewImage(expert.ImagePath ? `${API_BASE_URL}/experts/${expert.ID_Expert}/image` : null);
        setIsEditing(true);
        console.log('>>> fetchExperts: Expert loaded and form pre-filled', expert);
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  // Sync descriptions when an expert is loaded for editing to ensure ReactQuill updates
  useEffect(() => {
    if (isEditing && formData.ID_Expert) {
      console.log('>>> Syncing descriptions for editor:', formData.DescriptionFR);
    }
  }, [isEditing, formData.ID_Expert]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'VideoURL' && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewVideo(URL.createObjectURL(files[0]));
    } else if (name === 'Image' && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('>>> handleSubmit triggered');
    setIsLoading(true);
    setUploadProgress(0);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const expertFormData = new FormData();
      expertFormData.append('TitleFR', formData.TitleFR);
      expertFormData.append('TitleAR', formData.TitleAR);
      expertFormData.append('DescriptionFR', formData.DescriptionFR);
      expertFormData.append('DescriptionAR', formData.DescriptionAR);
      expertFormData.append('Etat', formData.Etat ? 1 : 0);
      if (formData.VideoURL instanceof File) {
        if (formData.VideoURL.size > 50 * 1024 * 1024) { // 50MB Limit
          toast.error('La vidéo est trop lourde (Max 50Mo).');
          return;
        }
        expertFormData.append('VideoURL', formData.VideoURL);
      }
      if (formData.Image instanceof File) {
        if (formData.Image.size > 5 * 1024 * 1024) { // 5MB Limit
          toast.error('L’image est trop lourde (Max 5Mo).');
          return;
        }
        expertFormData.append('Image', formData.Image);
      }

      console.log('>>> Sending Expert data:', Array.from(expertFormData.entries()));

      try {
        const axiosConfig = {
          headers,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        };

        if (experts.length > 0) {
          // Update the existing expert
          await axios.post(`${API_URL}/${experts[0].ID_Expert}?_method=PUT`, expertFormData, axiosConfig);
          toast.success('Section Experts mise à jour avec succès !');
        } else {
          // Create a new expert
          await axios.post(API_URL, expertFormData, axiosConfig);
          toast.success('Section Experts créée avec succès !');
        }
      } catch (err) {
        if (err.response && err.response.status === 413) {
          toast.error('Erreur 413 : Les fichiers sont trop lourds pour le serveur.');
        } else {
          throw err;
        }
      }

      fetchExperts();
      setIsEditing(false); // Reset to non-editing state after submit
    } catch (error) {
      console.error('Error saving expert:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        toast.error(`Erreur : ${firstError}`);
      } else {
        toast.error('Erreur lors de l’enregistrement. Vérifiez la console.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expert) => {
    console.log('>>> Editing expert:', expert);
    setFormData({
      ID_Expert: expert.ID_Expert,
      VideoURL: null,
      Image: null,
      TitleFR: expert.TitleFR || '',
      TitleAR: expert.TitleAR || '',
      DescriptionFR: expert.DescriptionFR || '',
      DescriptionAR: expert.DescriptionAR || '',
      Etat: expert.Etat,
    });
    setPreviewVideo(expert.VideoURL ? `${API_BASE_URL}/experts/${expert.ID_Expert}/video` : null);
    setPreviewImage(expert.ImagePath ? `${API_BASE_URL}/experts/${expert.ID_Expert}/image` : null);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      resetForm();
      fetchExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${id}/toggle-status`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchExperts();
    } catch (error) {
      console.error('Error toggling expert status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      ID_Expert: null,
      VideoURL: null,
      Image: null,
      TitleFR: '',
      TitleAR: '',
      DescriptionFR: '',
      DescriptionAR: '',
      Etat: true,
    });
    setPreviewVideo(null);
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      DescriptionFR: '',
      DescriptionAR: ''
    }));
    setIsEditing(false);
  };

  console.log('>>> Rendering ExpertsAdmin. Experts:', experts.length, 'isEditing:', isEditing);

  return (
    <div className="p-4 md:p-6 relative">
      <Toaster position="top-right" />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-xl font-semibold">Téléchargement en cours... {uploadProgress}%</p>

          <div className="w-64 h-4 bg-gray-700 rounded-full mt-4 overflow-hidden border border-gray-600">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>

          <p className="text-sm opacity-75 mt-4 italic">Veuillez patienter, envoi des fichiers vers le serveur...</p>
        </div>
      )}

      <h1 className="text-xl md:text-2xl font-bold">Gestion de la section Experts</h1>
      <p className="mt-4 mb-6">Configurez la section unique 'Experts en santé et bien-être' de la page d'accueil.</p>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Section Actif</p>
              <h3 className="text-blue-600 text-2xl font-bold mt-1">{experts.length > 0 && experts[0].Etat ? 1 : 0}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-500" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Section Inactif</p>
              <h3 className="text-red-600 text-2xl font-bold mt-1">{experts.length > 0 && !experts[0].Etat ? 1 : 0}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <X className="text-red-500" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Sections</p>
              <h3 className="text-green-600 text-2xl font-bold mt-1">{experts.length || 0}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Plus className="text-green-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Gérer la section Experts</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo</label>
              <input
                type="file"
                name="VideoURL"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="video/mp4,video/webm"
                disabled={experts.length > 0 && !isEditing}
              />
              {previewVideo && (
                <video
                  src={previewVideo}
                  controls
                  className="mt-2 w-full h-32 object-cover rounded-md"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image illustrative</label>
              <input
                type="file"
                name="Image"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
                disabled={experts.length > 0 && !isEditing}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 w-full h-32 object-cover rounded-md"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Français)</label>
              <input
                type="text"
                name="TitleFR"
                value={formData.TitleFR}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={experts.length > 0 && !isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Arabe)</label>
              <input
                type="text"
                name="TitleAR"
                value={formData.TitleAR}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                disabled={experts.length > 0 && !isEditing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Français)</label>
            <ReactQuill
              key={`fr-${formData.ID_Expert}`}
              theme="snow"
              value={formData.DescriptionFR}
              onChange={(content) => {
                if (content !== formData.DescriptionFR) {
                  setFormData(prev => ({ ...prev, DescriptionFR: content }));
                }
              }}
              modules={quillModules}
              formats={quillFormats}
              className="h-48 mb-12"
              readOnly={experts.length > 0 && !isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabe)</label>
            <ReactQuill
              key={`ar-${formData.ID_Expert}`}
              theme="snow"
              value={formData.DescriptionAR}
              onChange={(content) => {
                if (content !== formData.DescriptionAR) {
                  setFormData(prev => ({ ...prev, DescriptionAR: content }));
                }
              }}
              modules={quillModules}
              formats={quillFormats}
              className="h-48 mb-12"
              dir="rtl"
              readOnly={experts.length > 0 && !isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="Etat"
                checked={formData.Etat}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={experts.length === 0}
              />
              <span className="ml-2 text-sm text-gray-700">Actif</span>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {experts.length > 0 && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={!isEditing}
              >
                Annuler
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                console.log('>>> Manual button trigger');
                handleSubmit(e);
              }}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isLoading ? 'Envoi...' : (experts.length > 0 ? 'Mettre à jour' : 'Enregistrer')}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des experts */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Contenu actuel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vidéo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun contenu disponible
                  </td>
                </tr>
              ) : (
                experts.slice(0, 1).map(expert => ( // Limit to first entry
                  <tr key={expert.ID_Expert}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expert.VideoURL ? (
                        <video
                          src={`${API_BASE_URL}/experts/${expert.ID_Expert}/video`}
                          className="h-10 w-10 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200"></div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expert.ImagePath ? (
                        <img
                          src={`${API_BASE_URL}/experts/${expert.ID_Expert}/image`}
                          alt={expert.TitleFR}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-image.png';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expert.TitleFR}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" dangerouslySetInnerHTML={{ __html: expert.DescriptionFR }} />
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(expert.ID_Expert)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expert.Etat ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {expert.Etat ? (
                          <>
                            <Check size={12} className="mr-1" />
                            Actif
                          </>
                        ) : (
                          <>
                            <X size={12} className="mr-1" />
                            Inactif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(expert)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expert.ID_Expert)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpertsAdmin;