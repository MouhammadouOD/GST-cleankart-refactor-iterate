/**
 * Strategy pattern: Cart.calculateTotal() is injected with one of these
 * instead of branching on a string, like iteration 1 did.
 */
class DiscountStrategy {
  apply(_item) {
    throw new Error('apply() must be implemented by subclass');
  }
}

class NoDiscountStrategy extends DiscountStrategy {
  apply(item) {
    return item.price * item.quantity;
  }
}

class PercentageDiscountStrategy extends DiscountStrategy {
  constructor(rate = 0.1) {
    super();
    this.rate = rate;
  }

  apply(item) {
    const amount = item.price * item.quantity;
    return amount - amount * this.rate;
  }
}

class BulkDiscountStrategy extends DiscountStrategy {
  constructor(thresholds = [{ minQuantity: 5, rate: 0.2 }, { minQuantity: 3, rate: 0.1 }]) {
    super();
    this.thresholds = thresholds;
  }

  apply(item) {
    const amount = item.price * item.quantity;
    const tier = this.thresholds.find((t) => item.quantity >= t.minQuantity);
    return tier ? amount - amount * tier.rate : amount;
  }
}

module.exports = { DiscountStrategy, NoDiscountStrategy, PercentageDiscountStrategy, BulkDiscountStrategy };
