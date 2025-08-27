export default function handler(req, res) {
  const baseUrl = `https://${req.headers.host}`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student ID Card Generator API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #003e91; border-bottom: 3px solid #003e91; padding-bottom: 10px; }
    h2 { color: #d12027; margin-top: 30px; }
    .endpoint { 
      background: #f8f9fa; 
      padding: 15px; 
      border-left: 4px solid #003e91; 
      margin: 15px 0;
      border-radius: 5px;
    }
    .method { 
      display: inline-block;
      padding: 3px 8px; 
      border-radius: 3px; 
      font-weight: bold; 
      font-size: 12px;
      margin-right: 10px;
    }
    .get { background: #28a745; color: white; }
    .post { background: #007bff; color: white; }
    code { 
      background: #f1f1f1; 
      padding: 2px 5px; 
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
    }
    pre { 
      background: #2d3748; 
      color: #e2e8f0; 
      padding: 15px; 
      border-radius: 5px; 
      overflow-x: auto;
    }
    .demo-section {
      background: #e3f2fd;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #003e91;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 5px 5px 5px 0;
      border: none;
      cursor: pointer;
    }
    .btn:hover { background: #002a66; }
    .btn-secondary { background: #6c757d; }
    .btn-secondary:hover { background: #545b62; }
    img { max-width: 100%; border-radius: 5px; margin: 10px 0; }
    .status { padding: 5px 10px; border-radius: 3px; font-weight: bold; }
    .status-success { background: #d4edda; color: #155724; }
    .status-error { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎓 Student ID Card Generator API</h1>
    <p>API tạo thẻ sinh viên với thông tin random hoặc tùy chỉnh, trả về ảnh PNG chất lượng cao.</p>
    
    <div class="demo-section">
      <h3>🚀 Demo nhanh</h3>
      <button class="btn" onclick="downloadCard()">📥 Tạo & Tải Thẻ Random</button>
      <button class="btn btn-secondary" onclick="showCustomForm()">✏️ Tạo Thẻ Tùy Chỉnh</button>
      <div id="custom-form" style="display:none; margin-top:15px;">
        <input type="text" id="name" placeholder="Tên sinh viên" style="padding:8px; margin:5px; width:200px;">
        <input type="text" id="course" placeholder="Khóa học (B. Tech / CS)" style="padding:8px; margin:5px; width:150px;">
        <br>
        <button class="btn" onclick="downloadCustomCard()">📥 Tạo Thẻ</button>
      </div>
      <div id="status" style="margin-top:15px;"></div>
    </div>

    <h2>📋 API Endpoints</h2>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <strong>/api/generate-card</strong>
      <p>Tạo thẻ sinh viên với thông tin hoàn toàn random</p>
      <pre>curl -o student-card.png ${baseUrl}/api/generate-card</pre>
    </div>

    <div class="endpoint">
      <span class="method post">POST</span>
      <strong>/api/generate-card</strong>
      <p>Tạo thẻ sinh viên với thông tin tùy chỉnh</p>
      <pre>curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"name": "NGUYEN VAN A", "course": "B. Tech / CS"}' \\
  -o custom-card.png \\
  ${baseUrl}/api/generate-card</pre>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <strong>/api/random-info</strong>
      <p>Lấy thông tin sinh viên random (JSON only, không tạo ảnh)</p>
      <pre>curl ${baseUrl}/api/random-info</pre>
    </div>

    <h2>📝 Request Body (POST)</h2>
    <pre>{
  "name": "RAHUL SHARMA",           // Bắt buộc
  "course": "B. Tech / CS",         // Tùy chọn
  "fatherName": "SURESH SHARMA",    // Tùy chọn  
  "mobile": "9876543210",           // Tùy chọn
  "session": "2023 - 2027",        // Tùy chọn
  "regNo": "ABCDEF/ITM/2024/12345", // Tùy chọn
  "avatar": "https://example.com/avatar.jpg" // Tùy chọn
}</pre>

    <h2>🎯 Các khóa học có sẵn</h2>
    <p><code>B. Tech / CS</code>, <code>B. Tech / IT</code>, <code>B. Tech / ECE</code>, <code>B. Tech / ME</code>, <code>B. Tech / CE</code>, <code>B. Tech / EE</code>, <code>B. Tech / AI&ML</code>, <code>B. Tech / DS</code>, <code>BCA</code>, <code>MCA</code>, <code>MBA</code>, <code>BBA</code>, <code>B.Sc / Physics</code>, <code>B.Sc / Chemistry</code>, <code>B.Sc / Mathematics</code>, <code>B.Com</code></p>

    <h2>📄 Response</h2>
    <div class="endpoint">
      <h4>✅ Success (Image)</h4>
      <ul>
        <li><strong>Content-Type:</strong> <code>image/png</code></li>
        <li><strong>Status:</strong> <span class="status status-success">200 OK</span></li>
        <li><strong>Body:</strong> Binary PNG image data</li>
      </ul>
    </div>

    <div class="endpoint">
      <h4>❌ Error (JSON)</h4>
      <pre>{
  "error": "Error message",
  "details": "Detailed error description"
}</pre>
    </div>

    <h2>💡 Ví dụ JavaScript</h2>
    <pre>// Tạo và tải thẻ random
async function downloadRandomCard() {
  const response = await fetch('/api/generate-card');
  const blob = await response.blob();
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student-card.png';
  a.click();
}

// Tạo thẻ tùy chỉnh
async function createCustomCard() {
  const studentData = {
    name: "AMIT KUMAR",
    course: "B. Tech / IT",
    mobile: "9123456789"
  };
  
  const response = await fetch('/api/generate-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  
  if (response.ok) {
    const blob = await response.blob();
    // ... xử lý blob
  }
}</pre>

    <h2>⚡ Hiệu suất</h2>
    <ul>
      <li><strong>Thời gian tạo:</strong> ~3-5 giây</li>
      <li><strong>Kích thước ảnh:</strong> ~200-500KB</li>
      <li><strong>Độ phân giải:</strong> 800x520px (2x scale)</li>
      <li><strong>Timeout:</strong> 30 giây</li>
    </ul>

    <hr>
    <p style="text-align:center; color:#666;">
      🚀 Deployed on <strong>Vercel</strong> | 
      📧 Contact: <a href="mailto:support@example.com">support@example.com</a>
    </p>
  </div>

  <script>
    function showStatus(message, isError = false) {
      const status = document.getElementById('status');
      status.innerHTML = \`<div class="status \${isError ? 'status-error' : 'status-success'}">\${message}</div>\`;
      setTimeout(() => status.innerHTML = '', 5000);
    }

    async function downloadCard() {
      try {
        showStatus('🔄 Đang tạo thẻ...');
        const response = await fetch('/api/generate-card');
        
        if (!response.ok) {
          throw new Error('Lỗi tạo thẻ');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student-card.png';
        a.click();
        
        showStatus('✅ Thẻ đã được tải xuống!');
      } catch (error) {
        showStatus('❌ Lỗi: ' + error.message, true);
      }
    }

    function showCustomForm() {
      const form = document.getElementById('custom-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    async function downloadCustomCard() {
      const name = document.getElementById('name').value.trim();
      const course = document.getElementById('course').value.trim();
      
      if (!name) {
        showStatus('❌ Vui lòng nhập tên sinh viên', true);
        return;
      }

      try {
        showStatus('🔄 Đang tạo thẻ tùy chỉnh...');
        const response = await fetch('/api/generate-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, course })
        });
        
        if (!response.ok) {
          throw new Error('Lỗi tạo thẻ tùy chỉnh');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${name.toLowerCase().replace(/\\s+/g, '-')}-card.png\`;
        a.click();
        
        showStatus('✅ Thẻ tùy chỉnh đã được tải xuống!');
        
        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('course').value = '';
      } catch (error) {
        showStatus('❌ Lỗi: ' + error.message, true);
      }
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
