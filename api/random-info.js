// api/random-info.js
const courses = [
  'B. Tech / CS', 'B. Tech / IT', 'B. Tech / ECE', 'B. Tech / ME', 'B. Tech / CE',
  'B. Tech / EE', 'BCA', 'MCA', 'MBA', 'BBA', 'B. Tech / AI&ML', 'B. Tech / DS',
  'B.Sc / Physics', 'B.Sc / Chemistry', 'B.Sc / Mathematics', 'B.Com', 'BBA'
];

const fallbackFirstNames = [
  'RAHUL', 'PRIYA', 'AMIT', 'SNEHA', 'VIKASH', 'POOJA', 'RAVI', 'DEEPIKA',
  'AJAY', 'KAVYA', 'SANJAY', 'NISHA', 'ROHIT', 'SWATI', 'ANKIT', 'MEERA',
  'SUNIL', 'ANJALI', 'MANOJ', 'REKHA', 'VISHAL', 'SUNITA', 'ASHOK', 'SEEMA'
];

const fallbackLastNames = [
  'SHARMA', 'VERMA', 'GUPTA', 'SINGH', 'KUMAR', 'YADAV', 'MISHRA', 'TIWARI',
  'AGARWAL', 'JAIN', 'PANDEY', 'SRIVASTAVA', 'TRIPATHI', 'CHAUDHARY', 'BANSAL', 'CHOPRA'
];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function fetchRandomName() {
  try {
    const response = await fetch('https://randomuser.me/api/?nat=in&inc=name');
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      const user = data.results[0];
      const firstName = user.name.first.toUpperCase();
      const lastName = user.name.last.toUpperCase();
      return { firstName, lastName };
    }
  } catch (error) {
    console.log('API not available, using fallback names');
  }
  
  return {
    firstName: randomChoice(fallbackFirstNames),
    lastName: randomChoice(fallbackLastNames)
  };
}

function generateRandomPhone() {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000);
}

function generateRegNo() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = Array.from({length: 6}, () => randomChoice(letters)).join('');
  const year = new Date().getFullYear();
  const number = String(Math.floor(Math.random() * 99999 + 1)).padStart(5, '0');
  return `${prefix}/ITM/${year}/${number}`;
}

function generateSession() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - Math.floor(Math.random() * 3);
  return `${startYear} - ${startYear + 4}`;
}

function generateRandomAvatar() {
  const randomId = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/300?img=${randomId}`;
}

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName } = await fetchRandomName();
    const studentData = {
      name: `${firstName} ${lastName}`,
      course: randomChoice(courses),
      fatherName: `${randomChoice(fallbackFirstNames)} ${lastName}`,
      mobile: generateRandomPhone(),
      session: generateSession(),
      regNo: generateRegNo(),
      avatar: generateRandomAvatar(),
      timestamp: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      data: studentData
    });

  } catch (error) {
    console.error('Error generating random info:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate student info', 
      details: error.message 
    });
  }
}
