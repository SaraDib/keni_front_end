import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X, Layers, Users, Video, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import {
  PageHeader, Card, StatCard, Button, IconButton, Field, Input, FileInput, Checkbox, FormActions,
  Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions, Badge, Spinner, useConfirm,
} from '../ui';

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
  const { confirm, confirmDialog } = useConfirm();
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
    if (!(await confirm({ message: 'Êtes-vous sûr de vouloir supprimer cette section Experts ? Cette action est irréversible.' }))) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      resetForm();
      fetchExperts();
      toast.success('Section supprimée avec succès');
    } catch (error) {
      console.error('Error deleting expert:', error);
      toast.error('Échec de la suppression de la section.');
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
    <div>
      {confirmDialog}

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            <Spinner className="mx-auto mb-4" />
            <p className="text-base font-semibold text-gray-900">Téléchargement en cours... {uploadProgress}%</p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-700 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>

            <p className="mt-4 text-sm text-gray-500">Veuillez patienter, envoi des fichiers vers le serveur...</p>
          </div>
        </div>
      )}

      <PageHeader
        icon={Users}
        title="Section Experts"
        description="Configurez la section unique « Experts en santé et bien-être » de la page d'accueil."
      />

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Section active"
            value={experts.length > 0 && experts[0].Etat ? 1 : 0}
            icon={Check}
            tone="green"
          />
          <StatCard
            label="Section inactive"
            value={experts.length > 0 && !experts[0].Etat ? 1 : 0}
            icon={X}
            tone="red"
          />
          <StatCard label="Total sections" value={experts.length || 0} icon={Layers} tone="brand" />
        </div>

        {/* Formulaire */}
        <Card title="Gérer la section Experts" icon={Pencil}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Vidéo">
                <FileInput
                  name="VideoURL"
                  onChange={handleChange}
                  accept="video/mp4,video/webm"
                  disabled={experts.length > 0 && !isEditing}
                />
                {previewVideo && (
                  <video
                    src={previewVideo}
                    controls
                    className="mt-3 h-32 w-full rounded-lg border border-gray-200 object-cover"
                  />
                )}
              </Field>
              <Field label="Image illustrative">
                <FileInput
                  name="Image"
                  onChange={handleChange}
                  accept="image/*"
                  disabled={experts.length > 0 && !isEditing}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-3 h-32 w-full rounded-lg border border-gray-200 object-cover"
                  />
                )}
              </Field>
              <Field label="Titre (Français)">
                <Input
                  type="text"
                  name="TitleFR"
                  value={formData.TitleFR}
                  onChange={handleChange}
                  disabled={experts.length > 0 && !isEditing}
                />
              </Field>
              <Field label="Titre (Arabe)">
                <Input
                  type="text"
                  name="TitleAR"
                  value={formData.TitleAR}
                  onChange={handleChange}
                  dir="rtl"
                  disabled={experts.length > 0 && !isEditing}
                />
              </Field>
              <Field label="Description (Français)" className="md:col-span-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
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
              </Field>
              <Field label="Description (Arabe)" className="md:col-span-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
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
              </Field>
              <Field label="État">
                <Checkbox
                  name="Etat"
                  checked={formData.Etat}
                  onChange={handleChange}
                  disabled={experts.length === 0}
                  label="Actif"
                />
              </Field>
            </div>
            <FormActions>
              {experts.length > 0 && (
                <Button variant="secondary" onClick={resetForm} disabled={!isEditing}>
                  Annuler
                </Button>
              )}
              <Button
                onClick={(e) => {
                  console.log('>>> Manual button trigger');
                  handleSubmit(e);
                }}
                loading={isLoading}
              >
                {isLoading ? 'Envoi...' : (experts.length > 0 ? 'Mettre à jour' : 'Enregistrer')}
              </Button>
            </FormActions>
          </form>
        </Card>

        {/* Liste des experts */}
        <Card title="Contenu actuel" padded={false}>
          <Table>
            <THead>
              <tr>
                <Th>Vidéo</Th>
                <Th>Image</Th>
                <Th>Titre</Th>
                <Th>Description</Th>
                <Th>État</Th>
                <Th align="right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {experts.length === 0 ? (
                <TableEmpty colSpan={6} message="Aucun contenu disponible" />
              ) : (
                experts.slice(0, 1).map(expert => ( // Limit to first entry
                  <Tr key={expert.ID_Expert}>
                    <Td className="whitespace-nowrap">
                      {expert.VideoURL ? (
                        <video
                          src={`${API_BASE_URL}/experts/${expert.ID_Expert}/video`}
                          className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <Video size={16} className="text-gray-400" />
                        </div>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {expert.ImagePath ? (
                        <img
                          src={`${API_BASE_URL}/experts/${expert.ID_Expert}/image`}
                          alt={expert.TitleFR}
                          className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                          onError={(e) => {
                            e.target.src = '/default-image.png';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap font-medium text-gray-900">{expert.TitleFR}</Td>
                    <Td className="max-w-xs truncate text-gray-500" dangerouslySetInnerHTML={{ __html: expert.DescriptionFR }} />
                    <Td className="whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleStatus(expert.ID_Expert)}
                        title="Changer l'état"
                        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
                      >
                        {expert.Etat ? (
                          <Badge tone="green"><Check size={12} /> Actif</Badge>
                        ) : (
                          <Badge tone="red"><X size={12} /> Inactif</Badge>
                        )}
                      </button>
                    </Td>
                    <Td align="right" className="whitespace-nowrap">
                      <RowActions>
                        <IconButton icon={Pencil} label="Modifier" tone="brand" onClick={() => handleEdit(expert)} />
                        <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(expert.ID_Expert)} />
                      </RowActions>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ExpertsAdmin;
