// ЛЕКЦИЯ №1

const f = (x, y, z) => console.log(x, y, z)

const withMeta = (f, length, name) => {
  Object.defineProperty(f, 'length', { value: length, writable: false })
  Object.defineProperty(f, 'name', { value: name, writable: false })
  return f
}


const simpleCurry = original => {
  return original.length
    ? withMeta(
        (...args) => {
          const f = simpleCurry(original.bind(null, ...args))
          return f
        },
        original.length,
        original.name
    )
    : original()
}

const g = simpleCurry(f)

g(1)(2)(3)
g(1, 2)(3)
g(1)(2, 3)

console.log(g.name)
console.log(g.length)


// getRelevantArguments:
// [1, _, 3]   Result:   [ { index: 0, value: 1 }, { index: 2, value: 3 } ]
// [2]   Result:  [{ index: 0, value: 2 }]

// unfold:
// [
//   [{ index: 0, value: 2 }], //relevantArguments
//   [ { index: 0, value: 1 }, { index: 2, value: 3 } ]
// ]
// Result: [1, 2, 3]


/////////////////////////////////////////////////
// Utility code

const _ = Symbol('_')

const curry = original => {

  const getRelevantArguments = args => args.reduce(
    (acc, value, index) => value === _ ? acc : [ ...acc, { index, value } ]
    , []
  )

  const unfold = argumentsList => argumentsList.reduce(
    (acc, relevantArguments) => {


      return relevantArguments.reduce(
        (acc2, { index, value }) => {
          acc2.splice(index, 0, value)
          return acc2
        }, acc
      )


    }, []
  )

  const _curry = (length, argumentsList) => {
    return length
      ? withMeta(
          (...args) => {
            const relevantArguments = getRelevantArguments(args)
            return _curry( length - relevantArguments.length, [ relevantArguments, ...argumentsList ])
          },
          length,
          `curried ${original.name}`
        )
      : original( ...unfold(argumentsList) )
  }

  return _curry(original.length, [])
}

curry._ = _

////////
// Client code

const h = curry(f)

h(_, 2, 3)(1) 
h(1, _, 3)(2)
h(_, 2)(_, 3)(1)
h(_)(_,_,_)(_,_,3)(_,2)(1)

console.log(h.name)
console.log(h.length)