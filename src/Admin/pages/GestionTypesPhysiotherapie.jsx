import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react'; // Import des icônes Lucide React
import API_BASE_URL from '../../config';

const GestionTypesPhysiotherapie = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editType, setEditType] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Charger les packs et services depuis l'API
  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/physiotherapie`);
      setTypes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des packs et services', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Ajouter un nouveau pack ou service
  const handleAddType = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/physiotherapie`, { nom: newType }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes([...types, response.data]);
      setNewType('');
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du pack ou service', error);
      setIsLoading(false);
    }
  };

  // Supprimer un pack ou service
  const handleDeleteType = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/physiotherapie/${deleteId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes(types.filter((type) => type.id !== deleteId));
      setShowDeleteConfirmation(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du pack ou service', error);
      setIsLoading(false);
    }
  };

  // Modifier un pack ou service
  const handleEditType = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_BASE_URL}/physiotherapie/${editType.id}`, { nom: editType.nom }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes(types.map((type) => type.id === editType.id ? response.data : type));
      setEditType(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la modification du pack ou service', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <h1 className="text-xl font-semibold mb-4">Gestion des Packs et Services</h1>

      {isLoading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <>
          <div className="mb-4 flex items-center space-x-3">
            <input
              type="text"
              className="border p-2 rounded-md w-full"
              placeholder="Nom du pack ou service"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <button
              onClick={handleAddType}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Ajouter
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-4">Liste des Packs et Services</h2>
          <table className="min-w-full bg-gray-100 rounded-md">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="py-2 px-4 border-b">Nom du Pack/Service</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.length > 0 ? (
                types.map((type, index) => (
                  <tr key={type.id} className="text-center bg-white">
                    <td className="py-2 px-4 border-b">{type.nom}</td>
                    <td className="py-2 px-4 border-b flex justify-center space-x-2">
                      <button
                        className="text-yellow-500"
                        onClick={() => setEditType({ id: type.id, nom: type.nom })}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          setDeleteId(type.id);
                          setShowDeleteConfirmation(true);
                        }}
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">Aucun pack ou service disponible</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Formulaire de modification */}
          {editType && (
            <div className="mt-4 bg-gray-200 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Modifier le Pack ou Service</h3>
              <input
                type="text"
                className="border p-2 rounded-md w-full"
                value={editType.nom}
                onChange={(e) => setEditType({ ...editType, nom: e.target.value })}
              />
              <button
                onClick={handleEditType}
                className="bg-green-500 text-white p-2 rounded-md mt-2"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditType(null)}
                className="bg-gray-500 text-white p-2 rounded-md mt-2 ml-2"
              >
                Annuler
              </button>
            </div>
          )}

          {/* Confirmation de suppression */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/3 text-center">
                <h4 className="text-lg font-semibold">Êtes-vous sûr de vouloir supprimer ce pack ou service ?</h4>
                <div className="mt-4">
                  <button
                    onClick={handleDeleteType}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="bg-gray-500 text-white p-2 rounded-md ml-2"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GestionTypesPhysiotherapie;
