export const ORDER_STATUSES = [
  'New',
  'Acknowledged',
  'In Progress',
  'Completed',
  'Cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const SERVICE_TYPES = [
  'Room Service',
  'Housekeeping',
  'Laundry',
  'Extra Bed',
  'Spa & Massage',
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'Failed'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  service: ServiceType;
  quantity: number;
  amount: number;
  specialRequest: string;
  orderTime: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export type OrderAction =
  | 'acknowledge'
  | 'start'
  | 'complete'
  | 'cancel';
