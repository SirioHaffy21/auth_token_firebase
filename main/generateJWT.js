const jwt = require('jsonwebtoken');
const fs = require('fs');

// Đọc khóa riêng
const privateKey = fs.readFileSync('./file/private.pem');

const now = Math.floor(Date.now() / 1000);
const payload = {
    iss: 'firebase-adminsdk-9o8dt@fir-notify-1-e4261.iam.gserviceaccount.com',
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
};

const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
console.log(token)

const publicKey = fs.readFileSync('./file/public.pem');

// Xác thực token
jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
        console.error('Xác thực thất bại:', err);
    } else {
        console.log('Dữ liệu payload:', decoded);
    }
});