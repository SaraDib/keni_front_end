// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { Users, Shield, User, Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import {
  PageHeader,
  Card,
  Button,
  IconButton,
  RowActions,
  Field,
  Input,
  Textarea,
  FormActions,
  Badge,
  Alert,
  LoadingState,
  Spinner,
  EmptyState,
  ConfirmDialog,
} from '../ui';
import toast from 'react-hot-toast';

const API_BASE = API_BASE_URL;

// Rôles non supprimables (tu peux en ajouter)
const PROTECTED_ROLE_NAMES = ['admin']; // insensible à la casse

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
          <Badge tone="gray">
            <Icon size={13} style={{ color }} />
            {label}
          </Badge>
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
      toast.error('Ce rôle est protégé et ne peut pas être supprimé.');
      return;
    }
    if (isRoleUsed(role)) {
      toast.error('Ce rôle est déjà attribué à un utilisateur et ne peut pas être supprimé.');
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
      toast.error("Erreur lors de la suppression du rôle");
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
      toast.error("Erreur lors de l'enregistrement du rôle");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div>
      <PageHeader
        icon={Users}
        title="Utilisateurs"
        description="Gérez les utilisateurs qui ont accès au panneau d'administration."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
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
          <Card
            icon={Shield}
            title="Rôles et permissions"
            description="Définissez les rôles attribuables aux utilisateurs."
            actions={
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  if (!showRoleForm) resetRoleForm();
                  setShowRoleForm(!showRoleForm);
                }}
              >
                {editingRoleId ? 'Nouveau rôle' : 'Ajouter un rôle'}
              </Button>
            }
          >
            {/* ADD/EDIT ROLE FORM */}
            {showRoleForm && (
              <form
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50/60 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOrUpdateRole();
                }}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Nom du rôle" htmlFor="role-name" required>
                    <Input
                      id="role-name"
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      required
                      placeholder="Nom du rôle"
                    />
                  </Field>
                  <Field label="Couleur" htmlFor="role-color" required>
                    <div className="flex items-center gap-3">
                      <input
                        id="role-color"
                        type="color"
                        value={newRoleColor}
                        onChange={(e) => setNewRoleColor(e.target.value)}
                        className="h-10 w-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-1 shadow-sm"
                        required
                      />
                      <span className="font-mono text-sm text-gray-500">{newRoleColor}</span>
                    </div>
                  </Field>
                  <Field label="Description du rôle" htmlFor="role-description" className="md:col-span-2">
                    <Textarea
                      id="role-description"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Description du rôle"
                      rows={2}
                    />
                  </Field>
                </div>

                <FormActions className="mt-5 pt-4">
                  {editingRoleId && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        resetRoleForm();
                        setShowRoleForm(false);
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                  <Button type="submit">
                    {editingRoleId ? 'Mettre à jour le rôle' : 'Ajouter le rôle'}
                  </Button>
                </FormActions>
              </form>
            )}

            {/* ROLES LIST */}
            {isLoadingRoles ? (
              <div className="flex h-24 items-center justify-center">
                <Spinner />
              </div>
            ) : rolesError ? (
              <Alert tone="error" className="mb-0">{rolesError}</Alert>
            ) : roles.length === 0 ? (
              <EmptyState icon={Shield} title="Aucun rôle trouvé." compact />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {roles.map((role) => {
                  const id = role.id || role.ID_Role || role.nom;
                  const name = role.nom || role.name || 'Rôle';
                  const color = role.color || '#1E3A8A';
                  const Icon = iconForRole(name);

                  const protectedRole = isProtectedRole(name);
                  const usedRole = isRoleUsed(name);
                  const disabledDelete = protectedRole || usedRole;

                  return (
                    <div
                      key={id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4"
                      style={{ borderLeftWidth: 4, borderLeftColor: color }}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${color}1A`, color }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-gray-900">{name}</h3>
                            {protectedRole && <Badge tone="red">Protégé</Badge>}
                            {!protectedRole && usedRole && <Badge tone="brand">Utilisé</Badge>}
                          </div>
                          {role.description && (
                            <p className="mt-0.5 text-sm text-gray-500">{role.description}</p>
                          )}
                        </div>
                      </div>
                      <RowActions>
                        <IconButton
                          icon={Pencil}
                          tone="brand"
                          label="Éditer"
                          onClick={() => handleEditRoleClick(role)}
                        />
                        <IconButton
                          icon={Trash2}
                          tone="danger"
                          label={
                            disabledDelete
                              ? (protectedRole
                                ? 'Rôle protégé'
                                : 'Rôle utilisé par un utilisateur')
                              : 'Supprimer'
                          }
                          disabled={disabledDelete}
                          className={disabledDelete ? 'cursor-not-allowed' : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disabledDelete) requestDeleteRole(role);
                          }}
                        />
                      </RowActions>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* USERS LIST */}
          <CrudTable
            data={users}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            idField="ID_User"
            title="Liste des utilisateurs"
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
      />
    </div>
  );
};

export default UsersPage;
