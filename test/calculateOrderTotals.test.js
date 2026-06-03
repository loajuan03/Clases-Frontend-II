import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateCartSubtotal,
  calculateOrderTotals,
  getPaymentMethodById,
  getShippingOptionById,
} from '../src/utils/calculateOrderTotals.js';

const cartItems = [
  { price: 100000, quantity: 2 },
  { price: 50000, quantity: 1 },
];

test('calcula subtotal, IVA y envío estándar', () => {
  assert.equal(calculateCartSubtotal(cartItems), 250000);
  assert.deepEqual(calculateOrderTotals(cartItems, 'standard'), {
    subtotal: 250000,
    tax: 47500,
    shipping: 15000,
    total: 312500,
    shippingOption: getShippingOptionById('standard'),
  });
});

test('cambia el total cuando se selecciona envío express', () => {
  const totals = calculateOrderTotals(cartItems, 'express');

  assert.equal(totals.shipping, 25000);
  assert.equal(totals.total, 322500);
  assert.equal(totals.shippingOption.id, 'express');
});

test('un carrito vacío no cobra impuestos ni envío', () => {
  assert.deepEqual(calculateOrderTotals([], 'express'), {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    shippingOption: getShippingOptionById('express'),
  });
});

test('usa opciones predeterminadas para identificadores desconocidos', () => {
  assert.equal(getShippingOptionById('unknown').id, 'standard');
  assert.equal(getPaymentMethodById('unknown').id, 'card');
});
