import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Check, X, Image, Layers, Briefcase } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  PageHeader, Card, StatCard, Button, IconButton, Field, Input, Textarea, Select, FileInput, Checkbox,
  FormActions, Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions, Badge, Modal, useConfirm,
} from '../ui';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../config';

const Services = () => {
  const { confirm, confirmDialog } = useConfirm();
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
  const API_URL = `${API_BASE_URL}/services`;
  const ROW_API_URL = `${API_BASE_URL}/row-services`;
  const TYPE_PHOTOS_API_URL = `${API_BASE_URL}/type-photos`;

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
      setPreviewImage(`${API_BASE_URL}/services/${service.ID_Service}/photo`);
    } else {
      setPreviewImage(null);
    }

    setIsEditing(true);
  };

  const handleDeleteService = async (id) => {
    if (!(await confirm({ message: 'Êtes-vous sûr de vouloir supprimer ce service et toutes ses lignes ? Cette action est irréversible.' }))) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchServices();
      toast.success('Service supprimé avec succès');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Échec de la suppression du service.');
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
    if (content !== rowFormData.Text) {
      setRowFormData(prev => ({
        ...prev,
        Text: content
      }));
    }
  };

  // Handle rich text editor change for Arabic
  const handleTextEditorChangeAR = (content) => {
    if (content !== rowFormData.TextAR) {
      setRowFormData(prev => ({
        ...prev,
        TextAR: content
      }));
    }
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
    if (!(await confirm({ message: 'Êtes-vous sûr de vouloir supprimer cette ligne ? Cette action est irréversible.' }))) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ROW_API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchServiceRows(currentServiceId);
      toast.success('Ligne supprimée avec succès');
    } catch (error) {
      console.error('Error deleting row:', error);
      toast.error('Échec de la suppression de la ligne.');
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
      if (rowFormData.ID_Type_Photo == '1' && rowImage) {
        console.log('Uploading single photo for type 1');
        // Upload single photo for type 1
        const photoFormData = new FormData();
        photoFormData.append('ID_Row', rowId);
        photoFormData.append('Photo', rowImage);

        await axios.post(`${API_BASE_URL}/photos`, photoFormData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (rowFormData.ID_Type_Photo == '2') {
        // Upload two photos for type 2 (if provided)
        if (rowImage1) {
          console.log('Uploading first photo for type 2');
          const photoFormData1 = new FormData();
          photoFormData1.append('ID_Row', rowId);
          photoFormData1.append('Photo', rowImage1);

          await axios.post(`${API_BASE_URL}/photos`, photoFormData1, {
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

          await axios.post(`${API_BASE_URL}/photos`, photoFormData2, {
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
    <div>
      {confirmDialog}
      <PageHeader
        icon={Briefcase}
        title="Gestion des services"
        description="Ajoutez, modifiez ou supprimez les services proposés par votre établissement."
      />

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Services actifs" value={activeServices} icon={Check} tone="green" />
          <StatCard label="Services inactifs" value={inactiveServices} icon={X} tone="red" />
          <StatCard label="Total services" value={services.length} icon={Layers} tone="brand" />
        </div>

        {/* Formulaire d'ajout/modification */}
        <Card
          title={isEditing ? 'Modifier un service' : 'Ajouter un nouveau service'}
          icon={isEditing ? Pencil : Plus}
        >
          <form onSubmit={handleAddService}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nom du service" htmlFor="service-nom" required>
                <Input
                  id="service-nom"
                  type="text"
                  name="Nom"
                  value={formData.Nom}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Nom du service (Arabe)" htmlFor="service-nom-ar" required>
                <Input
                  id="service-nom-ar"
                  type="text"
                  name="NomAR"
                  value={formData.NomAR}
                  onChange={handleChange}
                  required
                  dir="rtl"
                />
              </Field>

              <Field label="Description" htmlFor="service-desc">
                <Textarea
                  id="service-desc"
                  name="Descriptions"
                  value={formData.Descriptions}
                  onChange={handleChange}
                  rows={3}
                />
              </Field>

              <Field label="Description (Arabe)" htmlFor="service-desc-ar">
                <Textarea
                  id="service-desc-ar"
                  name="DescriptionsAR"
                  value={formData.DescriptionsAR}
                  onChange={handleChange}
                  rows={3}
                  dir="rtl"
                />
              </Field>

              <Field label="État">
                <div className="pt-2">
                  <Checkbox
                    name="Etat"
                    checked={formData.Etat}
                    onChange={handleChange}
                    label="Actif"
                  />
                </div>
              </Field>

              <Field label="Image" htmlFor="service-photo">
                <div className="flex items-center gap-4">
                  <FileInput
                    id="service-photo"
                    name="Photos"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
                    />
                  )}
                </div>
              </Field>
            </div>

            <FormActions>
              {isEditing && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Annuler
                </Button>
              )}
              <Button type="submit" icon={isEditing ? Check : Plus}>
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </FormActions>
          </form>
        </Card>

        {/* Liste des services */}
        <Card title="Liste des services" icon={Briefcase} padded={false}>
          <Table>
            <THead>
              <tr>
                <Th>Image</Th>
                <Th>Nom</Th>
                <Th>Description</Th>
                <Th>État</Th>
                <Th>Lignes</Th>
                <Th align="right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {services.length === 0 ? (
                <TableEmpty colSpan={6} message="Aucun service disponible" />
              ) : (
                services.map(service => (
                  <Tr key={service.ID_Service}>
                    <Td>
                      {service.Photos ? (
                        <img
                          src={`${API_BASE_URL}/services/${service.ID_Service}/photo`}
                          alt={service.Nom}
                          className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                          onError={(e) => {
                            e.target.src = '/default-service.png';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                          <Image size={16} className="text-gray-400" />
                        </div>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap font-medium text-gray-900">{service.Nom}</Td>
                    <Td>
                      <div className="max-w-xs truncate text-gray-500">{service.Descriptions}</div>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => toggleServiceStatus(service.ID_Service)}
                        title="Changer l'état"
                        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
                      >
                        {service.Etat ? (
                          <Badge tone="green"><Check size={12} />Actif</Badge>
                        ) : (
                          <Badge tone="red"><X size={12} />Inactif</Badge>
                        )}
                      </button>
                    </Td>
                    <Td>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Layers}
                        onClick={() => handleViewRows(service)}
                      >
                        Voir
                      </Button>
                    </Td>
                    <Td align="right">
                      <RowActions>
                        <IconButton
                          icon={Pencil}
                          label="Modifier"
                          tone="brand"
                          onClick={() => handleEditService(service)}
                        />
                        <IconButton
                          icon={Trash2}
                          label="Supprimer"
                          tone="danger"
                          onClick={() => handleDeleteService(service.ID_Service)}
                        />
                      </RowActions>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Modal for managing rows */}
      <Modal
        open={showRowsModal}
        onClose={() => setShowRowsModal(false)}
        title={`Lignes du service : ${currentServiceName}`}
        icon={Layers}
        size="xl"
      >
        {showRowForm ? (
          <div className="mb-6 rounded-xl border border-gray-200 p-5">
            <h4 className="mb-4 text-base font-semibold text-gray-900">
              {isEditingRow ? 'Modifier une ligne' : 'Ajouter une ligne'}
            </h4>
            <form onSubmit={handleRowSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Type de photo" htmlFor="row-type-photo" required>
                  <Select
                    id="row-type-photo"
                    name="ID_Type_Photo"
                    value={rowFormData.ID_Type_Photo}
                    onChange={handleRowFormChange}
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    {typePhotos.map(type => (
                      <option key={type.ID_Type_Photo} value={type.ID_Type_Photo}>
                        {type.Nom}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Classement" htmlFor="row-classement">
                  <Input
                    id="row-classement"
                    type="number"
                    name="Classement"
                    value={rowFormData.Classement}
                    onChange={handleRowFormChange}
                  />
                </Field>

                {/* Conditional file upload fields based on ID_Type_Photo */}
                {rowFormData.ID_Type_Photo == '1' && (
                  <Field label="Image" htmlFor="row-image">
                    <FileInput
                      id="row-image"
                      name="image"
                      onChange={handleRowImageChange}
                      accept="image/*"
                    />
                  </Field>
                )}

                {rowFormData.ID_Type_Photo == '2' && (
                  <>
                    <Field label="Image 1" htmlFor="row-image1">
                      <FileInput
                        id="row-image1"
                        name="image1"
                        onChange={handleRowImage1Change}
                        accept="image/*"
                      />
                    </Field>
                    <Field label="Image 2" htmlFor="row-image2">
                      <FileInput
                        id="row-image2"
                        name="image2"
                        onChange={handleRowImage2Change}
                        accept="image/*"
                      />
                    </Field>
                  </>
                )}

                <Field label="Texte" className="md:col-span-2">
                  <div className="quill-container pb-12">
                    <ReactQuill
                      theme="snow"
                      value={rowFormData.Text}
                      onChange={handleTextEditorChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className="h-48"
                    />
                  </div>
                </Field>

                <Field label="Texte (Arabe)" className="md:col-span-2">
                  <div className="quill-container pb-12">
                    <ReactQuill
                      theme="snow"
                      value={rowFormData.TextAR}
                      onChange={handleTextEditorChangeAR}
                      modules={quillModules}
                      formats={quillFormats}
                      className="h-48"
                      dir="rtl"
                    />
                  </div>
                </Field>
              </div>

              <FormActions>
                <Button variant="secondary" onClick={() => setShowRowForm(false)}>
                  Annuler
                </Button>
                <Button type="submit" icon={isEditingRow ? Check : Plus}>
                  {isEditingRow ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </FormActions>
            </form>
          </div>
        ) : (
          <div className="mb-4 flex justify-end">
            <Button icon={Plus} onClick={handleAddRow}>
              Ajouter une ligne
            </Button>
          </div>
        )}

        {/* Table of rows */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <Table>
            <THead>
              <tr>
                {rowColumns.map((column, index) => (
                  <Th key={index}>{column.header}</Th>
                ))}
                <Th align="right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {currentServiceRows.length === 0 ? (
                <TableEmpty colSpan={rowColumns.length + 1} message="Aucune ligne disponible pour ce service" />
              ) : (
                currentServiceRows.map(row => (
                  <Tr key={row.ID_Row}>
                    {rowColumns.map((column, index) => (
                      <Td key={index} className="whitespace-nowrap">
                        {column.accessor === "Text" ? (
                          <div className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: row.Text || '' }}></div>
                        ) : (
                          column.render ? column.render(row) : row[column.accessor]
                        )}
                      </Td>
                    ))}
                    <Td align="right">
                      <RowActions>
                        <IconButton
                          icon={Pencil}
                          label="Modifier"
                          tone="brand"
                          onClick={() => handleEditRow(row)}
                        />
                        <IconButton
                          icon={Trash2}
                          label="Supprimer"
                          tone="danger"
                          onClick={() => handleDeleteRow(row.ID_Row)}
                        />
                      </RowActions>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Modal>
    </div>
  );
};

export default Services;

// Define Quill modules and formats
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
