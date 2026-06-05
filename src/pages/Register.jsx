import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { appConfig } from '../config';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import cartService from '../services/cartService';
import styles from '../styles/AuthPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function Register() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const { authError, clearAuthError, isSubmittingAuth, register } = useAuth();
  const { cart, cartError, cartHydrationStatus, isCartReady } = useCart();
  const navigate = useNavigate();
  const isRemoteMode = appConfig.useRemoteApi;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setFormError('');
    clearAuthError();
  };

  const validateForm = () => {
    const normalizedEmail = values.email.trim();

    if (!values.firstName.trim()) {
      return 'Ingresa tu nombre.';
    }

    if (!values.lastName.trim()) {
      return 'Ingresa tu apellido.';
    }

    if (!normalizedEmail) {
      return 'Ingresa tu correo electrónico.';
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (!values.password || values.password.length < MIN_PASSWORD_LENGTH) {
      return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    if (values.password !== values.confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const guestCartId = isRemoteMode && isCartReady ? cartService.getGuestCartIdForAuth(cart) : '';
    const result = await register({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      guestCartId,
      email: values.email.trim(),
      password: values.password,
      phone: values.phone.trim(),
    });

    if (!result.ok) {
      setFormError(result.error ?? 'No fue posible crear la cuenta.');
      return;
    }

    navigate('/user/profile', { replace: true });
  };

  const cartWarning =
    isRemoteMode && cartHydrationStatus === 'error'
      ? cartError || 'El registro continuará sin asociar un carrito invitado.'
      : '';

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          {isRemoteMode
            ? 'Crea una cuenta conectada al backend para mantener sesión, asociar direcciones y continuar el checkout autenticado.'
            : 'Registra un usuario local con rol cliente para mantener sesión, proteger rutas y asociar compras a tu perfil.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span className={styles.label}>Nombre</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              placeholder="Ejemplo: Ana"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Apellido</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              placeholder="Ejemplo: Gómez"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Correo electrónico</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="correo@dominio.com"
              type="text"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Teléfono</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="3001234567"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              type="password"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Confirmar contraseña</span>
            <input
              className={styles.input}
              disabled={isSubmittingAuth}
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              type="password"
            />
          </label>

          {formError || authError ? <p className={styles.error}>{formError || authError}</p> : null}
          {cartWarning && !formError && !authError ? (
            <p className={styles.error}>{cartWarning}</p>
          ) : null}

          <button type="submit" className={styles.primaryButton} disabled={isSubmittingAuth}>
            {isSubmittingAuth ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.helperText}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
        </p>
      </div>
    </section>
  );
}

export default Register;
