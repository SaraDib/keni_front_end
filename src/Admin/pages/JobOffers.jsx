import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import { Briefcase, Download } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { PageHeader, Button, Alert, LoadingState } from '../ui';

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
        <div className="font-medium text-gray-900">{`${item.Salutation} ${item.Nom}`}</div>
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
        <div className="flex flex-col items-start gap-1.5">
          <Button
            variant="link"
            icon={Download}
            onClick={() => handleDownload('cv', item.ID_Offres_Emploi)}
            disabled={!item.CV}
          >
            CV
          </Button>
          <Button
            variant="link"
            icon={Download}
            onClick={() => handleDownload('lettre', item.ID_Offres_Emploi)}
            disabled={!item.lettre}
          >
            Lettre de motivation
          </Button>
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
    <div>
      <PageHeader
        icon={Briefcase}
        title="Candidatures"
        description="Gérez les candidatures reçues via le formulaire de recrutement du site."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
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