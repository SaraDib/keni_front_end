import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Edit, Trash, Plus } from 'lucide-react';
import API_BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AboutUsAdmin = () => {
  const [aboutUsList, setAboutUsList] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    description_fr: '',
    description_ar: '',
    active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('token');
  const API_URL = `${API_BASE_URL}/about-us`;

  const fetchAboutUs = async () => {
    if (!token) {
      console.error('No token found in localStorage');
      setIsEditing(true);
      return;
    }
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched about us:', response.data);
      setAboutUsList(Array.isArray(response.data) ? response.data : []);
      if (response.data.length === 0) {
        resetForm();
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching about us:', error.response ? error.response.data : error.message);
      setAboutUsList([]);
      resetForm();
      setIsEditing(true);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : e.target.value });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDescriptionChange = (field, content) => {
    setFormData({ ...formData, [field]: content });
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const isDescriptionValid = (content) => {
    const cleanContent = content.replace(/<[^>]+>/g, '').trim();
    return cleanContent.length >= 3 && content !== '<p><br></p>' && content !== '<p></p>' && content !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!token) {
      setErrors({ general: 'Vous devez être connecté pour effectuer cette action.' });
      return;
    }

    const newErrors = {};
    if (!isDescriptionValid(formData.description_fr)) {
      newErrors.description_fr = 'La description en français doit contenir au moins 3 caractères.';
    }
    if (!isDescriptionValid(formData.description_ar)) {
      newErrors.description_ar = 'La description en arabe doit contenir au moins 3 caractères.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        description_fr: formData.description_fr,
        description_ar: formData.description_ar,
        active: formData.active ? 1 : 0,
      };

      console.log('Request payload:', payload, 'Is Update:', !!formData.id);

      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, payload, { headers });
      } else {
        const response = await axios.post(API_URL, payload, { headers });
        console.log('Created section:', response.data);
      }

      resetForm();
      fetchAboutUs();
      setIsEditing(false);
      alert(formData.id ? 'Section mise à jour avec succès' : 'Section créée avec succès');
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.errors
        ? Object.values(errorData.errors).flat().join(' ')
        : errorData?.message || 'Échec de l’enregistrement de la section.';
      console.error('Erreur:', errorData || error.message);
      setErrors({ general: errorMessage });
    }
  };

  const handleEdit = (section) => {
    setFormData({
      id: section.id,
      description_fr: section.description_fr || '',
      description_ar: section.description_ar || '',
      active: section.active,
    });
    setIsEditing(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!id) {
      setErrors({ general: 'Aucune section à supprimer.' });
      return;
    }
    if (!token) {
      setErrors({ general: 'Vous devez être connecté pour effectuer cette action.' });
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAboutUs();
      resetForm();
      alert('Section supprimée avec succès');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Échec de la suppression de la section.';
      console.error('Error deleting section:', error.response ? error.response.data : error.message);
      setErrors({ general: errorMessage });
    }
  };

  const handleCreateNew = () => {
    resetForm();
    setIsEditing(true);
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      id: null,
      description_fr: '',
      description_ar: '',
      active: true,
    });
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Gestion de la section Qui sommes-nous</h1>
      <p className="text-gray-600 mb-8">Configurez les descriptions de la section Qui sommes-nous.</p>

      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {errors.general || Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Sections Actives</p>
              <h3 className="text-blue-600 text-3xl font-bold mt-1">
                {aboutUsList.filter(section => section.active).length}
              </h3>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Check className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Sections Inactives</p>
              <h3 className="text-red-600 text-3xl font-bold mt-1">
                {aboutUsList.filter(section => !section.active).length}
              </h3>
            </div>
            <div className="bg-red-200 p-3 rounded-full">
              <X className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Sections</p>
              <h3 className="text-green-600 text-3xl font-bold mt-1">{aboutUsList.length}</h3>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <Plus className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {formData.id ? 'Modifier la section Qui sommes-nous' : 'Créer une nouvelle section Qui sommes-nous'}
          </h2>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus size={18} className="mr-2" /> Créer une nouvelle section
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Français)</label>
            <ReactQuill
              theme="snow"
              value={formData.description_fr}
              onChange={(content) => handleDescriptionChange('description_fr', content)}
              modules={quillModules}
              formats={quillFormats}
              className={`h-64 mb-12 bg-white rounded-lg border ${errors.description_fr ? 'border-red-500' : 'border-gray-300'}`}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabe)</label>
            <ReactQuill
              theme="snow"
              value={formData.description_ar}
              onChange={(content) => handleDescriptionChange('description_ar', content)}
              modules={quillModules}
              formats={quillFormats}
              className={`h-64 mb-12 bg-white rounded-lg border ${errors.description_ar ? 'border-red-500' : 'border-gray-300'}`}
              dir="rtl"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">État</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                disabled={!isEditing}
              />
              <span className="ml-3 text-sm text-gray-700">Actif</span>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isEditing}
            >
              {formData.id ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>

      {/* Contenu Actuel */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Contenu Actuel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description (Français)</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aboutUsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun contenu disponible
                  </td>
                </tr>
              ) : (
                aboutUsList.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-500">{section.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {section.description_fr ? <span dangerouslySetInnerHTML={{ __html: section.description_fr }} /> : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${section.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {section.active ? (
                          <>
                            <Check size={14} className="mr-1" /> Actif
                          </>
                        ) : (
                          <>
                            <X size={14} className="mr-1" /> Inactif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 transition-colors duration-200"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash size={20} />
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

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['link'],
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
  'size',
  'link',
];

export default AboutUsAdmin;
