// Задание №2.
// Напишите proxy-обертку для объекта, которая умеет достраивать недостающие промежуточные вложенные узлы в объекте.
// Сделайте так, чтобы этот proxy-объект корректно конвертировался в JSON формат, при помощи метода JSON.stringify.
"use strict";

const fruitProxy = object => new Proxy(object, proxyHandler);

const proxyHandler = {
    get(target, prop) {
        if (prop === 'toJSON') return () => target;

        prop in target
            ? target[prop] = fruitProxy(target[prop])
            : target[prop] = fruitProxy({});

        return Reflect.get(target, prop)
    }
}

const proxy = fruitProxy({
    apple: { count: 7 },
    nectarine: {
        count: 7,
        country: {
            name: 'China',
            region: 'East Asia'
        }
    }
});

proxy.orange.count = 30;
proxy.melon.country.name = 'Turkey';
proxy.watermelon.country.region = 'West Asia';

console.log(JSON.stringify(proxy));
// output:
// {
// "apple":{"count":7},
// "nectarine":{"count":7,"country":{"name":"China","region":"East Asia"}},
// "orange":{"count":30},
// "melon":{"country":{"name":"Turkey"}},
// "watermelon":{"country":{"region":"West Asia"}}
// }
