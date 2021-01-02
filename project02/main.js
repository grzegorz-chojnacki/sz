'use strict'
try {
  const tasks = Task.parseList([
    { id:  'Z1' },
    { id:  'Z2' },
    { id:  'Z3', required: [ 'Z2'] },
    { id:  'Z4', required: [ 'Z1',  'Z3'] },
    { id:  'Z6' },
    { id:  'Z5', required: [ 'Z1',  'Z2',  'Z6'] },
    { id:  'Z7', required: [ 'Z1',  'Z3'] },
    { id:  'Z8', required: [ 'Z3'] },
    { id:  'Z9', required: [ 'Z4',  'Z5',  'Z7'] },
    { id: 'Z10', required: [ 'Z5'] },
    { id: 'Z11', required: [ 'Z7'] },
    { id: 'Z12', required: [ 'Z5',  'Z6',  'Z8'] },
    { id: 'Z13', required: [ 'Z6',  'Z8'] },
    { id: 'Z14', required: [ 'Z7'] },
    { id: 'Z15', required: [ 'Z9', 'Z10', 'Z11', 'Z12'] },
    { id: 'Z16', required: ['Z11', 'Z13'] },
    { id: 'Z18', required: ['Z13', 'Z14'] },
    { id: 'Z17', required: ['Z10', 'Z12', 'Z16', 'Z18'] },
    { id: 'Z19', required: ['Z11', 'Z14'] },
  ])

  gui.draw(schedule(tasks))
} catch (e) { gui.error(e) }
