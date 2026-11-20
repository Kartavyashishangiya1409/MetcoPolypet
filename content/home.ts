export const story = [
  {
    n: '01',
    layout: 'macro',
    pf: '28,98,clear',
    title: 'Neck finishes held to tolerance.',
    spec: 'Thread profile, support ring and sealing surface checked every shift against the closure specification.',
  },
  {
    n: '02',
    layout: 'trio',
    pf: '28,72,clear;28,84,blue;28,98,blue',
    title: 'From 9.5 g to 18 g.',
    spec: 'From 200 ml up to 1-litre water bottle preforms, each on its own dedicated mould.',
  },
  {
    n: '03',
    layout: 'tilt',
    pf: '28,110,clear',
    title: 'Clarity you can see through.',
    spec: 'Virgin food-grade PET, dried before moulding to prevent haze and acetaldehyde build-up.',
  },
  // [capacity] is a placeholder — see TODO.md
  {
    n: '04',
    layout: 'pile',
    pf: '30,90,blue',
    title: 'Consistency at volume.',
    spec: 'Hot-runner multi-cavity moulds producing [capacity] preforms per day.',
  },
] as const;

export const necks = [
  {
    id: '1881',
    pf: '28,98,clear',
    name: '28 mm PCO 1881',
    range: '9.5 – 25 g',
  },
  {
    id: '1810',
    pf: '28,116,green',
    name: '28 mm PCO 1810',
    range: '21 – 42 g',
  },
  {
    id: '3025',
    pf: '30,90,blue',
    name: '29/25 · 30/25',
    range: '8 – 19 g',
  },
];

export const industries = [
  {
    n: '01',
    id: 'water',
    pf: '30,90,blue',
    name: 'Packaged drinking water',
    necks: '29/25 · 30/25 · PCO 1881',
  },
  {
    n: '02',
    id: 'csd',
    pf: '28,116,green',
    name: 'Carbonated soft drinks',
    necks: 'PCO 1810 · PCO 1881',
  },
  { n: '03', id: 'juice', pf: '38,96,white', name: 'Juices & dairy', necks: '38 mm 3-start' },
];

export const processSteps = [
  {
    n: '01',
    name: 'Resin drying',
    text: 'PET chips are dried to low moisture before they reach the barrel.',
  },
  {
    n: '02',
    name: 'Injection moulding',
    text: 'Hot-runner moulds form each preform to the set weight and wall.',
  },
  {
    n: '03',
    name: 'Controlled cooling',
    text: 'Post-mould cooling keeps preforms clear and dimensionally stable.',
  },
  {
    n: '04',
    name: 'Inspection',
    text: 'Weight, neck dimensions and visual defects are checked in the QC lab.',
  },
  {
    n: '05',
    name: 'Packing',
    text: 'Packed in lined cartons or octabins, labelled by batch and shift.',
  },
];

/** Client logo slots — client to supply monochrome logos (see TODO.md) */
