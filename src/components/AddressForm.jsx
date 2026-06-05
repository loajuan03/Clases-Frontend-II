import { useState } from 'react';

import styles from '../styles/UserProfile.module.css';

const DEFAULT_VALUES = {
  city: '',
  country: 'Colombia',
  isDefault: false,
  line1: '',
  line2: '',
  postalCode: '',
  state: '',
  type: 'SHIPPING',
};

function AddressForm({
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitError = '',
}) {
  const [values, setValues] = useState({
    ...DEFAULT_VALUES,
    ...(initialValues ?? {}),
  });

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span className={styles.label}>Tipo</span>
          <select
            className={styles.input}
            disabled={isSubmitting}
            name="type"
            onChange={handleChange}
            value={values.type}
          >
            <option value="SHIPPING">Envio</option>
            <option value="BILLING">Facturacion</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Direccion principal</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="line1"
            onChange={handleChange}
            value={values.line1}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Complemento</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="line2"
            onChange={handleChange}
            value={values.line2}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Ciudad</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="city"
            onChange={handleChange}
            value={values.city}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Departamento</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="state"
            onChange={handleChange}
            value={values.state}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Pais</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="country"
            onChange={handleChange}
            value={values.country}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Codigo postal</span>
          <input
            className={styles.input}
            disabled={isSubmitting}
            name="postalCode"
            onChange={handleChange}
            value={values.postalCode}
          />
        </label>
        <label className={`${styles.field} ${styles.checkboxField}`}>
          <input
            checked={values.isDefault}
            disabled={isSubmitting}
            name="isDefault"
            onChange={handleChange}
            type="checkbox"
          />
          <span className={styles.label}>Usar como predeterminada</span>
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
          {isSubmitting ? 'Guardando...' : 'Guardar direccion'}
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
