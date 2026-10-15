/**
 * Site content: company details, statistics and project entries.
 * Edit this file to update copy, contact information and imagery.
 */
export const siteConfig = {
  name: 'Stratum Construction',
  short: 'Stratum',
  initials: 'ST',
  profession: 'Building contractor',
  tagline: 'Precision from footing to roof.',
  intro: 'Stratum builds homes, offices and infrastructure, and hands each one over on the date we promised.',
  location: 'Foundry Road, Your City',
  email: 'hello@stratum-build.example',
  phone: '+00 00000 00000',
  founded: 2008,
  hours: 'Site office open Mon to Sat, 9:00 to 18:00',
  reply: 'We reply to every enquiry within one working day.',
  origin: 'https://stratum-build.example',
};

export const stats = [
  { value: 17, suffix: '', label: 'years on site' },
  { value: 240, suffix: '+', label: 'homes handed over' },
  { value: 61, suffix: ' km', label: 'of road laid' },
  { value: 98, suffix: '%', label: 'of projects handed over on or before the date' },
];

/* status: 'Completed' | 'In progress'; progress is 0-100 and only shown for live sites */
export const projects = [
  {
    id: 'aurora-tower',
    sector: 'homes',
    title: 'Aurora Tower',
    category: 'Residential',
    image: '/img/aurora-tower.webp',
    featured: true,
    year: '2026',
    area: '1.2M sq ft',
    duration: '34 months',
    status: 'In progress',
    progress: 72,
    tieLine: '38 floors of apartments over a three-level retail podium, built with a self-climbing core.',
    services: ['Design and build', 'Structural frame', 'Facade'],
    phases: ['Excavation and piling', 'Basement and podium', 'Core and frame to level 28', 'Facade and fit-out'],
  },
  {
    id: 'riverline-bridge',
    sector: 'infrastructure',
    title: 'Riverline Bridge',
    category: 'Infrastructure',
    image: '/img/riverline-bridge.webp',
    featured: true,
    year: '2025',
    area: '1.4 km span',
    duration: '29 months',
    status: 'Completed',
    tieLine: 'A cable-stayed river crossing that cut the commute between two districts from 50 minutes to 9.',
    services: ['Civil works', 'Marine foundations', 'Cable-stay erection'],
    phases: ['Cofferdams and piers', 'Pylon construction', 'Deck erection', 'Cable stressing and load test'],
  },
  {
    id: 'meridian-business-park',
    sector: 'commercial',
    title: 'Meridian Business Park',
    category: 'Commercial',
    image: '/img/meridian-business-park.webp',
    featured: true,
    year: '2025',
    area: '640,000 sq ft',
    duration: '22 months',
    status: 'Completed',
    tieLine: 'Four office blocks around a landscaped spine, delivered to a green-building rating.',
    services: ['Design and build', 'MEP coordination', 'Landscape'],
    phases: ['Site works', 'Frame and floors', 'Envelope', 'Fit-out and commissioning'],
  },
  {
    id: 'harbor-logistics-hub',
    sector: 'industrial',
    title: 'Harbor Logistics Hub',
    category: 'Industrial',
    image: '/img/harbor-logistics-hub.webp',
    featured: true,
    year: '2026',
    area: '980,000 sq ft',
    duration: '16 months',
    status: 'In progress',
    progress: 58,
    tieLine: 'A cross-dock warehouse with 64 loading bays and a gantry yard, built beside a working port.',
    services: ['Pre-engineered steel', 'Heavy floor slabs', 'Yard paving'],
    phases: ['Ground improvement', 'Slab pours', 'Steel erection', 'Roofing and yard'],
  },
  {
    id: 'lumen-hospital',
    sector: 'commercial',
    title: 'Lumen Hospital',
    category: 'Healthcare',
    image: '/img/lumen-hospital.webp',
    featured: true,
    year: '2024',
    area: '410,000 sq ft',
    duration: '27 months',
    status: 'Completed',
    tieLine: 'A 450-bed hospital built around a live clinic, with zero shutdowns of the existing wards.',
    services: ['Design and build', 'Medical gas and MEP', 'Phased handover'],
    phases: ['Enabling works', 'Frame', 'Services', 'Phased commissioning'],
  },
  {
    id: 'skyline-metro-station',
    sector: 'infrastructure',
    title: 'Skyline Metro Station',
    category: 'Transit',
    image: '/img/skyline-metro-station.webp',
    featured: true,
    year: '2026',
    area: '180,000 sq ft',
    duration: '31 months',
    status: 'In progress',
    progress: 41,
    tieLine: 'An elevated station under a steel arch roof, assembled in the gaps between night-time rail closures.',
    services: ['Steel arch fabrication', 'Viaduct works', 'Platform systems'],
    phases: ['Viaduct piers', 'Arch fabrication', 'Roof lift', 'Platform fit-out'],
  },
  {
    id: 'saffron-villas',
    sector: 'homes',
    title: 'Saffron Villas',
    category: 'Residential',
    image: '/img/saffron-villas.webp',
    featured: false,
    year: '2023',
    area: '86 homes',
    duration: '18 months',
    status: 'Completed',
    tieLine: 'Eighty-six family homes on a former orchard, with every mature tree kept.',
    services: ['Homes', 'Roads and drainage'],
    phases: [],
  },
  {
    id: 'terra-highway-interchange',
    sector: 'infrastructure',
    title: 'Terra Highway Interchange',
    category: 'Infrastructure',
    image: '/img/terra-highway-interchange.webp',
    featured: false,
    year: '2022',
    area: '11 km of ramps',
    duration: '24 months',
    status: 'Completed',
    tieLine: 'A four-level interchange built while traffic kept moving on every road beneath it.',
    services: ['Flyovers', 'Traffic management'],
    phases: [],
  },
  {
    id: 'cedar-court-apartments',
    sector: 'homes',
    title: 'Cedar Court Apartments',
    category: 'Residential',
    image: '/img/cedar-court-apartments.webp',
    featured: false,
    year: '2024',
    area: '312 apartments',
    duration: '20 months',
    status: 'Completed',
    tieLine: 'Two mid-rise blocks with shared courtyards, finished a month ahead of schedule.',
    services: ['Apartments', 'Landscape'],
    phases: [],
  },
  {
    id: 'quarry-road-retail-plaza',
    sector: 'commercial',
    title: 'Quarry Road Retail Plaza',
    category: 'Commercial',
    image: '/img/quarry-road-retail-plaza.webp',
    featured: false,
    year: '2023',
    area: '120,000 sq ft',
    duration: '11 months',
    status: 'Completed',
    tieLine: 'Five shop units under one canopy, open for trading before the monsoon.',
    services: ['Retail shells', 'Car park'],
    phases: [],
  },
  {
    id: 'greenfield-school',
    sector: 'commercial',
    title: 'Greenfield School',
    category: 'Education',
    image: '/img/greenfield-school.webp',
    featured: false,
    year: '2022',
    area: '95,000 sq ft',
    duration: '14 months',
    status: 'Completed',
    tieLine: 'A 1,200-pupil campus built over two summer breaks so term never stopped.',
    services: ['Campus build', 'Sports facilities'],
    phases: [],
  },
];

const byId = (id) => projects.find((p) => p.id === id);

/* Four sectors group the eleven categories, so the portfolio filter stays even */
export const sectors = [
  { id: 'homes', label: 'Homes and apartments' },
  { id: 'commercial', label: 'Commercial and civic' },
  { id: 'infrastructure', label: 'Roads, bridges and transit' },
  { id: 'industrial', label: 'Industrial' },
];
export const sectorLabel = (id) => sectors.find((s) => s.id === id)?.label ?? '';

/* Phase state for a project: every phase is done, or phases up to the current one are done and the next is live */
export function phaseStates(project) {
  const total = project.phases.length;
  if (!total) return [];
  const live = project.status === 'In progress';
  const done = live ? Math.floor((project.progress / 100) * total) : total;
  return project.phases.map((name, i) => ({ name, state: i < done ? 'done' : live && i === done ? 'live' : 'next' }));
}

export const projectById = (id) => projects.find((p) => p.id === id);

/* "What we build": each capability is proven by real projects, and the first one's image follows the cursor */
export const capabilities = [
  {
    title: 'Homes and apartments',
    sector: 'homes',
    desc: 'Villas, mid-rise blocks and towers, built to a fixed price and a fixed handover date.',
    ids: ['aurora-tower', 'saffron-villas', 'cedar-court-apartments'],
  },
  {
    title: 'Commercial and civic',
    sector: 'commercial',
    desc: 'Offices, retail, hospitals and schools, delivered with the services coordinated before the first pour.',
    ids: ['meridian-business-park', 'lumen-hospital', 'quarry-road-retail-plaza', 'greenfield-school'],
  },
  {
    title: 'Roads, bridges and transit',
    sector: 'infrastructure',
    desc: 'Long-span structures and live-traffic works, planned around the people who still need to get through.',
    ids: ['riverline-bridge', 'terra-highway-interchange', 'skyline-metro-station'],
  },
  {
    title: 'Warehouses and industrial',
    sector: 'industrial',
    desc: 'Heavy slabs, steel frames and yards that carry real loads from the first day of operation.',
    ids: ['harbor-logistics-hub'],
  },
].map((cap) => {
  const list = cap.ids.map(byId).filter(Boolean);
  return { ...cap, image: list[0]?.image, built: list.map((p) => p.title) };
});

export const process = [
  {
    n: '01',
    title: 'Survey',
    desc: 'We walk the site, test the soil and agree what can be built, in writing.',
    duration: '1 to 2 weeks',
    deliverables: ['Soil and boundary survey', 'Feasibility note in writing', 'Fixed-scope proposal'],
    signoff: 'Scope and site conditions',
    tint: '#ffb020',
  },
  {
    n: '02',
    title: 'Design',
    desc: 'Drawings, costs and a programme you can hold us to, before any ground is broken.',
    duration: '3 to 6 weeks',
    deliverables: ['Architectural and structural drawings', 'Itemised cost plan', 'Programme with a handover date'],
    signoff: 'Drawings, price and handover date',
    tint: '#ff6a1a',
  },
  {
    n: '03',
    title: 'Build',
    desc: 'One site manager, a weekly photo report and an inspection sign-off on every pour.',
    duration: 'To the programme',
    deliverables: ['One named site manager', 'Weekly photo report', 'Inspection sign-off on every pour'],
    signoff: 'Each stage, before the next begins',
    tint: '#78aae6',
  },
  {
    n: '04',
    title: 'Handover',
    desc: 'A walk-through, a snag list closed in 14 days, and a five-year defects warranty.',
    duration: '14-day snag close',
    deliverables: ['Joint walk-through', 'Snag list closed in 14 days', 'Five-year defects warranty'],
    signoff: 'Completion and warranty',
    tint: '#e9eef2',
  },
];

export const milestones = [
  { year: '2008', title: 'Founded with one crew', text: 'Two engineers and a crew of nine start building boundary walls and small homes.' },
  { year: '2012', title: 'First tower', text: 'A 14-storey residential block, finished in 19 months.' },
  { year: '2016', title: 'Infrastructure division', text: 'Our first road contract: 9 km of rural highway, handed over early.' },
  { year: '2020', title: 'In-house design office', text: 'Architects and structural engineers join, so design and build sit under one roof.' },
  { year: '2024', title: 'Hospital and bridge', text: 'Lumen Hospital opens, and Riverline Bridge begins its load test.' },
];

export const methods = [
  'Reinforced concrete',
  'Structural steel',
  'Precast panels',
  'Timber frame',
  'Self-climbing cores',
  'Post-tensioned slabs',
  'Piling and ground improvement',
  'BIM coordination',
  'Drone surveys',
  'Weekly photo reports',
];

export const commitments = [
  { title: 'We name the date', text: 'Every contract carries a handover date, and a clause that pays you when we miss it.' },
  { title: 'We show our work', text: 'You get a photo report each week and an open invitation to walk the site.' },
  { title: 'We stay after handover', text: 'A five-year defects warranty, answered by the same people who built the place.' },
];

export const quoteTypes = ['Home or apartments', 'Office or retail', 'Road or bridge', 'Warehouse', 'Something else'];
