import React, { useState } from 'react';
import { Trash2, Edit, Plus, Check, X, AlertCircle } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex space-x-2">
          {selectedItems.length > 0 && (
            <button 
              onClick={confirmDeleteSelected}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              Supprimer ({selectedItems.length})
            </button>
          )}
          {showAddButton && (
            <button 
              onClick={onAdd}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ajouter
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item[idField]} className={selectedItems.includes(item[idField]) ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item[idField])}
                      onChange={() => handleSelect(item[idField])}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.render ? column.render(item) : item[column.accessor]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {showEditButton && (
                      <button 
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => confirmDelete(item[idField])}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
            </div>
            <p className="mb-6 text-gray-600">
              {Array.isArray(itemToDelete) && itemToDelete.length > 1 
                ? `Êtes-vous sûr de vouloir supprimer ces ${itemToDelete.length} éléments ? Cette action est irréversible.`
                : "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."}
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
              >
                <X size={16} className="mr-1" />
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              >
                <Check size={16} className="mr-1" />
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;