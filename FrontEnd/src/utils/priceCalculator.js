export function calculateRentalPrice(params) {
  const { rentalType, basePrice, days, subscriptionMonthlyPrice = 50.0 } = params;

  if (rentalType === "assinatura") {
    return subscriptionMonthlyPrice;
  }

  let totalPrice = basePrice * days;

  if (days >= 30) {
    totalPrice *= 0.7;
  } else if (days >= 14) {
    totalPrice *= 0.85;
  } else if (days >= 7) {
    totalPrice *= 0.9;
  }

  return Math.round(totalPrice * 100) / 100;
}

