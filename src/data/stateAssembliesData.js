function generateAssemblySeats(
  stateName,
  count,
  rulingPartyId,
  topParties
) {
  const seats = [];
  const demographics = [
    'RURAL_AGRI',
    'URBAN_METRO',
    'INDUSTRIAL_COASTAL',
    'SEMI_URBAN',
  ];

  for (let i = 1; i <= count; i++) {
    const demo = demographics[i % 4];
    const leadingPartyId = topParties[i % topParties.length];
    const runnerUpPartyId = topParties[(i + 1) % topParties.length];
    const isRuling = leadingPartyId === rulingPartyId;
    const turnout = Math.floor(62 + Math.random() * 18);
    const satisfaction = isRuling ? Math.floor(55 + Math.random() * 25) : Math.floor(40 + Math.random() * 30);

    seats.push({
      id: i * 1000 + (count % 100),
      constituencyName: `${stateName} AC ${i}`,
      state: stateName,
      totalVoters: 250,
      reservedCategory: i % 5 === 0 ? (i % 10 === 0 ? 'ST' : 'SC') : 'GEN',
      leadingPartyId,
      runnerUpPartyId,
      marginPercent: 5.2,
      swingStatus: i % 3 === 0 ? 'BATTLEGROUND' : 'SAFE',
      currentTurnoutPercent: turnout,
      keyIssue: 'Local Infrastructure & Governance',
      campaignHeat: 65,
      mpWorkScore: 70,
      voterSatisfaction: satisfaction,
      mpladFundCrores: 5,
      recentWorkDone: ['Road Concreting', 'Water Supply Pipeline'],
      demographicType: demo,
      candidates: [
        { partyId: leadingPartyId, candidateName: `Candidate A (${leadingPartyId.toUpperCase()})`, votePercentage: 45, criminalCases: 0, netWorthCrores: 12 },
        { partyId: runnerUpPartyId, candidateName: `Candidate B (${runnerUpPartyId.toUpperCase()})`, votePercentage: 38, criminalCases: 1, netWorthCrores: 8 },
      ],
    });
  }

  return seats;
}

export const STATE_ASSEMBLIES_DATA = [
  {
    id: 'up-assembly',
    stateName: 'Uttar Pradesh',
    totalSeats: 403,
    majorityThreshold: 202,
    currentChiefMinister: 'Yogi Adityanath',
    rulingPartyId: 'bjp',
    topIssues: ['Expressway Expansion', 'Law & Order (Zero Tolerance)', 'Sugarcane Price Support', 'Job Creation'],
    bannerColor: '#FF9933',
    assemblySeats: generateAssemblySeats('Uttar Pradesh', 403, 'bjp', ['bjp', 'sp', 'bsp', 'inc']),
  },
  {
    id: 'mh-assembly',
    stateName: 'Maharashtra',
    totalSeats: 288,
    majorityThreshold: 145,
    currentChiefMinister: 'Eknath Shinde',
    rulingPartyId: 'ss',
    topIssues: ['Ladki Bahin Yojana', 'Maratha & OBC Reservation', 'Mumbai Coastal Road & Metro', 'Marathwada Drought Relief'],
    bannerColor: '#F57C00',
    assemblySeats: generateAssemblySeats('Maharashtra', 288, 'ss', ['ss', 'bjp', 'inc', 'ncp', 'sp']),
  },
  {
    id: 'wb-assembly',
    stateName: 'West Bengal',
    totalSeats: 294,
    majorityThreshold: 148,
    currentChiefMinister: 'Mamata Banerjee',
    rulingPartyId: 'tmc',
    topIssues: ['Lakshmir Bhandar Assistance', 'Kanyashree Scheme', 'Regional Identity & Rights', 'Rural Housing Allotment'],
    bannerColor: '#2E7D32',
    assemblySeats: generateAssemblySeats('West Bengal', 294, 'tmc', ['tmc', 'bjp', 'inc', 'cpim']),
  },
  {
    id: 'bihar-assembly',
    stateName: 'Bihar',
    totalSeats: 243,
    majorityThreshold: 122,
    currentChiefMinister: 'Nitish Kumar',
    rulingPartyId: 'jdu',
    topIssues: ['Special Category Status', 'Caste Survey Benefit Delivery', '10 Lakh Government Jobs', 'Flood Protection Infrastructure'],
    bannerColor: '#388E3C',
    assemblySeats: generateAssemblySeats('Bihar', 243, 'jdu', ['jdu', 'rjd', 'bjp', 'inc', 'cpiml']),
  },
  {
    id: 'tn-assembly',
    stateName: 'Tamil Nadu',
    totalSeats: 234,
    majorityThreshold: 118,
    currentChiefMinister: 'M.K. Stalin',
    rulingPartyId: 'dmk',
    topIssues: ['Dravidian Model Welfare', 'NEET Exemption', 'Kalaignar Magalir Urimai Scheme', 'Electronics Manufacturing Hubs'],
    bannerColor: '#D32F2F',
    assemblySeats: generateAssemblySeats('Tamil Nadu', 234, 'dmk', ['dmk', 'aiadmk', 'bjp', 'inc', 'tvk', 'vck']),
  },
  {
    id: 'delhi-assembly',
    stateName: 'Delhi',
    totalSeats: 70,
    majorityThreshold: 36,
    currentChiefMinister: 'Arvind Kejriwal',
    rulingPartyId: 'aap',
    topIssues: ['200 Units Free Electricity', 'Mohalla Clinic Network', 'State Government School Model', 'Full Statehood Rights'],
    bannerColor: '#00BCD4',
    assemblySeats: generateAssemblySeats('Delhi', 70, 'aap', ['aap', 'bjp', 'inc']),
  },
  {
    id: 'punjab-assembly',
    stateName: 'Punjab',
    totalSeats: 117,
    majorityThreshold: 59,
    currentChiefMinister: 'Bhagwant Mann',
    rulingPartyId: 'aap',
    topIssues: ['300 Units Free Power', 'Anti-Drug Action Plan', 'Farm Loan Subsidies', 'NRI Investment Facilitation'],
    bannerColor: '#00BCD4',
    assemblySeats: generateAssemblySeats('Punjab', 117, 'aap', ['aap', 'inc', 'sad', 'bjp']),
  },
  {
    id: 'gujarat-assembly',
    stateName: 'Gujarat',
    totalSeats: 182,
    majorityThreshold: 92,
    currentChiefMinister: 'Bhupendra Patel',
    rulingPartyId: 'bjp',
    topIssues: ['GIFT City Financial Hub', 'Semiconductor Manufacturing', 'Dholera Smart City', 'Renewable Energy Parks'],
    bannerColor: '#FF9933',
    assemblySeats: generateAssemblySeats('Gujarat', 182, 'bjp', ['bjp', 'inc', 'aap']),
  },
  {
    id: 'ka-assembly',
    stateName: 'Karnataka',
    totalSeats: 224,
    majorityThreshold: 113,
    currentChiefMinister: 'Siddaramaiah',
    rulingPartyId: 'inc',
    topIssues: ['Five Guarantee Schemes', 'Bengaluru Traffic & Metro Expansion', 'Cauvery Basin Irrigation', 'Rural Power Supply'],
    bannerColor: '#1976D2',
    assemblySeats: generateAssemblySeats('Karnataka', 224, 'inc', ['inc', 'bjp', 'jds']),
  },
  {
    id: 'tg-assembly',
    stateName: 'Telangana',
    totalSeats: 119,
    majorityThreshold: 60,
    currentChiefMinister: 'A. Revanth Reddy',
    rulingPartyId: 'inc',
    topIssues: ['Six Guarantee Guarantees', 'Hyderabad Pharma & IT Node', 'Rythu Bharosa Support', '2 Lakh Crop Loan Waiver'],
    bannerColor: '#1976D2',
    assemblySeats: generateAssemblySeats('Telangana', 119, 'inc', ['inc', 'brs', 'bjp', 'aimim']),
  },
];
