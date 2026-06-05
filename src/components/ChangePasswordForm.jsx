import { useState } from 'react';

import styles from '../styles/UserProfile.module.css';

function ChangePasswordForm({
  isSubmitting = false,
  onSubmit,
  submitError = '',
  submitSuccess = '',
}) {
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.newPassword !== values.confirmPassword) {
      setLocalError('Las contrasenas no coinciden.');
      return;
    }

    const result = await onSubmit({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (result?.ok) {
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGridSingle}>
        <label className={styles.field}>
          <span className={styles.label}>Contrasena actual</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="currentPassword"
            onChange={handleChange}
            type="password"
            value={values.currentPassword}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Nueva contrasena</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="newPassword"
            onChange={handleChange}
            type="password"
            value={values.newPassword}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Confirmar contrasena</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            value={values.confirmPassword}
          />
        </label>
      </div>

      {localError || submitError ? (
        <p className={styles.error}>{localError || submitError}</p>
      ) : null}
      {submitSuccess ? <p className={styles.successBanner}>{submitSuccess}</p> : null}

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Cambiar contrasena'}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
