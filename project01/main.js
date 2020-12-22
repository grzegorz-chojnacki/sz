'use strict'

const tasks = Task.parseList([
  { id: 'Z1', time: 5 },
  { id: 'Z2', time: 3 },
  { id: 'Z3', time: 4,  required: ['Z1', 'Z2'] },

  { id: 'Z4', time: 12, required: ['Z1', 'Z2'] },
  { id: 'Z5', time: 6,  required: ['Z3'] },
  { id: 'Z6', time: 11, required: ['Z3', 'Z4'] },
  { id: 'Z7', time: 2,  required: ['Z4'] },
  { id: 'Z8', time: 3,  required: ['Z5', 'Z7'] },

  // { id: 'Z9', time: 8,  required: ['Z3', 'Z2'] },
  // { id: 'ZA', time: 1,  required: ['Z6'] },
  // { id: 'ZB', time: 5,  required: ['Z9', 'Z7'] },
  // { id: 'ZC', time: 4,  required: ['Z3', 'Z9', 'ZB'] },
  // { id: 'ZD', time: 2,  required: ['Z6', 'Z7'] },
  // { id: 'ZE', time: 6,  required: ['Z9', 'ZD'] },
  // { id: 'ZF', time: 5,  required: ['Z2'] },
  // { id: 'ZG', time: 7,  required: ['ZA', 'Z4'] },

  // { id: 'ZH', time: 1,  required: ['ZH'] }
])

gui.draw(schedule(tasks))
