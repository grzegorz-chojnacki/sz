'use strict'

const z1 = new Task('Z1', 5)
const z2 = new Task('Z2', 3)
const z3 = new Task('Z3', 4,  [z1, z2])
const z4 = new Task('Z4', 12, [z1, z2])
const z5 = new Task('Z5', 6,  [z3])
const z6 = new Task('Z6', 11, [z3, z4])
const z7 = new Task('Z7', 2,  [z4])
const z8 = new Task('Z8', 3,  [z5, z7])
const z9 = new Task('Z9', 1); z9.required = [z9]

const tasks = [z7, z5, z2, z8, z1, z4, z6, z3]
// const tasks = [z1, z2, z3, z4, z5, z6, z7, z8]
// const tasks = [z8, z7, z6, z5, z4, z3, z2, z1]
// const tasks = [z8, z7, z6, z5, z4, z3, z2, z1, z9]

const machines = new TaskMaster().schedule(tasks)
gui.draw(machines)
