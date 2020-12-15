'use strict'

const z1 = new Task('z1', 5)
const z2 = new Task('z2', 3)
const z3 = new Task('z3', 4,  [z1, z2])
const z4 = new Task('z4', 12, [z1, z2])
const z5 = new Task('z5', 6,  [z3])
const z6 = new Task('z6', 11, [z3, z4])
const z7 = new Task('z7', 2,  [z4])
const z8 = new Task('z8', 3,  [z5, z7])

const tasks = Task.topologicalOrder([z7, z5, z2, z8, z1, z4, z6, z3])
console.log(tasks.map(task => task.toString()))
console.log('Cyclic tasks?: ', areCyclic(tasks))

// const z9 = new Task('z9', 1); z9.required = [z9]
// const cyclic = [z9, ...tasks]
// console.log('cyclic tasks: ', areCyclic(cyclic))

console.log(tasks.map(task => task.toString()))
console.log(new TaskMaster().schedule(tasks).map(m => m.toString()))
