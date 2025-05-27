export interface LearningCenter {
  id: string;
  name: string;
  address: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  district: string;
  node: string;
}

export const DISTRICTS = [
  'Pune',
  'Ahilyanagar',
  'Nashik'
];

export const LEARNING_CENTERS: LearningCenter[] = [
  {
    id: '1',
    name: 'Anantrao Pawar College of Engineering and Research (APCOER)',
    address: 'S. No. 103, Shahu College Road, Laxminagar, Parvati, Pune - 411009, Maharashtra, India',
    coordinates: {
      latitude: 18.49071249,
      longitude: 73.84341068
    },
    contact: {
      website: ''
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '2',
    name: 'Zeal College of Engineering and Research',
    address: 'Survey No. 39, Narhe-Dhayari Road, Narhe, Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.44878871,
      longitude: 73.82619246
    },
    contact: {
      website: ''
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '3',
    name: 'Sinhgad Institute of Technology and Science (SITS)',
    address: '49/1, Off Mumbai-Bangalore Bypass, Narhe, Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.45550961,
      longitude: 73.81808747
    },
    contact: {
      website: 'https://cms.sinhgad.edu/sinhgad_engineering_institutes/sits_narhetechnicalcampus/sits_nt_aboutus.aspx'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '4',
    name: 'Smt. Kashibai Navale College of Engineering (SKNCOE)',
    address: 'Survey No. 44/1, Off Sinhgad Road, Vadgaon (Bk), Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.46656276,
      longitude: 73.83660128
    },
    contact: {
      website: ''
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '5',
    name: 'Smt. Kashibai Navale College of Pharmacy (SKNCOP)',
    address: 'S. No. 40/4 A, Kondhwa-Saswad Road, Kondhwa (Bk), Pune - 411048, Maharashtra, India',
    coordinates: {
      latitude: 18.44139328,
      longitude: 73.8956553
    },
    contact: {
      website: ''
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '6',
    name: 'Bhivarabai Sawant Institute of Technology and Research (BSIOTR)',
    address: 'Gate No. 720/2, Nagar Road, Wagholi, Pune - 412207, Maharashtra, India',
    coordinates: {
      latitude: 18.58648448,
      longitude: 74.00456576
    },
    contact: {
      website: 'https://jspmbsiotr.edu.in/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '7',
    name: 'Jayawantrao Sawant College of Engineering (JSCOE)',
    address: 'Survey No. 58, Indrayani Nagar, Handewadi Road, Hadapsar, Pune - 411028, Maharashtra, India',
    coordinates: {
      latitude: 18.47283584,
      longitude: 73.93618804
    },
    contact: {
      website: ''
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '8',
    name: 'PES Modern College of Engineering (PESMCOE)',
    address: '1186/A, Off J.M. Road, Shivajinagar, Pune - 411005, Maharashtra, India',
    coordinates: {
      latitude: 18.52636095,
      longitude: 73.84700395
    },
    contact: {
      website: 'https://moderncoe.edu.in/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '9',
    name: 'Sanjivani College of Engineering (SRES)',
    address: 'Sahajanand Nagar, Kopargaon, Ahmednagar - 423603, Maharashtra, India',
    coordinates: {
      latitude: 19.90049466,
      longitude: 74.49490303
    },
    contact: {
      website: 'http://sanjivanicoe.org.in/'
    },
    district: 'Ahilyanagar',
    node: 'Kopargaon'
  },
  {
    id: '10',
    name: 'Pravara Rural Engineering College (PREC)',
    address: 'Loni, Tal: Rahata, Dist: Ahmednagar - 413736, Maharashtra, India',
    coordinates: {
      latitude: 19.57724596,
      longitude: 74.44555738
    },
    contact: {
      website: 'http://www.pravaraengg.org.in/'
    },
    district: 'Ahilyanagar',
    node: 'Loni'
  },
  {
    id: '11',
    name: 'Amrutvahini College of Engineering (AVCOE)',
    address: 'Near, Pune - Nashik Hwy, Sangamner, Ghulewadi, Maharashtra 422608',
    coordinates: {
      latitude: 19.61411904,
      longitude: 74.18549411
    },
    contact: {
      website: 'http://www.avcoe.org/'
    },
    district: 'Ahilyanagar',
    node: 'Sangamner'
  },
  {
    id: '12',
    name: 'NBN Sinhgad School of Engineering',
    address: 'S. No. 10/1, Ambegaon (Bk.), Off Sinhgad Road, Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.46269659,
      longitude: 73.8359352
    },
    contact: {
      website: 'http://nbnstic.sinhgad.edu/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '13',
    name: 'Ajeenkya DY Patil University (ADYPU)',
    address: 'DY Patil Knowledge City, Charholi Bk. Via Lohgaon, Pune - 412105, Maharashtra, India',
    coordinates: {
      latitude: 18.62291049,
      longitude: 73.91168855
    },
    contact: {
      website: 'https://adypu.edu.in/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '14',
    name: 'Sinhgad College of Engineering (SCOE)',
    address: 'Survey No. 44/1, Vadgaon (Bk), Off Sinhgad Road, Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.46797718,
      longitude: 73.83715951
    },
    contact: {
      website: 'http://www.sinhgad.edu/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '15',
    name: 'Sandeep Institute of Engineering and Management (SIEM)',
    address: 'Trimbak Road, Mahiravani, Nashik - 422213, Maharashtra, India',
    coordinates: {
      latitude: 19.96187807,
      longitude: 73.66866899
    },
    contact: {
      website: 'https://siem.sandipfoundation.org/'
    },
    district: 'Nashik',
    node: 'Nashik'
  },
  {
    id: '16',
    name: 'MET\'s Institute of Engineering, Bhujbal Knowledge City',
    address: 'Bhujbal Knowledge City, Adgaon, Nashik - 422003, Maharashtra, India',
    coordinates: {
      latitude: 20.0414915,
      longitude: 73.85056513
    },
    contact: {
      website: 'http://www.metbhujbalknowledgecity.ac.in/'
    },
    district: 'Nashik',
    node: 'Nashik'
  },
  {
    id: '17',
    name: 'Gokhale Education Society\'s Sir Dr. M.S. Gosavi Polytechnic Institute',
    address: 'Prin. T.A. Kulkarni Vidyanagar, College Road, Nashik - 422005, Maharashtra, India',
    coordinates: {
      latitude: 19.95693194,
      longitude: 73.829906
    },
    contact: {
      website: 'http://www.gespoly.org/'
    },
    district: 'Nashik',
    node: 'Nashik'
  },
  {
    id: '18',
    name: 'Pimpri Chinchwad College of Engineering and Research (PCCOER)',
    address: 'Plot No. B, Sector No. 110, Gate No.1, Laxminagar, Ravet, Haveli, Pune - 412101, Maharashtra, India',
    coordinates: {
      latitude: 18.65051145,
      longitude: 73.74538316
    },
    contact: {
      website: 'https://www.pccoer.com/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '19',
    name: 'Dhole Patil College of Engineering',
    address: '1284, Ubale Nagar, Wagholi, Pune - 412207, Maharashtra, India',
    coordinates: {
      latitude: 18.5550431,
      longitude: 73.96178717
    },
    contact: {
      website: 'https://dpcoepune.edu.in/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '20',
    name: 'Shri Ramchandra College of Engineering',
    address: 'Gate No. 351/333-1, Pune-Nagar Road, Bakori Phata, Wagholi, Pune - 412216, Maharashtra, India',
    coordinates: {
      latitude: 18.59832879,
      longitude: 74.02118948
    },
    contact: {
      website: 'http://www.srespune.org/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '21',
    name: 'Rani Laxmibai Girls\' Military School',
    address: 'Gut No.80 K, Kasaramboli, Post-Pirangut, Mulshi, Pune - 412115, Maharashtra, India',
    coordinates: {
      latitude: 18.51762382,
      longitude: 73.66286962
    },
    contact: {
      website: 'https://rlmss.mespune.in/'
    },
    district: 'Pune',
    node: 'Pune'
  },
  {
    id: '22',
    name: 'Nashik District Maratha Vidya Prasarak Samaj\'s College of Engineering',
    address: 'Udoji Maratha Boarding Campus, Near Pumping Station, Gangapur Road, Nashik - 422013, Maharashtra, India',
    coordinates: {
      latitude: 20.01522224,
      longitude: 73.76609081
    },
    contact: {
      website: 'https://rsmpoly.org/'
    },
    district: 'Nashik',
    node: 'Nashik'
  },
  {
    id: '23',
    name: 'Matoshri College of Engineering and Research Centre',
    address: 'Eklahareshivar, Near Odhagaon, Opp. Nashik-Aurangabad Highway, Nashik - 422105, Maharashtra, India',
    coordinates: {
      latitude: 19.99043217,
      longitude: 73.91092414
    },
    contact: {
      website: 'https://engg.matoshri.edu.in/'
    },
    district: 'Nashik',
    node: 'Nashik'
  },
  {
    id: '24',
    name: 'Smt. Kashibai Navale College of Architecture',
    address: 'S.No. 10/Part, Ambegaon (Bk), Pune - 411041, Maharashtra, India',
    coordinates: {
      latitude: 18.4641887,
      longitude: 73.83664631
    },
    contact: {
      website: 'http://www.sinhgad.edu/sinhgadInstitutes-2013/Inner-pages/SinhgadInstitutes_SKNCOA.html'
    },
    district: 'Pune',
    node: 'Pune'
  }
];

// Default export for the learning centers data
const learningCentersData = {
  DISTRICTS,
  LEARNING_CENTERS
};

export default learningCentersData; 