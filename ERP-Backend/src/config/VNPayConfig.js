const crypto = require('crypto');

const vnpayConfig = {
  vnp_PayUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'https://duckien.vercel.app/product',
  vnp_TmnCode: 'TMYGP979',
  vnp_HashSecret: 'I4TNR0GOB4M5URF7XV9H627ADTI08AMW',
  vnp_ApiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',

  hmacSHA512: (key, data) => {
    return crypto
      .createHmac('sha512', key)
      .update(Buffer.from(data, 'utf8'))
      .digest('hex');
  },

  getIpAddress: (req) => {
    return (
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      '127.0.0.1'
    );
  },

  sortObject: (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  },

  getRandomNumber: (length = 8) => {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  },
};

module.exports = vnpayConfig;
