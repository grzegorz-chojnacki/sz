'use strict'

const z0 = new Task('Z0', 5)
const z1 = new Task('Z1', 3)
const z2 = new Task('Z2', 4,  [z0, z1])
const z3 = new Task('Z3', 12, [z0, z1])
const z4 = new Task('Z4', 6,  [z2])
const z5 = new Task('Z5', 11, [z2, z3])
const z6 = new Task('Z6', 2,  [z3])
const z7 = new Task('Z7', 3,  [z4, z6])
const z8 = new Task('Z8', 1); z8.required = [z8]

// const tasks = [z6, z4, z1, z7, z0, z3, z5, z2]
// const tasks = [z0, z1, z2, z3, z4, z5, z6, z7]
const tasks = [z7, z6, z5, z4, z3, z2, z1, z0]
// const tasks = [z7, z6, z5, z4, z3, z2, z1, z0, z8]

const machines = new TaskMaster().schedule(tasks)
gui.draw(machines)
