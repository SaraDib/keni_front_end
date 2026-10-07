import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { PageHeader, Alert, LoadingState } from '../ui';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les contacts depuis l'API
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/contact-us`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des messages de contact');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Définition des colonnes du tableau
  const columns = [
    {
      header: "Nom complet",
      accessor: "Nom",
      render: (item) => (
        <div className="font-medium text-gray-900">{item.Nom}</div>
      )
    },
    {
      header: "Contact",
      accessor: "contact",
      render: (item) => (
        <div>
          <div className="text-sm text-gray-900">{item.Email}</div>
          <div className="text-xs text-gray-500">{item.Telephone}</div>
        </div>
      )
    },
    {
      header: "Message",
      accessor: "Message",
      render: (item) => (
        <div className="max-w-md truncate" title={item.Message}>
          {item.Message}
        </div>
      )
    },
    {
      header: "Date",
      accessor: "created_at",
      render: (item) => (
        <div className="whitespace-nowrap text-sm text-gray-500">
          {new Date(item.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )
    }
  ];

  // Gérer la suppression d'un contact
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        // Suppression multiple
        await Promise.all(id.map(singleId =>
          axios.delete(`${API_BASE_URL}/contact-us/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        // Suppression unique
        await axios.delete(`${API_BASE_URL}/contact-us/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchContacts();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression du message');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={MessageSquare}
        title="Messages de contact"
        description="Gérez les messages reçus via le formulaire de contact du site."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
      ) : (
        <CrudTable
          title="Messages de contact"
          columns={columns}
          data={contacts}
          onDelete={handleDelete}
          showAddButton={false}
          showEditButton={false}
          emptyMessage="Aucun message de contact reçu pour le moment."
          idField="ID_Contact"
        />
      )}
    </div>
  );
};

export default Contact;