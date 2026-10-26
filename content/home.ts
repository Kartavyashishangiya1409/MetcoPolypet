export const story = [
  { n: '01', layout: 'macro', pf: '28,98,clear', title: 'Neck finishes held to tolerance.', spec: 'Thread profile, support ring and sealing surface checked every shift against the closure specification.' },
  { n: '02', layout: 'trio', pf: '20,64,amber;28,116,green;48,150,clear', title: 'From 6 g to 85 g.', spec: 'Light water preforms through heavy edible-oil and jar preforms, on dedicated moulds.' },
  { n: '03', layout: 'tilt', pf: '28,110,clear', title: 'Clarity you can see through.', spec: 'Virgin food-grade PET, dried before moulding to prevent haze and acetaldehyde build-up.' },
  // [capacity] is a placeholder — see TODO.md
  { n: '04', layout: 'pile', pf: '30,90,blue', title: 'Consistency at volume.', spec: 'Hot-runner multi-cavity moulds producing [capacity] preforms per day.' },
] as const;

export const necks = [
  { id: '1881', pf: '28,98,clear', name: '28 mm PCO 1881', range: '9.5 – 25 g', app: 'Water · CSD' },
  { id: '1810', pf: '28,116,green', name: '28 mm PCO 1810', range: '21 – 42 g', app: 'Carbonated soft drinks' },
  { id: '3025', pf: '30,90,blue', name: '29/25 · 30/25', range: '8 – 19 g', app: 'Packaged drinking water' },
  { id: '38', pf: '38,96,white', name: '38 mm 3-start', range: '22 – 42 g', app: 'Juice · Dairy' },
  { id: '46', pf: '46,112,amber', name: '46 · 48 mm', range: '38 – 85 g', app: 'Edible oil' },
  { id: '63', pf: '63,78,clear', name: '53 – 63 mm', range: '30 – 75 g', app: 'Wide-mouth jars' },
  { id: '20', pf: '20,64,amber', name: '20 · 24 mm', range: '6 – 18 g', app: 'Pharma · Personal care' },
];

export const industries = [
  { n: '01', id: 'water', pf: '30,90,blue', name: 'Packaged drinking water', necks: '29/25 · 30/25 · PCO 1881' },
  { n: '02', id: 'csd', pf: '28,116,green', name: 'Carbonated soft drinks', necks: 'PCO 1810 · PCO 1881' },
  { n: '03', id: 'juice', pf: '38,96,white', name: 'Juices & dairy', necks: '38 mm 3-start' },
  { n: '04', id: 'oil', pf: '48,150,amber', name: 'Edible oil', necks: '46 mm · 48 mm' },
  { n: '05', id: 'pharma', pf: '20,64,amber', name: 'Pharmaceuticals', necks: '20/410 · 24/410' },
  { n: '06', id: 'care', pf: '24,82,white', name: 'Personal & home care', necks: '24/410 · 28/410' },
];

export const processSteps = [
  { n: '01', name: 'Resin drying', text: 'PET chips are dried to low moisture before they reach the barrel.' },
  { n: '02', name: 'Injection moulding', text: 'Hot-runner moulds form each preform to the set weight and wall.' },
  { n: '03', name: 'Controlled cooling', text: 'Post-mould cooling keeps preforms clear and dimensionally stable.' },
  { n: '04', name: 'Inspection', text: 'Weight, neck dimensions and visual defects are checked in the QC lab.' },
  { n: '05', name: 'Packing', text: 'Packed in lined cartons or octabins, labelled by batch and shift.' },
];

/** Client logo slots — client to supply monochrome logos (see TODO.md) */
export const clientLogos = ['a', 'b', 'c', 'd', 'e'];
