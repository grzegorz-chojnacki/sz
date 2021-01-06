'use strict'
const schedule = (tasks = [], machineNumber) => {
  const machines = Machine.make(machineNumber)
  tasks.filter(Task.isRoot).forEach(task => task.updateDeadline())

  const scheduleTasks = (scheduled = []) => {
    const schedulable = tasks
      .filter(task => task.isSchedulableFor(scheduled))
      .sort(Task.deadlineOrder)
      .slice(0, machineNumber)

    if (schedulable.length > 0) {
      machines.forEach((machine, i) => machine.schedule(schedulable[i]))
      scheduleTasks(scheduled.concat(schedulable))
    }
  }

  scheduleTasks()
  return machines
}

class Machine {
  static make     = n => new Array(n).fill().map((_, i) => new Machine(`M${i + 1}`))
  static cMax     = machines => machines.reduce((max, m) => Math.max(max, m.tasks.length), 0)
  static allTasks = machines => machines.flatMap(m => m.tasks)

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.tasks.push(task || Task.gap)
  toString = () => `${this.id}: [${this.tasks.map(task => task.id)}]`
}
