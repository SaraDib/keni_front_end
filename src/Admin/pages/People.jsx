import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Users, Briefcase } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { PageHeader, Alert, LoadingState } from '../ui';

const People = () => {
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les membres de l'équipe depuis l'API
  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/equipes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setPeople(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des membres de l\'équipe');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  // Définition des colonnes du tableau
  const columns = [
    {
      header: "Image",
      accessor: "Image",
      render: (item) => (
        <img
          src={`${API_BASE_URL}/equipes/${item.ID_Equipe}/image`}
          alt={item.Nom}
          className="h-10 w-10 rounded-full bg-gray-100 object-cover ring-1 ring-gray-200"
          onError={(e) => {
            e.target.src = '/default-profile.png'; // Image par défaut en cas d'erreur
          }}
        />
      )
    },
    {
      header: "Nom Complet",
      accessor: "Nom",
      render: (item) => <span className="font-medium text-gray-900">{item.Nom}</span>
    },
    {
      header: "Profession",
      accessor: "Profession",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <Briefcase size={15} className="text-gray-400" />
          <span>{item.Profession}</span>
        </div>
      )
    },
    {
      header: "Description",
      accessor: "Description",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.Description}>
          {item.Description || <span className="text-gray-400">Aucune description</span>}
        </div>
      )
    }
  ];

  // Définition des champs du formulaire
  const formFields = [
    { name: "Nom", label: "Nom Complet", type: "text", required: true },
    { name: "NomAR", label: "Nom Complet (Arabe)", type: "text", required: true },
    {
      name: "Profession",
      label: "Profession",
      type: "select",
      required: true,
      options: [
        { value: "gestion", label: "Gestion" },
        { value: "medical", label: "Medical" }
      ]
    },
    { name: "ProfessionAR", label: "Profession (Arabe)", type: "text", required: true },
    { name: "Description", label: "Description", type: "textarea", rows: 3 },
    { name: "DescriptionAR", label: "Description (Arabe)", type: "textarea", rows: 3 },
    { name: "Image", label: "Photo", type: "file", accept: "image/*" }
  ];

  // Gérer l'ajout d'un membre
  const handleAdd = () => {
    setCurrentPerson(null);
    setShowForm(true);
  };

  // Gérer la modification d'un membre
  const handleEdit = (person) => {
    setCurrentPerson(person);
    setShowForm(true);
  };

  // Gérer la suppression d'un membre
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        await Promise.all(id.map(singleId =>
          axios.delete(`${API_BASE_URL}/equipes/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        await axios.delete(`${API_BASE_URL}/equipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchPeople();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du membre');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const data = new FormData();

      // Ajouter ID_Entreprise = 1
      data.append('ID_Entreprise', 1);

      // Ajouter tous les champs au FormData
      Object.keys(formData).forEach(key => {
        if (key === 'Image') {
          if (formData[key] instanceof File) {
            data.append('Image', formData[key]);
          }
        } else {
          // Pour les autres champs, envoyer même si null/undefined
          data.append(key, formData[key] || '');
        }
      });

      if (currentPerson) {
        // Mise à jour
        // S'assurer que les champs requis sont présents
        if (!formData.Nom || !formData.NomAR || !formData.Profession || !formData.ProfessionAR) {
          throw new Error('Les champs Nom, Nom (Arabe), Profession et Profession (Arabe) sont requis');
        }

        // Ajouter les champs existants si non modifiés
        if (!formData.Image) {
          data.append('Image', currentPerson.Image || '');
        }

        await axios.post(`${API_BASE_URL}/equipes/${currentPerson.ID_Equipe}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      } else {
        // Ajout
        await axios.post(`${API_BASE_URL}/equipes`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      }

      await fetchPeople();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement du membre');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Users}
        title="L'équipe"
        description="Gérez les membres de votre équipe et leurs informations."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
      ) : showForm ? (
        <CrudForm
          title="membre de l'équipe"
          fields={formFields}
          initialData={currentPerson}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEdit={!!currentPerson}
        />
      ) : (
        <CrudTable
          title="Membres de l'équipe"
          columns={columns}
          data={people}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Aucun membre dans l'équipe. Cliquez sur 'Ajouter' pour créer le premier membre."
          idField="ID_Equipe"
        />
      )}
    </div>
  );
};

export default People;