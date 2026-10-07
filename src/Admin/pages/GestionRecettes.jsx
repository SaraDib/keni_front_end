import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, Plus, Pencil, Trash2, Save } from 'lucide-react';
import API_BASE_URL from '../../config';
import {
  PageHeader, Card, Button, IconButton, Field, Input, Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions,
  Modal, ConfirmDialog, LoadingState,
} from '../ui';

const GestionTypesRecette = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editType, setEditType] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Charger les types de recettes depuis l'API
  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/types-recette`);
      setTypes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des types de recettes', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Gérer l'ajout d'un nouveau type de recette
  const handleAddType = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/types-recette`, {
        nom: newType
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes([...types, response.data]);
      setNewType("");
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de recette', error);
      setIsLoading(false);
    }
  };

  // Gérer la suppression d'un type de recette
  const handleDeleteType = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/types-recette/${deleteId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes(types.filter((type) => type.id !== deleteId));
      setShowDeleteConfirmation(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du type de recette', error);
      setIsLoading(false);
    }
  };

  // Gérer la modification d'un type de recette
  const handleEditType = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_BASE_URL}/types-recette/${editType.id}`, {
        nom: editType.nom
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setTypes(types.map((type) => type.id === editType.id ? response.data : type));
      setEditType(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la modification du type de recette', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={ChefHat}
        title="Types de recette"
        description="Gérez les types de recette proposés sur le site."
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <Card title="Ajouter un type de recette" icon={Plus}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label="Nom du type de recette" htmlFor="new-type-recette" className="flex-1">
                <Input
                  id="new-type-recette"
                  type="text"
                  placeholder="Nom du type de recette"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                />
              </Field>
              <Button icon={Plus} onClick={handleAddType}>
                Ajouter
              </Button>
            </div>
          </Card>

          <Card title="Liste des types de recette" padded={false}>
            <Table>
              <THead>
                <tr>
                  <Th>Nom du type</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </THead>
              <TBody>
                {types.length > 0 ? (
                  types.map((type) => (
                    <Tr key={type.id}>
                      <Td className="font-medium text-gray-900">{type.nom}</Td>
                      <Td align="right">
                        <RowActions>
                          <IconButton
                            icon={Pencil}
                            label="Modifier"
                            tone="brand"
                            onClick={() => setEditType({ id: type.id, nom: type.nom })}
                          />
                          <IconButton
                            icon={Trash2}
                            label="Supprimer"
                            tone="danger"
                            onClick={() => {
                              setDeleteId(type.id);
                              setShowDeleteConfirmation(true);
                            }}
                          />
                        </RowActions>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <TableEmpty colSpan={2} message="Aucun type disponible" />
                )}
              </TBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Formulaire de modification */}
      <Modal
        open={!!editType}
        onClose={() => setEditType(null)}
        title="Modifier le type de recette"
        icon={Pencil}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditType(null)}>
              Annuler
            </Button>
            <Button icon={Save} onClick={handleEditType}>
              Sauvegarder
            </Button>
          </>
        }
      >
        {editType && (
          <Field label="Nom du type de recette" htmlFor="edit-type-recette">
            <Input
              id="edit-type-recette"
              type="text"
              value={editType.nom}
              onChange={(e) => setEditType({ ...editType, nom: e.target.value })}
            />
          </Field>
        )}
      </Modal>

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={showDeleteConfirmation}
        message="Êtes-vous sûr de vouloir supprimer ce type ? Cette action est irréversible."
        confirmLabel="Oui, supprimer"
        onConfirm={handleDeleteType}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </div>
  );
};

export default GestionTypesRecette;
