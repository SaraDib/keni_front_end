import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Building, Clock, Check, X } from 'lucide-react';
import axios from 'axios';

const HealthCenter = () => {
  // État pour stocker les données
  const [centers, setCenters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentCenter, setCurrentCenter] = useState(null);
  const [showHoursForm, setShowHoursForm] = useState(false);
  const [currentHours, setCurrentHours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les centres de santé depuis l'API
  const fetchCenters = async () => {
    try {
      setIsLoading(true);
      const [centersResponse, hoursResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/centres', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get('http://localhost:8000/api/horaires', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      // Combiner les centres avec leurs horaires
      const centersWithHours = centersResponse.data.map(center => ({
        ...center,
        horaires: hoursResponse.data.filter(hour => hour.ID_Center === center.ID_Center)
      }));
      
      setCenters(centersWithHours);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des centres de santé');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Définition des colonnes du tableau
  const columns = [
    { header: "Nom", accessor: "Nom" },
    { header: "Adresse", accessor: "Adresse" },
    { header: "Téléphone", accessor: "Telephone" },
    { header: "Fixe", accessor: "Fix" },
    { header: "Email", accessor: "Email" },
    { 
      header: "Accès handicapés", 
      accessor: "Handicapes",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.Handicapes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.Handicapes ? <Check size={14} className="mr-1" /> : <X size={14} className="mr-1" />}
          {item.Handicapes ? 'Oui' : 'Non'}
        </span>
      )
    },
    { 
      header: "Horaires", 
      accessor: "horaires",
      render: (item) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleViewHours(item);
          }}
          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
        >
          <Clock size={14} className="mr-1" />
          Voir
        </button>
      )
    }
  ];

  // Définition des colonnes du tableau des horaires
  const hoursColumns = [
    { header: "Jour", accessor: "Day_Start" },
    { 
      header: "Ouverture", 
      accessor: "Time_Start",
      render: (item) => item.isClosed ? "-" : item.Time_Start
    },
    { 
      header: "Fermeture", 
      accessor: "Time_End",
      render: (item) => item.isClosed ? "-" : item.Time_End
    },
    { 
      header: "Statut", 
      accessor: "isClosed",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {item.isClosed ? 'Fermé' : 'Ouvert'}
        </span>
      )
    }
  ];

  // Définition des champs du formulaire
  const formFields = [
    { name: "Nom", label: "Nom du centre", type: "text", required: true },
    { name: "Adresse", label: "Adresse", type: "text", required: true, fullWidth: true },
    { name: "Telephone", label: "Téléphone mobile", type: "tel", required: true },
    { name: "Fix", label: "Téléphone fixe", type: "tel", required: true },
    { name: "Email", label: "Email", type: "email", required: true },
    { name: "Handicapes", label: "Accès handicapés", type: "checkbox" },
    { name: "Positions", label: "Position sur la carte", type: "map", required: true, fullWidth: true }
  ];

  // Définition des champs du formulaire des horaires
  const hoursFormFields = [
    { 
      name: "Day_Start", 
      label: "Jour", 
      type: "select", 
      required: true,
      options: [
        { value: "Lundi", label: "Lundi" },
        { value: "Mardi", label: "Mardi" },
        { value: "Mercredi", label: "Mercredi" },
        { value: "Jeudi", label: "Jeudi" },
        { value: "Vendredi", label: "Vendredi" },
        { value: "Samedi", label: "Samedi" },
        { value: "Dimanche", label: "Dimanche" }
      ]
    },
    { 
      name: "isClosed", 
      label: "Fermé", 
      type: "checkbox",
      onChange: (e, formData, setFormData) => {
        // Si le jour est marqué comme fermé, réinitialiser les heures
        if (e.target.checked) {
          setFormData({
            ...formData,
            isClosed: true,
            Time_Start: '',
            Time_End: ''
          });
        }
      }
    },
    { 
      name: "Time_Start", 
      label: "Heure d'ouverture", 
      type: "time",
      required: (formData) => !formData.isClosed,
      disabled: (formData) => formData.isClosed
    },
    { 
      name: "Time_End", 
      label: "Heure de fermeture", 
      type: "time",
      required: (formData) => !formData.isClosed,
      disabled: (formData) => formData.isClosed
    }
  ];

  // Gérer l'ajout d'un centre
  const handleAdd = () => {
    setCurrentCenter(null);
    setShowForm(true);
  };

  // Gérer la modification d'un centre
  const handleEdit = (center) => {
    setCurrentCenter(center);
    setShowForm(true);
  };

  // Gérer la suppression d'un centre
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        // Suppression multiple
        await Promise.all(id.map(singleId => 
          axios.delete(`http://localhost:8000/api/centres/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ));
      } else {
        // Suppression unique
        await axios.delete(`http://localhost:8000/api/centres/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      await fetchCenters();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du centre');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la visualisation des horaires
  const handleViewHours = (center) => {
    setCurrentCenter(center);
    setShowHoursForm(true);
  };

  // Gérer l'ajout d'un horaire
  const handleAddHour = () => {
    setCurrentHours(null);
    setShowHoursForm(true);
  };

  // Gérer la modification d'un horaire
  const handleEditHour = (hour) => {
    setCurrentHours(hour);
    setShowHoursForm(true);
  };

  // Gérer la suppression d'un horaire
  const handleDeleteHour = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8000/api/horaires/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchCenters();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'horaire');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      // Add ID_Entreprise = 1 to the formData
      const dataToSend = {
        ...formData,
        ID_Entreprise: 1
      };
      
      if (currentCenter) {
        // Mise à jour
        await axios.put(`http://localhost:8000/api/centres/${currentCenter.ID_Center}`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Ajout
        await axios.post('http://localhost:8000/api/centres', dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchCenters();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du centre');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire des horaires
  const handleHourSubmit = async (formData) => {
    try {
      setIsLoading(true);
      // Format the data to match the database schema
      const hourData = {
        ID_Center: currentCenter.ID_Center,
        Day_Start: formData.Day_Start,
        Day_End: formData.Day_Start, // Same as Day_Start as requested
        Time_Start: formData.isClosed ? "00:00" : formData.Time_Start,
        Time_End: formData.isClosed ? "00:00" : formData.Time_End,
        isClosed: formData.isClosed ? 1 : 0
      };
      
      if (currentHours) {
        // Mise à jour
        await axios.put(`http://localhost:8000/api/horaires/${currentHours.ID_Horaire}`, hourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Ajout
        await axios.post('http://localhost:8000/api/horaires', hourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchCenters();
      setShowHoursForm(false);
      setCurrentHours(null);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'horaire');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Building className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Centre de global health</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Gérez les informations sur vos centres de santé et leurs horaires d'ouverture.
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
          title="centre de santé"
          fields={formFields}
          initialData={currentCenter}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEdit={!!currentCenter}
        />
      ) : showHoursForm && currentCenter ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Horaires - {currentCenter.name}
            </h2>
            <button
              onClick={() => setShowHoursForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Retour
            </button>
          </div>
          
          <CrudTable 
            title="Horaires"
            columns={hoursColumns}
            data={currentCenter.horaires || []}
            onAdd={handleAddHour}
            onEdit={handleEditHour}
            onDelete={handleDeleteHour}
            idField="ID_Horaire" 
            emptyMessage="Aucun horaire défini. Cliquez sur 'Ajouter' pour créer le premier horaire."
          />
          
          {showHoursForm && (
            <CrudForm 
              title="horaire"
              fields={hoursFormFields}
              initialData={currentHours}
              onSubmit={handleHourSubmit}
              onCancel={() => setShowHoursForm(false)}
              isEdit={!!currentHours}
            />
          )}
        </div>
      ) : (
        <CrudTable 
          title="Centres de santé"
          columns={columns}
          data={centers}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          idField="ID_Center" 
          emptyMessage="Aucun centre de santé disponible. Cliquez sur 'Ajouter' pour créer votre premier centre."
        />
      )}
    </div>
  );
};

export default HealthCenter;