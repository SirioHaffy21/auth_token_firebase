const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const https = require('https');
//const { google } = require('googleapis');

// Đọc thông tin tài khoản dịch vụ từ tệp JSON đã tải xuống
const serviceAccount = JSON.parse(fs.readFileSync('./file/fir-notify-1-e4261-firebase-adminsdk.json'));

// Tạo JWT token
const now = Math.floor(Date.now() / 1000);
const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
};

console.log('Private key 1: ', serviceAccount.private_key);

const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

console.log('Private key 2: ', privateKey);

if(privateKey == serviceAccount.private_key)
{
    //
    console.log('same');
}
else
{
    console.log('NOt same');
}

try {
    console.log(payload);
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    console.log('Generated Token:', token);

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
} catch (error) {
    console.error('Error generating token:', error.message);
}


