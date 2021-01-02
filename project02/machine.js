'use strict'

const schedule = (tasks = []) => {
  const machines = [ new Machine('M1'), new Machine('M2') ];

  (function processTasks(i = 1) {
    const schedulable = tasks.filter(task => task.isSchedulable())
    if (schedulable.length > 0) {
      const task = schedulable.sort(Task.lexicographicOrder)[0]
      task.label = i
      return processTasks(i + 1)
    }
  })()

  return tasks.sort(Task.labelOrder)
}

class Machine {
  constructor(id) {
    this.id = id
    this.tasks = []
  }

  toString = () => `${this.id}: [${this.tasks.map(task => task.toString())}]`
}
