import crypto from "crypto"

// Replace with your order ID from the order creation response
const order_id = 'order_OH7jUVj8I8U0sk'; // Example order ID from your backend
const payment_id = 'pay_29QQoUBi66xm2f'; // Simulated payment ID
const secret = 'QSa0SOvCN0yGeyxAqnC02PDh'; // Your Razorpay secret

const generateSignature = (orderId, paymentId, secretKey) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('hex');
  return expectedSignature;
};

const razorpay_signature = generateSignature(order_id, payment_id, secret);

console.log('Payment ID:', payment_id);
console.log('Razorpay Signature:', razorpay_signature);
