const assert = require('assert');
const messyCart = require('./iteration-0-messy/cart');
const { Cart: RefactoredCart } = require('./iteration-1-refactored/cart');
const { ProductBuilder } = require('./iteration-2-patterns/builders/ProductBuilder');
const {
  NoDiscountStrategy,
  PercentageDiscountStrategy,
  BulkDiscountStrategy,
} = require('./iteration-2-patterns/strategies/DiscountStrategy');
const { Customer } = require('./iteration-2-patterns/observers/Customer');
const { Cart: PatternedCart } = require('./iteration-2-patterns/Cart');

const TOTAL_TESTS = 11;
let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

console.log('Iteration 0 (messy) vs Iteration 1 (refactored) — same behavior, cleaner code');
{
  test('les deux donnent le même résultat pour une remise bulk (preuve que le refactor n\'a rien cassé)', () => {
    messyCart.c.length = 0;
    messyCart.a('Widget', 10, 5, 'misc');
    const messyTotal = messyCart.calc('bulk');

    const refactored = new RefactoredCart();
    refactored.addItem('Widget', 10, 5, 'misc');
    const refactoredTotal = refactored.calculateTotal('bulk');

    assert.strictEqual(messyTotal, refactoredTotal);
    assert.strictEqual(refactoredTotal, 40); // 10*5 = 50, -20% = 40
  });

  test('removeItem fonctionne de façon identique dans les deux versions', () => {
    messyCart.c.length = 0;
    messyCart.a('Widget', 10, 1, 'misc');
    messyCart.rm('Widget');
    assert.strictEqual(messyCart.c.length, 0);

    const refactored = new RefactoredCart();
    refactored.addItem('Widget', 10, 1, 'misc');
    refactored.removeItem('Widget');
    assert.strictEqual(refactored.items.length, 0);
  });

  test('removeItem avec un nom dupliqué retire TOUTES les occurrences dans les deux versions', () => {
    // Avant le 2026-11-05, la version messy ne retirait que la 1re occurrence
    // (splice+return), la version refactorée les retirait toutes (filter) -
    // divergence jamais détectée car l'ancien test n'utilisait qu'un seul
    // article. Ce test échouerait avec l'ancien comportement messy.
    messyCart.c.length = 0;
    messyCart.a('Widget', 10, 1, 'misc');
    messyCart.a('Widget', 10, 1, 'misc');
    messyCart.rm('Widget');
    assert.strictEqual(messyCart.c.length, 0);

    const refactored = new RefactoredCart();
    refactored.addItem('Widget', 10, 1, 'misc');
    refactored.addItem('Widget', 10, 1, 'misc');
    refactored.removeItem('Widget');
    assert.strictEqual(refactored.items.length, 0);
  });
}

console.log('Iteration 2 — Builder (Product)');
{
  test('ProductBuilder construit un Product valide avec les champs optionnels par défaut', () => {
    const product = new ProductBuilder().setName('Keyboard').setPrice(50).build();
    assert.strictEqual(product.name, 'Keyboard');
    assert.strictEqual(product.price, 50);
    assert.strictEqual(product.category, 'General');
  });

  test('ProductBuilder refuse un Product sans nom ou avec un prix invalide', () => {
    assert.throws(() => new ProductBuilder().setPrice(10).build());
    assert.throws(() => new ProductBuilder().setName('Mouse').setPrice(-5).build());
  });
}

console.log('Iteration 2 — Strategy (discount)');
{
  test('changer la stratégie injectée change réellement le total (preuve que ce n\'est pas hardcodé)', () => {
    const product = new ProductBuilder().setName('Widget').setPrice(10).build();
    const cart = new PatternedCart(new NoDiscountStrategy());
    cart.addItem(product, 5);

    assert.strictEqual(cart.calculateTotal(), 50);

    cart.setDiscountStrategy(new PercentageDiscountStrategy(0.1));
    assert.strictEqual(cart.calculateTotal(), 45);

    cart.setDiscountStrategy(new BulkDiscountStrategy());
    assert.strictEqual(cart.calculateTotal(), 40);
  });
}

console.log('Iteration 2 — Observer (price drop)');
{
  test('un Customer abonné est notifié quand le prix baisse', () => {
    const product = new ProductBuilder().setName('Monitor').setPrice(200).build();
    const alice = new Customer('Alice');
    product.subscribe(alice);

    product.setPrice(150);

    assert.strictEqual(alice.notifications.length, 1);
    assert.ok(alice.notifications[0].includes('Monitor'));
  });

  test('un Customer non abonné n\'est jamais notifié', () => {
    const product = new ProductBuilder().setName('Monitor').setPrice(200).build();
    const bob = new Customer('Bob');
    // bob never subscribes

    product.setPrice(150);

    assert.strictEqual(bob.notifications.length, 0);
  });

  test('une hausse de prix ne déclenche AUCUNE notification (preuve que le test est discriminant)', () => {
    const product = new ProductBuilder().setName('Monitor').setPrice(200).build();
    const alice = new Customer('Alice');
    product.subscribe(alice);

    product.setPrice(250); // price goes UP

    assert.strictEqual(alice.notifications.length, 0);
  });

  test('se désabonner arrête bien les notifications futures', () => {
    const product = new ProductBuilder().setName('Monitor').setPrice(200).build();
    const alice = new Customer('Alice');
    product.subscribe(alice);
    product.unsubscribe(alice);

    product.setPrice(100);

    assert.strictEqual(alice.notifications.length, 0);
  });
}

console.log('Intégration (Builder + Strategy + Observer ensemble)');
{
  test('un produit construit via Builder, mis en panier avec une Strategy, et observé, fonctionne de bout en bout', () => {
    const product = new ProductBuilder().setName('Headphones').setPrice(80).addTag('audio').build();
    const alice = new Customer('Alice');
    product.subscribe(alice);

    const cart = new PatternedCart(new PercentageDiscountStrategy(0.25));
    cart.addItem(product, 2);
    assert.strictEqual(cart.calculateTotal(), 120); // 160 - 25%

    product.setPrice(60);
    assert.strictEqual(alice.notifications.length, 1);
  });
}

assert.strictEqual(passed, TOTAL_TESTS, `attendu ${TOTAL_TESTS}, ${passed} exécutés`);
console.log(`\n${passed}/${TOTAL_TESTS} tests passent`);
