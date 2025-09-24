import React from 'react';
import { X } from 'lucide-react';

const SettingsPageModals = ({
  showAddForm,
  setShowAddForm,
  showEditForm,
  setShowEditForm,
  showDeleteModal,
  avantageToDelete,
  confirmDelete,
  cancelDelete,
  formData,
  handleFormChange,
  previewImage,
  editingAvantage,
  handleAddSubmit,
  handleEditSubmit,
  resetForm
}) => {
  return (
    <>
      {/* Modale d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Nouvel avantage social</h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form 
              className="space-y-4" 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddSubmit(e);
              }}
            >
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFormChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="mt-2 w-32 h-32 object-cover rounded-md border"
                  />
                )}
              </div>

              <div>
                <label htmlFor="paragraphe" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="paragraphe"
                  name="paragraphe"
                  value={formData.paragraphe}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez l'avantage social..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de modification */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Modifier l'avantage social</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFormChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
                {editingAvantage && editingAvantage.photo && !previewImage && (
                  <img
                    src={`http://localhost:8000/storage/${editingAvantage.photo}`}
                    alt="Image actuelle"
                    className="mt-2 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraphe
                </label>
                <textarea
                  name="paragraphe"
                  value={formData.paragraphe}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez l'avantage social..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteModal && avantageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-red-600">Confirmer la suppression</h3>
              <button
                type="button"
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer cet avantage social ?
              </p>
              
              {/* Aperçu de l'avantage à supprimer */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start space-x-4">
                  {avantageToDelete.photo && (
                    <img
                      src={`http://localhost:8000/storage/${avantageToDelete.photo}`}
                      alt="Avantage à supprimer"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">
                      {avantageToDelete.paragraphe}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-red-600 text-sm mt-3 font-medium">
                Cette action est irréversible.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPageModals;