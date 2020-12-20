'use strict'

const z1 = new Task('Z1', 5)
const z2 = new Task('Z2', 3)
const z3 = new Task('Z3', 4,  [z1, z2])
const z4 = new Task('Z4', 12, [z1, z2])
const z5 = new Task('Z5', 6,  [z3])
const z6 = new Task('Z6', 11, [z3, z4])
const z7 = new Task('Z7', 2,  [z4])
const z8 = new Task('Z8', 3,  [z5, z7])

const tasks = [z7, z5, z2, z8, z1, z4, z6, z3]
// const tasks = [z1, z2, z3, z4, z5, z6, z7, z8]
// tasks.forEach(task => console.log(task.toString()))
// console.log('Tasks have a cycle?: ', haveCycle(tasks))

// const z9 = new Task('Z9', 1); z9.required = [z9]
// const cyclic = [z9, ...tasks]
// console.log('Cyclic tasks have a cycle?: ', haveCycle(cyclic))

const machines = new TaskMaster().schedule(tasks)
machines.forEach(m => console.log(m.toString()))
gui.drawSchedule(machines)
gui.drawDelayedSchedule(machines)
