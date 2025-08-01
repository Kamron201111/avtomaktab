// Telefon raqami formatlash funksiyasi
export function formatPhoneNumber(value) {
  // Faqat raqamlarni olamiz
  const numbers = value.replace(/\D/g, '');
  
  // Agar 998 bilan boshlansa, uni olib tashlaymiz
  let cleanNumber = numbers;
  if (cleanNumber.startsWith('998')) {
    cleanNumber = cleanNumber.substring(3);
  }
  
  // Maksimal 9 ta raqam
  cleanNumber = cleanNumber.substring(0, 9);
  
  // Formatlash
  if (cleanNumber.length === 0) {
    return '+998(';
  } else if (cleanNumber.length <= 2) {
    return `+998(${cleanNumber}`;
  } else if (cleanNumber.length <= 5) {
    return `+998(${cleanNumber.substring(0, 2)})${cleanNumber.substring(2)}`;
  } else if (cleanNumber.length <= 7) {
    return `+998(${cleanNumber.substring(0, 2)})${cleanNumber.substring(2, 5)}-${cleanNumber.substring(5)}`;
  } else {
    return `+998(${cleanNumber.substring(0, 2)})${cleanNumber.substring(2, 5)}-${cleanNumber.substring(5, 7)}-${cleanNumber.substring(7)}`;
  }
}

// Telefon raqami validatsiyasi
export function validatePhoneNumber(value) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.startsWith('998')) {
    return numbers.length === 12; // 998 + 9 ta raqam
  }
  return numbers.length === 9; // 9 ta raqam
}

// Telefon raqamini tozalash (faqat raqamlarni qaytarish)
export function cleanPhoneNumber(value) {
  let numbers = value.replace(/\D/g, '');
  if (numbers.startsWith('998')) {
    numbers = numbers.substring(3);
  }
  return numbers;
}

// Telefon raqamini to'liq formatda qaytarish
export function getFullPhoneNumber(value) {
  const cleanNumber = cleanPhoneNumber(value);
  if (cleanNumber.length === 9) {
    return `+998${cleanNumber}`;
  }
  return value;
} 