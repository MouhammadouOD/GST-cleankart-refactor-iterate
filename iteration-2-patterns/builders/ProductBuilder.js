const { Product } = require('../models/Product');

/**
 * Builder pattern: Product has two required fields and several optional
 * ones. Instead of a constructor with a long, error-prone argument list,
 * the builder lets each field be set explicitly and validates before build().
 */
class ProductBuilder {
  constructor() {
    this._name = null;
    this._price = null;
    this._category = 'General';
    this._description = '';
    this._tags = [];
  }

  setName(name) {
    this._name = name;
    return this;
  }

  setPrice(price) {
    this._price = price;
    return this;
  }

  setCategory(category) {
    this._category = category;
    return this;
  }

  setDescription(description) {
    this._description = description;
    return this;
  }

  addTag(tag) {
    this._tags.push(tag);
    return this;
  }

  build() {
    if (!this._name) throw new Error('Product requires a name');
    if (typeof this._price !== 'number' || this._price < 0) {
      throw new Error('Product requires a valid non-negative price');
    }
    return new Product({
      name: this._name,
      price: this._price,
      category: this._category,
      description: this._description,
      tags: [...this._tags],
    });
  }
}

module.exports = { ProductBuilder };
