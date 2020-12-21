'use strict'

const tasks = Task.parseList([
  { id: 'Z0', time: 5 },
  { id: 'Z1', time: 3 },
  { id: 'Z2', time: 4,  required: ['Z0', 'Z1'] },
  { id: 'Z3', time: 12, required: ['Z0', 'Z1'] },
  { id: 'Z4', time: 6,  required: ['Z2'] },
  { id: 'Z5', time: 11, required: ['Z2', 'Z3'] },
  { id: 'Z6', time: 2,  required: ['Z3'] },
  { id: 'Z7', time: 3,  required: ['Z4', 'Z6'] },
  // { id: 'Z8', time: 8,  required: ['Z2', 'Z1'] },
  // { id: 'Z9', time: 1,  required: ['Z5'] },
  // { id: 'ZA', time: 5,  required: ['Z8', 'Z6'] },
  // { id: 'ZB', time: 4,  required: ['Z2', 'Z8', 'ZA'] },
  // { id: 'ZC', time: 2,  required: ['Z5', 'Z6'] },
  // { id: 'ZD', time: 6,  required: ['Z8', 'ZC'] },
  // { id: 'ZE', time: 5,  required: ['Z1'] },
  // { id: 'ZF', time: 7,  required: ['Z9', 'Z3'] },
  // { id: 'Z8', time: 1,  required: ['Z8'] }
])

gui.draw(schedule(tasks))
