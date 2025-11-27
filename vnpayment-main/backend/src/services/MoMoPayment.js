const crypto = require('crypto');
const axios = require('axios');

class MoMoPayment {
  constructor() {
    // Validate required environment variables
    if (!process.env.MOMO_PARTNER_CODE || !process.env.MOMO_ACCESS_KEY || !process.env.MOMO_SECRET_KEY) {
      throw new Error('Missing required MoMo environment variables. Check MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, and MOMO_SECRET_KEY');
    }

    this.partnerCode = process.env.MOMO_PARTNER_CODE;
    this.accessKey = process.env.MOMO_ACCESS_KEY;
    this.secretKey = process.env.MOMO_SECRET_KEY;
    this.endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    this.enableLog = true;

    console.log('🚀 MoMoPayment initialized successfully');
    console.log('- Partner Code:', this.partnerCode);
    console.log('- Access Key:', this.accessKey.substring(0, 6) + '...');
    console.log('- Endpoint:', this.endpoint);
  }

  /**
   * Tạo URL thanh toán MoMo
   * @param {Object} orderInfo - Thông tin đơn hàng
   * @returns {Object} - Kết quả tạo URL thanh toán
   */
  async createPayment(orderInfo) {
    try {
      const {
        orderId,
        amount,
        orderInfo: description,
        redirectUrl,
        ipnUrl,
        requestType = 'payWithATM',
        extraData = '',
        lang = 'vi'
      } = orderInfo;

      // Validate input parameters
      if (!orderId || !amount || !description || !redirectUrl) {
        throw new Error('Missing required payment parameters: orderId, amount, orderInfo, redirectUrl');
      }

      // Validate amount
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error('Invalid amount: must be a positive integer');
      }

      // Generate unique request ID
      const requestId = this.partnerCode + new Date().getTime();
      
      // Set default ipnUrl if not provided
      const finalIpnUrl = ipnUrl || redirectUrl;

      // Create raw signature string according to MoMo format (alphabetical order)
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${finalIpnUrl}&orderId=${orderId}&orderInfo=${description}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      // Create HMAC SHA256 signature
      const signature = crypto.createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      // Prepare request body according to MoMo API specification
      const requestBody = {
        partnerCode: this.partnerCode,
        partnerName: "Test",
        storeId: this.partnerCode,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: description,
        redirectUrl: redirectUrl,
        ipnUrl: finalIpnUrl,
        lang: lang,
        extraData: extraData,
        requestType: requestType,
        signature: signature
      };

      // Debug logging
      if (this.enableLog) {
        console.log('=== MoMo Payment Creation ===');
        console.log('Partner Code:', this.partnerCode);
        console.log('Request ID:', requestId);
        console.log('Order ID:', orderId);
        console.log('Amount:', amount);
        console.log('Description:', description);
        console.log('Request Type:', requestType);
        console.log('Raw Signature:', rawSignature);
        console.log('Signature:', signature);
        console.log('Request Body:', JSON.stringify(requestBody, null, 2));
        console.log('==============================');
      }

      // Send request to MoMo API with retry logic
      const response = await this.sendRequestWithRetry(requestBody);

      const responseData = response.data;

      if (this.enableLog) {
        console.log('=== MoMo API Response ===');
        console.log('Status:', response.status);
        console.log('Response Data:', JSON.stringify(responseData, null, 2));
        console.log('==========================');
      }

      // Check if request was successful
      if (responseData.resultCode === 0) {
        return {
          success: true,
          payUrl: responseData.payUrl,
          data: {
            requestId: requestId,
            orderId: orderId,
            amount: amount,
            signature: signature,
            deeplink: responseData.deeplink,
            qrCodeUrl: responseData.qrCodeUrl
          }
        };
      } else {
        throw new Error(`MoMo API Error: ${responseData.message} (Code: ${responseData.resultCode})`);
      }

    } catch (error) {
      console.error('❌ MoMo Payment Creation Error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - MoMo API không phản hồi trong thời gian cho phép');
      } else if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received from MoMo API');
        console.error('Request details:', error.request);
      }
      
      // Return a more user-friendly error
      const friendlyError = this.getFriendlyError(error);
      throw new Error(friendlyError);
    }
  }

  /**
   * Xác thực callback từ MoMo (IPN/webhook)
   * @param {Object} params - Data từ MoMo callback
   * @returns {Object} - Kết quả xác thực
   */
  verifyCallback(params) {
    try {
      if (!params || Object.keys(params).length === 0) {
        return {
          isValid: false,
          isSuccess: false,
          message: 'No parameters provided'
        };
      }

      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
      } = params;

      if (!signature) {
        return {
          isValid: false,
          isSuccess: false,
          message: 'Missing signature'
        };
      }

      // Create raw signature for verification
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

      // Create expected signature
      const expectedSignature = crypto.createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      const isValidSignature = signature === expectedSignature;
      const isSuccess = resultCode == 0 || resultCode === '0'; // Support both string and number

      // Debug logging
      if (this.enableLog) {
        console.log('=== MoMo Callback Verification ===');
        console.log('Result Code:', resultCode);
        console.log('Message:', message);
        console.log('Transaction ID:', transId);
        console.log('Order ID:', orderId);
        console.log('Amount:', amount);
        console.log('Raw Signature:', rawSignature);
        console.log('Expected Signature:', expectedSignature);
        console.log('Received Signature:', signature);
        console.log('Signature Valid:', isValidSignature);
        console.log('Payment Success:', isSuccess);
        console.log('===================================');
      }

      return {
        isValid: isValidSignature,
        isSuccess: isSuccess,
        transactionId: transId,
        orderId: orderId,
        amount: parseInt(amount),
        resultCode: resultCode,
        message: message,
        payType: payType,
        responseTime: responseTime
      };

    } catch (error) {
      console.error('❌ MoMo Callback Verification Error:', error.message);
      return {
        isValid: false,
        isSuccess: false,
        message: error.message
      };
    }
  }

  /**
   * Lấy message từ result code
   * @param {number} resultCode - MoMo result code
   * @returns {string} - Message tương ứng
   */
  getFriendlyError(error) {
    if (error.code === 'ECONNABORTED') {
      return 'MoMo API timeout - Vui lòng thử lại sau';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'Không thể kết nối đến MoMo API';
    } else if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        return 'Dữ liệu gửi đến MoMo không hợp lệ';
      } else if (status === 401) {
        return 'Xác thực MoMo thất bại - Kiểm tra credentials';
      } else if (status === 500) {
        return 'Lỗi hệ thống MoMo - Vui lòng thử lại sau';
      } else {
        return `MoMo API error: ${status}`;
      }
    } else {
      return 'Lỗi không xác định khi kết nối MoMo';
    }
  }

  getResultMessage(resultCode) {
    const messages = {
      0: 'Thành công',
      9000: 'Giao dịch được khởi tạo, chờ người dùng xác nhận thanh toán',
      8000: 'Giao dịch đang được xử lý',
      7000: 'Giao dịch bị từ chối bởi người dùng',
      6000: 'Giao dịch bị từ chối bởi người dùng do quá thời gian thanh toán',
      5000: 'Giao dịch bị từ chối bởi hệ thống',
      4000: 'Giao dịch bị lỗi do số dư không đủ',
      3000: 'Giao dịch bị hủy',
      2000: 'Giao dịch thất bại do lỗi kỹ thuật',
      1000: 'Giao dịch thất bại do lỗi từ phía merchant',
      10: 'Lỗi không xác định',
      11: 'Truy cập bị từ chối',
      12: 'API version không được hỗ trợ cho yêu cầu này',
      13: 'Merchant authentication failed',
      20: 'Yêu cầu sai format',
      21: 'Amount không hợp lệ',
      40: 'RequestId bị trùng',
      41: 'OrderId bị trùng',
      42: 'OrderId không hợp lệ hoặc không được tìm thấy',
      43: 'Yêu cầu bị từ chối vì lý do bảo mật'
    };

    return messages[resultCode] || `Mã lỗi không xác định: ${resultCode}`;
  }

  /**
   * Send request to MoMo API with retry logic
   * @param {Object} requestBody - Request body to send
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise<Object>} - API response
   */
  async sendRequestWithRetry(requestBody, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        if (this.enableLog && attempt > 1) {
          console.log(`🔄 MoMo API Retry attempt ${attempt}/${maxRetries + 1}`);
        }

        const response = await axios.post(this.endpoint, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MoMo-Payment-Gateway/1.0'
          },
          timeout: 15000, // Reduce timeout to 15 seconds for faster retries
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept 4xx responses as well
          }
        });

        return response;

      } catch (error) {
        lastError = error;
        
        if (error.code === 'ECONNABORTED') {
          console.error(`⏰ Attempt ${attempt}: Request timeout (15s)`);
        } else if (error.code === 'ECONNREFUSED') {
          console.error(`🔌 Attempt ${attempt}: Connection refused`);
        } else if (error.code === 'ENOTFOUND') {
          console.error(`🌐 Attempt ${attempt}: DNS lookup failed`);
        } else {
          console.error(`❌ Attempt ${attempt}: ${error.message}`);
        }

        // If this is the last attempt, don't wait
        if (attempt < maxRetries + 1) {
          const waitTime = attempt * 1000; // Wait 1s, 2s, etc.
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // All attempts failed
    throw lastError;
  }

  /**
   * Get friendly error message from API error
   * @param {Error} error - The error object
   * @returns {string} - Friendly error message
   */
  getFriendlyError(error) {
    if (error.code === 'ECONNABORTED') {
      return 'MoMo API timeout - Vui lòng thử lại sau';
    } else if (error.code === 'ECONNREFUSED') {
      return 'Không thể kết nối đến MoMo API - Vui lòng kiểm tra kết nối mạng';
    } else if (error.code === 'ENOTFOUND') {
      return 'Không tìm thấy MoMo API server - Vui lòng kiểm tra cấu hình';
    } else if (error.response && error.response.data) {
      return error.response.data.message || 'Lỗi từ MoMo API';
    } else {
      return error.message || 'Lỗi không xác định từ MoMo API';
    }
  }
}

module.exports = MoMoPayment;