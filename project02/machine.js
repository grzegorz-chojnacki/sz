'use strict'

const schedule = (tasks = [], n) => {
  const labelTasks = (i = 1) => {
    const labelable = tasks.filter(task => task.isLabelable())
    if (labelable.length > 0) {
      const task = labelable.sort(Task.lexicographicOrder)[0]
      task.label = i
      labelTasks(i + 1)
    }
  }

  const machines = Machine.make(n)
  const scheduleTasks = (alreadyScheduled = []) => {
    const schedulable = tasks
      .filter(task => task.isSchedulableFor(alreadyScheduled))
      .slice(0, machines.length)

    if (schedulable.length > 0) {
      machines.forEach((machine, i) => machine.schedule(schedulable[i]))
      scheduleTasks(alreadyScheduled.concat(schedulable))
    }
  }

  labelTasks()
  tasks.sort(Task.labelOrder)
  scheduleTasks()

  return machines
}

class Machine {
  static make = n => new Array(n).fill().map((_, i) => new Machine(`M${i + 1}`))
  static cMax = machines => machines
    .reduce((max, machine) => Math.max(max, machine.tasks.length), 0)

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.tasks.push(task || Task.gap)
  toString = () => `${this.id}: [${this.tasks.map(task => task.label)}]`
}
