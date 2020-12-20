'use strict'

class TaskMaster {
  machines = [ new Machine('M0') ]

  schedule = tasks => {
    tasks.forEach(task => this.getMachineFor(task).schedule(task))

    this.machines.forEach(m => m.tasks.slice()
      .reverse()
      .forEach(task => task.shiftRigthIn(m.tasks, Machine.highestCMax(this.machines))))

    return this.machines
  }

  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.add(new Machine(`M${this.machines.length}`))

  add = m => { this.machines.push(m); return m }
}

class Machine {
  static highestCMax = machines => machines.reduce((max, m) => Math.max(max, m.cMax), 0)

  get cMax() { return this.tasks[this.tasks.length - 1].endTime }

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.canSchedule(task) && this.tasks.push(task)
  canSchedule = task => !this.tasks.some(slot => Task.intersects(task, slot))

  toString = () => `${this.id}: ${this.tasks.map(task => task.toString())}`
}
