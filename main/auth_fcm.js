const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

// Đọc thông tin tài khoản dịch vụ từ tệp JSON đã tải xuống
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json'));

// Tạo JWT token
const now = Math.floor(Date.now() / 1000);
const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
};

const token = jwt.sign(payload, serviceAccount.private_key, { algorithm: 'RS256' });

// Gửi yêu cầu lấy access_token từ Google OAuth2
axios.post('https://oauth2.googleapis.com/token', null, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
    }
})
.then(response => {
    console.log('Access Token:', response.data.access_token);
})
.catch(error => {
    console.error('Error getting access token:', error.response.data);
});
