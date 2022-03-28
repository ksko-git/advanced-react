// Обертка
const wrapper = (func, {
    delay = 500,
    delaySinceCompletion = true,
    waitForPrevious = false,
    queueLimit = undefined
} = {}) => {
    const promises = { count: 0, queue: Promise.resolve() };
    const getDelay = () => new Promise(resolve => setTimeout(resolve, delay));

    return async (...props) => {
        if (promises.count >= queueLimit) return Promise.reject('Очередь заполнена!');

        promises.count++;
        const resultChain = promises.queue.then(async () => {
            promises.count--;
            return await func(...props);
        });

        promises.queue = (delaySinceCompletion
            ? resultChain
            : promises.queue
        ).then(waitForPrevious // Ожидаем выполнение либо delay времени, либо последнего промиса
            ? () => Promise.all([getDelay(), resultChain])
            : getDelay
        );
        return resultChain;
    }
}

// Тестирование
const setDelay = (delay) => new Promise(resolve => setTimeout(resolve, delay));

const checkEquality = (name, value, equalsTo) =>
    console.log(JSON.stringify(value) !== JSON.stringify(equalsTo)
        ? `Ожидается: ${equalsTo}, получено: ${value}`
        : `Тест "${name}" - пройден.`
    );

const functionWithDuration = (duration, output) => (
    async (number, { reject = false } = {}) => {
        output(`start of ${number}`);
        await setDelay(duration);
        if (reject) {
            output(`reject of ${number}`);
            throw number;
        } else {
            output(`end of ${number}`);
            return number;
        }
    }
);

const promissoryTemplate = async (func, result) => {
    func(1)
        .then(number => result.push(`${number} done`))
        .then(() => setDelay(5))
        .then(() => result.push('break'))
    func(2)
        .then(number => result.push(`${number} done`))
        .then(() => setDelay(5))
        .then(() => result.push('break'))
    await func(3)
        .then(number => result.push(`${number} done`))
}

// Кейсы
const firstTest = async () => {
    const result = [];
    const original = functionWithDuration(100, result.push.bind(result));
    const func = wrapper(
        original,
        {
            delay: 100,
            delaySinceCompletion: true,
            waitForPrevious: false,
            queueLimit: 5,
        }
    );
    await promissoryTemplate(func, result);
    checkEquality(
        'Выполнить последовательно без ожидания',
        result,
        [
            "start of 1","end of 1","1 done","break",
            "start of 2","end of 2","2 done","break",
            "start of 3","end of 3","3 done"
        ]
    );
}

const secondTest = async () => {
    const result = []
    const original = functionWithDuration(100, result.push.bind(result))
    const func = wrapper(
        original,
        {
            delay: 100,
            delaySinceCompletion: true,
            waitForPrevious: true,
            queueLimit: 5,
        }
    );
    await promissoryTemplate(func, result);
    checkEquality(
        'Выполнить последовательно с ожиданием предыдущей',
        result,
        [
            "start of 1","end of 1","1 done","break",
            "start of 2","end of 2","2 done","break",
            "start of 3","end of 3","3 done"
        ]
    )
}

const thirdTest = async () => {
    const result = []
    const original = functionWithDuration(100, result.push.bind(result))
    const func = wrapper(
        original,
        {
            delay: 10,
            delaySinceCompletion: false,
            waitForPrevious: false,
            queueLimit: 5,
        }
    );
    func(1)
        .then(number => result.push(`${number} done`))
    func(2)
        .then(number => result.push(`${number} done`))
    await func(3)
        .then(number => result.push(`${number} done`))
    checkEquality(
        'Выполнить асинхронно',
        result,
        [
            "start of 1","start of 2","start of 3",
            "end of 1","1 done",
            "end of 2","2 done",
            "end of 3","3 done"
        ]
    );
}

// Запуск тестов
Promise.resolve().then(firstTest).then(secondTest).then(thirdTest);