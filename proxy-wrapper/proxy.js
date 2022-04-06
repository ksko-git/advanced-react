// ============= PROXY =============

// Proxy - обертка над объектом, которая может перехватывать обращение к объекту, тем самым влияя на его поведение.

// new Proxy(target, handler)
// target - целевой объект, вокруг которого оборачивается прокси, перехватывая обращение к этому объекту
// handler - объект с перехватчиками (ловушками), представляющими из себя функции

// Пример без ловушек:
const original = {};
const proxy = new Proxy(original, {});
proxy.a = 10;
console.log(proxy.a, original.a);

// пример перехватчика get
const getProxy = (target, emptyValue) => (
    new Proxy(target, {
        get(target, prop) {
            return prop in target ? target[prop] : emptyValue
        }
    })
);

const numbers = getProxy([0, 1, 2], 'oi!');
console.log(numbers[2]);
console.log(numbers[10]);

// пример перехватчика set - должен вернуть true или false, если ошибка
const getAnotherProxy = target => (
    new Proxy(target, {
        set(target, prop, value) {
            return typeof value === 'number'
                ? (target[prop] = value, true)
                : false
        }
    })
);

const anotherNumbers = getAnotherProxy([0, 'meow']);
anotherNumbers.push(2);
anotherNumbers[0] = 10; // если попытаться записать сюда строку, то выскочит ошибка
console.log('anotherNumbers', anotherNumbers);

// Reflect - встроенный объект, с помощью которого можно вызывать внутренние методы
// переписанный метод getAnotherProxy с использованием Reflect:
const getAnotherProxyWithReflect = target => (
    new Proxy(target, {
        set(target, prop, value, receiver) {
            return typeof value === 'number'
                ? Reflect.set(target, prop, value, receiver)
                : false
        }
    })
);

