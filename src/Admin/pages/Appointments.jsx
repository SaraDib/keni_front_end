import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Calendar, Filter, Eye } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';

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
      console.log(localStorage.getItem('token'))
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
          <div className="font-medium">{item.Nom} {item.Prenom}</div>
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
          <div className="text-xs">
            {item.Physiotherapie === 'Oui' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                Physiothérapie
              </span>
            )}
            {item.Ergotherapie === 'Oui' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Ergothérapie
              </span>
            )}
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
      header: "Actions",
      accessor: "actions",
      render: (item) => (
        <button
          onClick={() => handleView(item)}
          className="p-2 text-blue-600 hover:text-blue-800"
          title="Voir les détails"
        >
          <Eye size={18} />
        </button>
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
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Calendar className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Rendez-vous</h1>
      </div>

      <p className="mb-6 text-gray-600">
        Gérez les rendez-vous reçus via le formulaire de prise de rendez-vous du site.
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
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center mb-4">
              <Filter className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold">Filtres</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de consultation
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="Générale">Générale</option>
                  <option value="Spécialiste">Spécialiste</option>
                </select>
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={filters.service}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les services</option>
                  <option value="physiotherapie">Physiothérapie</option>
                  <option value="ergotherapie">Ergothérapie</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

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