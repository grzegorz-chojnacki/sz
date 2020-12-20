'use strict'

const push = (arr, a) => { arr.push(a); return a }

class TaskMaster {
  machines = [ new Machine('M0') ]

  schedule = tasks => {
    tasks.map(task => this.getMachineFor(task).schedule(task))
    this.machines.forEach(Machine.sortTasks)
    return this.machines
  }

  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.addMachine()

  addMachine = () => push(this.machines, new Machine(`M${this.machines.length}`))
}

class Machine {
  static highestCMax  = (max, m) => Math.max(max, m.cMax)
  static sortTasks    = m => Task.startTimeOrder(m.tasks)

  get cMax() { return this.tasks[this.tasks.length - 1].endTime }

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.canSchedule(task) && this.tasks.push(task)
  canSchedule = task => !this.tasks.some(slot => Task.intersects(task, slot))

  toString = () => `${this.id}: ${this.tasks.map(task => task.toString())}`
}
