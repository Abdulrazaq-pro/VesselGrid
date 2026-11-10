export const vessels = [
  { id: 'V-2041', name: 'MV Atlantic Dawn', type: 'Container', loa: 294, draft: 12.8, line: 'Meridian Lines', declared: '11 Nov 06:00', predicted: '11 Nov 09:40', berth: 'B1', status: 'At anchorage', confidence: 91, cargo: '2,140 TEU discharge' },
  { id: 'V-2042', name: 'Kota Bahari', type: 'Container', loa: 260, draft: 11.9, line: 'Straits Feeder Co.', declared: '11 Nov 08:00', predicted: '11 Nov 07:15', berth: 'B3', status: 'Inbound', confidence: 88, cargo: '1,310 TEU mixed' },
  { id: 'V-2043', name: 'Grande Tema', type: 'Ro-Ro', loa: 214, draft: 9.4, line: 'Gulf Ro-Ro', declared: '11 Nov 14:00', predicted: '11 Nov 16:30', berth: 'B4', status: 'Inbound', confidence: 79, cargo: '1,800 vehicles' },
  { id: 'V-2044', name: 'CMA Benin', type: 'Container', loa: 300, draft: 13.5, line: 'Meridian Lines', declared: '11 Nov 18:00', predicted: '11 Nov 18:20', berth: 'B2', status: 'Inbound', confidence: 93, cargo: '2,600 TEU discharge' },
  { id: 'V-2045', name: 'Delta Spirit', type: 'Tanker', loa: 183, draft: 10.1, line: 'Coastal Energy', declared: '12 Nov 02:00', predicted: '12 Nov 05:50', berth: 'Unassigned', status: 'Conflict', confidence: 72, cargo: 'Clean petroleum products' },
  { id: 'V-2046', name: 'ONE Crown', type: 'Container', loa: 336, draft: 14.2, line: 'Oceanic Network', declared: '12 Nov 07:00', predicted: '12 Nov 07:30', berth: 'B1', status: 'Scheduled', confidence: 86, cargo: '3,050 TEU discharge' },
  { id: 'V-2047', name: 'Bight Trader', type: 'General cargo', loa: 145, draft: 8.2, line: 'West Coast Shipping', declared: '12 Nov 10:00', predicted: '12 Nov 09:10', berth: 'B3', status: 'Scheduled', confidence: 84, cargo: 'Steel coils' },
  { id: 'V-2048', name: 'MSC Lagos', type: 'Container', loa: 299, draft: 13.1, line: 'Oceanic Network', declared: '12 Nov 15:00', predicted: '12 Nov 21:40', berth: 'B2', status: 'Delayed', confidence: 68, cargo: '2,450 TEU discharge' },
]

// berth gantt: start hour (0 = 11 Nov 00:00), duration hours
export const gantt = [
  { berth: 'B1', items: [{ v: 'Atlantic Dawn', s: 9, d: 22, c: 'signal' }, { v: 'ONE Crown', s: 33, d: 14, c: 'ink' }] },
  { berth: 'B2', items: [{ v: 'CMA Benin', s: 18, d: 20, c: 'sea' }, { v: 'MSC Lagos', s: 45, d: 3, c: 'warn' }] },
  { berth: 'B3', items: [{ v: 'Kota Bahari', s: 7, d: 16, c: 'ink' }, { v: 'Bight Trader', s: 33, d: 11, c: 'sea' }] },
  { berth: 'B4', items: [{ v: 'Grande Tema', s: 16, d: 12, c: 'sea' }] },
]

export const dispatch = [
  { id: 'D-118', vessel: 'Kota Bahari', job: 'Pilot boarding', when: '11 Nov 06:30', crew: 'Pilot A. Okafor', tugs: '—', state: 'Confirmed' },
  { id: 'D-119', vessel: 'Kota Bahari', job: 'Berthing, 2 tugs', when: '11 Nov 07:10', crew: 'Tug Kiri, Tug Osun', tugs: '2', state: 'Confirmed' },
  { id: 'D-120', vessel: 'MV Atlantic Dawn', job: 'Berthing, 3 tugs', when: '11 Nov 09:30', crew: 'Tug Kiri, Tug Ogun, Tug Niger', tugs: '3', state: 'Proposed' },
  { id: 'D-121', vessel: 'Grande Tema', job: 'Pilot boarding', when: '11 Nov 15:50', crew: 'Pilot S. Bello', tugs: '—', state: 'Proposed' },
  { id: 'D-122', vessel: 'CMA Benin', job: 'Berthing, 3 tugs', when: '11 Nov 18:10', crew: 'Awaiting tide window', tugs: '3', state: 'Needs review' },
]

export const exceptions = [
  { id: 'X-07', title: 'Delta Spirit has no compatible berth before 12 Nov 14:00', fix: 'Move Bight Trader to B4 after Grande Tema departs; assign Delta Spirit to B3 at 06:30.', reason: 'B3 is the only berth with tanker manifold access; Bight Trader has no special requirements.' },
  { id: 'X-08', title: 'MSC Lagos predicted 6h40m later than declared', fix: 'Hold B2 window, move crane gang 3 to B1 for ONE Crown from 12 Nov 15:00.', reason: 'Speed over ground dropped to 9.2 kn with head seas in the forecast for the next 18 hours.' },
  { id: 'X-09', title: 'CMA Benin berthing clashes with low water', fix: 'Shift berthing to 19:40 high-water window and notify pilots and tug crews.', reason: 'Draft 13.5 m exceeds channel depth less safety margin at 18:10.' },
]

export const activity = [
  ['06:42', 'ETA updated', 'Kota Bahari now 45 min early; B3 window brought forward.'],
  ['06:20', 'Weather', 'Swell 2.1 m forecast at the fairway from 14:00.'],
  ['05:58', 'Dispatch', 'Pilot boarding for Kota Bahari confirmed.'],
  ['05:31', 'Conflict', 'Delta Spirit unassigned: no tanker berth free on arrival.'],
  ['04:10', 'Report', 'Night-shift handover summary generated.'],
]
