import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Megaphone, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  PageHeader, Card, Button, IconButton, Field, Input, FileInput, Checkbox, FormActions,
  Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions, Badge, LoadingState, useConfirm,
} from '../ui';
import toast from 'react-hot-toast';

const UpdatesAdmin = () => {
  const { confirm, confirmDialog } = useConfirm();
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
  const [isLoaded, setIsLoaded] = useState(false); // Avoids submitting a "create" before the existing update is known

  const token = localStorage.getItem('token');
  const API_URL = `${API_BASE_URL}/updates`;

  // `isActive` lets the initial load ignore a response that arrives after the
  // effect was cleaned up, so it cannot reset a form the user is already filling.
  const fetchUpdate = async (isActive = () => true) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!isActive()) return;
      // Laravel renvoie {} (et non null) quand aucune mise à jour n'existe.
      const existingId = response.data && (response.data.id || response.data.ID_Updates);
      const data = existingId ? { ...response.data, ID_Updates: existingId } : null;
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
        const storageBase = API_BASE_URL.replace('/api', '/storage');
        setPreviewImage(data.image_path ? `${storageBase}/${data.image_path}` : null);
        setIsEditing(true); // Editing mode if update exists
      } else {
        resetForm();
        setIsEditing(true); // Creation mode if no update exists
      }
    } catch (error) {
      if (!isActive()) return;
      console.error('Error fetching update:', error);
      resetForm();
      setIsEditing(true); // Allow creation if fetch fails (e.g., no update exists)
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    let active = true;
    fetchUpdate(() => active);
    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image' && files && files[0]) {
      setImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (field, content) => {
    setFormData((prev) => ({ ...prev, [field]: content }));
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
      if (image) updateFormData.append('image', image);

      if (formData.ID_Updates) {
        // POST vers /updates/{id} pour modifier avec method spoofing pour Laravel
        updateFormData.append('_method', 'PUT');
        await axios.post(`${API_URL}/${formData.ID_Updates}`, updateFormData, { headers });
      } else {
        const response = await axios.post(API_URL, updateFormData, { headers });
        setFormData((prev) => ({
          ...prev,
          ID_Updates: response.data.ID_Updates || response.data.id,
        }));
      }


      fetchUpdate();
      toast.success(formData.ID_Updates ? 'Mise à jour modifiée avec succès' : 'Mise à jour créée avec succès');
    } catch (error) {
      console.error('Erreur:', error.response ? error.response.data : error.message);
      toast.error(
        error.response?.data?.message ||
        'Échec de l’enregistrement de la mise à jour.'
      );
    }
  };


  const handleDelete = async (id) => {
    const targetId = (id && (typeof id === 'string' || typeof id === 'number')) ? id : formData.ID_Updates;

    if (!targetId) {
      toast.error('Aucune mise à jour à supprimer.');
      return;
    }

    if (!(await confirm({ message: 'Êtes-vous sûr de vouloir supprimer cette mise à jour ? Cette action est irréversible.' }))) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUpdate();
      toast.success('Mise à jour supprimée avec succès');
    } catch (error) {
      console.error('Error deleting update:', error);
      toast.error('Échec de la suppression de la mise à jour.');
    }
  };

  const handleEdit = (updateItem) => {
    setFormData({
      ID_Updates: updateItem.ID_Updates,
      title_fr: updateItem.title_fr || '',
      title_ar: updateItem.title_ar || '',
      description_fr: updateItem.description_fr || '',
      description_ar: updateItem.description_ar || '',
      active: updateItem.active,
    });
    const storageBase = API_BASE_URL.replace('/api', '/storage');
    setPreviewImage(updateItem.image_path ? `${storageBase}/${updateItem.image_path}` : null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div>
      {confirmDialog}
      <PageHeader
        icon={Megaphone}
        title="Mise à jour"
        description="Configurez la section unique des mises à jour de la page d'accueil."
      />

      {!isLoaded ? <LoadingState /> : (
      <div className="space-y-6">
        {/* Formulaire */}
        <Card
          title={update ? 'Modifier la mise à jour' : 'Créer une mise à jour'}
          icon={update ? Pencil : Plus}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Image" className="md:col-span-2">
                <FileInput
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-3 h-32 w-full rounded-lg border border-gray-200 object-cover md:w-1/2"
                  />
                )}
              </Field>
              <Field label="Titre (Français)" required>
                <Input
                  type="text"
                  name="title_fr"
                  value={formData.title_fr}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Titre (Arabe)" required>
                <Input
                  type="text"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleChange}
                  required
                  dir="rtl"
                />
              </Field>
              <Field label="Description (Français)" className="md:col-span-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                  <ReactQuill
                    theme="snow"
                    value={formData.description_fr}
                    onChange={(content) => handleDescriptionChange('description_fr', content)}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-48 mb-12"
                  />
                </div>
              </Field>
              <Field label="Description (Arabe)" className="md:col-span-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
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
              </Field>
              <Field label="État">
                <Checkbox
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  label="Actif"
                />
              </Field>
            </div>
            <FormActions>
              {update && (
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => handleDelete(formData.ID_Updates)}
                >
                  Supprimer
                </Button>
              )}
              <Button type="submit">
                {update ? 'Mettre à jour' : 'Créer'}
              </Button>
            </FormActions>
          </form>
        </Card>

        {/* Contenu Actuel */}
        <Card title="Contenu actuel" padded={false}>
          <Table>
            <THead>
              <tr>
                <Th>Image</Th>
                <Th>Titre</Th>
                <Th>Description</Th>
                <Th>État</Th>
                <Th align="right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {!update ? (
                <TableEmpty colSpan={5} message="Aucun contenu disponible" />
              ) : (
                <Tr>
                  <Td className="whitespace-nowrap">
                    {update.image_path ? (
                      <img
                        src={`${API_BASE_URL.replace('/api', '/storage')}/${update.image_path}`}
                        alt={update.title_fr}
                        className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                        onError={(e) => { e.target.src = '/default-image.png'; }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap font-medium text-gray-900">{update.title_fr || 'N/A'}</Td>
                  <Td className="max-w-xs truncate text-gray-500">
                    {update.description_fr ? <span dangerouslySetInnerHTML={{ __html: update.description_fr }} /> : 'N/A'}
                  </Td>
                  <Td className="whitespace-nowrap">
                    {update.active ? (
                      <Badge tone="green"><Check size={12} /> Actif</Badge>
                    ) : (
                      <Badge tone="red"><X size={12} /> Inactif</Badge>
                    )}
                  </Td>
                  <Td align="right" className="whitespace-nowrap">
                    <RowActions>
                      <IconButton icon={Pencil} label="Modifier" tone="brand" onClick={() => handleEdit(update)} />
                      <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(update.ID_Updates)} />
                    </RowActions>
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </Card>
      </div>
      )}
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