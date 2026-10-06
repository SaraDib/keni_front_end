// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Users, Shield, User, PlusCircle, Pencil, Trash2, X } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const API_BASE = API_BASE_URL;

// Rôles non supprimables (tu peux en ajouter)
const PROTECTED_ROLE_NAMES = ['admin']; // insensible à la casse

// Petit composant de confirmation modale (sans lib)
const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', onConfirm, onCancel, accentColor = '#2563eb' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      {/* dialog */}
      <div className="relative bg-white w-[95%] max-w-md rounded-xl shadow-xl p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-gray-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">{message}</p>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: accentColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersPage = () => {
  // USERS
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ROLES
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  // ADD/EDIT ROLE FORM
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#000000');
  const [editingRoleId, setEditingRoleId] = useState(null);

  // Confirm dialog (delete role)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rolePendingDelete, setRolePendingDelete] = useState(null);

  // -----------------------------
  // API CALLS
  // -----------------------------
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE}/users`, authHeaders);
      setUsers(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Erreur users:', err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setIsLoadingRoles(true);
      const res = await axios.get(`${API_BASE}/roles`, authHeaders);
      setRoles(res.data || []);
      setRolesError(null);
    } catch (err) {
      console.error('Erreur roles:', err);
      setRolesError("Erreur lors du chargement des rôles");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // -----------------------------
  // HELPERS
  // -----------------------------
  const isProtectedRole = (roleNameOrObj) => {
    const name =
      typeof roleNameOrObj === 'string'
        ? roleNameOrObj
        : (roleNameOrObj?.nom || roleNameOrObj?.name || '');
    return PROTECTED_ROLE_NAMES.includes(String(name).toLowerCase());
  };

  const isRoleUsed = (roleNameOrObj) => {
    const name =
      typeof roleNameOrObj === 'string'
        ? roleNameOrObj
        : (roleNameOrObj?.nom || roleNameOrObj?.name || '');

    return users.some(
      (u) => String(u.Role || '').toLowerCase() === String(name).toLowerCase()
    );
  };

  const colorForRole = (roleName) =>
    roles.find(r =>
      (r.nom && r.nom.toLowerCase() === String(roleName || '').toLowerCase()) ||
      (r.name && r.name.toLowerCase() === String(roleName || '').toLowerCase())
    )?.color
    || (String(roleName).toLowerCase() === 'admin' ? '#ef4444' : '#10b981');

  const labelForRole = (roleName) => {
    if (!roleName) return '';
    const r = roles.find(r =>
      (r.nom && r.nom.toLowerCase() === String(roleName).toLowerCase()) ||
      (r.name && r.name.toLowerCase() === String(roleName).toLowerCase())
    );
    if (r?.nom) return r.nom;
    if (r?.name) return r.name;
    if (String(roleName).toLowerCase() === 'admin') return 'Administrateur';
    if (String(roleName).toLowerCase() === 'user') return 'Utilisateur';
    return String(roleName);
  };

  const iconForRole = (roleName) => {
    const n = String(roleName || '').toLowerCase();
    if (n === 'admin') return Shield;
    if (n === 'user' || n === 'utilisateur') return User;
    return Users; // défaut
  };

  // Colonnes du tableau
  const columns = [
    { header: 'Nom', accessor: 'Nom' },
    { header: 'Email', accessor: 'Email' },
    {
      header: 'Rôle',
      accessor: 'Role',
      render: (item) => {
        const roleName = item.Role || '';
        const color = colorForRole(roleName);
        const label = labelForRole(roleName);
        const Icon = iconForRole(roleName);
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${color}22`,
              color: '#111',
              border: `1px solid ${color}`,
            }}
          >
            <Icon className="mr-1" size={14} style={{ color }} />
            {label}
          </span>
        );
      },
    },
  ];

  // Options dynamiques pour le select des rôles
  const roleOptions = roles.length
    ? roles.map((r) => ({
      value: r.nom || r.name,
      label: r.nom || r.name,
    }))
    : [
      { value: 'admin', label: 'Administrateur' },
      { value: 'user', label: 'Utilisateur' },
    ];

  // Champs du formulaire utilisateur
  const formFields = [
    { name: 'Nom', label: 'Nom complet', type: 'text', required: true },
    { name: 'Email', label: 'Email', type: 'email', required: true },
    {
      name: 'Role',
      label: 'Rôle',
      type: 'select',
      required: true,
      options: roleOptions,
    },
    { name: 'password', label: 'Mot de passe', type: 'password', required: !currentUser },
  ];

  // -----------------------------
  // CRUD HANDLERS (USERS)
  // -----------------------------
  const handleAdd = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    delete userWithoutPassword.password_confirmation;
    setCurrentUser(userWithoutPassword);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      if (Array.isArray(id)) {
        await Promise.all(
          id.map((singleId) => axios.delete(`${API_BASE}/users/${singleId}`, authHeaders))
        );
      } else {
        await axios.delete(`${API_BASE}/users/${id}`, authHeaders);
      }
      await fetchUsers();
      setError(null);
    } catch (err) {
      console.error('Erreur delete:', err);
      setError("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = { ...formData, ID_Entreprise: 1 };

      if (currentUser) {
        await axios.put(`${API_BASE}/users/${currentUser.ID_User}`, data, authHeaders);
      } else {
        await axios.post(`${API_BASE}/register`, data, authHeaders);
      }
      await fetchUsers();
      setShowForm(false);
    } catch (err) {
      console.error('Erreur save user:', err);
      setError("Erreur lors de la sauvegarde de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // HANDLERS (ROLES)
  // -----------------------------
  const resetRoleForm = () => {
    setEditingRoleId(null);
    setNewRole('');
    setNewRoleDescription('');
    setNewRoleColor('#000000');
  };

  const handleEditRoleClick = (role) => {
    const id = role.id || role.ID_Role;
    const name = role.nom || role.name || '';
    setEditingRoleId(id || null);
    setNewRole(name);
    setNewRoleDescription(role.description || '');
    setNewRoleColor(role.color || '#000000');
    setShowRoleForm(true);
  };

  const requestDeleteRole = (role) => {
    if (isProtectedRole(role)) {
      alert('Ce rôle est protégé et ne peut pas être supprimé.');
      return;
    }
    if (isRoleUsed(role)) {
      alert('Ce rôle est déjà attribué à un utilisateur et ne peut pas être supprimé.');
      return;
    }
    setRolePendingDelete(role);
    setConfirmOpen(true);
  };

  const performDeleteRole = async () => {
    const role = rolePendingDelete;
    setConfirmOpen(false);
    if (!role) return;

    const id = role.id || role.ID_Role;
    if (!id) return;

    try {
      await axios.delete(`${API_BASE}/roles/${id}`, authHeaders);
      await fetchRoles();
      if (editingRoleId && (editingRoleId === id)) {
        resetRoleForm();
        setShowRoleForm(false);
      }
    } catch (e) {
      console.error('Erreur suppression rôle:', e);
      alert("Erreur lors de la suppression du rôle");
    } finally {
      setRolePendingDelete(null);
    }
  };

  const handleAddOrUpdateRole = async () => {
    if (!newRole.trim()) return;

    try {
      if (editingRoleId) {
        const res = await axios.put(
          `${API_BASE}/roles/${editingRoleId}`,
          { nom: newRole, description: newRoleDescription, color: newRoleColor },
          authHeaders
        );
        //alert(`Rôle mis à jour : ${res.data?.nom || newRole}`);
      } else {
        const res = await axios.post(
          `${API_BASE}/roles`,
          { nom: newRole, description: newRoleDescription, color: newRoleColor },
          authHeaders
        );
        //alert(`Nouveau rôle ajouté : ${res.data?.nom || newRole}`);
      }

      resetRoleForm();
      setShowRoleForm(false);
      fetchRoles();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du rôle:", error);
      alert("Erreur lors de l'enregistrement du rôle");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Users className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">Utilisateurs</h1>
      </div>

      <p className="mb-6 text-gray-600">
        Gérez les utilisateurs qui ont accès au panneau d&apos;administration.
      </p>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
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
          {/* ROLES & PERMISSIONS */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-4 justify-between">
              <div className="flex items-center">
                <Shield className="text-blue-500 mr-2" size={20} />
                <h2 className="text-lg font-semibold">Rôles et permissions</h2>
              </div>
              <button
                onClick={() => {
                  if (!showRoleForm) resetRoleForm();
                  setShowRoleForm(!showRoleForm);
                }}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <PlusCircle size={18} className="mr-1" />
                {editingRoleId ? 'Nouveau rôle' : 'Ajouter un rôle'}
              </button>
            </div>

            {/* ADD/EDIT ROLE FORM */}
            {showRoleForm && (
              <form
                className="mb-4 bg-blue-50 p-4 rounded-lg space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOrUpdateRole();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      Nom du rôle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      required
                      placeholder="Nom du rôle"
                      className="border rounded p-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      Couleur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="color"
                      value={newRoleColor}
                      onChange={(e) => setNewRoleColor(e.target.value)}
                      className="h-10 w-16 border rounded bg-white"
                      style={{ maxWidth: '100px' }}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Description du rôle</label>
                  <textarea
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Description du rôle"
                    className="border rounded p-2"
                    rows="2"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingRoleId ? 'Mettre à jour le rôle' : 'Ajouter le rôle'}
                  </button>
                  {editingRoleId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetRoleForm();
                        setShowRoleForm(false);
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ROLES LIST */}
            <div className="mt-4">
              {isLoadingRoles ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
              ) : rolesError ? (
                <div className="p-3 bg-red-100 text-red-700 rounded">{rolesError}</div>
              ) : roles.length === 0 ? (
                <div className="p-3 bg-gray-50 text-gray-600 rounded">Aucun rôle trouvé.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const id = role.id || role.ID_Role || role.nom;
                    const name = role.nom || role.name || 'Rôle';
                    const color = role.color || '#2563eb';
                    const bg = `${color}20`;
                    const Icon = iconForRole(name);

                    const protectedRole = isProtectedRole(name);
                    const usedRole = isRoleUsed(name);
                    const disabledDelete = protectedRole || usedRole;

                    return (
                      <div
                        key={id}
                        className="p-4 rounded-lg border"
                        style={{ borderColor: color, backgroundColor: bg }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Icon className="mr-2" style={{ color }} size={18} />
                            <div>
                              <h3 className="font-medium">{name}</h3>
                              {role.description && (
                                <p className="text-sm text-gray-600">{role.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              title="Éditer"
                              aria-label="Éditer"
                              onClick={() => handleEditRoleClick(role)}
                              className="p-1 rounded hover:bg-white/60"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              title={
                                disabledDelete
                                  ? (protectedRole
                                    ? 'Rôle protégé'
                                    : 'Rôle utilisé par un utilisateur')
                                  : 'Supprimer'
                              }
                              aria-label="Supprimer"
                              disabled={disabledDelete}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!disabledDelete) requestDeleteRole(role);
                              }}
                              className={`p-1 rounded transition border border-transparent
                                ${disabledDelete ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/60 hover:border-white'}
                              `}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* USERS LIST */}
          <CrudTable
            data={users}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            title="utilisateur"
          />
        </div>
      )}

      {/* Confirm dialog for deleting role */}
      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le rôle"
        message={`Voulez-vous vraiment supprimer le rôle "${rolePendingDelete?.nom || rolePendingDelete?.name}" ?`}
        confirmLabel="Supprimer"
        onConfirm={performDeleteRole}
        onCancel={() => {
          setConfirmOpen(false);
          setRolePendingDelete(null);
        }}
        accentColor="#dc2626"
      />
    </div>
  );
};

export default UsersPage;
