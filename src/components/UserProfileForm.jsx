import { useState } from 'react';

import styles from '../styles/UserProfile.module.css';

function UserProfileForm({
  email,
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
  roleLabel,
  submitError = '',
}) {
  const [values, setValues] = useState({
    firstName: initialValues?.firstName ?? '',
    lastName: initialValues?.lastName ?? '',
    phone: initialValues?.phone ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="firstName"
            onChange={handleChange}
            value={values.firstName}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Apellido</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="lastName"
            onChange={handleChange}
            value={values.lastName}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Telefono</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="phone"
            onChange={handleChange}
            value={values.phone}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Correo</span>
          <input className={styles.input} disabled readOnly value={email} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Rol</span>
          <input className={styles.input} disabled readOnly value={roleLabel} />
        </label>
      </div>

      {submitError ? <p className={styles.error}>{submitError}</p> : null}

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}

export default UserProfileForm;
