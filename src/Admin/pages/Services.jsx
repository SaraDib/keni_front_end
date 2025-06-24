import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash, Check, X, Image, Layers } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    ID_Service: null,
    ID_Entreprise: 1, // Default to enterprise 1
    Nom: '',
    NomAR: '', // Added Arabic name field
    Descriptions: '',
    DescriptionsAR: '', // Added Arabic description field
    Photos: null,
    Etat: true
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // States for row management
  const [showRowsModal, setShowRowsModal] = useState(false);
  const [currentServiceRows, setCurrentServiceRows] = useState([]);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [currentServiceName, setCurrentServiceName] = useState('');
  const [rowFormData, setRowFormData] = useState({
    ID_Service: null,
    ID_Type_Photo: '',
    Text: '',
    TextAR: '', // Added Arabic text field
    Classement: ''
  });
  const [typePhotos, setTypePhotos] = useState([]);
  const [isEditingRow, setIsEditingRow] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [showRowForm, setShowRowForm] = useState(false);

  // API base URL
  const API_URL = 'http://keniweb.test/api/services';
  const ROW_API_URL = 'http://keniweb.test/api/row-services';
  const TYPE_PHOTOS_API_URL = 'http://keniweb.test/api/type-photos';

  // Fetch all services
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch type photos
  const fetchTypePhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(TYPE_PHOTOS_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTypePhotos(response.data);
    } catch (error) {
      console.error('Error fetching type photos:', error);
    }
  };

  // Fetch rows for a specific service
  const fetchServiceRows = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ROW_API_URL}?ID_Service=${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const filteredRows = response.data.filter(row => row.ID_Service === serviceId);
      setCurrentServiceRows(filteredRows);
    } catch (error) {
      console.error('Error fetching service rows:', error);
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
    fetchTypePhotos();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (name === 'Photos' && files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      
      // Create FormData object for file upload
      const serviceFormData = new FormData();
      serviceFormData.append('ID_Entreprise', formData.ID_Entreprise);
      serviceFormData.append('Nom', formData.Nom);
      serviceFormData.append('NomAR', formData.NomAR || ''); // Added Arabic name field
      serviceFormData.append('Descriptions', formData.Descriptions || '');
      serviceFormData.append('DescriptionsAR', formData.DescriptionsAR || ''); // Added Arabic description field
      serviceFormData.append('Etat', formData.Etat ? 1 : 0);
      
      if (formData.Photos instanceof File) {
        serviceFormData.append('Photos', formData.Photos);
      }
      
      if (isEditing) {
        // Update existing service
        await axios.post(`${API_URL}/${formData.ID_Service}`, serviceFormData, { headers });
      } else {
        // Add new service
        await axios.post(API_URL, serviceFormData, { headers });
      }
      
      // Refresh the services list
      fetchServices();
      
      // Reset form
      setFormData({
        ID_Service: null,
        ID_Entreprise: 1,
        Nom: '',
        NomAR: '', // Added Arabic name field
        Descriptions: '',
        DescriptionsAR: '', // Added Arabic description field
        Photos: null,
        Etat: true
      });
      setPreviewImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEditService = (service) => {
    setFormData({
      ID_Service: service.ID_Service,
      ID_Entreprise: service.ID_Entreprise,
      Nom: service.Nom,
      NomAR: service.NomAR || '', // Added Arabic name field
      Descriptions: service.Descriptions || '',
      DescriptionsAR: service.DescriptionsAR || '', // Added Arabic description field
      Photos: null, // Can't edit existing file directly
      Etat: service.Etat
    });
    
    // Set preview image if available
    if (service.Photos) {
      setPreviewImage(`http://keniweb.test/api/services/${service.ID_Service}/photo`);
    } else {
      setPreviewImage(null);
    }
    
    setIsEditing(true);
  };

  const handleDeleteService = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      ID_Service: null,
      ID_Entreprise: 1,
      Nom: '',
      NomAR: '', // Added Arabic name field
      Descriptions: '',
      DescriptionsAR: '', // Added Arabic description field
      Photos: null,
      Etat: true
    });
    setPreviewImage(null);
  };

  const toggleServiceStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const service = services.find(s => s.ID_Service === id);
      
      const serviceFormData = new FormData();
      serviceFormData.append('ID_Entreprise', service.ID_Entreprise);
      serviceFormData.append('Nom', service.Nom);
      serviceFormData.append('NomAR', service.NomAR || ''); // Added Arabic name field
      serviceFormData.append('Descriptions', service.Descriptions || '');
      serviceFormData.append('DescriptionsAR', service.DescriptionsAR || ''); // Added Arabic description field
      serviceFormData.append('Etat', service.Etat ? 0 : 1);
      
      await axios.post(`${API_URL}/${id}?_method=PUT`, serviceFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  // Handle viewing rows for a service
  const handleViewRows = (service) => {
    setCurrentServiceId(service.ID_Service);
    setCurrentServiceName(service.Nom);
    fetchServiceRows(service.ID_Service);
    setShowRowsModal(true);
  };

  // Handle row form change
  const handleRowFormChange = (e) => {
    const { name, value } = e.target;
    setRowFormData({
      ...rowFormData,
      [name]: value
    });
  };

  // Handle rich text editor change
  const handleTextEditorChange = (content) => {
    setRowFormData({
      ...rowFormData,
      Text: content
    });
  };

  // Handle rich text editor change for Arabic
  const handleTextEditorChangeAR = (content) => {
    setRowFormData({
      ...rowFormData,
      TextAR: content
    });
  };

  // Handle adding a new row
  const handleAddRow = () => {
    setRowFormData({
      ID_Service: currentServiceId,
      ID_Type_Photo: '',
      Text: '',
      TextAR: '', // Added Arabic text field
      Classement: ''
    });
    setIsEditingRow(false);
    setShowRowForm(true);
  };

  // Handle editing a row
  const handleEditRow = (row) => {
    setRowFormData({
      ID_Service: row.ID_Service,
      ID_Type_Photo: row.ID_Type_Photo,
      Text: row.Text || '',
      TextAR: row.TextAR || '', // Added Arabic text field
      Classement: row.Classement || ''
    });
    setCurrentRowId(row.ID_Row);
    setIsEditingRow(true);
    setShowRowForm(true);
  };

  // Handle deleting a row
  const handleDeleteRow = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ROW_API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchServiceRows(currentServiceId);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  // Handle submitting the row form
  // Add these state variables near your other state declarations (after the rowFormData state)
  const [rowImage, setRowImage] = useState(null);
  const [rowImage1, setRowImage1] = useState(null);
  const [rowImage2, setRowImage2] = useState(null);
  
  // Add these handlers for the file inputs
  const handleRowImageChange = (e) => {
    console.log("aa");
    if (e.target.files && e.target.files[0]) {
      setRowImage(e.target.files[0]);
    }
  };
  
  const handleRowImage1Change = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRowImage1(e.target.files[0]);
    }
  };
  
  const handleRowImage2Change = (e) => {
    if (e.target.files && e.target.files[0]) {
      setRowImage2(e.target.files[0]);
    }
  };
  
  // Then update your file input elements to use these handlers
  // Replace the existing file input elements with these:
  

  
  // Finally, update your handleRowSubmit function to send the photos after row submission
  const handleRowSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Submitting row data:', rowFormData);
      
      let rowResponse;
      if (isEditingRow) {
        // Update existing row
        rowResponse = await axios.put(`${ROW_API_URL}/${currentRowId}`, rowFormData, { headers });
      } else {
        // Add new row
        rowResponse = await axios.post(ROW_API_URL, rowFormData, { headers });
      }
      
      // Get the row ID (either from the response for new rows or from state for edited rows)
      const rowId = isEditingRow ? currentRowId : rowResponse.data.data.ID_Row;
      console.log('Row ID for photo upload:', rowId);
      
      // Handle photo uploads based on the selected type
      if (rowFormData.ID_Type_Photo === '1' && rowImage) {
        console.log('Uploading single photo for type 1');
        // Upload single photo for type 1
        const photoFormData = new FormData();
        photoFormData.append('ID_Row', rowId);
        photoFormData.append('Photo', rowImage);
        
        await axios.post('http://keniweb.test/api/photos', photoFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (rowFormData.ID_Type_Photo === '2') {
        // Upload two photos for type 2 (if provided)
        if (rowImage1) {
          console.log('Uploading first photo for type 2');
          const photoFormData1 = new FormData();
          photoFormData1.append('ID_Row', rowId);
          photoFormData1.append('Photo', rowImage1);
          
          await axios.post('http://keniweb.test/api/photos', photoFormData1, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        
        if (rowImage2) {
          console.log('Uploading second photo for type 2');
          const photoFormData2 = new FormData();
          photoFormData2.append('ID_Row', rowId);
          photoFormData2.append('Photo', rowImage2);
          
          await axios.post('http://keniweb.test/api/photos', photoFormData2, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }
      
      // Refresh the rows list
      fetchServiceRows(currentServiceId);
      
      // Reset form and state
      setRowFormData({
        ID_Service: currentServiceId,
        ID_Type_Photo: '',
        Text: '',
        Classement: ''
      });
      setRowImage(null);
      setRowImage1(null);
      setRowImage2(null);
      setShowRowForm(false);
    } catch (error) {
      console.error('Error saving row or uploading photos:', error);
    }
  };

  // Define columns for the rows table
  const rowColumns = [
    { 
      header: "Type Photo", 
      accessor: "ID_Type_Photo",
      render: (item) => {
        const typePhoto = typePhotos.find(tp => tp.ID_Type_Photo === item.ID_Type_Photo);
        return typePhoto ? typePhoto.Nom : item.ID_Type_Photo;
      }
    },
    { header: "Texte", accessor: "Text" },
    { header: "Classement", accessor: "Classement" }
  ];

  const activeServices = services.filter(service => service.Etat).length;
  const inactiveServices = services.length - activeServices;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold">Gestion des Services</h1>
      <p className="mt-4 mb-6">Ajoutez, modifiez ou supprimez les services proposés par votre établissement.</p>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Services Actifs</p>
              <h3 className="text-blue-600 text-2xl font-bold mt-1">{activeServices}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Check className="text-blue-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Services Inactifs</p>
              <h3 className="text-red-600 text-2xl font-bold mt-1">{inactiveServices}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <X className="text-red-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Services</p>
              <h3 className="text-green-600 text-2xl font-bold mt-1">{services.length}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Plus className="text-green-500" size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulaire d'ajout/modification */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Modifier un service' : 'Ajouter un nouveau service'}</h2>
        <form onSubmit={handleAddService} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
              <input
                type="text"
                name="Nom"
                value={formData.Nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service (Arabe)</label>
              <input
                type="text"
                name="NomAR"
                value={formData.NomAR}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                dir="rtl"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="Descriptions"
              value={formData.Descriptions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabe)</label>
            <textarea
              name="DescriptionsAR"
              value={formData.DescriptionsAR}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="Etat"
                  checked={formData.Etat}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Actif</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="Photos"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {previewImage && (
                  <div className="relative h-16 w-16">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Liste des services */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Liste des services</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lignes</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun service disponible
                  </td>
                </tr>
              ) : (
                services.map(service => (
                  <tr key={service.ID_Service}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.Photos ? (
                        <img
                          src={`http://keniweb.test/api/services/${service.ID_Service}/photo`}
                          alt={service.Nom}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-service.png';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Image size={16} className="text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.Nom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{service.Descriptions}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleServiceStatus(service.ID_Service)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.Etat
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.Etat ? (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewRows(service)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Layers size={14} className="mr-1" />
                        Voir
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.ID_Service)}
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
      
      {/* Modal for managing rows */}
      {showRowsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Lignes pour le service: {currentServiceName}</h2>
              <button
                onClick={() => setShowRowsModal(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {showRowForm ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{isEditingRow ? 'Modifier une ligne' : 'Ajouter une ligne'}</h3>
                <form onSubmit={handleRowSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type de photo</label>
                      <select
                        name="ID_Type_Photo"
                        value={rowFormData.ID_Type_Photo}
                        onChange={handleRowFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        {typePhotos.map(type => (
                          <option key={type.ID_Type_Photo} value={type.ID_Type_Photo}>
                            {type.Nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Conditional file upload fields based on ID_Type_Photo */}
                    {rowFormData.ID_Type_Photo === '1' && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
      <input
        type="file"
        name="image"
        onChange={handleRowImageChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        accept="image/*"
      />
    </div>
  )}
  
  {rowFormData.ID_Type_Photo === '2' && (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image 1</label>
        <input
          type="file"
          name="image1"
          onChange={handleRowImage1Change}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
        <input
          type="file"
          name="image2"
          onChange={handleRowImage2Change}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
        />
      </div>
    </div>
  )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Classement</label>
                      <input
                        type="number"
                        name="Classement"
                        value={rowFormData.Classement}
                        onChange={handleRowFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte</label>
                    <div className="quill-container">
                      <ReactQuill
                        theme="snow"
                        value={rowFormData.Text}
                        onChange={handleTextEditorChange}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet',
                          'color', 'background',
                          'link', 'image'
                        ]}
                        className="h-48"
                      />
                    </div>
                  </div>
                  
                  <div style={{marginTop:"50px"}}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte (Arabe)</label>
                    <div className="quill-container">
                      <ReactQuill
                        theme="snow"
                        value={rowFormData.TextAR}
                        onChange={handleTextEditorChangeAR}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header',
                          'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet',
                          'color', 'background',
                          'link', 'image'
                        ]}
                        className="h-48"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3" style={{marginTop:"60px"}}>
                    <button
                      type="button"
                      onClick={() => setShowRowForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {isEditingRow ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={handleAddRow}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Ajouter une ligne
              </button>
            )}
            
            {/* Table of rows */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {rowColumns.map((column, index) => (
                      <th 
                        key={index}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentServiceRows.length === 0 ? (
                    <tr>
                      <td colSpan={rowColumns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucune ligne disponible pour ce service
                      </td>
                    </tr>
                  ) : (
                    currentServiceRows.map(row => (
                      <tr key={row.ID_Row}>
                        {rowColumns.map((column, index) => (
                          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {column.accessor === "Text" ? (
                              <div className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: row.Text || '' }}></div>
                            ) : (
                              column.render ? column.render(row) : row[column.accessor]
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditRow(row)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row.ID_Row)}
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
      )}
    </div>
  );
};

export default Services;

// Define Quill modules and formats
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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
