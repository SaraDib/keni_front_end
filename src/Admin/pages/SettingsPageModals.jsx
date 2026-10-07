import React from 'react';
import { Gift, Pencil, Image } from 'lucide-react';
import API_BASE_URL from '../../config';
import { Modal, ConfirmDialog, Button, Field, Textarea, FileInput } from '../ui';

const previewClass = 'mt-3 h-32 w-32 rounded-lg border border-gray-200 bg-gray-50 object-cover';

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
  const closeAdd = () => {
    setShowAddForm(false);
    resetForm();
  };

  const closeEdit = () => {
    setShowEditForm(false);
    resetForm();
  };

  return (
    <>
      {/* Modale d'ajout */}
      <Modal
        open={showAddForm}
        onClose={closeAdd}
        title="Nouvel avantage social"
        icon={Gift}
        footer={
          <>
            <Button variant="secondary" onClick={closeAdd}>
              Annuler
            </Button>
            <Button type="submit" form="avantage-add-form">
              Ajouter
            </Button>
          </>
        }
      >
        <form
          id="avantage-add-form"
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddSubmit(e);
          }}
        >
          <Field label="Image" htmlFor="photo" required>
            <FileInput
              id="photo"
              name="photo"
              onChange={handleFormChange}
              accept="image/*"
              required
            />
            {previewImage && (
              <img src={previewImage} alt="Aperçu" className={previewClass} />
            )}
          </Field>

          <Field label="Description" htmlFor="paragraphe" required>
            <Textarea
              id="paragraphe"
              name="paragraphe"
              value={formData.paragraphe}
              onChange={handleFormChange}
              rows={3}
              placeholder="Décrivez l'avantage social..."
              required
            />
          </Field>
        </form>
      </Modal>

      {/* Modale de modification */}
      <Modal
        open={showEditForm}
        onClose={closeEdit}
        title="Modifier l'avantage social"
        icon={Pencil}
        footer={
          <>
            <Button variant="secondary" onClick={closeEdit}>
              Annuler
            </Button>
            <Button type="submit" form="avantage-edit-form">
              Modifier
            </Button>
          </>
        }
      >
        <form id="avantage-edit-form" onSubmit={handleEditSubmit} className="space-y-5">
          <Field label="Image" htmlFor="photo-edit" hint="Laissez vide pour conserver l'image actuelle.">
            <FileInput
              id="photo-edit"
              name="photo"
              onChange={handleFormChange}
              accept="image/*"
            />
            {previewImage && (
              <img src={previewImage} alt="Aperçu" className={previewClass} />
            )}
            {editingAvantage && editingAvantage.photo && !previewImage && (
              <img
                src={`${API_BASE_URL.replace('/api', '/storage')}/${editingAvantage.photo}`}
                alt="Actuelle"
                className={previewClass}
              />
            )}
          </Field>

          <Field label="Paragraphe" htmlFor="paragraphe-edit" required>
            <Textarea
              id="paragraphe-edit"
              name="paragraphe"
              value={formData.paragraphe}
              onChange={handleFormChange}
              rows={3}
              placeholder="Décrivez l'avantage social..."
              required
            />
          </Field>
        </form>
      </Modal>

      {/* Modale de confirmation de suppression */}
      <ConfirmDialog
        open={Boolean(showDeleteModal && avantageToDelete)}
        title="Confirmer la suppression"
        confirmLabel="Supprimer définitivement"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={
          avantageToDelete && (
            <>
              <p>Êtes-vous sûr de vouloir supprimer cet avantage social ? Cette action est irréversible.</p>
              {/* Aperçu de l'avantage à supprimer */}
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {avantageToDelete.photo ? (
                    <img
                      src={`${API_BASE_URL.replace('/api', '/storage')}/${avantageToDelete.photo}`}
                      alt="Avantage à supprimer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image size={18} className="text-gray-400" />
                  )}
                </div>
                <p className="flex-1 text-sm text-gray-700">{avantageToDelete.paragraphe}</p>
              </div>
            </>
          )
        }
      />
    </>
  );
};

export default SettingsPageModals;
