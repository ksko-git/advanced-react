// Задание №3.
// Доработайте функцию, написанную на практической части занятия:
// - добавьте ленивый filter;
// - замените итераторы на генераторы;
// - добавьте поддержку работы с промисами - асинхронные генераторы.
"use strict";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('0:', ...numbers);

const iterator = {
    next() {
        this.item = (this.item || 0) + 1;
        return this.item <= numbers.length
            ? { value: this.item, done: false }
            : delete this.item && { done: true }
    },
    [Symbol.iterator]() { return this },
};
// numbers.map(i => console.log(iterator.next().value));

const lazy = (object) => {
    const generator = {
        *lazyMap(predicate) {
            let i = 0;
            for (const item of object) yield predicate(item, i++)
        },
        *lazyFilter(predicate) {
            let i = 0;
            for (const item of object) if (predicate(item, i++)) yield item;
        }
    }
    return new Proxy(
        object,
        {
            get(target, prop) {
                return generator[prop]
                    ? (object) => lazy(generator[prop](object))
                    : Reflect.get(target, prop).bind(target);
            }
        }
    )
}

// console.log(lazy(iterator));
// console.log(...lazy(iterator));
console.log(
    '1:',
    ...lazy(iterator).lazyMap(item => item * 3)
);
console.log(
    '2:',
    ...lazy(iterator)
        .lazyMap(item => item * 2)
        .lazyFilter(item => Number.isInteger(item / 4))
);
console.log(
    '3:',
    ...lazy(iterator)
        .lazyMap(item => item * 2)
        .lazyFilter(item => Number.isInteger(item / 4))
        .lazyFilter(item => item < 16)
);
console.log(
    '4:',
    ...lazy(iterator)
        .lazyMap(item => item * 2)
        .lazyFilter(item => Number.isInteger(item / 4))
        .lazyFilter(item => item < 16)
        .lazyMap(item => item * 13)
        .lazyMap(item => item / 2)
);