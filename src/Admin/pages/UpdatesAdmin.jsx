import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash, Check, X, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdatesAdmin = () => {
  const [update, setUpdate] = useState(null); // Single update object, not an array
  const [formData, setFormData] = useState({
    ID_Updates: null,
    title_fr: '',
    title_ar: '',
    description_fr: '',
    description_ar: '',
    active: true,
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // True when editing or creating

  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:8000/api/updates';

  const fetchUpdate = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data
        ? { ...response.data, ID_Updates: response.data.id || response.data.ID_Updates }
        : null;
      console.log('Fetched update:', data);
      setUpdate(data);
      if (data) {
        setFormData({
          ID_Updates: data.ID_Updates,
          title_fr: data.title_fr || '',
          title_ar: data.title_ar || '',
          description_fr: data.description_fr || '',
          description_ar: data.description_ar || '',
          active: data.active || true,
        });
        setPreviewImage(data.image_path ? `http://localhost:8000${data.image_path}` : null);
        setIsEditing(true); // Editing mode if update exists
      } else {
        resetForm();
        setIsEditing(true); // Creation mode if no update exists
      }
    } catch (error) {
      console.error('Error fetching update:', error);
      resetForm();
      setIsEditing(true); // Allow creation if fetch fails (e.g., no update exists)
    }
  };

  useEffect(() => {
    fetchUpdate();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image' && files && files[0]) {
      setImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDescriptionChange = (field, content) => {
    setFormData({ ...formData, [field]: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const updateFormData = new FormData();
      updateFormData.append('title_fr', formData.title_fr);
      updateFormData.append('title_ar', formData.title_ar);
      updateFormData.append('description_fr', formData.description_fr);
      updateFormData.append('description_ar', formData.description_ar);
      updateFormData.append('active', formData.active ? '1' : '0');
      if (image) {
        updateFormData.append('image', image);
      }

      if (formData.ID_Updates) {
        await axios.put(`${API_URL}/${formData.ID_Updates}`, updateFormData, { headers });
      } else {
        const response = await axios.post(API_URL, updateFormData, { headers });
        setFormData((prev) => ({
          ...prev,
          ID_Updates: response.data.ID_Updates || response.data.id,
        }));
      }

      fetchUpdate();
      alert(formData.ID_Updates ? 'Mise à jour modifiée avec succès' : 'Mise à jour créée avec succès');
    } catch (error) {
      console.error('Erreur:', error.response ? error.response.data : error.message);
      alert(
        error.response?.data?.message ||
          'Échec de l’enregistrement de la mise à jour. Voir la console pour plus de détails.'
      );
    }
  };

  const handleDelete = async () => {
    if (!formData.ID_Updates) {
      alert('Aucune mise à jour à supprimer.');
      return;
    }
    try {
      await axios.delete(`${API_URL}/${formData.ID_Updates}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUpdate();
      alert('Mise à jour supprimée avec succès');
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Échec de la suppression de la mise à jour. Voir la console pour plus de détails.');
    }
  };

  const resetForm = () => {
    setFormData({
      ID_Updates: null,
      title_fr: '',
      title_ar: '',
      description_fr: '',
      description_ar: '',
      active: true,
    });
    setImage(null);
    setPreviewImage(null);
    setIsEditing(true); // Allow creation of a new update
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold">Gestion de la Mise à Jour</h1>
      <p className="mt-4 mb-6">Configurez la section unique des mises à jour de la page d'accueil.</p>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {update ? 'Modifier la Mise à Jour' : 'Créer une Mise à Jour'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
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
                name="title_fr"
                value={formData.title_fr}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Arabe)</label>
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                dir="rtl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Français)</label>
            <ReactQuill
              theme="snow"
              value={formData.description_fr}
              onChange={(content) => handleDescriptionChange('description_fr', content)}
              modules={quillModules}
              formats={quillFormats}
              className="h-48 mb-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabe)</label>
            <ReactQuill
              theme="snow"
              value={formData.description_ar}
              onChange={(content) => handleDescriptionChange('description_ar', content)}
              modules={quillModules}
              formats={quillFormats}
              className="h-48 mb-12"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Actif</span>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {update && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {update ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>

      {/* Contenu Actuel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Contenu Actuel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!update ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun contenu disponible
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {update.image_path ? (
                      <img
                        src={`http://localhost:8000/api/updates/${update.ID_Updates}/image`}
                        alt={update.title_fr}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => { e.target.src = '/default-image.png'; }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{update.title_fr || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {update.description_fr ? <span dangerouslySetInnerHTML={{ __html: update.description_fr }} /> : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        update.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {update.active ? (
                        <>
                          <Check size={12} className="mr-1" /> Actif
                        </>
                      ) : (
                        <>
                          <X size={12} className="mr-1" /> Inactif
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'color',
  'background',
  'link',
  'image',
];

export default UpdatesAdmin;