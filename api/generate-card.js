// api/generate-card.js
import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

// Dữ liệu mẫu
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

// Helper functions
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

// HTML template
function generateHTML(studentData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student ID Card</title>
  <style>
    body {
      font-family: Georgia, serif;
      background: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      margin: 0;
    }
    .id-card {
      width: 800px;
      height: 520px;
      background: white;
      border-radius: 10px;
      border: 4px solid #003e91;
      padding: 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      position: relative;
    }
    .header {
      background-color: #003e91;
      color: white;
      padding: 24px 10px 20px 130px;
      position: relative;
      height: 100px;
    }
    .header img {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 110px;
      height: auto;
    }
    .header h1 {
      font-size: 30px;
      margin: 0;
      text-align: center;
    }
    .header h3 {
      margin: 2px 0;
      font-size: 17px;
      font-weight: bold;
      text-align: center;
    }
    .sub-header {
      background-color: #d12027;
      color: white;
      text-align: center;
      padding: 4px 10px;
      font-weight: bold;
      font-size: 26px;
      letter-spacing: 1px;
    }
    .content {
      display: flex;
      padding: 10px 20px;
      justify-content: space-between;
      position: relative;
    }
    .info {
      flex: 2;
    }
    .info table {
      width: 100%;
      font-size: 16px;
    }
    .info td {
      padding: 4px 10px;
    }
    .info .label {
      width: 180px;
      font-weight: bold;
    }
    .photo {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .photo img {
      width: 140px;
      height: 180px;
      border: 1px solid #333;
      object-fit: cover;
    }
    .signature {
      margin-top: 10px;
    }
    .signature img {
      width: 120px;
      height: auto;
      border: none;
    }
    .barcode-section {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 500px;
    }
    .barcode-section img {
      width: 80%;
      height: auto;
    }
    .footer {
      position: absolute;
      bottom: 10px;
      right: 20px;
    }
    .director img {
      width: 130px;
    }
  </style>
</head>
<body>
  <div class="id-card">
    <div class="header">
      <img src="https://i.ibb.co/Hpkk9LVg/image.png" alt="Logo" />
      <h1>BABU BANARASI DAS</h1>
      <h3>Institute of Technology and Management, Lucknow</h3>
      <h3>Affiliated to Dr. A.P.J. Abdul Kalam Technical University</h3>  
      <h3>(AKTU College Code: 054)</h3>
    </div>
    <div class="sub-header">STUDENT IDENTITY CARD</div>
    <div class="content">
      <div class="info">
        <table>
          <tr>
            <td class="label">NAME</td>
            <td>${studentData.name}</td>
          </tr>
          <tr>
            <td class="label">COURSE</td>
            <td>${studentData.course}</td>
          </tr>
          <tr>
            <td class="label">FATHER'S NAME</td>
            <td>${studentData.fatherName}</td>
          </tr>
          <tr>
            <td class="label">MOBILE NO.</td>
            <td>${studentData.mobile}</td>
          </tr>
          <tr>
            <td class="label">SESSION</td>
            <td>${studentData.session}</td>
          </tr>
          <tr>
            <td class="label">REG. NO.</td>
            <td>${studentData.regNo}</td>
          </tr>
        </table>
      </div>
      <div class="photo">
        <img src="${studentData.avatar}" alt="Student Photo" />
        <div class="signature">
          <img src="https://i.ibb.co/Xr5bmgwM/Screenshot-2025-07-31-175409.png" alt="Signature" />
        </div>
      </div>
    </div>
    <div class="barcode-section">
      <img src="https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(studentData.regNo)}&code=Code128&translate-esc=false" alt="Barcode" />
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  try {
    console.log('Method:', req.method);
    console.log('Starting card generation...');

    // Xử lý CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    let studentData;

    if (req.method === 'POST') {
      // Tạo thẻ với thông tin tùy chỉnh
      const {
        name,
        course,
        fatherName,
        mobile,
        session,
        regNo,
        avatar
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'SHARMA';
      
      studentData = {
        name: name,
        course: course || randomChoice(courses),
        fatherName: fatherName || `${randomChoice(fallbackFirstNames)} ${lastName}`,
        mobile: mobile || generateRandomPhone(),
        session: session || generateSession(),
        regNo: regNo || generateRegNo(),
        avatar: avatar || generateRandomAvatar()
      };
    } else {
      // Tạo thẻ với thông tin random (GET)
      const { firstName, lastName } = await fetchRandomName();
      studentData = {
        name: `${firstName} ${lastName}`,
        course: randomChoice(courses),
        fatherName: `${randomChoice(fallbackFirstNames)} ${lastName}`,
        mobile: generateRandomPhone(),
        session: generateSession(),
        regNo: generateRegNo(),
        avatar: generateRandomAvatar()
      };
    }

    console.log('Student data generated:', studentData);

    // Tạo HTML
    const html = generateHTML(studentData);
    
    // Khởi tạo browser với Vercel config
    const browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
    });

    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    
    // Set viewport với scale cao cho chất lượng tốt
    await page.setViewport({ 
      width: 1200, 
      height: 800, 
      deviceScaleFactor: 2 
    });
    
    // Load HTML và chờ tất cả resources load xong
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    console.log('Page content set, taking screenshot...');

    // Chụp ảnh thẻ sinh viên
    const cardElement = await page.$('.id-card');
    
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    const screenshot = await cardElement.screenshot({ 
      type: 'png',
      encoding: 'buffer',
      omitBackground: false
    });

    await browser.close();
    console.log('Screenshot taken successfully');

    // Set headers và trả về ảnh
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Content-Disposition', 'inline; filename=student-card.png');
    
    return res.send(screenshot);

  } catch (error) {
    console.error('Error generating card:', error);
    return res.status(500).json({ 
      error: 'Failed to generate student card', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
