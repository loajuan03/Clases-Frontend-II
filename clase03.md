# Clase 03 - Header, Navbar y Footer (Layout base)

## 📋 Tabla de Contenidos

1. [Objetivo](#1-objetivo)
2. [Resultado esperado](#2-resultado-esperado)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Paso a paso guiado](#4-paso-a-paso-guiado)
   - [Paso 1: Crear páginas nuevas (Inicio y Carrito)](#paso-1-crear-páginas-nuevas-inicio-y-carrito)
   - [Paso 2: Crear Navbar (logo + navegación + auth UI)](#paso-2-crear-navbar-logo--navegación--auth-ui)
   - [Paso 3: Crear Header (contenedor del Navbar)](#paso-3-crear-header-contenedor-del-navbar)
   - [Paso 4: Crear Footer (simple)](#paso-4-crear-footer-simple)
   - [Paso 5: Integrar layout y navegación en App.jsx](#paso-5-integrar-layout-y-navegación-en-appjsx)
   - [Paso 6: Ajustes mínimos de layout global](#paso-6-ajustes-mínimos-de-layout-global)
   - [Paso 7: Verificación](#paso-7-verificación)
5. [Nota: Usuarios y validación (Semana 04)](#nota-usuarios-y-validación-semana-04)

---

## 1. Objetivo

En esta clase vamos a crear un **layout base** para el proyecto:

- `Header` con un `Navbar` que incluye:
  - Logo + Brand
  - Links de navegación: **Inicio**, **Productos**, **Carrito**
  - UI de autenticación (por ahora **simulada**):
    - Si NO hay usuario → mostrar **Invitado** + botón **Sign in**
    - Si hay usuario → mostrar su **nombre** + botón **Sign out**
- `Footer` sencillo

> Importante: **NO usaremos `react-router-dom` todavía**. En esta clase la navegación será por **estado local** (`useState`) en `App.jsx`. Más adelante (otra semana) lo migramos a rutas reales.

---

## 2. Resultado esperado

Al final tendrás:

- Un header fijo arriba (no sticky), visible en todas las “páginas”
- Un footer visible al final
- Un contenido central que cambia entre:
  - Inicio
  - Productos (lista actual)
  - Carrito
- Un botón que simula iniciar/cerrar sesión

---

## 3. Estructura de archivos

Trabajaremos dentro de `frontend-sistema-ventas/src/`.

```
src/
  components/
    Header.jsx
    Navbar.jsx
    Footer.jsx
  pages/
    Home.jsx
    ProductList.jsx
    Cart.jsx
  styles/
    Header.module.css
    Navbar.module.css
    Footer.module.css
```

Usaremos **CSS Modules** igual que en la clase anterior (en la carpeta `styles/`).

---

## 4. Paso a paso guiado

### Paso 1: Crear páginas nuevas (Inicio y Carrito)

#### 🎯 Concepto

Ya existe la página de productos (`ProductList`). Para que el navbar tenga navegación completa, crearemos:

- `Home.jsx` (Inicio)
- `Cart.jsx` (Carrito)

Estas páginas por ahora serán simples (solo contenido base).

#### 💻 Implementación

Crea `src/pages/Home.jsx`:

```jsx
function Home() {
  return (
    <section>
      <h1>Inicio</h1>
      <p>Bienvenido al sistema de ventas.</p>
    </section>
  );
}

export default Home;
```

Crea `src/pages/Cart.jsx`:

```jsx
function Cart() {
  return (
    <section>
      <h1>Carrito</h1>
      <p>Aquí verás los productos agregados al carrito.</p>
    </section>
  );
}

export default Cart;
```

#### 📝 Commit

```bash
git add src/pages/Home.jsx src/pages/Cart.jsx
git commit -m "feat: crear páginas Home y Cart"
```

---

### Paso 2: Crear Navbar (logo + navegación + auth UI)

#### 🎯 Concepto

El `Navbar` es un componente reutilizable que:

- Muestra links de navegación
- Muestra el estado de usuario (Invitado / Nombre)
- Dispara eventos hacia el padre (App) para:
  - Cambiar de página
  - Simular sign-in / sign-out

> En React, el flujo recomendado es: el padre mantiene el estado y el hijo recibe `props`.

#### 💻 Implementación

Crea `src/components/Navbar.jsx`:

```jsx
import styles from "../styles/Navbar.module.css";

import logo from "../assets/react.svg";

function Navbar({ activePage, onNavigate, user, onSignIn, onSignOut }) {
  const userLabel = user?.name ?? "Invitado";
  const isLoggedIn = Boolean(user);

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img className={styles.logo} src={logo} alt="Logo" />
        <span className={styles.brandName}>Sistema Ventas</span>
      </div>

      <div className={styles.links}>
        <button
          type="button"
          className={`${styles.link} ${activePage === "home" ? styles.active : ""}`}
          onClick={() => onNavigate("home")}
        >
          Inicio
        </button>
        <button
          type="button"
          className={`${styles.link} ${activePage === "products" ? styles.active : ""}`}
          onClick={() => onNavigate("products")}
        >
          Productos
        </button>
        <button
          type="button"
          className={`${styles.link} ${activePage === "cart" ? styles.active : ""}`}
          onClick={() => onNavigate("cart")}
        >
          Carrito
        </button>
      </div>

      <div className={styles.auth}>
        <span className={styles.userName}>{userLabel}</span>

        {isLoggedIn ? (
          <button type="button" className={styles.authBtn} onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <button type="button" className={styles.authBtn} onClick={onSignIn}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

Crea `src/styles/Navbar.module.css`:

```css
.navbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid var(--gray-200);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
}

.logo {
  width: 28px;
  height: 28px;
}

.brandName {
  font-weight: 800;
  color: var(--gray-900);
}

.links {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.link {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  color: var(--gray-900);
}

.link:hover {
  background: var(--gray-100);
}

.active {
  background: var(--gray-100);
  color: var(--primary-dark);
}

.auth {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.userName {
  font-weight: 700;
  color: var(--gray-900);
}

.authBtn {
  border: none;
  background: var(--primary);
  color: white;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 800;
}

.authBtn:hover {
  background: var(--primary-dark);
}

@media (max-width: 768px) {
  .navbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand {
    min-width: auto;
  }
}
```

> Logo: estamos usando `src/assets/react.svg` como placeholder. Puedes reemplazarlo por tu logo (por ejemplo `src/assets/logo.svg`) y actualizar el import.

#### 📝 Commit

```bash
git add src/components/Navbar.jsx src/styles/Navbar.module.css
git commit -m "feat: crear navbar con navegación y auth UI"
```

---

### Paso 3: Crear Header (contenedor del Navbar)

#### 🎯 Concepto

El `Header` es un componente que encapsula el navbar. Esto nos deja listo el proyecto para crecer (por ejemplo: agregar un banner, buscador, etc.).

#### 💻 Implementación

Crea `src/components/Header.jsx`:

```jsx
import styles from "../styles/Header.module.css";

import Navbar from "./Navbar";

function Header({ activePage, onNavigate, user, onSignIn, onSignOut }) {
  return (
    <header className={styles.header}>
      <Navbar
        activePage={activePage}
        onNavigate={onNavigate}
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
      />
    </header>
  );
}

export default Header;
```

Crea `src/styles/Header.module.css`:

```css
.header {
  width: 100%;
}
```

#### 📝 Commit

```bash
git add src/components/Header.jsx src/styles/Header.module.css
git commit -m "feat: agregar header que encapsula navbar"
```

---

### Paso 4: Crear Footer (simple)

#### 🎯 Concepto

El footer tendrá información básica. Lo iremos enriqueciendo más adelante.

#### 💻 Implementación

Crea `src/components/Footer.jsx`:

```jsx
import styles from "../styles/Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>© {year} Sistema Ventas</p>
    </footer>
  );
}

export default Footer;
```

Crea `src/styles/Footer.module.css`:

```css
.footer {
  width: 100%;
  padding: 1rem;
  text-align: center;
  color: white;
}

.text {
  font-weight: 700;
}
```

#### 📝 Commit

```bash
git add src/components/Footer.jsx src/styles/Footer.module.css
git commit -m "feat: agregar footer básico"
```

---

### Paso 5: Integrar layout y navegación en App.jsx

#### 🎯 Concepto

`App.jsx` será el lugar donde vive el estado global por ahora:

- `activePage`: qué “página” se ve
- `user`: usuario actual (simulado)

El navbar solo dispara eventos (callbacks). El estado se mantiene en `App`.

#### 💻 Implementación

Actualiza `src/App.jsx`:

```jsx
import { useMemo, useState } from "react";

import "./App.css";

import Footer from "./components/Footer";
import Header from "./components/Header";

import Cart from "./pages/Cart";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);

  const page = useMemo(() => {
    if (activePage === "products") return <ProductList />;
    if (activePage === "cart") return <Cart />;

    return <Home />;
  }, [activePage]);

  const handleSignIn = () => {
    setUser({ name: "Usuario" });
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="main">{page}</main>

      <Footer />
    </div>
  );
}

export default App;
```

Actualiza `src/App.css` para que el layout sea columna y el main crezca:

```css
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .main {
    padding: 1rem 0;
  }
}
```

#### 📝 Commit

```bash
git add src/App.jsx src/App.css
git commit -m "feat: integrar header footer y navegación por estado en app"
```

---

### Paso 6: Ajustes mínimos de layout global

#### 🎯 Concepto

En algunos templates, `body` viene con `display: flex;` y eso puede afectar el layout.

Vamos a dejar el `body` en modo normal y hacer que `#root` ocupe toda la altura.

#### 💻 Implementación

Actualiza `src/index.css` (bloque `body`) a algo como:

```css
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
```

#### 📝 Commit

```bash
git add src/index.css
git commit -m "style: ajustar estilos globales para layout con header y footer"
```

---

### Paso 7: Verificación

En la carpeta `frontend-sistema-ventas/`:

```bash
npm install
npm run dev
```

Checklist:

- Navbar muestra logo + “Sistema Ventas”
- Cambia entre Inicio / Productos / Carrito
- Muestra “Invitado” + `Sign in` si no hay usuario
- Muestra “Usuario” + `Sign out` si hay usuario
- Footer visible

---

## Nota: Usuarios y validación (Semana 04)

En esta clase el usuario se simula con `setUser({ name: 'Usuario' })`.

En **Semana 04** haremos:

- `src/data/users.js` con usuarios iniciales
- Validación real (por ejemplo: buscar usuario por email/username)
- Persistencia (opcional) con `localStorage`
