/**
 * Observer pattern (concrete observer side): a Customer subscribes to a
 * Product (see Product.subscribe) and reacts when Product.setPrice()
 * lowers the price. The Product never needs to know Customer exists beyond
 * this interface.
 */
class Customer {
  constructor(name) {
    this.name = name;
    this.notifications = [];
  }

  onPriceDrop(product, oldPrice, newPrice) {
    this.notifications.push(`${product.name} dropped from $${oldPrice} to $${newPrice}`);
  }
}

module.exports = { Customer };
