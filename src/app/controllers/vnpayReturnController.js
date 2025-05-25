// controllers/VNPayController.js
const moment = require('moment-timezone');
const qs = require('qs');
const vnpayConfig = require('../../config/VNPayConfig');
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require('vnpay');
class VNPayController {
  async createPaymentUrl(req, res) {
    const { amount } = req.body;
    try {
      const vnpay = new VNPay({
        tmnCode: 'HA8JKRZ7',
        secureSecret: 'T58U67DMCO4FIOAZ7FUTWENOBGGIJUWP',
        vnpayHost: 'https://sandbox.vnpayment.com',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerfm: ignoreLogger,
      });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Locale: VnpLocale.VN,
        vnp_TxnRef: Date.now().toString(),
        vnp_OrderInfo: '123456',
        vnp_OrderType: ProductCode.Other,
        vnp_Amount: amount,
        vnp_ReturnUrl: 'http://localhost:3000/product/result',
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });
      return res.status(200).json({ paymentUrl: vnpayResponse });
    } catch (err) {
      console.error('Lỗi tạo URL thanh toán:', err);
      return res
        .status(500)
        .json({ message: 'Lỗi hệ thống khi tạo link thanh toán' });
    }
  }
}

module.exports = new VNPayController();
