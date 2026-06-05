import { useState } from 'react';

const PLACEHOLDER_STYLE = {
  alignItems: 'center',
  background: '#f3f4f6',
  color: '#6b7280',
  display: 'flex',
  fontSize: '0.8rem',
  fontWeight: 700,
  justifyContent: 'center',
  textAlign: 'center',
};

function OptionalImage({ alt = '', className = '', src }) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = String(src ?? '').trim();

  if (!normalizedSrc || hasError) {
    return (
      <div
        aria-label={alt || 'Imagen no disponible'}
        className={className}
        style={PLACEHOLDER_STYLE}
      >
        Sin imagen
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
      src={normalizedSrc}
    />
  );
}

export default OptionalImage;
