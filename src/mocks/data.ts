import type {
  Order,
  OrderStatus,
  PaymentStatus,
  ServiceType,
} from '@/domain/types';

// To get random integer https://github.com/cprosche/mulberry32
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'James', 'Sophia',
  'Daniel', 'Ava', 'Liam', 'Mia', 'Noah', 'Isabella', 'Lucas', 'Amelia',
  'Ethan', 'Charlotte', 'Mason', 'Harper', 'Aisha', 'Wei', 'Priya', 'Carlos',
];
const LAST_NAMES = [
  'Smith', 'Johnson', 'Tan', 'Wilson', 'Lee', 'Brown', 'Garcia', 'Martinez',
  'Nguyen', 'Kumar', 'Chen', 'Patel', 'Khan', 'Rossi', 'Silva', 'Okafor',
];

const SERVICES: ServiceType[] = [
  'Room Service', 'Housekeeping', 'Laundry', 'Extra Bed', 'Spa & Massage',
];

const SPECIAL_REQUESTS: Record<ServiceType, string[]> = {
  'Room Service': [
    'Please deliver to the room before 8 PM.',
    'No nuts due to allergy.',
    'Extra napkins, please.',
    '',
  ],
  Housekeeping: [
    'Please clean the room after 2 PM.',
    'Extra towels and pillows.',
    'Do not disturb until noon.',
    '',
  ],
  Laundry: ['Express service requested.', 'Delicate wash only.', ''],
  'Extra Bed': ['Child bed, please.', 'Firm mattress preferred.', ''],
  'Spa & Massage': [
    'Preferred time: 7 PM.',
    'Deep tissue, 60 minutes.',
    'Couple session.',
    '',
  ],
};

const AMOUNTS: Record<ServiceType, number> = {
  'Room Service': 45,
  Housekeeping: 0,
  Laundry: 25,
  'Extra Bed': 30,
  'Spa & Massage': 75,
};

const STATUS_WEIGHTS: [OrderStatus, number][] = [
  ['New', 0.28],
  ['Acknowledged', 0.18],
  ['In Progress', 0.2],
  ['Completed', 0.26],
  ['Cancelled', 0.08],
];

function weightedPick<T>(rng: () => number, weights: [T, number][]): T {
  const r = rng();
  let acc = 0;
  for (const [value, w] of weights) {
    acc += w;
    if (r <= acc) return value;
  }
  return weights[weights.length - 1][0];
}

function paymentFor(rng: () => number, status: OrderStatus): PaymentStatus {
  if (status === 'Completed') return rng() < 0.85 ? 'Paid' : 'Pending';
  if (status === 'Cancelled') return rng() < 0.5 ? 'Failed' : 'Pending';
  const r = rng();
  if (r < 0.5) return 'Paid';
  if (r < 0.85) return 'Pending';
  return 'Failed';
}

export function generateSeedOrders(count = 42, now: number = Date.now()): Order[] {
  const rng = mulberry32(20260728);
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const status = weightedPick(rng, STATUS_WEIGHTS);
    const service = SERVICES[Math.floor(rng() * SERVICES.length)];
    const first = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const requests = SPECIAL_REQUESTS[service];

    const ageMinutes =
      status === 'New'
        ? Math.floor(rng() * 40)
        : 20 + Math.floor(rng() * 340);

    orders.push({
      id: `ORD-${1001 + i}`,
      guestName: `${first} ${last}`,
      roomNumber: String(100 + Math.floor(rng() * 420)),
      service,
      quantity: 1 + Math.floor(rng() * 3),
      amount: AMOUNTS[service],
      specialRequest: requests[Math.floor(rng() * requests.length)],
      orderTime: new Date(now - ageMinutes * 60_000).toISOString(),
      status,
      paymentStatus: paymentFor(rng, status),
    });
  }

  // Pin the first order so there's always a visible SLA breach.
  orders[0] = {
    ...orders[0],
    guestName: 'John Smith',
    roomNumber: '204',
    service: 'Room Service',
    status: 'New',
    paymentStatus: 'Paid',
    orderTime: new Date(now - 23 * 60_000).toISOString(),
    specialRequest: 'Please deliver to the room before 8 PM.',
  };

  return orders;
}
