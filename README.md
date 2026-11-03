# CleanKart: Refactor & Iterate an Online Shopping Cart

GoMyCode checkpoint — *Low Level Design: Refactoring Techniques & Iterative Development*.

Three tracked iterations of the same shopping cart, from intentionally bad code to a design-pattern-based architecture (Strategy, Builder, Observer).

## Project structure

| Path | Role |
|---|---|
| `iteration-0-messy/cart.js` | Starting point — intentionally bad: globals, cryptic names, duplicated discount logic |
| `iteration-1-refactored/cart.js` | Basic refactoring: renamed, extracted, de-duplicated — no patterns yet |
| `iteration-2-patterns/` | **Strategy** (`strategies/DiscountStrategy.js`), **Builder** (`builders/ProductBuilder.js`), **Observer** (`models/Product.js` + `observers/Customer.js`), composed in `Cart.js` |
| `tests.js` | 10 tests spanning all 3 iterations |
| `SUMMARY.md` | Full report: what changed, why, how each pattern improved the design |

## How to run

```bash
npm test
```

## Résultats

```
10/10 tests passent
```
Exécution réelle vérifiée le 03/11/2026. Test de mutation effectué (le garde-fou "notifier seulement sur une baisse de prix" remplacé par "notifier sur tout changement") : le test "une hausse de prix ne déclenche AUCUNE notification" échoue bien dans ce cas, confirmant que le mécanisme Observer est réellement exercé, pas seulement déclaré.

Voir [`SUMMARY.md`](./SUMMARY.md) pour le rapport complet demandé par le brief.
