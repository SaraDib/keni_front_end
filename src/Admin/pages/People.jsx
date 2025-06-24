import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Users, Phone, Mail, Briefcase } from 'lucide-react';
import axios from 'axios';

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
      const response = await axios.get('http://keniweb.test/api/equipes', {
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
          src={`http://keniweb.test/api/equipes/${item.ID_Equipe}/image`}
          alt={item.Nom}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = '/default-profile.png'; // Image par défaut en cas d'erreur
          }}
        />
      )
    },
    { 
      header: "Nom Complet", 
      accessor: "Nom"
    },
    { 
      header: "Profession", 
      accessor: "Profession",
      render: (item) => (
        <div className="flex items-center">
          <Briefcase size={16} className="mr-1 text-gray-500" />
          <span>{item.Profession}</span>
        </div>
      )
    },
    {
      header: "Description",
      accessor: "Description",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.Description}>
          {item.Description || "Aucune description"}
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
          axios.delete(`http://keniweb.test/api/equipes/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        await axios.delete(`http://keniweb.test/api/equipes/${id}`, {
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

        await axios.post(`http://keniweb.test/api/equipes/${currentPerson.ID_Equipe}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
      } else {
        // Ajout
        await axios.post('http://keniweb.test/api/equipes', data, {
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
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Users className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">L'équipe</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Gérez les membres de votre équipe et leurs informations.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
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