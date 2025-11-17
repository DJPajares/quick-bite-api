export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled'
} as const;

export const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired'
} as const;

export const MENU_CATEGORIES = {
  APPETIZERS: 'appetizers',
  MAIN_COURSE: 'main-course',
  DESSERTS: 'desserts',
  BEVERAGES: 'beverages',
  SIDES: 'sides'
} as const;

export const TAX_RATE = parseFloat(process.env.TAX_RATE || '0.08');
export const SERVICE_FEE_RATE = parseFloat(
  process.env.SERVICE_FEE_RATE || '0.05'
);
export const SESSION_TIMEOUT_MINUTES = parseInt(
  process.env.SESSION_TIMEOUT_MINUTES || '120',
  10
);
