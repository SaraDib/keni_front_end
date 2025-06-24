import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Users, Shield, User } from 'lucide-react';
import axios from 'axios';

const UsersPage = () => {
  // État pour stocker les données
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://keniweb.test/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Définition des colonnes du tableau
  const columns = [
    { header: "Nom", accessor: "Nom" },
    { header: "Email", accessor: "Email" },
    { 
      header: "Rôle", 
      accessor: "Role",
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.Role === 'admin' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {item.Role === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </span>
      )
    }
  ];

  // Définition des champs du formulaire
  const formFields = [
    { name: "Nom", label: "Nom complet", type: "text", required: true },
    { name: "Email", label: "Email", type: "email", required: true },
    { 
      name: "Role", 
      label: "Rôle", 
      type: "select", 
      required: true,
      options: [
        { value: "admin", label: "Administrateur" },
        { value: "user", label: "Utilisateur" }
      ]
    },
    { name: "password", label: "Mot de passe", type: "password", required: !currentUser },
  ];

  // Gérer l'ajout d'un utilisateur
  const handleAdd = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  // Gérer la modification d'un utilisateur
  const handleEdit = (user) => {
    // Ne pas inclure le mot de passe dans l'édition
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    delete userWithoutPassword.password_confirmation;
    
    setCurrentUser(userWithoutPassword);
    setShowForm(true);
  };

  // Gérer la suppression d'un utilisateur
  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        // Multiple delete
        await Promise.all(id.map(singleId => 
          axios.delete(`http://keniweb.test/api/users/${singleId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      } else {
        // Single delete
        await axios.delete(`http://keniweb.test/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      // Always include ID_Entreprise = 1
      const data = { ...formData, ID_Entreprise: 1 };
      if (currentUser) {
        // Update
        await axios.put(`http://keniweb.test/api/users/${currentUser.ID_User}`, data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Create
        await axios.post('http://keniweb.test/api/register', data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
      await fetchUsers();
      setShowForm(false);
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'utilisateur');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Users className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Utilisateurs</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Gérez les utilisateurs qui ont accès au panneau d'administration.
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
          title="utilisateur"
          fields={formFields}
          initialData={currentUser}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEdit={!!currentUser}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Shield className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold">Rôles et permissions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Shield className="text-red-500 mr-2" size={16} />
                  <p className="text-sm font-medium text-red-500">Administrateur</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Accès complet à toutes les fonctionnalités du panneau d'administration.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="text-green-500 mr-2" size={16} />
                  <p className="text-sm font-medium text-green-500">Utilisateur</p>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Accès limité aux fonctionnalités de base.
                </p>
              </div>
            </div>
          </div>

          <CrudTable 
            title="Liste des utilisateurs"
            columns={columns}
            data={users}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            idField="ID_User"
            emptyMessage="Aucun utilisateur disponible. Cliquez sur 'Ajouter' pour créer votre premier utilisateur."
          />
        </div>
      )}
    </div>
  );
};

export default UsersPage;