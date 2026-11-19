export interface OroquietaSchool {
  id: string;
  name: string;
  shortName: string;
  barangay: string;
  defaultAddress: string;
  coordinates: { lat: number; lng: number };
}

export const OROQUIETA_CITY_SCHOOLS: OroquietaSchool[] = [
  {
    id: 'ustp-oroquieta',
    name: 'USTP Oroquieta Campus',
    shortName: 'USTP Oroquieta',
    barangay: 'Mobod',
    defaultAddress: 'Purok 2, Brgy. Mobod, Oroquieta City',
    coordinates: { lat: 8.4895, lng: 123.8038 },
  },
  {
    id: 'sjc-oroquieta',
    name: 'Saint Joseph College (SJC) - Oroquieta City',
    shortName: 'Saint Joseph College (SJC)',
    barangay: 'Canubay',
    defaultAddress: 'National Highway, Brgy. Canubay, Oroquieta City',
    coordinates: { lat: 8.484, lng: 123.801 },
  },
  {
    id: 'scc-oroquieta',
    name: 'Southern Capital Colleges (SCC)',
    shortName: 'Southern Capital Colleges',
    barangay: 'Poblacion',
    defaultAddress: 'Washington St., Brgy. Poblacion, Oroquieta City',
    coordinates: { lat: 8.4855, lng: 123.807 },
  },
  {
    id: 'moit-oroquieta',
    name: 'Misamis Occidental Institute of Technology (MOIT)',
    shortName: 'MOIT Oroquieta',
    barangay: 'Lower Langcangan',
    defaultAddress: 'Purok 3, Brgy. Lower Langcangan, Oroquieta City',
    coordinates: { lat: 8.4875, lng: 123.805 },
  },
  {
    id: 'oais-oroquieta',
    name: 'Oroquieta Agro-Industrial School (OAIS / TESDA)',
    shortName: 'OAIS / TESDA',
    barangay: 'Villaflor',
    defaultAddress: 'Purok 1, Brgy. Villaflor, Oroquieta City',
    coordinates: { lat: 8.495, lng: 123.798 },
  },
  {
    id: 'smc-oroquieta',
    name: 'Stella Maris College (SMC) - Oroquieta City',
    shortName: 'Stella Maris College',
    barangay: 'Poblacion',
    defaultAddress: 'Burgos St., Brgy. Poblacion, Oroquieta City',
    coordinates: { lat: 8.486, lng: 123.8065 },
  },
  {
    id: 'monhs-oroquieta',
    name: 'Misamis Occidental National High School (MONHS)',
    shortName: 'MONHS',
    barangay: 'Poblacion 1',
    defaultAddress: 'Capitol Drive, Brgy. Poblacion 1, Oroquieta City',
    coordinates: { lat: 8.4868, lng: 123.8052 },
  },
  {
    id: 'ocnhs-oroquieta',
    name: 'Oroquieta City National High School (OCNHS)',
    shortName: 'Oroquieta City NHS',
    barangay: 'Mobod',
    defaultAddress: 'National Highway, Brgy. Mobod, Oroquieta City',
    coordinates: { lat: 8.491, lng: 123.8025 },
  },
  {
    id: 'mobod-is',
    name: 'Mobod Integrated School',
    shortName: 'Mobod Integrated School',
    barangay: 'Mobod',
    defaultAddress: 'Purok 4, Brgy. Mobod, Oroquieta City',
    coordinates: { lat: 8.4902, lng: 123.8042 },
  },
  {
    id: 'talic-nhs',
    name: 'Talic National High School',
    shortName: 'Talic NHS',
    barangay: 'Talic',
    defaultAddress: 'Purok 2, Brgy. Talic, Oroquieta City',
    coordinates: { lat: 8.492, lng: 123.8005 },
  },
  {
    id: 'rizal-nhs',
    name: 'Rizal National High School (Oroquieta)',
    shortName: 'Rizal NHS',
    barangay: 'Rizal',
    defaultAddress: 'Brgy. Rizal, Oroquieta City',
    coordinates: { lat: 8.4775, lng: 123.796 },
  },
  {
    id: 'bunga-nhs',
    name: 'Bunga National High School (Oroquieta)',
    shortName: 'Bunga NHS',
    barangay: 'Bunga',
    defaultAddress: 'Brgy. Bunga, Oroquieta City',
    coordinates: { lat: 8.472, lng: 123.792 },
  },
  {
    id: 'senote-nhs',
    name: 'Senote National High School (Oroquieta)',
    shortName: 'Senote NHS',
    barangay: 'Senote',
    defaultAddress: 'Brgy. Senote, Oroquieta City',
    coordinates: { lat: 8.482, lng: 123.788 },
  },
];
