import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Calendar, Filter, Eye, RotateCcw } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import {
  PageHeader, Card, Button, IconButton, Field, Select, Badge, Alert, LoadingState,
} from '../ui';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    service: 'all'
  });

  // Charger les rendez-vous depuis l'API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rendez-vous`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    if (filters.type !== 'all' && appointment.Type_recette !== filters.type) {
      return false;
    }

    if (filters.service === 'physiotherapie' && appointment.Physiotherapie !== 'Oui') {
      return false;
    }

    if (filters.service === 'ergotherapie' && appointment.Ergotherapie !== 'Oui') {
      return false;
    }

    return true;
  });

  // Définition des colonnes du tableau
  const columns = [
    {
      header: "Patient",
      accessor: "patient",
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.Nom} {item.Prenom}</div>
          <div className="text-xs text-gray-500">Né(e) le {new Date(item.Date_Naissance).toLocaleDateString('fr-FR')}</div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (item) => (
        <div>
          <div className="text-sm">{item.Email}</div>
          <div className="text-xs text-gray-500">{item.Tel}</div>
        </div>
      )
    },
    {
      header: "Consultation",
      accessor: "consultation",
      render: (item) => (
        <div>
          <div className="text-sm">{item.Faire}</div>
          <div className="text-xs text-gray-500">{item.Type_recette}</div>
        </div>
      )
    },
    {
      header: "Services",
      accessor: "services",
      render: (item) => (
        <div className="space-y-1">
          <div className="text-sm">
            Nombre de personnes: {item.nombre}
          </div>
          <div className="flex flex-wrap gap-1">
            {item.Physiotherapie === 'Oui' && <Badge tone="brand">Physiothérapie</Badge>}
            {item.Ergotherapie === 'Oui' && <Badge tone="green">Ergothérapie</Badge>}
          </div>
        </div>
      )
    },
    {
      header: "Remarque",
      accessor: "Remarque",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.Remarque}>
          {item.Remarque || "Aucune remarque"}
        </div>
      )
    },
    {
      header: "Date",
      accessor: "created_at",
      render: (item) => (
        <div className="text-sm text-gray-500">
          {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Non spécifiée'}
        </div>
      )
    },
    {
      header: "Détails",
      accessor: "actions",
      render: (item) => (
        <IconButton icon={Eye} label="Voir les détails" onClick={() => handleView(item)} />
      )
    }
  ];

  // Gérer la suppression d'un rendez-vous
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        // Suppression multiple
        await Promise.all(id.map(singleId =>
          axios.delete(`${API_BASE_URL}/rendez-vous/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        // Suppression unique
        await axios.delete(`${API_BASE_URL}/rendez-vous/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchAppointments();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du rendez-vous');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'affichage des détails
  const handleView = (appointment) => {
    setCurrentAppointment(appointment);
    setShowDetails(true);
  };

  // Gérer le changement de filtre
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      type: 'all',
      service: 'all'
    });
  };

  // Définition des champs pour l'affichage des détails
  const detailFields = [
    { name: "Nom", label: "Nom", type: "text", readOnly: true },
    { name: "Prenom", label: "Prénom", type: "text", readOnly: true },
    { name: "Date_Naissance", label: "Date de naissance", type: "date", readOnly: true },
    { name: "Tel", label: "Téléphone", type: "tel", readOnly: true },
    { name: "Email", label: "Email", type: "email", readOnly: true },
    { name: "Faire", label: "Objet", type: "text", readOnly: true },
    { name: "Type_recette", label: "Type", type: "text", readOnly: true },
    { name: "nombre", label: "Nombre de personnes", type: "number", readOnly: true },
    { name: "Physiotherapie", label: "Physiothérapie", type: "text", readOnly: true },
    { name: "Ergotherapie", label: "Ergothérapie", type: "text", readOnly: true },
    { name: "Remarque", label: "Remarque", type: "textarea", rows: 3, readOnly: true, fullWidth: true }
  ];

  return (
    <div>
      <PageHeader
        icon={Calendar}
        title="Rendez-vous"
        description="Gérez les rendez-vous reçus via le formulaire de prise de rendez-vous du site."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
      ) : showDetails ? (
        <CrudForm
          title="Détails du rendez-vous"
          fields={detailFields}
          initialData={currentAppointment}
          onCancel={() => setShowDetails(false)}
          readOnly={true}
          showSubmitButton={false}
        />
      ) : (
        <div className="space-y-6">
          <Card
            title="Filtres"
            icon={Filter}
            actions={
              <Button variant="secondary" size="sm" icon={RotateCcw} onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            }
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Type de consultation" htmlFor="type">
                <Select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tous les types</option>
                  <option value="Générale">Générale</option>
                  <option value="Spécialiste">Spécialiste</option>
                </Select>
              </Field>
              <Field label="Service" htmlFor="service">
                <Select
                  id="service"
                  name="service"
                  value={filters.service}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tous les services</option>
                  <option value="physiotherapie">Physiothérapie</option>
                  <option value="ergotherapie">Ergothérapie</option>
                </Select>
              </Field>
            </div>
          </Card>

          <CrudTable
            title="Liste des rendez-vous"
            columns={columns}
            data={filteredAppointments}
            onDelete={handleDelete}
            showAddButton={false}
            showEditButton={false}
            idField="ID_Rendez_Vous"
            emptyMessage={
              filteredAppointments.length === 0 && appointments.length > 0
                ? "Aucun rendez-vous ne correspond aux filtres sélectionnés."
                : "Aucun rendez-vous reçu pour le moment."
            }
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;