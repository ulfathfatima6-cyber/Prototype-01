export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

export const CAN_RECEIVE_FROM: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

export const CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

export interface UrgentRequest {
  id: string;
  patient: string;
  bloodGroup: BloodGroup;
  hospital: string;
  city: string;
  units: number;
  minutesLeft: number;
  urgency: 'critical' | 'high' | 'normal';
  note: string;
}

export const URGENT_REQUESTS: UrgentRequest[] = [
  {
    id: 'req-1',
    patient: 'Priya S.',
    bloodGroup: 'O-',
    hospital: 'St. Martha\'s Multispeciality',
    city: 'Bengaluru',
    units: 3,
    minutesLeft: 42,
    urgency: 'critical',
    note: 'Postpartum haemorrhage — ICU, transit surgery scheduled.',
  },
  {
    id: 'req-2',
    patient: 'Arjun M.',
    bloodGroup: 'B+',
    hospital: 'Fortis Healthcare',
    city: 'Mumbai',
    units: 2,
    minutesLeft: 95,
    urgency: 'high',
    note: 'Road accident victim, thalassemia complications.',
  },
  {
    id: 'req-3',
    patient: 'Fatima R.',
    bloodGroup: 'AB-',
    hospital: 'Apollo City Hospital',
    city: 'Hyderabad',
    units: 4,
    minutesLeft: 26,
    urgency: 'critical',
    note: 'Bone marrow transplant support, rare group needed urgently.',
  },
  {
    id: 'req-4',
    patient: 'Dev P.',
    bloodGroup: 'A+',
    hospital: 'Ruby Hall Clinic',
    city: 'Pune',
    units: 1,
    minutesLeft: 240,
    urgency: 'normal',
    note: 'Scheduled cardiac bypass, pre-operative units.',
  },
  {
    id: 'req-5',
    patient: 'Lakshmi V.',
    bloodGroup: 'O+',
    hospital: 'AIIMS Trauma Centre',
    city: 'Delhi NCR',
    units: 5,
    minutesLeft: 58,
    urgency: 'high',
    note: 'Polytrauma from highway collision, emergency ward 3.',
  },
  {
    id: 'req-6',
    patient: 'Noah D.',
    bloodGroup: 'B-',
    hospital: 'Manipal Hospital',
    city: 'Bengaluru',
    units: 2,
    minutesLeft: 150,
    urgency: 'normal',
    note: 'Anaemic paediatric patient, planned transfusion.',
  },
];

export interface InventoryFacility {
  id: string;
  name: string;
  city: string;
  type: 'Hospital' | 'Blood Bank';
  verified: boolean;
  phone: string;
  stock: Record<BloodGroup, 'in-stock' | 'low' | 'critical'>;
}

type StockLevel = InventoryFacility['stock'][BloodGroup];

function stock(
  levels: [BloodGroup, StockLevel][]
): Record<BloodGroup, StockLevel> {
  return Object.fromEntries(
    BLOOD_GROUPS.map((g) => [
      g,
      levels.find(([lg]) => lg === g)?.[1] ?? 'in-stock',
    ])
  ) as Record<BloodGroup, StockLevel>;
}

export const FACILITIES: InventoryFacility[] = [
  {
    id: 'f1',
    name: "St. Martha's Multispeciality",
    city: 'Bengaluru',
    type: 'Hospital',
    verified: true,
    phone: '+91 80 2200 1122',
    stock: stock([
      ['O-', 'critical'],
      ['AB-', 'low'],
      ['B+', 'low'],
    ]),
  },
  {
    id: 'f2',
    name: 'Fortis Healthcare',
    city: 'Mumbai',
    type: 'Hospital',
    verified: true,
    phone: '+91 22 6799 4444',
    stock: stock([
      ['AB+', 'low'],
      ['O+', 'low'],
    ]),
  },
  {
    id: 'f3',
    name: 'Apollo City Blood Bank',
    city: 'Hyderabad',
    type: 'Blood Bank',
    verified: true,
    phone: '+91 40 2360 7777',
    stock: stock([
      ['O-', 'critical'],
      ['B-', 'critical'],
      ['A+', 'low'],
    ]),
  },
  {
    id: 'f4',
    name: 'AIIMS Trauma Centre',
    city: 'Delhi NCR',
    type: 'Hospital',
    verified: true,
    phone: '+91 11 2659 0000',
    stock: stock([
      ['AB-', 'low'],
      ['O-', 'low'],
      ['B+', 'critical'],
    ]),
  },
  {
    id: 'f5',
    name: 'Ruby Hall Clinic',
    city: 'Pune',
    type: 'Hospital',
    verified: true,
    phone: '+91 20 6645 5100',
    stock: stock([['A-', 'low']]),
  },
  {
    id: 'f6',
    name: 'Manipal Red Cross Bank',
    city: 'Bengaluru',
    type: 'Blood Bank',
    verified: true,
    phone: '+91 80 2502 5566',
    stock: stock([
      ['B-', 'low'],
      ['AB+', 'low'],
    ]),
  },
  {
    id: 'f7',
    name: 'Chennai Kauvery Hospital',
    city: 'Chennai',
    type: 'Hospital',
    verified: true,
    phone: '+91 44 4000 6000',
    stock: stock([
      ['O+', 'critical'],
      ['A+', 'critical'],
      ['B+', 'low'],
    ]),
  },
  {
    id: 'f8',
    name: 'Ahmedabad Lifeline Bank',
    city: 'Ahmedabad',
    type: 'Blood Bank',
    verified: false,
    phone: '+91 79 3011 8899',
    stock: stock([['AB-', 'low']]),
  },
  {
    id: 'f9',
    name: 'Kolkata Mission of Mercy',
    city: 'Kolkata',
    type: 'Hospital',
    verified: true,
    phone: '+91 33 2490 8888',
    stock: stock([
      ['O-', 'low'],
      ['B-', 'critical'],
    ]),
  },
];

export interface Myth {
  id: string;
  myth: string;
  fact: string;
}

export const MYTHS: Myth[] = [
  {
    id: 'm1',
    myth: 'Donating blood makes you weak for days.',
    fact: 'Your body replenishes the plasma within 24–48 hours and red cells within a few weeks. Most donors return to full activity the same day.',
  },
  {
    id: 'm2',
    myth: 'I can get an infection from donating.',
    fact: 'Every needle is sterile, single-use and disposed of after one donation. There is zero risk of catching anything from the donation itself.',
  },
  {
    id: 'm3',
    myth: 'People with diabetes or high BP can never donate.',
    fact: 'If your condition is well-controlled with medication and you feel healthy, you are usually still eligible. A quick screening at the camp confirms it.',
  },
  {
    id: 'm4',
    myth: 'Vegetarians cannot donate blood.',
    fact: 'Diet does not disqualify you. Eat an iron-rich meal — greens, lentils, fortified cereal — and drink plenty of water before you donate.',
  },
  {
    id: 'm5',
    myth: 'Donating hurts and takes hours.',
    fact: 'The needle prick lasts a second. The whole visit takes 30–45 minutes; the actual draw is under 10 minutes and one donation can save up to three lives.',
  },
  {
    id: 'm6',
    myth: 'Older people cannot donate.',
    fact: 'Healthy adults between 18 and 65 who meet weight and haemoglobin checks can donate regularly — age is not a barrier by itself.',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  city: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'BloodLink found a rare AB- match for my father in 11 minutes. The nurse said those units were the reason he walked out of the ICU.',
    name: 'Ananya Rao',
    role: 'Recipient family',
    city: 'Bengaluru',
  },
  {
    id: 't2',
    quote:
      'I donate every 90 days now. The app tells me exactly when I am eligible and where my type is needed most — it made saving lives effortless.',
    name: 'Rohit Menon',
    role: 'Verified donor, 12 donations',
    city: 'Mumbai',
  },
  {
    id: 't3',
    quote:
      'During the dengue surge our platelet shelf hit zero twice. Both times the network rallied donors within the hour.',
    name: 'Dr. Meera Krishnan',
    role: 'Blood bank in-charge',
    city: 'Chennai',
  },
  {
    id: 't4',
    quote:
      'As a first-time donor I was nervous. The eligibility check prepared me, and the staff walk you through every step. It took 20 minutes.',
    name: 'Sana Qureshi',
    role: 'First-time donor',
    city: 'Delhi NCR',
  },
];

export const LIVE_EVENTS: { city: string; group: BloodGroup }[] = [
  { city: 'Bengaluru', group: 'A+' },
  { city: 'Mumbai', group: 'O+' },
  { city: 'Delhi NCR', group: 'B+' },
  { city: 'Hyderabad', group: 'O-' },
  { city: 'Chennai', group: 'AB+' },
  { city: 'Pune', group: 'B+' },
  { city: 'Kolkata', group: 'A-' },
  { city: 'Ahmedabad', group: 'O+' },
  { city: 'Bengaluru', group: 'AB-' },
  { city: 'Chennai', group: 'O+' },
];

export const URGENCY_META = {
  critical: {
    label: 'Critical',
    badge: 'bg-crimson-100 text-crimson-800 border border-crimson-200',
    dot: 'bg-crimson-600',
    ring: 'ring-1 ring-crimson-200',
  },
  high: {
    label: 'High Priority',
    badge: 'bg-amber-100 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-1 ring-amber-200',
  },
  normal: {
    label: 'Normal',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-1 ring-emerald-200',
  },
} as const;

export const STOCK_META = {
  'in-stock': {
    label: 'In Stock',
    cell: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    chip: 'bg-emerald-100 text-emerald-700',
  },
  low: {
    label: 'Low Stock',
    cell: 'bg-amber-50 text-amber-700 border-amber-200',
    chip: 'bg-amber-100 text-amber-700',
  },
  critical: {
    label: 'Critical Shortage',
    cell: 'bg-crimson-50 text-crimson-700 border-crimson-200',
    chip: 'bg-crimson-100 text-crimson-700',
  },
} as const;

export function formatCountdown(minutes: number): string {
  if (minutes <= 0) return 'Expired';
  if (minutes < 60) return `${minutes} min left`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m left` : `${h}h left`;
}
