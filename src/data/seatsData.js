const STATE_CONFIGS = [
  { state: 'Uttar Pradesh', count: 80, cities: ['Varanasi', 'Amethi', 'Rae Bareli', 'Lucknow', 'Gorakhpur', 'Agra', 'Kanpur', 'Prayagraj', 'Ghaziabad', 'Gautam Buddha Nagar', 'Mathura', 'Ayodhya', 'Meerut', 'Aligarh', 'Bareilly', 'Moradabad', 'Saharanpur', 'Jhansi', 'Muzaffarnagar', 'Ballia', 'Azamgarh', 'Deoria', 'Jaunpur', 'Mirzapur', 'Ghazipur', 'Faizabad', 'Badaun', 'Mainpuri', 'Etawah', 'Rampur'] },
  { state: 'Maharashtra', count: 48, cities: ['Mumbai South', 'Mumbai North', 'Mumbai North West', 'Mumbai North East', 'Mumbai South Central', 'Mumbai North Central', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Baramati', 'Aurangabad', 'Satara', 'Kolhapur', 'Nanded', 'Solapur', 'Amravati', 'Latur', 'Sangli', 'Jalgaon', 'Ahmednagar', 'Ratnagiri-Sindhudurg'] },
  { state: 'West Bengal', count: 42, cities: ['Kolkata Uttar', 'Kolkata Dakshin', 'Diamond Harbour', 'Asansol', 'Darjeeling', 'Howrah', 'Barrackpore', 'Tamluk', 'Murshidabad', 'Malda Uttar', 'Malda Dakshin', 'Baharampur', 'Hooghly', 'Durgapur', 'Ranaghat', 'Krishnanagar', 'Bishnupur', 'Bankura', 'Medinipur'] },
  { state: 'Bihar', count: 40, cities: ['Patna Sahib', 'Pataliputra', 'Begusarai', 'Gaya', 'Hajipur', 'Muzaffarpur', 'Darbhanga', 'Saran', 'Purnia', 'Bhagalpur', 'Munger', 'Nalanda', 'Nawada', 'Jamui', 'Ujiarpur', 'Samastipur', 'Katihar', 'Arrah', 'Buxar', 'Kishanganj'] },
  { state: 'Tamil Nadu', count: 39, cities: ['Chennai South', 'Chennai Central', 'Chennai North', 'Coimbatore', 'Madurai', 'Salem', 'Thanjavur', 'Sivaganga', 'Nilgiris', 'Kanyakumari', 'Trichy', 'Erode', 'Tiruppur', 'Vellore', 'Dharmapuri', 'Theni', 'Tuticorin', 'Ramnathapuram'] },
  { state: 'Madhya Pradesh', count: 29, cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Chhindwara', 'Ujjain', 'Rewa', 'Sagar', 'Vidisha', 'Satna', 'Khajuraho', 'Ratlam', 'Mandsaur', 'Damoh', 'Morena', 'Hoshangabad'] },
  { state: 'Karnataka', count: 28, cities: ['Bangalore South', 'Bangalore Central', 'Bangalore North', 'Bangalore Rural', 'Mysore', 'Dharwad', 'Dakshina Kannada', 'Shimoga', 'Belgaum', 'Mandya', 'Gulbarga', 'Hassan', 'Bellary', 'Chikballapur', 'Udupi Chikmagalur'] },
  { state: 'Gujarat', count: 26, cities: ['Gandhinagar', 'Ahmedabad East', 'Ahmedabad West', 'Surat', 'Vadodara', 'Rajkot', 'Amreli', 'Bhavnagar', 'Porbandar', 'Kutch', 'Anand', 'Mehsana', 'Jamnagar', 'Navsari', 'Bharuch', 'Patan'] },
  { state: 'Rajasthan', count: 25, cities: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Barmer', 'Alwar', 'Ajmer', 'Churu', 'Chittorgarh', 'Nagaur', 'Sikar', 'Pali', 'Banswara', 'Bharatpur', 'Jhalawar-Baran'] },
  { state: 'Andhra Pradesh', count: 25, cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kadapa', 'Nellore', 'Rajahmundry', 'Kakinada', 'Anantapur', 'Kurnool', 'Eluru', 'Ongole', 'Srikakulam', 'Chittoor', 'Narsapuram'] },
  { state: 'Odisha', count: 21, cities: ['Bhubaneswar', 'Cuttack', 'Puri', 'Sambalpur', 'Balasore', 'Berhampur', 'Koraput', 'Sundargarh', 'Kendrapara', 'Mayurbhanj', 'Dhenkanal', 'Bhadrak', 'Jajpur', 'Bolangir', 'Kalahandi'] },
  { state: 'Kerala', count: 20, cities: ['Wayanad', 'Thiruvananthapuram', 'Thrissur', 'Ernakulam', 'Kozhikode', 'Malappuram', 'Kollam', 'Palakkad', 'Kannur', 'Kasaragod', 'Alappuzha', 'Patanamthitta', 'Idukki', 'Vatakara', 'Chalakudy'] },
  { state: 'Telangana', count: 17, cities: ['Hyderabad', 'Secunderabad', 'Malkajgiri', 'Karimnagar', 'Nizamabad', 'Warangal', 'Khammam', 'Medak', 'Chevella', 'Mahabubnagar', 'Nalgonda', 'Peddapalle', 'Mahabubabad', 'Zahirabad'] },
  { state: 'Assam', count: 14, cities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Barpeta', 'Tezpur', 'Lakhimpur', 'Dhubri', 'Kokrajhar', 'Kaziranga', 'Sonitpur', 'Darrang-Udalguri'] },
  { state: 'Jharkhand', count: 14, cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Hazaribagh', 'Dumka', 'Giridih', 'Singhbhum', 'Palamu', 'Kodarma', 'Khunti', 'Chatra', 'Lohardaga', 'Godda', 'Rajmahal'] },
  { state: 'Punjab', count: 13, cities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Gurdaspur', 'Anandpur Sahib', 'Faridkot', 'Khadoor Sahib', 'Sangrur', 'Hoshiarpur', 'Ferozepur', 'Fatehgarh Sahib'] },
  { state: 'Chhattisgarh', count: 11, cities: ['Raipur', 'Bilaspur', 'Durg', 'Bastar', 'Korba', 'Rajnandgaon', 'Surguja', 'Janjgir-Champa', 'Mahasamund', 'Raigarh', 'Kanker'] },
  { state: 'Haryana', count: 10, cities: ['Gurugram', 'Faridabad', 'Rohtak', 'Ambala', 'Hisar', 'Karnal', 'Sonipat', 'Sirsa', 'Kurukshetra', 'Bhiwani-Mahendragarh'] },
  { state: 'Delhi', count: 7, cities: ['New Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'Chandni Chowk'] },
  { state: 'Jammu and Kashmir', count: 5, cities: ['Srinagar', 'Jammu', 'Anantnag-Rajouri', 'Baramulla', 'Udhampur'] },
  { state: 'Uttarakhand', count: 5, cities: ['Haridwar', 'Tehri Garhwal', 'Almora', 'Garhwal', 'Nainital-Udhamsingh Nagar'] },
  { state: 'Himachal Pradesh', count: 4, cities: ['Mandi', 'Shimla', 'Hamirpur', 'Kangra'] },
  { state: 'Tripura', count: 2, cities: ['Tripura West', 'Tripura East'] },
  { state: 'Meghalaya', count: 2, cities: ['Shillong', 'Tura'] },
  { state: 'Manipur', count: 2, cities: ['Inner Manipur', 'Outer Manipur'] },
  { state: 'Goa', count: 2, cities: ['North Goa', 'South Goa'] },
  { state: 'Arunachal Pradesh', count: 2, cities: ['Arunachal West', 'Arunachal East'] },
  { state: 'Puducherry', count: 1, cities: ['Puducherry'] },
  { state: 'Chandigarh', count: 1, cities: ['Chandigarh'] },
  { state: 'Andaman & Nicobar Islands', count: 1, cities: ['Andaman and Nicobar'] },
  { state: 'Dadra and Nagar Haveli & Daman and Diu', count: 2, cities: ['Dadra and Nagar Haveli', 'Daman and Diu'] },
  { state: 'Ladakh', count: 1, cities: ['Ladakh'] },
  { state: 'Lakshadweep', count: 1, cities: ['Lakshadweep'] },
  { state: 'Mizoram', count: 1, cities: ['Mizoram'] },
  { state: 'Nagaland', count: 1, cities: ['Nagaland'] },
  { state: 'Sikkim', count: 1, cities: ['Sikkim'] },
];

const ISSUES = [
  'Youth Unemployment & Skills',
  'Farmer MSP & Loan Relief',
  'Urban Infrastructure & Metro',
  'Inflation & Gas Prices',
  'Caste Census & Reservations',
  'Industrial & Tech Investment',
  'Healthcare Infrastructure',
  'Law and Order & Crime Rate',
  'Tourism & Cultural Heritage',
  'Clean Water & Sanitation',
];

export const generate543Seats = () => {
  const seats = [];
  let seatId = 1;

  STATE_CONFIGS.forEach((config) => {
    for (let i = 0; i < config.count; i++) {
      const cityName = config.cities[i % config.cities.length];
      const constituencyName = config.count > config.cities.length ? `${cityName} ${Math.floor(i / config.cities.length) + 1}` : cityName;
      
      let leadParty = 'bjp';
      let runnerUp = 'inc';

      if (['Tamil Nadu'].includes(config.state)) {
        leadParty = 'dmk';
        runnerUp = 'bjp';
      } else if (['West Bengal'].includes(config.state)) {
        leadParty = 'tmc';
        runnerUp = 'bjp';
      } else if (['Kerala'].includes(config.state)) {
        leadParty = 'inc';
        runnerUp = 'cpim';
      } else if (['Punjab'].includes(config.state)) {
        leadParty = 'aap';
        runnerUp = 'inc';
      } else if (['Uttar Pradesh'].includes(config.state)) {
        leadParty = i % 2 === 0 ? 'bjp' : 'sp';
        runnerUp = leadParty === 'bjp' ? 'sp' : 'bjp';
      } else if (['Bihar'].includes(config.state)) {
        leadParty = i % 2 === 0 ? 'bjp' : 'jdu';
        runnerUp = 'inc';
      } else if (['Maharashtra'].includes(config.state)) {
        leadParty = i % 2 === 0 ? 'bjp' : 'ss';
        runnerUp = 'inc';
      }

      const margin = Math.floor(Math.random() * 20) + 1;
      let swing = 'LEANING';
      if (margin > 12) swing = 'SAFE';
      else if (margin <= 4) swing = 'TOSS_UP';
      else if (margin <= 8) swing = 'BATTLEGROUND';

      const isSC = i % 7 === 0;
      const isST = i % 13 === 0;

      const workScore = Math.floor(Math.random() * 50) + 40;
      const satisfaction = Math.floor(Math.random() * 40) + 50;

      let demoType = 'SEMI_URBAN';
      const lower = constituencyName.toLowerCase();
      if (
        lower.includes('mumbai') ||
        lower.includes('bangalore') ||
        lower.includes('chennai') ||
        lower.includes('delhi') ||
        lower.includes('kolkata') ||
        lower.includes('hyderabad') ||
        lower.includes('pune') ||
        lower.includes('ahmedabad') ||
        lower.includes('jaipur') ||
        lower.includes('lucknow')
      ) {
        demoType = 'URBAN_METRO';
      } else if (
        lower.includes('thane') ||
        lower.includes('surat') ||
        lower.includes('asansol') ||
        lower.includes('coimbatore') ||
        lower.includes('indore') ||
        lower.includes('visakhapatnam') ||
        lower.includes('ludhiana')
      ) {
        demoType = 'INDUSTRIAL_COASTAL';
      } else if (['Uttar Pradesh', 'Bihar', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan', 'Assam', 'Odisha'].includes(config.state)) {
        demoType = 'RURAL_AGRI';
      }

      seats.push({
        id: seatId,
        constituencyName,
        state: config.state,
        totalVoters: Math.floor(Math.random() * 500) + 1200,
        reservedCategory: isST ? 'ST' : isSC ? 'SC' : 'GEN',
        leadingPartyId: leadParty,
        runnerUpPartyId: runnerUp,
        marginPercent: margin,
        swingStatus: swing,
        currentTurnoutPercent: Math.floor(Math.random() * 25) + 55,
        keyIssue: ISSUES[Math.floor(Math.random() * ISSUES.length)],
        campaignHeat: Math.floor(Math.random() * 60) + 20,
        mpWorkScore: workScore,
        voterSatisfaction: satisfaction,
        mpladFundCrores: 5.0,
        recentWorkDone: ['Jan Janata Darbar Conducted', 'Rural Road Connectivity Upgraded'],
        demographicType: demoType,
        candidates: [
          {
            partyId: leadParty,
            candidateName: `Candidate (${leadParty.toUpperCase()})`,
            votePercentage: 45 + Math.floor(margin / 2),
            criminalCases: Math.floor(Math.random() * 3),
            netWorthCrores: Math.floor(Math.random() * 30) + 2,
          },
          {
            partyId: runnerUp,
            candidateName: `Candidate (${runnerUp.toUpperCase()})`,
            votePercentage: 45 - Math.floor(margin / 2),
            criminalCases: Math.floor(Math.random() * 3),
            netWorthCrores: Math.floor(Math.random() * 25) + 1,
          },
        ],
      });

      seatId++;
    }
  });

  return seats;
};

export const INITIAL_543_SEATS = generate543Seats();
