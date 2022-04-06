// Из лекции.
"use strict";

// ============= ДЕСРКИПТОРЫ =============

// получить свойства объекта
const object = { a: 10 };
object.b = 20;
console.log(Object.getOwnPropertyDescriptors(object));

// установить свойства объекта
const obj = {};
Object.defineProperty(obj, 'a', {});
Object.defineProperty(obj, 'b', { value: 1 });
Object.defineProperty(obj, 'c', { value: 2, writable: true });
Object.defineProperty(obj, 'd', { value: 3, writable: true, configurable: true, enumerable: true });
console.log(Object.getOwnPropertyDescriptors(obj))

// TypeError: Cannot assign to read only property 'a' of object '#<Object>'
const obj2 = Object.defineProperty({}, 'a', { writable: false })
obj2.a = 1;

// 1) writable - возможность изменять объект
// 2) configurable - возможность переконфигурировать (переопределить) или удалить свойство
// 3) enumerable - видно ли свойство при перечислении циклом for..in, spread оператором, методом Object.keys
// остальные свойства объекта будут видны, а те, что имеют { enumerable: false } - нет

// Дескрипторы не копируются!

// Свойства аксессоры.
const person = Object.defineProperty(
    { lastName: 'Ko', firstName: 'Ks' },
    'name',
    {
        get() { return `${this.lastName} ${this.firstName}` },
        set(value) { [this.lastName, this.firstName] = value.split(" ") }
    }
);
person.name = 'Qw We';
console.log({ ...person });


// Конфигурирование целого объекта, а не отдельных свойств:

// Object.preventExtensions(obj) - запретить расширение объекта
// Object.isExtensible(obj) - вернет false, если было запрещено расширение объекта

// Object.seal(obj) - дополнительно к запрещению расширения не разрешается удалять существующие свойства
// Object.isSealed(obj) - проверка на это

// Object.freeze(obj) - в дополнение к запретам выше запрещаем изменения существующих свойств объекта - получается "объект константа"
// Object.isFrozen(obj) - проверка