import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import { Briefcase, Download } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const JobOffers = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les candidatures depuis l'API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/offres-emploi`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Télécharger un fichier
  const handleDownload = async (type, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/offres-emploi/${id}/${type}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${type === 'cv' ? 'CV' : 'Lettre_de_motivation'}_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Erreur lors du téléchargement du fichier');
      console.error('Erreur:', err);
    }
  };

  // Définition des colonnes du tableau
  const columns = [
    {
      header: "Nom complet",
      accessor: "Nom",
      render: (item) => (
        <div className="font-medium">{`${item.Salutation} ${item.Nom}`}</div>
      )
    },
    {
      header: "Informations personnelles",
      accessor: "personal_info",
      render: (item) => (
        <div>
          <div className="text-xs text-gray-500">{item.Rue}</div>
          <div className="text-xs text-gray-500">{item.Code_Postal} {item.Ville}</div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (item) => (
        <div>
          <div className="text-sm">{item.Email}</div>
          <div className="text-xs text-gray-500">{item.Telephone}</div>
        </div>
      )
    },
    {
      header: "Profession",
      accessor: "Profession",
      render: (item) => (
        <div className="text-sm">{item.Profession}</div>
      )
    },
    {
      header: "Documents",
      accessor: "documents",
      render: (item) => (
        <div className="space-y-2">
          <button
            onClick={() => handleDownload('cv', item.ID_Offres_Emploi)}
            className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
            disabled={!item.CV}
          >
            <Download size={16} className="mr-1" />
            CV
          </button>
          <button
            onClick={() => handleDownload('lettre', item.ID_Offres_Emploi)}
            className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
            disabled={!item.lettre}
          >
            <Download size={16} className="mr-1" />
            Lettre de motivation
          </button>
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
    }
  ];

  // Gérer la suppression d'une candidature
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        // Suppression multiple
        await Promise.all(id.map(singleId =>
          axios.delete(`${API_BASE_URL}/offres-emploi/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        // Suppression unique
        await axios.delete(`${API_BASE_URL}/offres-emploi/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchApplications();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression de la candidature');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Briefcase className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Candidatures</h1>
      </div>

      <p className="mb-6 text-gray-600">
        Gérez les candidatures reçues via le formulaire de recrutement du site.
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
      ) : (
        <CrudTable
          title="Candidatures"
          columns={columns}
          data={applications}
          onDelete={handleDelete}
          showAddButton={false}
          showEditButton={false}
          emptyMessage="Aucune candidature reçue pour le moment."
          idField="ID_Offres_Emploi"
        />
      )}
    </div>
  );
};

export default JobOffers;