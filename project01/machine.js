'use strict'

const schedule = tasks => {
  const machines = [ new Machine('M0') ]
  const add = m => { machines.push(m); return m }
  const next = (arr, a) => arr[arr.findIndex(x => x === a) + 1]
  const getMachineFor = task => machines.find(m => m.canSchedule(task))
    || add(new Machine(`M${machines.length}`))

  tasks.forEach(task => getMachineFor(task).schedule(task))

  machines.forEach(m => m.tasks.slice()
    .reverse()
    .forEach(task => task.shiftRight(next(m.tasks, task), Machine.highestCMax(machines))))

  return machines
}

class Machine {
  static highestCMax = machines => machines.reduce((max, m) => Math.max(max, m.cMax), 0)

  get cMax() { return this.tasks[this.tasks.length - 1].endTime }

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule    = task => this.tasks.push(task)
  canSchedule = task => !this.tasks.some(slot => Task.intersects(task, slot))

  toString = () => `${this.id}: ${this.tasks.map(task => task.toString())}`
}
