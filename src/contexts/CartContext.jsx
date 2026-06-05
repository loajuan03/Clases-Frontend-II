import { createContext, useEffect, useMemo, useState } from 'react';

import cartService from '../services/cartService';
import { CART_UPDATED_EVENT } from '../utils/cartStorage';

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState(cartService.getCart);
  const [cartError, setCartError] = useState('');
  const [cartHydrationStatus, setCartHydrationStatus] = useState('idle');

  useEffect(() => {
    let isMounted = true;

    const hydrateCart = async () => {
      setCartHydrationStatus('loading');
      setCartError('');

      try {
        const nextCart = await cartService.getCartAsync();

        if (isMounted) {
          setCart(nextCart);
          setCartHydrationStatus('ready');
        }
      } catch (error) {
        if (isMounted) {
          setCartError(
            error instanceof Error && error.message
              ? error.message
              : 'No fue posible cargar el carrito.'
          );
          setCartHydrationStatus('error');
        }
      }
    };

    hydrateCart();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleCartUpdated = (event) => {
      setCart(event.detail ?? cartService.getCart());
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, []);

  const runCartAction = async (action, fallbackMessage) => {
    setCartError('');

    try {
      const nextCart = await action();
      setCart(nextCart);
      return nextCart;
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : fallbackMessage;
      setCartError(message);
      throw error;
    }
  };

  const value = useMemo(() => {
    const cartItems = cart.items ?? [];

    return {
      addToCart: (product) =>
        runCartAction(
          () => cartService.addToCartAsync(product, cartItems),
          'No fue posible agregar el producto al carrito.'
        ),
      cart,
      cartError,
      cartHydrationStatus,
      cartItemCount: cartService.getCartItemCount(cartItems),
      cartItems,
      clearCart: () =>
        runCartAction(() => cartService.clearCartAsync(), 'No fue posible vaciar el carrito.'),
      isCartReady: cartHydrationStatus === 'ready',
      removeCartItem: (productId) =>
        runCartAction(
          () => cartService.removeCartItemAsync(productId, cartItems),
          'No fue posible quitar el producto del carrito.'
        ),
      updateCartItemQuantity: (productId, nextQuantity) =>
        runCartAction(
          () => cartService.updateCartItemQuantityAsync(productId, nextQuantity, cartItems),
          'No fue posible actualizar la cantidad del producto.'
        ),
    };
  }, [cart, cartError, cartHydrationStatus]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext, CartProvider };
