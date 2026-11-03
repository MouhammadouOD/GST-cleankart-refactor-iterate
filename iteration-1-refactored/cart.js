// Iteration 1 — basic refactoring techniques, no design patterns yet.
// Rename variables/methods, extract small functions, remove duplication,
// stop relying on a module-level global.

const DISCOUNT_THRESHOLDS = [
  { minQuantity: 5, rate: 0.2 },
  { minQuantity: 3, rate: 0.1 },
];

function calculateItemTotal(item) {
  return item.price * item.quantity;
}

function applyPercentDiscount(amount) {
  return amount - amount * 0.1;
}

function applyBulkDiscount(item) {
  const amount = calculateItemTotal(item);
  const tier = DISCOUNT_THRESHOLDS.find((t) => item.quantity >= t.minQuantity);
  return tier ? amount - amount * tier.rate : amount;
}

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(name, price, quantity, category) {
    this.items.push({ name, price, quantity, category });
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
  }

  calculateTotal(discountType) {
    return this.items.reduce((total, item) => {
      if (discountType === 'percent') {
        return total + applyPercentDiscount(calculateItemTotal(item));
      }
      if (discountType === 'bulk') {
        return total + applyBulkDiscount(item);
      }
      return total + calculateItemTotal(item);
    }, 0);
  }
}

module.exports = { Cart };
