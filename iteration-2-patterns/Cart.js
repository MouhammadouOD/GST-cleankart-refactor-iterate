class Cart {
  constructor(discountStrategy) {
    this.items = [];
    this.discountStrategy = discountStrategy;
  }

  addItem(product, quantity) {
    this.items.push({ name: product.name, price: product.price, quantity });
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
  }

  setDiscountStrategy(discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  calculateTotal() {
    return this.items.reduce((total, item) => total + this.discountStrategy.apply(item), 0);
  }
}

module.exports = { Cart };
