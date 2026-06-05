import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../services/authService';
import dashboardStyles from '../styles/AdminDashboard.module.css';
import styles from '../styles/AdminUsers.module.css';

const EMPTY_FORM = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  phone: '',
  role: 'CUSTOMER',
  status: 'ACTIVE',
};

function AdminUsers() {
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      setUsers(await authService.getAdminUsersAsync());
    } catch (error) {
      setLoadError(
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible cargar los usuarios.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [user.fullName, user.name, user.email, user.role, user.status].some((field) =>
        String(field ?? '')
          .toLowerCase()
          .includes(normalizedQuery)
      )
    );
  }, [query, users]);

  const closeForm = () => {
    setEditingUser(null);
    setFormValues(EMPTY_FORM);
    setIsFormOpen(false);
    setSubmitError('');
  };

  const openCreateForm = () => {
    setEditingUser(null);
    setFormValues(EMPTY_FORM);
    setIsFormOpen(true);
    setSubmitError('');
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormValues({
      email: user.email ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      password: '',
      phone: user.phone ?? '',
      role: user.role ?? 'CUSTOMER',
      status: user.status ?? 'ACTIVE',
    });
    setIsFormOpen(true);
    setSubmitError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSubmitError('');

    try {
      if (editingUser) {
        await authService.updateAdminUserAsync(editingUser.id, formValues);
      } else {
        await authService.createAdminUserAsync(formValues);
      }

      closeForm();
      await loadUsers();
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible guardar el usuario.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    setSubmitError('');

    try {
      setUsers(await authService.deleteAdminUserAsync(userId));
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible desactivar el usuario.'
      );
    }
  };

  return (
    <section className={dashboardStyles.container}>
      <header className={dashboardStyles.header}>
        <div>
          <p className={dashboardStyles.eyebrow}>Semana 12</p>
          <h1 className={dashboardStyles.title}>Gestion de usuarios</h1>
          <p className={dashboardStyles.subtitle}>
            Administra clientes y administradores usando los servicios del backend cuando la API
            remota esta activa.
          </p>
        </div>

        <div className={dashboardStyles.actions}>
          <button
            type="button"
            className={dashboardStyles.secondaryButton}
            onClick={() => navigate('/admin')}
          >
            Volver al panel
          </button>
          <button type="button" className={dashboardStyles.primaryButton} onClick={openCreateForm}>
            Agregar usuario
          </button>
        </div>
      </header>

      {isFormOpen ? (
        <section className={dashboardStyles.card}>
          <form className={dashboardStyles.list} onSubmit={handleSubmit}>
            <input
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder="Nombre"
            />
            <input
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder="Apellido"
            />
            <input
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Correo electronico"
              type="email"
            />
            <input
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="Telefono"
            />
            {!editingUser ? (
              <input
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Contrasena"
                type="password"
              />
            ) : null}
            <select name="role" value={formValues.role} onChange={handleChange}>
              <option value="CUSTOMER">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <select name="status" value={formValues.status} onChange={handleChange}>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>

            {submitError ? <p className={dashboardStyles.emptyText}>{submitError}</p> : null}

            <div className={styles.userActions}>
              <button className={styles.actionButton} type="button" onClick={closeForm}>
                Cancelar
              </button>
              <button className={styles.actionButton} type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar usuario'}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className={dashboardStyles.card}>
          <div className={dashboardStyles.cardHeader}>
            <h2 className={dashboardStyles.sectionTitle}>Usuarios</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar usuario..."
              type="search"
            />
          </div>

          {submitError ? <p className={dashboardStyles.emptyText}>{submitError}</p> : null}

          {isLoading ? (
            <p className={dashboardStyles.emptyText}>Cargando usuarios...</p>
          ) : loadError ? (
            <p className={dashboardStyles.emptyText}>{loadError}</p>
          ) : filteredUsers.length === 0 ? (
            <p className={dashboardStyles.emptyText}>No hay usuarios para mostrar.</p>
          ) : (
            <div className={dashboardStyles.list}>
              {filteredUsers.map((user) => (
                <article className={styles.userCard} key={user.id}>
                  <div className={styles.userMain}>
                    <div>
                      <strong className={styles.userName}>{user.fullName || user.name}</strong>
                      <p className={styles.userMeta}>{user.email}</p>
                    </div>
                    <div className={styles.badges}>
                      <span>{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</span>
                      <span>{user.status === 'INACTIVE' ? 'Inactivo' : 'Activo'}</span>
                    </div>
                  </div>
                  <div className={styles.userDetails}>
                    <span>{user.phone || 'Sin telefono'}</span>
                    <span>{user.createdAt || 'Sin fecha'}</span>
                  </div>
                  <div className={styles.userActions}>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => openEditForm(user)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      Desactivar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
}

export default AdminUsers;
