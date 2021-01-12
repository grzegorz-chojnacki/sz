'use strict'
const schedule = (tasks = [], machineNumber) => {
  const machines = Machine.make(machineNumber)

  const [root, ...rest] = tasks.filter(Task.isRoot)

  if (rest.length > 0) throw new Error('Graf ma kilka korzeni')
  else root.floodPriority()

  const scheduleTasks = (scheduled = []) => {
    const schedulable = tasks
      .filter(task => task.isSchedulableAfter(scheduled))
      .sort(Task.priorityOrder)
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
  static lMax     = machines => Machine.allTasks(machines).reduce(Task.lMax, -Infinity)
  static allTasks = machines => machines.flatMap(m => m.tasks)

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = (task = Task.gap) => this.tasks.push(task.withTime(this.tasks.length + 1))
  toString = () => `${this.id}: [${this.tasks.map(task => task.id)}]`
}
