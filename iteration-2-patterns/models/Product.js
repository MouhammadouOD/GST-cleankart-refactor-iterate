class Product {
  constructor({ name, price, category, description, tags }) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.description = description;
    this.tags = tags;
    this.subscribers = new Set(); // Observer pattern: who to notify on price drop
  }

  subscribe(observer) {
    this.subscribers.add(observer);
  }

  unsubscribe(observer) {
    this.subscribers.delete(observer);
  }

  setPrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;
    if (newPrice < oldPrice) {
      this.subscribers.forEach((observer) => observer.onPriceDrop(this, oldPrice, newPrice));
    }
  }
}

module.exports = { Product };
