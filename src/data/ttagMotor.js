/**
 * Demo dataset for the TTAG Motor workshop management system.
 *
 * Everything here is fictional sample data used to drive the clickable demo at
 * /demo/ttag-motor. Figures are in SGD and tax follows the Singapore GST rate.
 */

export const GST_RATE = 0.09;

/** Fixed "today" so the demo stays internally consistent regardless of when it is shown. */
export const TODAY = new Date('2026-09-01T08:30:00');

export const workshop = {
  name: 'TTAG Motor',
  tagline: 'Workshop Operating System',
  uen: '201934822K',
  address: '18 Sin Ming Lane, #03-12, Midview City, Singapore 573960',
  phone: '+65 6842 7710',
  bays: 6,
  openingHours: 'Mon–Sat 08:30 – 18:30',
};

/** Renders an explicit "S$" so amounts match the "S$" used on chart axes. */
export const formatSGD = (value, { decimals = 2 } = {}) => {
  const amount = value ?? 0;
  const body = new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));
  return `${amount < 0 ? '-' : ''}S$${body}`;
};

export const formatCompactSGD = (value) =>
  `S$${new Intl.NumberFormat('en-SG', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value ?? 0)}`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatDateShort = (iso) =>
  new Date(iso).toLocaleDateString('en-SG', { day: '2-digit', month: 'short' });

/* ------------------------------------------------------------------ staff */

export const staff = [
  {
    id: 'EMP-001',
    shortName: 'Jason Lee',
    name: 'Jason Lee Chee Meng',
    role: 'Workshop Manager',
    department: 'Operations',
    initials: 'JL',
    joined: '2019-03-04',
    employment: 'Full-time',
    baseSalary: 6200,
    leaveBalance: 11,
    certifications: ['LTA Approved Inspector', 'Bosch Diagnostics L3'],
  },
  {
    id: 'EMP-002',
    shortName: 'Rahmat Osman',
    name: 'Rahmat Bin Osman',
    role: 'Senior Technician',
    department: 'Workshop',
    initials: 'RO',
    joined: '2017-08-21',
    employment: 'Full-time',
    baseSalary: 4600,
    leaveBalance: 6,
    certifications: ['Hybrid HV Safety', 'ATA Brakes & Suspension'],
  },
  {
    id: 'EMP-003',
    shortName: 'Kelvin Sim',
    name: 'Kelvin Sim Wei Jie',
    role: 'Technician',
    department: 'Workshop',
    initials: 'KS',
    joined: '2021-01-11',
    employment: 'Full-time',
    baseSalary: 3400,
    leaveBalance: 14,
    certifications: ['ATA Engine Repair'],
  },
  {
    id: 'EMP-004',
    shortName: 'Muthu Kumar',
    name: 'Muthu Kumar s/o Raja',
    role: 'Technician',
    department: 'Workshop',
    initials: 'MK',
    joined: '2020-06-15',
    employment: 'Full-time',
    baseSalary: 3550,
    leaveBalance: 3,
    certifications: ['Aircon Servicing (NEA)'],
  },
  {
    id: 'EMP-005',
    shortName: 'Aaron Tan',
    name: 'Aaron Tan Jun Hao',
    role: 'Apprentice Technician',
    department: 'Workshop',
    initials: 'AT',
    joined: '2025-02-03',
    employment: 'Full-time',
    baseSalary: 2100,
    leaveBalance: 9,
    certifications: ['NITEC Automotive Technology'],
  },
  {
    id: 'EMP-006',
    shortName: 'Siti Nurhaliza',
    name: 'Siti Nurhaliza Binte Yusof',
    role: 'Service Advisor',
    department: 'Front Office',
    initials: 'SN',
    joined: '2022-09-19',
    employment: 'Full-time',
    baseSalary: 3800,
    leaveBalance: 8,
    certifications: ['Customer Experience Level 2'],
  },
  {
    id: 'EMP-007',
    shortName: 'Priya Devi',
    name: 'Priya Devi',
    role: 'Accounts Executive',
    department: 'Finance',
    initials: 'PD',
    joined: '2023-04-10',
    employment: 'Part-time',
    baseSalary: 2400,
    leaveBalance: 5,
    certifications: ['Xero Certified Advisor'],
  },
];

export const technicians = staff.filter((s) => s.department === 'Workshop');

/* -------------------------------------------------------------- customers */

export const customers = [
  {
    id: 'CUS-1042',
    name: 'Ng Wei Liang',
    type: 'Individual',
    phone: '+65 9123 4471',
    email: 'weiliang.ng@gmail.com',
    since: '2021-05-02',
    vehicles: ['SJH8823X'],
    lifetimeValue: 8420.5,
    outstanding: 0,
  },
  {
    id: 'CUS-1088',
    name: 'Hock Seng Logistics Pte Ltd',
    type: 'Fleet',
    phone: '+65 6745 2210',
    email: 'fleet@hockseng.com.sg',
    since: '2019-11-14',
    vehicles: ['SMV1129L', 'SMV1130J', 'SMV1174T'],
    lifetimeValue: 61230.0,
    outstanding: 4860.3,
  },
  {
    id: 'CUS-1150',
    name: 'Chan Mei Ling',
    type: 'Individual',
    phone: '+65 8332 9076',
    email: 'meiling.chan@outlook.sg',
    since: '2022-02-28',
    vehicles: ['SLA2290M'],
    lifetimeValue: 3980.75,
    outstanding: 486.2,
  },
  {
    id: 'CUS-1203',
    name: 'Rajesh Kumaran',
    type: 'Individual',
    phone: '+65 9044 1188',
    email: 'rajesh.k88@gmail.com',
    since: '2023-07-09',
    vehicles: ['SKZ4417B'],
    lifetimeValue: 2140.0,
    outstanding: 0,
  },
  {
    id: 'CUS-1261',
    name: 'GreenRide Car Rental',
    type: 'Fleet',
    phone: '+65 6288 3341',
    email: 'ops@greenride.sg',
    since: '2024-01-22',
    vehicles: ['SPQ7702E', 'SPQ7715K'],
    lifetimeValue: 24870.4,
    outstanding: 2310.0,
  },
  {
    id: 'CUS-1299',
    name: 'Tan Boon Huat',
    type: 'Individual',
    phone: '+65 9771 6620',
    email: 'bh.tan@yahoo.com.sg',
    since: '2020-09-30',
    vehicles: ['SDB6634A'],
    lifetimeValue: 11560.9,
    outstanding: 0,
  },
];

/* --------------------------------------------------------------- vehicles */

export const vehicles = [
  {
    plate: 'SJH8823X',
    make: 'Toyota',
    model: 'Corolla Altis 1.6',
    year: 2019,
    customerId: 'CUS-1042',
    colour: 'Silver',
    vin: 'JTDBR32E830112947',
    mileage: 98420,
    lastService: '2026-03-14',
    nextServiceDue: '2026-09-14',
    nextServiceKm: 103000,
    coeExpiry: '2029-04-18',
    insuranceExpiry: '2027-01-31',
    status: 'In workshop',
    telematics: { fitted: true, battery: 12.4, engineTemp: 88, dtcCount: 1 },
  },
  {
    plate: 'SMV1129L',
    make: 'Toyota',
    model: 'Hiace 3.0D',
    year: 2021,
    customerId: 'CUS-1088',
    colour: 'White',
    vin: 'JTFHS02P900338211',
    mileage: 187650,
    lastService: '2026-07-02',
    nextServiceDue: '2026-10-02',
    nextServiceKm: 197000,
    coeExpiry: '2031-06-11',
    insuranceExpiry: '2026-12-15',
    status: 'On road',
    telematics: { fitted: true, battery: 12.7, engineTemp: 91, dtcCount: 0 },
  },
  {
    plate: 'SMV1130J',
    make: 'Toyota',
    model: 'Hiace 3.0D',
    year: 2021,
    customerId: 'CUS-1088',
    colour: 'White',
    vin: 'JTFHS02P900338290',
    mileage: 201380,
    lastService: '2026-05-19',
    nextServiceDue: '2026-08-19',
    nextServiceKm: 211000,
    coeExpiry: '2031-06-11',
    insuranceExpiry: '2026-12-15',
    status: 'Service overdue',
    telematics: { fitted: true, battery: 11.9, engineTemp: 96, dtcCount: 3 },
  },
  {
    plate: 'SMV1174T',
    make: 'Nissan',
    model: 'NV200 1.6',
    year: 2022,
    customerId: 'CUS-1088',
    colour: 'White',
    vin: 'JN1CM0A22Z0044817',
    mileage: 142900,
    lastService: '2026-06-24',
    nextServiceDue: '2026-09-24',
    nextServiceKm: 152000,
    coeExpiry: '2032-03-08',
    insuranceExpiry: '2027-03-01',
    status: 'On road',
    telematics: { fitted: true, battery: 12.6, engineTemp: 89, dtcCount: 0 },
  },
  {
    plate: 'SLA2290M',
    make: 'Honda',
    model: 'Vezel Hybrid 1.5',
    year: 2020,
    customerId: 'CUS-1150',
    colour: 'Pearl White',
    vin: 'JHMRU1870LX004412',
    mileage: 71240,
    lastService: '2026-04-08',
    nextServiceDue: '2026-10-08',
    nextServiceKm: 77000,
    coeExpiry: '2030-02-25',
    insuranceExpiry: '2026-11-20',
    status: 'In workshop',
    telematics: { fitted: false, battery: null, engineTemp: null, dtcCount: 0 },
  },
  {
    plate: 'SKZ4417B',
    make: 'Mazda',
    model: 'CX-5 2.0',
    year: 2018,
    customerId: 'CUS-1203',
    colour: 'Soul Red',
    vin: 'JM3KFBCM4J0338821',
    mileage: 126780,
    lastService: '2026-08-11',
    nextServiceDue: '2027-02-11',
    nextServiceKm: 133000,
    coeExpiry: '2028-08-02',
    insuranceExpiry: '2027-05-14',
    status: 'On road',
    telematics: { fitted: false, battery: null, engineTemp: null, dtcCount: 0 },
  },
  {
    plate: 'SPQ7702E',
    make: 'Hyundai',
    model: 'Avante 1.6',
    year: 2023,
    customerId: 'CUS-1261',
    colour: 'Grey',
    vin: 'KMHLM41AAPU229103',
    mileage: 64110,
    lastService: '2026-08-20',
    nextServiceDue: '2026-11-20',
    nextServiceKm: 74000,
    coeExpiry: '2033-09-27',
    insuranceExpiry: '2027-02-08',
    status: 'Awaiting collection',
    telematics: { fitted: true, battery: 12.5, engineTemp: 87, dtcCount: 0 },
  },
  {
    plate: 'SPQ7715K',
    make: 'Hyundai',
    model: 'Avante 1.6',
    year: 2023,
    customerId: 'CUS-1261',
    colour: 'White',
    vin: 'KMHLM41AAPU229288',
    mileage: 58940,
    lastService: '2026-07-30',
    nextServiceDue: '2026-10-30',
    nextServiceKm: 68000,
    coeExpiry: '2033-09-27',
    insuranceExpiry: '2027-02-08',
    status: 'In workshop',
    telematics: { fitted: true, battery: 12.3, engineTemp: 90, dtcCount: 2 },
  },
  {
    plate: 'SDB6634A',
    make: 'BMW',
    model: '320i Sport',
    year: 2017,
    customerId: 'CUS-1299',
    colour: 'Black Sapphire',
    vin: 'WBA8E9105HK772201',
    mileage: 158320,
    lastService: '2026-06-02',
    nextServiceDue: '2026-09-02',
    nextServiceKm: 164000,
    coeExpiry: '2027-11-16',
    insuranceExpiry: '2026-10-05',
    status: 'Booked in',
    telematics: { fitted: true, battery: 12.1, engineTemp: 93, dtcCount: 1 },
  },
];

export const vehicleByPlate = (plate) => vehicles.find((v) => v.plate === plate);
export const customerById = (id) => customers.find((c) => c.id === id);
export const staffById = (id) => staff.find((s) => s.id === id);

/* ------------------------------------------------------------- job cards */

export const JOB_STAGES = [
  { key: 'booked', label: 'Booked in' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'awaiting-parts', label: 'Awaiting parts' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'qc', label: 'QC / Road test' },
  { key: 'ready', label: 'Ready for collection' },
];

export const jobCards = [
  {
    id: 'JC-26-0841',
    plate: 'SJH8823X',
    customerId: 'CUS-1042',
    stage: 'in-progress',
    bay: 2,
    technicianId: 'EMP-002',
    advisorId: 'EMP-006',
    opened: '2026-09-01T08:45:00',
    promised: '2026-09-01T17:00:00',
    priority: 'Normal',
    complaint: 'Squealing under braking, steering shudder above 80 km/h.',
    odometer: 98420,
    labourHours: 2.5,
    progress: 60,
    lines: [
      { type: 'Labour', description: 'Front brake overhaul', qty: 2.5, unit: 45, code: 'LAB-BRK' },
      { type: 'Part', description: 'Front brake pad set — Bendix', qty: 1, unit: 128, code: 'BP-2201' },
      { type: 'Part', description: 'Front brake disc (pair)', qty: 1, unit: 268, code: 'BD-4410' },
      { type: 'Part', description: 'Brake fluid DOT4 1L', qty: 1, unit: 22, code: 'BF-0104' },
    ],
  },
  {
    id: 'JC-26-0842',
    plate: 'SLA2290M',
    customerId: 'CUS-1150',
    stage: 'awaiting-parts',
    bay: 4,
    technicianId: 'EMP-004',
    advisorId: 'EMP-006',
    opened: '2026-08-31T14:10:00',
    promised: '2026-09-02T12:00:00',
    priority: 'Normal',
    complaint: 'Aircon not cold, intermittent blower noise.',
    odometer: 71240,
    labourHours: 3,
    progress: 35,
    lines: [
      { type: 'Labour', description: 'Aircon diagnosis & regas', qty: 3, unit: 45, code: 'LAB-AC' },
      { type: 'Part', description: 'Blower motor assembly', qty: 1, unit: 340, code: 'AC-7712' },
      { type: 'Part', description: 'Cabin filter', qty: 1, unit: 38, code: 'CF-1180' },
    ],
  },
  {
    id: 'JC-26-0843',
    plate: 'SPQ7715K',
    customerId: 'CUS-1261',
    stage: 'qc',
    bay: 1,
    technicianId: 'EMP-003',
    advisorId: 'EMP-006',
    opened: '2026-09-01T09:05:00',
    promised: '2026-09-01T15:30:00',
    priority: 'Fleet SLA',
    complaint: 'Scheduled 60,000 km service + engine check light.',
    odometer: 58940,
    labourHours: 2,
    progress: 88,
    lines: [
      { type: 'Labour', description: 'Major service package', qty: 2, unit: 45, code: 'LAB-SVC' },
      { type: 'Part', description: 'Engine oil 5W-30 fully synthetic (4L)', qty: 1, unit: 96, code: 'EO-5304' },
      { type: 'Part', description: 'Oil filter', qty: 1, unit: 24, code: 'OF-3320' },
      { type: 'Part', description: 'Air filter', qty: 1, unit: 42, code: 'AF-2210' },
      { type: 'Part', description: 'Spark plug set (4)', qty: 1, unit: 88, code: 'SP-9901' },
    ],
  },
  {
    id: 'JC-26-0844',
    plate: 'SMV1130J',
    customerId: 'CUS-1088',
    stage: 'diagnosis',
    bay: 5,
    technicianId: 'EMP-002',
    advisorId: 'EMP-001',
    opened: '2026-09-01T10:20:00',
    promised: '2026-09-03T18:00:00',
    priority: 'Urgent',
    complaint: 'Loss of power under load, DTC P0299 turbo underboost. Fleet vehicle off-road.',
    odometer: 201380,
    labourHours: 4,
    progress: 20,
    lines: [
      { type: 'Labour', description: 'Turbo system diagnosis', qty: 4, unit: 55, code: 'LAB-DIAG' },
      { type: 'Part', description: 'Boost pressure sensor', qty: 1, unit: 145, code: 'BS-6640' },
    ],
  },
  {
    id: 'JC-26-0845',
    plate: 'SPQ7702E',
    customerId: 'CUS-1261',
    stage: 'ready',
    bay: null,
    technicianId: 'EMP-003',
    advisorId: 'EMP-006',
    opened: '2026-08-31T09:00:00',
    promised: '2026-09-01T11:00:00',
    priority: 'Fleet SLA',
    complaint: 'Tyre replacement x2 and wheel alignment.',
    odometer: 64110,
    labourHours: 1.5,
    progress: 100,
    lines: [
      { type: 'Labour', description: 'Tyre fitting & 4-wheel alignment', qty: 1.5, unit: 45, code: 'LAB-TYR' },
      { type: 'Part', description: 'Michelin Primacy 4 205/55R16', qty: 2, unit: 185, code: 'TY-2055' },
    ],
  },
  {
    id: 'JC-26-0846',
    plate: 'SDB6634A',
    customerId: 'CUS-1299',
    stage: 'booked',
    bay: null,
    technicianId: 'EMP-005',
    advisorId: 'EMP-006',
    opened: '2026-09-01T11:40:00',
    promised: '2026-09-02T17:00:00',
    priority: 'Normal',
    complaint: 'Annual servicing, oil leak inspection at sump.',
    odometer: 158320,
    labourHours: 3,
    progress: 0,
    lines: [
      { type: 'Labour', description: 'Annual service + leak inspection', qty: 3, unit: 55, code: 'LAB-SVC' },
      { type: 'Part', description: 'Engine oil 5W-30 fully synthetic (4L)', qty: 2, unit: 96, code: 'EO-5304' },
      { type: 'Part', description: 'Oil filter', qty: 1, unit: 24, code: 'OF-3320' },
    ],
  },
];

export const jobSubtotal = (job) =>
  job.lines.reduce((sum, line) => sum + line.qty * line.unit, 0);

export const jobTotal = (job) => jobSubtotal(job) * (1 + GST_RATE);

/* ---------------------------------------------------------------- bays */

export const bays = [
  { id: 1, label: 'Bay 1', kind: 'Two-post lift', jobId: 'JC-26-0843' },
  { id: 2, label: 'Bay 2', kind: 'Four-post lift', jobId: 'JC-26-0841' },
  { id: 3, label: 'Bay 3', kind: 'General', jobId: null },
  { id: 4, label: 'Bay 4', kind: 'Aircon', jobId: 'JC-26-0842' },
  { id: 5, label: 'Bay 5', kind: 'Diagnostics', jobId: 'JC-26-0844' },
  { id: 6, label: 'Bay 6', kind: 'Alignment', jobId: null },
];

/* ----------------------------------------------------------- inventory */

export const parts = [
  { sku: 'EO-5304', name: 'Engine oil 5W-30 synthetic (4L)', category: 'Lubricants', bin: 'A1-03', onHand: 24, reorderAt: 12, cost: 58, price: 96, supplier: 'Shell Lubricants SG' },
  { sku: 'OF-3320', name: 'Oil filter — universal fit', category: 'Filters', bin: 'A2-11', onHand: 41, reorderAt: 20, cost: 11, price: 24, supplier: 'Denso Asia' },
  { sku: 'AF-2210', name: 'Air filter — Hyundai/Kia', category: 'Filters', bin: 'A2-14', onHand: 8, reorderAt: 10, cost: 19, price: 42, supplier: 'Denso Asia' },
  { sku: 'CF-1180', name: 'Cabin filter — Honda', category: 'Filters', bin: 'A2-18', onHand: 15, reorderAt: 8, cost: 16, price: 38, supplier: 'Denso Asia' },
  { sku: 'BP-2201', name: 'Front brake pad set — Bendix', category: 'Brakes', bin: 'B1-02', onHand: 6, reorderAt: 8, cost: 72, price: 128, supplier: 'Bendix Asia Pacific' },
  { sku: 'BD-4410', name: 'Front brake disc (pair)', category: 'Brakes', bin: 'B1-07', onHand: 4, reorderAt: 4, cost: 158, price: 268, supplier: 'Bendix Asia Pacific' },
  { sku: 'BF-0104', name: 'Brake fluid DOT4 1L', category: 'Fluids', bin: 'A1-09', onHand: 22, reorderAt: 10, cost: 9, price: 22, supplier: 'Shell Lubricants SG' },
  { sku: 'SP-9901', name: 'Spark plug set (4) — iridium', category: 'Ignition', bin: 'C3-01', onHand: 12, reorderAt: 6, cost: 49, price: 88, supplier: 'NGK Singapore' },
  { sku: 'TY-2055', name: 'Michelin Primacy 4 205/55R16', category: 'Tyres', bin: 'Rack 2', onHand: 10, reorderAt: 8, cost: 118, price: 185, supplier: 'Michelin SG' },
  { sku: 'AC-7712', name: 'Blower motor assembly', category: 'Aircon', bin: 'D1-04', onHand: 0, reorderAt: 2, cost: 205, price: 340, supplier: 'Regional Auto Parts' },
  { sku: 'BS-6640', name: 'Boost pressure sensor', category: 'Engine', bin: 'C1-12', onHand: 3, reorderAt: 3, cost: 84, price: 145, supplier: 'Bosch Automotive SG' },
  { sku: 'WB-1000', name: 'Wiper blade pair 24"/18"', category: 'Consumables', bin: 'A3-05', onHand: 34, reorderAt: 15, cost: 14, price: 32, supplier: 'Regional Auto Parts' },
  { sku: 'BT-6011', name: 'Battery 60Ah maintenance-free', category: 'Electrical', bin: 'Rack 4', onHand: 7, reorderAt: 4, cost: 132, price: 218, supplier: 'Amaron SG' },
  { sku: 'CL-0250', name: 'Coolant premix 5L', category: 'Fluids', bin: 'A1-15', onHand: 18, reorderAt: 8, cost: 21, price: 45, supplier: 'Shell Lubricants SG' },
];

export const lowStockParts = parts.filter((p) => p.onHand <= p.reorderAt);

/* ------------------------------------------------------------------ POS */

export const posCategories = ['Service', 'Parts', 'Tyres', 'Consumables', 'Accessories'];

export const posCatalog = [
  { sku: 'SVC-BASIC', name: 'Basic servicing package', category: 'Service', price: 158 },
  { sku: 'SVC-MAJOR', name: 'Major servicing package', category: 'Service', price: 298 },
  { sku: 'SVC-AC', name: 'Aircon regas & clean', category: 'Service', price: 168 },
  { sku: 'SVC-DIAG', name: 'Computer diagnostics (per hr)', category: 'Service', price: 55 },
  { sku: 'SVC-ALIGN', name: '4-wheel alignment', category: 'Service', price: 88 },
  { sku: 'SVC-INSP', name: 'Pre-purchase inspection', category: 'Service', price: 220 },
  { sku: 'EO-5304', name: 'Engine oil 5W-30 (4L)', category: 'Parts', price: 96 },
  { sku: 'OF-3320', name: 'Oil filter', category: 'Parts', price: 24 },
  { sku: 'BP-2201', name: 'Front brake pad set', category: 'Parts', price: 128 },
  { sku: 'BT-6011', name: 'Battery 60Ah', category: 'Parts', price: 218 },
  { sku: 'TY-2055', name: 'Michelin Primacy 4 205/55R16', category: 'Tyres', price: 185 },
  { sku: 'TY-2156', name: 'Goodyear Assurance 215/60R16', category: 'Tyres', price: 172 },
  { sku: 'WB-1000', name: 'Wiper blade pair', category: 'Consumables', price: 32 },
  { sku: 'CL-0250', name: 'Coolant premix 5L', category: 'Consumables', price: 45 },
  { sku: 'AC-CARE', name: 'Cabin deodoriser treatment', category: 'Consumables', price: 28 },
  { sku: 'ACC-MAT', name: 'All-weather floor mat set', category: 'Accessories', price: 118 },
  { sku: 'ACC-CAM', name: 'Dashcam 2CH install', category: 'Accessories', price: 385 },
  { sku: 'ACC-FILM', name: 'Solar film — full car', category: 'Accessories', price: 480 },
];

export const paymentMethods = ['PayNow', 'NETS', 'Visa / Mastercard', 'Cash', 'Fleet account'];

export const recentSales = [
  { id: 'POS-26-3391', time: '11:42', customer: 'Walk-in', items: 3, method: 'PayNow', total: 214.4 },
  { id: 'POS-26-3390', time: '10:58', customer: 'Rajesh Kumaran', items: 1, method: 'NETS', total: 95.9 },
  { id: 'POS-26-3389', time: '10:15', customer: 'GreenRide Car Rental', items: 5, method: 'Fleet account', total: 806.3 },
  { id: 'POS-26-3388', time: '09:36', customer: 'Walk-in', items: 2, method: 'Visa / Mastercard', total: 148.5 },
  { id: 'POS-26-3387', time: '09:04', customer: 'Chan Mei Ling', items: 1, method: 'Cash', total: 34.9 },
];

/* ------------------------------------------------------------- invoices */

export const invoices = [
  {
    id: 'INV-26-1187',
    jobId: 'JC-26-0845',
    customerId: 'CUS-1261',
    plate: 'SPQ7702E',
    issued: '2026-09-01',
    due: '2026-10-01',
    status: 'Sent',
    terms: 'Net 30 — fleet account',
    lines: [
      { description: 'Tyre fitting & 4-wheel alignment', qty: 1.5, unit: 45 },
      { description: 'Michelin Primacy 4 205/55R16', qty: 2, unit: 185 },
    ],
  },
  {
    id: 'INV-26-1186',
    jobId: 'JC-26-0838',
    customerId: 'CUS-1088',
    plate: 'SMV1129L',
    issued: '2026-08-24',
    due: '2026-09-23',
    status: 'Overdue',
    terms: 'Net 30 — fleet account',
    lines: [
      { description: 'Major service package', qty: 3, unit: 45 },
      { description: 'Engine oil 5W-30 (4L)', qty: 2, unit: 96 },
      { description: 'Oil filter', qty: 1, unit: 24 },
      { description: 'Diesel fuel filter', qty: 1, unit: 78 },
      { description: 'Brake pad set — rear', qty: 1, unit: 112 },
    ],
  },
  {
    id: 'INV-26-1185',
    jobId: 'JC-26-0836',
    customerId: 'CUS-1150',
    plate: 'SLA2290M',
    issued: '2026-08-19',
    due: '2026-08-26',
    status: 'Overdue',
    terms: 'Net 7',
    lines: [
      { description: 'Basic servicing package', qty: 1, unit: 158 },
      { description: 'Cabin filter', qty: 1, unit: 38 },
      { description: 'Wiper blade pair', qty: 1, unit: 32 },
    ],
  },
  {
    id: 'INV-26-1184',
    jobId: 'JC-26-0834',
    customerId: 'CUS-1042',
    plate: 'SJH8823X',
    issued: '2026-08-16',
    due: '2026-08-23',
    status: 'Paid',
    terms: 'Net 7',
    lines: [
      { description: 'Computer diagnostics', qty: 2, unit: 55 },
      { description: 'Boost pressure sensor', qty: 1, unit: 145 },
    ],
  },
  {
    id: 'INV-26-1183',
    jobId: 'JC-26-0831',
    customerId: 'CUS-1299',
    plate: 'SDB6634A',
    issued: '2026-08-12',
    due: '2026-08-19',
    status: 'Paid',
    terms: 'Net 7',
    lines: [
      { description: 'Major service package', qty: 3, unit: 55 },
      { description: 'Engine oil 5W-30 (4L)', qty: 2, unit: 96 },
      { description: 'Spark plug set (4) — iridium', qty: 1, unit: 88 },
    ],
  },
  {
    id: 'INV-26-1182',
    jobId: 'JC-26-0829',
    customerId: 'CUS-1261',
    plate: 'SPQ7715K',
    issued: '2026-08-05',
    due: '2026-09-04',
    status: 'Sent',
    terms: 'Net 30 — fleet account',
    lines: [
      { description: 'Basic servicing package', qty: 1, unit: 158 },
      { description: 'Air filter', qty: 1, unit: 42 },
    ],
  },
  {
    id: 'INV-26-1181',
    jobId: 'JC-26-0827',
    customerId: 'CUS-1203',
    plate: 'SKZ4417B',
    issued: '2026-07-28',
    due: '2026-08-04',
    status: 'Paid',
    terms: 'Net 7',
    lines: [
      { description: 'Aircon regas & clean', qty: 1, unit: 168 },
      { description: 'Cabin deodoriser treatment', qty: 1, unit: 28 },
    ],
  },
  {
    id: 'INV-26-1180',
    jobId: null,
    customerId: 'CUS-1088',
    plate: 'SMV1174T',
    issued: '2026-07-21',
    due: '2026-08-20',
    status: 'Draft',
    terms: 'Net 30 — fleet account',
    lines: [
      { description: 'Brake fluid flush', qty: 1, unit: 120 },
      { description: 'Brake fluid DOT4 1L', qty: 2, unit: 22 },
    ],
  },
];

export const invoiceSubtotal = (inv) =>
  inv.lines.reduce((sum, line) => sum + line.qty * line.unit, 0);

export const invoiceGst = (inv) => invoiceSubtotal(inv) * GST_RATE;

export const invoiceTotal = (inv) => invoiceSubtotal(inv) + invoiceGst(inv);

/* -------------------------------------------------------------- finance */

/** The final row is the current month in progress and is flagged so views can label it. */
export const monthlyPerformance = [
  { month: 'Oct 25', revenue: 148200, cost: 79400, expenses: 42100 },
  { month: 'Nov 25', revenue: 152800, cost: 81900, expenses: 42600 },
  { month: 'Dec 25', revenue: 171400, cost: 92300, expenses: 45200 },
  { month: 'Jan 26', revenue: 139600, cost: 74800, expenses: 43800 },
  { month: 'Feb 26', revenue: 144900, cost: 77100, expenses: 42900 },
  { month: 'Mar 26', revenue: 163500, cost: 87200, expenses: 44100 },
  { month: 'Apr 26', revenue: 158700, cost: 84600, expenses: 43700 },
  { month: 'May 26', revenue: 169200, cost: 89800, expenses: 45400 },
  { month: 'Jun 26', revenue: 174600, cost: 92100, expenses: 46200 },
  { month: 'Jul 26', revenue: 181300, cost: 95700, expenses: 46800 },
  { month: 'Aug 26', revenue: 192400, cost: 101200, expenses: 47500 },
  { month: 'Sep 26', revenue: 8420, cost: 4380, expenses: 1520, partial: true },
];

export const revenueByStream = [
  { name: 'Servicing & repair', value: 92400 },
  { name: 'Parts & accessories', value: 48700 },
  { name: 'Tyres & alignment', value: 26800 },
  { name: 'Fleet contracts', value: 18300 },
  { name: 'Inspection & diagnostics', value: 6200 },
];

export const expenseBreakdown = [
  { name: 'Payroll & CPF', value: 26480 },
  { name: 'Rent & utilities', value: 9800 },
  { name: 'Parts procurement', value: 5200 },
  { name: 'Equipment & tooling', value: 2900 },
  { name: 'Insurance & licences', value: 1740 },
  { name: 'Marketing', value: 1380 },
];

export const cashflow = [
  { week: 'W31', inflow: 41200, outflow: 28900 },
  { week: 'W32', inflow: 46800, outflow: 31400 },
  { week: 'W33', inflow: 39600, outflow: 34200 },
  { week: 'W34', inflow: 52300, outflow: 29800 },
  { week: 'W35', inflow: 48100, outflow: 33600 },
];

export const arAging = [
  { bucket: 'Current', amount: 18420 },
  { bucket: '1–30 days', amount: 9260 },
  { bucket: '31–60 days', amount: 4860 },
  { bucket: '61–90 days', amount: 1490 },
  { bucket: '90+ days', amount: 620 },
];

/* -------------------------------------------------------------------- HR */

export const attendanceToday = [
  { staffId: 'EMP-001', clockIn: '08:12', clockOut: null, status: 'On shift' },
  { staffId: 'EMP-002', clockIn: '08:03', clockOut: null, status: 'On shift' },
  { staffId: 'EMP-003', clockIn: '08:21', clockOut: null, status: 'On shift' },
  { staffId: 'EMP-004', clockIn: '08:47', clockOut: null, status: 'Late' },
  { staffId: 'EMP-005', clockIn: null, clockOut: null, status: 'Annual leave' },
  { staffId: 'EMP-006', clockIn: '08:00', clockOut: null, status: 'On shift' },
  { staffId: 'EMP-007', clockIn: '09:02', clockOut: null, status: 'On shift' },
];

/** Billable vs available hours for the current month, used for the productivity view. */
export const technicianProductivity = [
  { staffId: 'EMP-002', billable: 148, available: 168, jobsClosed: 41, reworkRate: 1.2 },
  { staffId: 'EMP-003', billable: 131, available: 168, jobsClosed: 36, reworkRate: 2.8 },
  { staffId: 'EMP-004', billable: 126, available: 168, jobsClosed: 33, reworkRate: 2.1 },
  { staffId: 'EMP-005', billable: 84, available: 168, jobsClosed: 18, reworkRate: 5.4 },
];

/** Singapore CPF: 17% employer / 20% employee for residents aged 55 and below. */
export const CPF_EMPLOYER_RATE = 0.17;
export const CPF_EMPLOYEE_RATE = 0.2;

export const payrollRun = {
  period: 'August 2026',
  status: 'Pending approval',
  payDate: '2026-09-05',
  lines: staff.map((s) => {
    const overtime = { 'EMP-002': 620, 'EMP-003': 380, 'EMP-004': 295, 'EMP-005': 140 }[s.id] ?? 0;
    const allowance = s.department === 'Workshop' ? 180 : 120;
    const gross = s.baseSalary + overtime + allowance;
    return {
      staffId: s.id,
      base: s.baseSalary,
      overtime,
      allowance,
      gross,
      cpfEmployee: Math.round(gross * CPF_EMPLOYEE_RATE),
      cpfEmployer: Math.round(gross * CPF_EMPLOYER_RATE),
      net: Math.round(gross * (1 - CPF_EMPLOYEE_RATE)),
    };
  }),
};

export const leaveRequests = [
  { id: 'LV-0231', staffId: 'EMP-005', type: 'Annual', from: '2026-09-01', to: '2026-09-01', days: 1, status: 'Approved' },
  { id: 'LV-0232', staffId: 'EMP-003', type: 'Annual', from: '2026-09-14', to: '2026-09-18', days: 5, status: 'Pending' },
  { id: 'LV-0233', staffId: 'EMP-004', type: 'Medical', from: '2026-08-27', to: '2026-08-28', days: 2, status: 'Approved' },
  { id: 'LV-0234', staffId: 'EMP-006', type: 'Childcare', from: '2026-09-22', to: '2026-09-22', days: 1, status: 'Pending' },
];
