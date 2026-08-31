// MotoBlitz WhatsApp Order & Notification Generator
export const DEFAULT_WHATSAPP_NUMBER = "919342310194";

/**
 * Formats a clean, high-conversion WhatsApp message for a customer order
 */
export function generateWhatsAppOrderMessage({
  orderCode,
  customerName,
  customerPhone,
  bikeModel,
  address,
  pincode,
  items,
  totalAmount,
  notes,
  paymentPreference = "UPI on Delivery / GPay / PhonePe"
}) {
  const itemsText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  const message = `🏍️ *NEW ORDER - MOTOBLITZ* ⚡
━━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${orderCode}
📅 *Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

👤 *Customer Details:*
• *Name:* ${customerName}
• *Phone:* ${customerPhone}
• *Bike Model & Year:* ${bikeModel || 'Universal / Not Specified'}
• *Delivery Address:* ${address}, PIN: ${pincode}

📦 *Items Ordered:*
${itemsText}

💰 *Payment Summary:*
• *Total Payable:* ₹${totalAmount.toLocaleString('en-IN')}
• *Shipping:* FREE ⚡
• *Payment Mode:* ${paymentPreference}

${notes ? `📝 *Customer Note:* ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
⚡ *Order placed via MotoBlitz Web Store*
Please confirm availability and dispatch timeline. Thank you!`;

  return encodeURIComponent(message);
}

/**
 * Creates direct WhatsApp URL for an order
 */
export function getWhatsAppOrderUrl(orderData, whatsappNumber = DEFAULT_WHATSAPP_NUMBER) {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const encodedText = generateWhatsAppOrderMessage(orderData);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Formats WhatsApp order status update message sent by Admin to Customer
 */
export function generateCustomerStatusUpdateMessage({
  orderCode,
  customerName,
  status,
  trackingId,
  courierName
}) {
  let statusEmoji = "📦";
  let statusText = status.toUpperCase();

  if (status === 'confirmed') {
    statusEmoji = "✅";
    statusText = "ORDER CONFIRMED & IN PREPARATION";
  } else if (status === 'dispatched') {
    statusEmoji = "🚀";
    statusText = "DISPATCHED / ON THE WAY";
  } else if (status === 'delivered') {
    statusEmoji = "🎉";
    statusText = "DELIVERED";
  }

  const message = `${statusEmoji} *MOTOBLITZ ORDER UPDATE* ⚡
━━━━━━━━━━━━━━━━━━━━━━
Hi *${customerName}*,

Your MotoBlitz Order *#${orderCode}* status has been updated:
👉 *Status:* ${statusText}

${trackingId ? `📍 *Tracking Number:* ${trackingId}\n🚚 *Courier Partner:* ${courierName || 'DTDC / Delhivery / SpeedPost'}\n` : ''}
Need any help? Feel free to reply directly to this message.
Ride Safe! 🏍️💨
━━━━━━━━━━━━━━━━━━━━━━
*MotoBlitz Performance Team*`;

  return encodeURIComponent(message);
}
