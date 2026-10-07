import React, { useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import {
  Card, Button, IconButton, Table, THead, TBody, Th, Tr, Td, TableEmpty, RowActions, ConfirmDialog, checkboxClass,
} from '../ui';

const CrudTable = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  showAddButton = true,
  showEditButton = true,
  emptyMessage = "Aucune donnée disponible",
  idField = "id" // Add idField prop with default value "id"
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  // Gérer la sélection d'un élément
  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, id]);
      if (selectedItems.length + 1 === data.length) {
        setSelectAll(true);
      }
    }
  };

  // Gérer la sélection de tous les éléments
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(data.map(item => item[idField]));
      setSelectAll(true);
    }
  };

  // Confirmer la suppression d'un élément
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Confirmer la suppression de plusieurs éléments
  const confirmDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setItemToDelete(selectedItems);
      setShowDeleteConfirm(true);
    }
  };

  // Effectuer la suppression
  const handleDelete = () => {
    onDelete(itemToDelete);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setSelectedItems(selectedItems.filter(id =>
      Array.isArray(itemToDelete)
        ? !itemToDelete.includes(id)
        : id !== itemToDelete
    ));
    setSelectAll(false);
  };

  return (
    <Card
      title={title}
      padded={false}
      actions={
        <>
          {selectedItems.length > 0 && (
            <Button variant="danger" icon={Trash2} onClick={confirmDeleteSelected}>
              Supprimer ({selectedItems.length})
            </Button>
          )}
          {showAddButton && (
            <Button icon={Plus} onClick={onAdd}>
              Ajouter
            </Button>
          )}
        </>
      }
    >
      <Table>
        <THead>
          <tr>
            <Th className="w-12">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className={checkboxClass}
                aria-label="Tout sélectionner"
              />
            </Th>
            {columns.map((column, index) => (
              <Th key={index}>{column.header}</Th>
            ))}
            <Th align="right">Actions</Th>
          </tr>
        </THead>
        <TBody>
          {data.length === 0 ? (
            <TableEmpty colSpan={columns.length + 2} message={emptyMessage} />
          ) : (
            data.map((item) => (
              <Tr key={item[idField]} selected={selectedItems.includes(item[idField])}>
                <Td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item[idField])}
                    onChange={() => handleSelect(item[idField])}
                    className={checkboxClass}
                    aria-label="Sélectionner"
                  />
                </Td>
                {columns.map((column, index) => (
                  <Td key={index} className="whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.accessor]}
                  </Td>
                ))}
                <Td align="right">
                  <RowActions>
                    {showEditButton && (
                      <IconButton icon={Pencil} label="Modifier" tone="brand" onClick={() => onEdit(item)} />
                    )}
                    <IconButton icon={Trash2} label="Supprimer" tone="danger" onClick={() => confirmDelete(item[idField])} />
                  </RowActions>
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>

      <ConfirmDialog
        open={showDeleteConfirm}
        message={Array.isArray(itemToDelete) && itemToDelete.length > 1
          ? `Êtes-vous sûr de vouloir supprimer ces ${itemToDelete.length} éléments ? Cette action est irréversible.`
          : "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </Card>
  );
};

export default CrudTable;
