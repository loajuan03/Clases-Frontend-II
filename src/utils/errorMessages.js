const FIELD_LABELS = {
  email: 'correo electrónico',
  firstName: 'nombre',
  lastName: 'apellido',
  password: 'contraseña',
  phone: 'teléfono',
};

const NORMALIZED_MESSAGES = [
  {
    test: (message) => /invalid email or password/i.test(message),
    value: 'Correo o contraseña incorrectos.',
  },
  {
    test: (message) => /validation failed/i.test(message),
    value: 'Revisa los datos ingresados.',
  },
  {
    test: (message) => /invalid email format/i.test(message),
    value: 'Ingresa un correo electrónico válido.',
  },
  {
    test: (message) => /must be a well-formed email address/i.test(message),
    value: 'Ingresa un correo electrónico válido.',
  },
  {
    test: (message) => /must not be blank/i.test(message),
    value: 'Completa todos los campos obligatorios.',
  },
  {
    test: (message) =>
      /size must be between 8/i.test(message) || /size must be at least 8/i.test(message),
    value: 'La contraseña debe tener al menos 8 caracteres.',
  },
  {
    test: (message) => /failed to fetch|network error/i.test(message),
    value: 'No fue posible conectar con el backend. Verifica que esté encendido.',
  },
  {
    test: (message) => /aborted|timeout/i.test(message),
    value: 'La solicitud tardó demasiado. Intenta nuevamente.',
  },
];

export function translateErrorMessage(
  message,
  fallback = 'No fue posible completar la solicitud.'
) {
  const normalizedMessage = String(message ?? '').trim();

  if (!normalizedMessage) {
    return fallback;
  }

  const match = NORMALIZED_MESSAGES.find((item) => item.test(normalizedMessage));
  return match?.value ?? normalizedMessage;
}

export function formatFieldErrors(fieldErrors = []) {
  if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) {
    return '';
  }

  return fieldErrors
    .map((fieldError) => {
      const field = String(fieldError?.field ?? '').trim();
      const label = FIELD_LABELS[field] ?? (field || 'campo');
      const message = translateErrorMessage(fieldError?.message, 'tiene un valor inválido.');

      if (message === 'Completa todos los campos obligatorios.') {
        return `El ${label} es obligatorio.`;
      }

      return `${label}: ${message}`;
    })
    .join(' ');
}
