import styles from "../styles/Navbar.module.css";
import logo from "../assets/react.svg";
import {useLocation, useNavigate } from "react-router-dom";

function Navbar({ user, onSignIn, onSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === "/" || location.pathname.startsWith('/category');
  const isProductsActive = location.pathname === "/products";
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
          className={`${styles.link} ${isHomeActive ? styles.active : ""}`}
          onClick={() => navigate("/")}
        >
          Inicio
        </button>

        <button
          type="button"
          className={`${styles.link} ${isProductsActive ? styles.active : ""}`}
          onClick={() => navigate("/products")}
        >
          Productos
        </button>

        <button
          type="button"
          className={styles.link}
          onClick={() => navigate("/cart")}
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