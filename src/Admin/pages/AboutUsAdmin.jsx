import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Check, X, Pencil, Trash2, Plus, Info, CheckCircle2, XCircle, Layers, FileText, Save,
} from 'lucide-react';
import API_BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  PageHeader, Card, StatCard, Button, IconButton, Field, Checkbox, FormActions,
  Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions, Badge, Alert, useConfirm,
} from '../ui';
import toast from 'react-hot-toast';

const AboutUsAdmin = () => {
  const { confirm, confirmDialog } = useConfirm();
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
      setErrors({ general: 'Erreur lors du chargement des sections.' });
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
      toast.success(formData.id ? 'Section mise à jour avec succès' : 'Section créée avec succès');
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
    if (!(await confirm({ message: 'Êtes-vous sûr de vouloir supprimer cette section ? Cette action est irréversible.' }))) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAboutUs();
      resetForm();
      toast.success('Section supprimée avec succès');
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

  const quillClass =
    'bg-white [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 ' +
    '[&_.ql-container]:h-56 [&_.ql-container]:border-0 [&_.ql-container]:text-sm';

  return (
    <div>
      {confirmDialog}
      <PageHeader
        icon={Info}
        title="Qui sommes-nous"
        description="Configurez les descriptions de la section Qui sommes-nous (FR & AR)."
        actions={
          <Button icon={Plus} onClick={handleCreateNew}>
            Créer une nouvelle section
          </Button>
        }
      />

      {errors.general && <Alert tone="error">{errors.general}</Alert>}

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Sections actives"
            value={aboutUsList.filter(section => section.active).length}
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            label="Sections inactives"
            value={aboutUsList.filter(section => !section.active).length}
            icon={XCircle}
            tone="red"
          />
          <StatCard label="Total sections" value={aboutUsList.length} icon={Layers} tone="brand" />
        </div>

        {/* Formulaire */}
        <Card
          icon={formData.id ? Pencil : Plus}
          title={formData.id ? 'Modifier la section Qui sommes-nous' : 'Créer une nouvelle section Qui sommes-nous'}
          description={!isEditing ? 'Sélectionnez une section à modifier ou créez-en une nouvelle.' : undefined}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5">
              <Field label="Description (Français)" required error={errors.description_fr}>
                <div
                  className={`overflow-hidden rounded-lg border bg-white ${errors.description_fr ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <ReactQuill
                    theme="snow"
                    value={formData.description_fr}
                    onChange={(content) => handleDescriptionChange('description_fr', content)}
                    modules={quillModules}
                    formats={quillFormats}
                    className={quillClass}
                    readOnly={!isEditing}
                  />
                </div>
              </Field>
              <Field label="Description (Arabe)" required error={errors.description_ar}>
                <div
                  className={`overflow-hidden rounded-lg border bg-white ${errors.description_ar ? 'border-red-400' : 'border-gray-300'}`}
                >
                  <ReactQuill
                    theme="snow"
                    value={formData.description_ar}
                    onChange={(content) => handleDescriptionChange('description_ar', content)}
                    modules={quillModules}
                    formats={quillFormats}
                    className={quillClass}
                    dir="rtl"
                    readOnly={!isEditing}
                  />
                </div>
              </Field>
              <Field label="État">
                <Checkbox
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  disabled={!isEditing}
                  label="Actif"
                />
              </Field>
            </div>
            <FormActions>
              {isEditing && (
                <Button variant="secondary" onClick={resetForm}>
                  Annuler
                </Button>
              )}
              <Button type="submit" icon={Save} disabled={!isEditing}>
                {formData.id ? 'Mettre à jour' : 'Créer'}
              </Button>
            </FormActions>
          </form>
        </Card>

        {/* Contenu actuel */}
        <Card title="Contenu actuel" icon={FileText} padded={false}>
          <Table>
            <THead>
              <tr>
                <Th>ID</Th>
                <Th>Description (Français)</Th>
                <Th>État</Th>
                <Th align="right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {aboutUsList.length === 0 ? (
                <TableEmpty colSpan={4} message="Aucun contenu disponible" />
              ) : (
                aboutUsList.map((section) => (
                  <Tr key={section.id} selected={formData.id === section.id}>
                    <Td className="whitespace-nowrap text-gray-500">{section.id}</Td>
                    <Td className="max-w-xs truncate">
                      {section.description_fr ? <span dangerouslySetInnerHTML={{ __html: section.description_fr }} /> : 'N/A'}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {section.active ? (
                        <Badge tone="green"><Check size={12} /> Actif</Badge>
                      ) : (
                        <Badge tone="red"><X size={12} /> Inactif</Badge>
                      )}
                    </Td>
                    <Td align="right">
                      <RowActions>
                        <IconButton icon={Pencil} label="Modifier" tone="brand" onClick={() => handleEdit(section)} />
                        <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => handleDelete(section.id)} />
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
