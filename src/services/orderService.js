import { appConfig } from '../config';
import { loadSessionToken } from '../utils/authStorage';
import { loadOrders, loadOrdersByUserId, saveOrder, saveOrders } from '../utils/ordersStorage';

import { requestJson } from './http';

const createLocalOrderId = () => String(Date.now());
const createLocalOrderNumber = () =>
  `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
    Math.random() * 1000000
  )
    .toString()
    .padStart(6, '0')}`;
const toAsyncResult = (callback) => Promise.resolve().then(callback);

const normalizeOrderPayload = (order) => ({
  ...order,
  id: String(order?.id ?? createLocalOrderId()),
  orderNumber: String(order?.orderNumber ?? createLocalOrderNumber()),
  status: String(order?.status ?? 'PENDING'),
  createdAt: order?.createdAt ?? new Date().toISOString(),
});

function getOrders() {
  return loadOrders();
}

function getOrdersByUserId(userId) {
  return loadOrdersByUserId(userId);
}

function getOrderByIdForUser(userId, orderId) {
  return getOrdersByUserId(userId).find((order) => order.id === orderId) ?? null;
}

function createOrder(order) {
  return saveOrder(normalizeOrderPayload(order));
}

function getOrdersAsync() {
  if (appConfig.useRemoteApi) {
    return requestJson('/orders/me', {
      method: 'GET',
      token: loadSessionToken(),
    }).then((response) =>
      saveOrders((Array.isArray(response) ? response : []).map(normalizeRemoteOrder))
    );
  }

  return toAsyncResult(() => getOrders());
}

function getOrdersByUserIdAsync(userId) {
  if (appConfig.useRemoteApi) {
    return getOrdersAsync();
  }

  return toAsyncResult(() => getOrdersByUserId(userId));
}

function getOrderByIdForUserAsync(userId, orderId) {
  if (appConfig.useRemoteApi) {
    return requestJson(`/orders/${orderId}`, {
      method: 'GET',
      token: loadSessionToken(),
    }).then((response) => saveOrder(normalizeOrderPayload(normalizeRemoteOrder(response))));
  }

  return toAsyncResult(() => getOrderByIdForUser(userId, orderId));
}

function createOrderAsync(order) {
  if (!appConfig.useRemoteApi) {
    return toAsyncResult(() => createOrder(order));
  }

  return requestJson('/orders/checkout', {
    method: 'POST',
    token: loadSessionToken(),
    body: {
      shippingAddressId: order?.shippingAddress?.id ?? order?.shippingAddressId,
      billingAddressId: order?.billingAddress?.id ?? order?.billingAddressId,
    },
  }).then((response) => saveOrder(normalizeOrderPayload(response)));
}
const normalizeRemoteOrder = (order) => ({
  ...order,

  totals: order.totals ?? {
    subtotal: Number(order.subtotal ?? 0),
    tax: Number(order.tax ?? 0),
    shipping: Number(order.shippingCost ?? 0),
    total: Number(order.total ?? 0),
  },

  items: (order.items ?? []).map((item) => ({
    ...item,
    name: item.name ?? item.productName,
  })),
});

const orderService = {
  createOrder,
  createOrderAsync,
  getOrderByIdForUser,
  getOrderByIdForUserAsync,
  getOrders,
  getOrdersAsync,
  getOrdersByUserId,
  getOrdersByUserIdAsync,
};

export { orderService };
export default orderService;
