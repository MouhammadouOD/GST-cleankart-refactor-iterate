# CleanKart — Refactoring Summary Report

## Iteration 0 → 1: basic refactoring techniques

Starting point (`iteration-0-messy/cart.js`): a module-level global array, one-letter parameter and function names (`a`, `c`, `x`), and a single `calc()` function that mixes item-total math with two different discount formulas inline, duplicated in an if/else chain.

Changes applied:
- **Rename variables and methods**: `a` → `addItem`, `c` → `items`, `calc` → `calculateTotal`, `rm` → `removeItem`.
- **Extract methods**: pulled `calculateItemTotal()`, `applyPercentDiscount()` and `applyBulkDiscount()` out of the one giant function.
- **Remove duplication**: the bulk-discount tier logic (`>= 5` / `>= 3`) was written once as a `DISCOUNT_THRESHOLDS` table instead of nested if/else.
- **Encapsulate state**: the global `c` array became `this.items` inside a `Cart` class — no more module-level mutable state.

Result verified: `tests.js` checks iteration 0 and iteration 1 produce the exact same total for the same input (50 → 40 with a bulk discount on qty 5), so the refactor provably changed nothing about behavior, only structure.

## Iteration 1 → 2: introducing design patterns

The `discountType` string parameter in iteration 1 (`'percent'` / `'bulk'`) was a code smell on its own — adding a new discount type meant editing `Cart.calculateTotal()` again. Iteration 2 fixes the three remaining structural issues with three patterns:

- **Strategy** (`strategies/DiscountStrategy.js`): `NoDiscountStrategy`, `PercentageDiscountStrategy`, `BulkDiscountStrategy` are interchangeable objects injected into `Cart`'s constructor. `Cart` no longer knows how any discount is computed — it just calls `strategy.apply(item)`. Adding a new discount type is now a new class, not an edit to `Cart`.
- **Builder** (`builders/ProductBuilder.js`): `Product` has two required fields (name, price) and three optional ones (category, description, tags). Instead of a constructor call with five positional arguments that's easy to get wrong, `ProductBuilder` sets each field explicitly and validates before `build()`.
- **Observer** (`models/Product.js` + `observers/Customer.js`): a brand-new feature the messy version never had — customers can subscribe to a product and get notified only when its price actually drops (not on every price change, see the mutation test in `tests.js` that proves this guard is real).

## Why this matters

- **Clean code principles followed**: single responsibility (each class does one thing), descriptive names, no magic strings routing behavior (`discountType === 'percent'` is gone), small functions.
- **How patterns improved design**: Strategy and Builder both remove branching/positional-argument fragility by replacing it with explicit objects; Observer adds new behavior (price-drop alerts) without touching `Cart` or `Product`'s core responsibilities at all — it's additive, not invasive.
- **Testability**: every iteration is independently testable; `tests.js` proves iteration 0 and 1 are behaviorally identical, then proves each pattern in iteration 2 is genuinely exercised (not just declared) via a mutation test on the Observer's price-drop guard.
