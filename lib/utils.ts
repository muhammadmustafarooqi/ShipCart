// Generate WhatsApp URL for order confirmation
export function generateWhatsAppOrderURL(order: {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingFee: number;
  paymentMethod: string;
}): string {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "923001234567";

  const itemsList = order.items
    .map((item) => `• ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`)
    .join("\n");

  const message = `*NEW ORDER #${order.orderId}*

*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*City:* ${order.city}
*Address:* ${order.address}

*Order items:*
${itemsList}

*Shipping:* Rs. ${order.shippingFee}
*Total:* Rs. ${order.total.toLocaleString()}
*Payment:* ${order.paymentMethod}

Please confirm the order!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Generate customer WhatsApp URL for product enquiry
export function generateProductWhatsAppURL(product: {
  name: string;
  price: number;
}): string {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "923001234567";
  const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: Rs. ${product.price.toLocaleString()}\n\nPlease confirm availability.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Format price in PKR
export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

// Generate order ID
export function generateOrderId(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `AIO-${num}`;
}

// Calculate shipping fee
export function calculateShipping(subtotal: number, freeAbove = 1500, fee = 200): number {
  return subtotal >= freeAbove ? 0 : fee;
}

// Validate Pakistani phone number
export function validatePakistaniPhone(phone: string): boolean {
  const regex = /^03[0-9]{9}$/;
  return regex.test(phone.replace(/\s/g, ""));
}

// Pakistani cities list
export const PAKISTANI_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Sukkur",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Mingora",
  "Nawabshah",
  "Sahiwal",
  "Mirpur Khas",
  "Other",
];

// Product categories
export const PRODUCT_CATEGORIES = [
  { name: "Kitchen & Cooking", slug: "kitchen-cooking" },
  { name: "Personal Care & Beauty", slug: "personal-care-beauty" },
  { name: "Home & Cleaning", slug: "home-cleaning" },
  { name: "Fitness & Health", slug: "fitness-health" },
  { name: "Electronics & Gadgets", slug: "electronics-gadgets" },
  { name: "Baby & Kids", slug: "baby-kids" },
];

// Common product colors
export const PRODUCT_COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Gray",
  "Silver",
  "Gold",
  "Brown",
  "Beige",
  "Navy",
  "Maroon",
  "Teal",
  "Mint",
  "Rose Gold",
  "Multicolor",
];
