'use strict'

const push     = (arr, a) => { arr.push(a); return a }
const insertAt = (index, e, arr) => arr.splice(index, 0, e)

class TaskMaster {
  machines = [ new Machine('M0') ]

  schedule = tasks => {
    tasks.map(task => this.getMachineFor(task).schedule(task))
    this.machines.forEach(Machine.fillGaps)
    return this.machines
  }

  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.prepareNew()

  prepareNew = () => push(this.machines, new Machine(`M${this.machines.length}`))
}

class Machine {
  static highestCMax = (max, m) => Math.max(max, m.cMax)
  static fillGaps = machine => machine.tasks
    .forEach((task, index) => Machine.buba(task, index, machine.tasks))

  get cMax() { return this.tasks[this.tasks.length - 1].endTime }

  static buba = (task, index, tasks) => {
    if (index > 0) {
      const prev = tasks[index - 1]
      const gap = Task.gap(prev, task)
      gap > 0 && insertAt(index, new Task('', gap, [prev]), tasks)
    }
  }

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.canSchedule(task) && this.tasks.push(task)

  canSchedule = task => !this.tasks
    .some(slot => Task.intersects(task, slot))

  toString = () => `${this.id}: ${this.tasks.map(task => task.toString())}`
}
