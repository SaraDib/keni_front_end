import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Building, Clock, Check, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { PageHeader, Alert, LoadingState, Button, Badge } from '../ui';

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
        axios.get(`${API_BASE_URL}/centres`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_BASE_URL}/horaires`, {
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
        <Badge tone={item.Handicapes ? 'green' : 'red'}>
          {item.Handicapes ? <Check size={12} /> : <X size={12} />}
          {item.Handicapes ? 'Oui' : 'Non'}
        </Badge>
      )
    },
    {
      header: "Horaires",
      accessor: "horaires",
      render: (item) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Clock}
          onClick={(e) => {
            e.stopPropagation();
            handleViewHours(item);
          }}
        >
          Voir
        </Button>
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
        <Badge tone={item.isClosed ? 'red' : 'green'}>
          {item.isClosed ? 'Fermé' : 'Ouvert'}
        </Badge>
      )
    }
  ];

  // Définition des champs du formulaire
  const formFields = [
    { name: "Nom", label: "Nom du centre (FR)", type: "text", required: true },
    { name: "NomAR", label: "Nom du centre (AR)", type: "text", required: true },
    { name: "Adresse", label: "Adresse (FR)", type: "text", required: true, fullWidth: true },
    { name: "AdresseAR", label: "Adresse (AR)", type: "text", required: true, fullWidth: true },
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
          axios.delete(`${API_BASE_URL}/centres/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ));
      } else {
        // Suppression unique
        await axios.delete(`${API_BASE_URL}/centres/${id}`, {
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
      await axios.delete(`${API_BASE_URL}/horaires/${id}`, {
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

      console.log('>>> Sending Center data:', dataToSend);

      if (currentCenter) {
        // Mise à jour
        await axios.put(`${API_BASE_URL}/centres/${currentCenter.ID_Center}`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Ajout
        await axios.post(`${API_BASE_URL}/centres`, dataToSend, {
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
      if (err.response && err.response.data) {
        console.error('>>> Backend Validation Errors:', err.response.data);
        const backendErrors = err.response.data.errors;
        const firstError = backendErrors ? Object.values(backendErrors)[0][0] : err.response.data.message;
        setError(`Erreur : ${firstError}`);
      } else {
        setError('Erreur lors de l\'enregistrement du centre');
      }
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire des horaires
  const handleHourSubmit = async (formData) => {
    try {
      setIsLoading(true);

      const dayAR = {
        "Lundi": "الاثنين",
        "Mardi": "الثلاثاء",
        "Mercredi": "الأربعاء",
        "Jeudi": "الخميس",
        "Vendredi": "الجمعة",
        "Samedi": "السبت",
        "Dimanche": "الأحد"
      };

      // Format the data to match the database schema
      const hourData = {
        ID_Center: currentCenter.ID_Center,
        Day_Start: formData.Day_Start,
        Day_Start_AR: dayAR[formData.Day_Start] || formData.Day_Start,
        Time_Start: formData.isClosed ? "00:00" : (formData.Time_Start ? formData.Time_Start.substring(0, 5) : "00:00"),
        Time_End: formData.isClosed ? "00:00" : (formData.Time_End ? formData.Time_End.substring(0, 5) : "00:00"),
        isClosed: formData.isClosed ? 1 : 0
      };

      console.log('>>> Sending Hour data:', hourData);

      if (currentHours) {
        // Mise à jour
        await axios.put(`${API_BASE_URL}/horaires/${currentHours.ID_Horaire}`, hourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Ajout
        await axios.post(`${API_BASE_URL}/horaires`, hourData, {
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
      if (err.response && err.response.data) {
        console.error('>>> Backend Hour Validation Errors:', err.response.data);
        const backendErrors = err.response.data.errors;
        const firstError = backendErrors ? Object.values(backendErrors)[0][0] : err.response.data.message;
        setError(`Erreur horaire : ${firstError}`);
      } else {
        setError('Erreur lors de l\'enregistrement de l\'horaire');
      }
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Building}
        title="Centres Global Health"
        description="Gérez les informations sur vos centres de santé et leurs horaires d'ouverture."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
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
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-brand-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Horaires - {currentCenter.Nom || currentCenter.name}
              </h2>
            </div>
            <Button variant="secondary" icon={ArrowLeft} onClick={() => setShowHoursForm(false)}>
              Retour
            </Button>
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