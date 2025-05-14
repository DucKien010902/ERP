const moment = require('moment-timezone');
const qs = require('qs');
const vnpayConfig = require('../../config/VNPayConfig');

class VNPayController {
  async generatePayURL(req, res) {
    try {
      const { amount, bankCode } = req.query;
      const amountNumber = Number(amount);
      if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
        return res.status(400).json({ message: 'Số tiền không hợp lệ' });
      }

      const date = moment().tz('Asia/Ho_Chi_Minh');
      const createDate = date.format('YYYYMMDDHHmmss');
      const expireDate = date
        .clone()
        .add(15, 'minutes')
        .format('YYYYMMDDHHmmss'); // Hết hạn sau 15 phút
      const ipAddr = vnpayConfig.getIpAddress(req);
      const txnRef = vnpayConfig.getRandomNumber(8);
      console.log(req.headers['x-forwarded-for']);
      console.log(req.connection?.remoteAddress);
      console.log(req.socket?.remoteAddress);
      const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: vnpayConfig.vnp_TmnCode,
        vnp_Amount: amountNumber * 100,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
      };

      if (bankCode) {
        vnp_Params.vnp_BankCode = bankCode;
      }

      // Bước 1: Sắp xếp tham số
      const sortedParams = vnpayConfig.sortObject(vnp_Params);

      // Bước 2: Tạo chuỗi dữ liệu để ký - KHÔNG encode
      const signData = qs.stringify(sortedParams, { encode: false });

      // Bước 3: Tạo chữ ký
      const secureHash = vnpayConfig.hmacSHA512(
        vnpayConfig.vnp_HashSecret,
        signData
      );
      console.log(vnp_Params);
      console.log(signData);
      console.log(secureHash);
      // Bước 4: Gắn chữ ký
      sortedParams.vnp_SecureHash = secureHash;

      // Bước 5: Tạo URL thanh toán (CÓ encode)
      const paymentUrl = `${vnpayConfig.vnp_PayUrl}?${qs.stringify(
        sortedParams,
        { encode: true }
      )}`;
      console.log(paymentUrl);
      return res.json({ paymentUrl });
    } catch (err) {
      console.error('Lỗi khi tạo URL VNPay:', err);
      return res
        .status(500)
        .json({ message: 'Lỗi hệ thống khi tạo link thanh toán' });
    }
  }

  async handleVnpayReturn(req, res) {
    try {
      const vnp_Params = { ...req.query };
      const secureHash = vnp_Params.vnp_SecureHash;

      delete vnp_Params.vnp_SecureHash;
      delete vnp_Params.vnp_SecureHashType;

      const sortedParams = vnpayConfig.sortObject(vnp_Params);
      const signData = qs.stringify(sortedParams, { encode: false });

      const hashCheck = vnpayConfig.hmacSHA512(
        vnpayConfig.vnp_HashSecret,
        signData
      );

      if (secureHash === hashCheck) {
        return res.status(200).json({
          code: vnp_Params.vnp_ResponseCode,
          message: 'Xác thực chữ ký thành công',
          data: vnp_Params,
        });
      } else {
        return res.status(400).json({
          code: '97',
          message: 'Sai chữ ký',
        });
      }
    } catch (error) {
      console.error('Lỗi khi xử lý callback từ VNPay:', error);
      return res.status(500).json({ message: 'Lỗi xử lý callback' });
    }
  }
}

module.exports = new VNPayController();
