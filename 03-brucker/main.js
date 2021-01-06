'use strict'
try {
  const tasks = Task.parseList([
    { id: 'Z32', deadline:  5 },
    { id: 'Z31', deadline:  3, required: ['Z32'] },
    { id: 'Z30', deadline:  5 },
    { id: 'Z29', deadline:  7, required: ['Z31', 'Z30'] },
    { id: 'Z28', deadline:  8, required: ['Z29'] },
    { id: 'Z27', deadline: 10, required: ['Z28'] },
    { id: 'Z26', deadline:  9, required: ['Z27'] },
    { id: 'Z25', deadline: 12, required: ['Z26'] },
    { id: 'Z24', deadline: 11, required: ['Z25'] },
    { id: 'Z23', deadline:  4 },
    { id: 'Z22', deadline:  5, required: ['Z23'] },
    { id: 'Z21', deadline:  6, required: ['Z22'] },
    { id: 'Z20', deadline:  3 },
    { id: 'Z19', deadline:  2, required: ['Z20'] },
    { id: 'Z18', deadline:  8, required: ['Z21', 'Z19'] },
    { id: 'Z17', deadline: 10, required: ['Z18'] },
    { id: 'Z16', deadline:  9, required: ['Z17'] },
    { id: 'Z15', deadline: 10, required: ['Z16'] },
    { id: 'Z14', deadline:  7 },
    { id: 'Z13', deadline:  9, required: ['Z14'] },
    { id: 'Z12', deadline:  8, required: ['Z13'] },
    { id: 'Z11', deadline: 10, required: ['Z15'] },
    { id: 'Z10', deadline:  4 },
    { id:  'Z9', deadline:  6, required: ['Z10'] },
    { id:  'Z8', deadline:  6, required: ['Z9'] },
    { id:  'Z7', deadline: 17, required: ['Z8'] },
    { id:  'Z6', deadline: 14, required: ['Z7'] },
    { id:  'Z5', deadline: 15, required: ['Z11', 'Z12', 'Z24'] },
    { id:  'Z4', deadline:  3 },
    { id:  'Z3', deadline:  4, required: ['Z4'] },
    { id:  'Z2', deadline: 20, required: ['Z5'] },
    { id:  'Z1', deadline: 16, required: ['Z3', 'Z2', 'Z6'] },
  ])
  const machineNumber = 4
  gui.draw(schedule(tasks, machineNumber))
} catch (e) { gui.error(e) }
