'use strict'

const push = (arr, a) => { arr.push(a); return a }
const next = (arr, a) => arr[arr.findIndex(x => x === a) + 1]
const prev = (arr, a) => arr[arr.findIndex(x => x === a) - 1]

class TaskMaster {
  machines = [ new Machine('M0') ]

  schedule = tasks => {
    tasks.map(task => this.getMachineFor(task).schedule(task))

    this.machines.forEach(m => Task.startTimeOrder(m.tasks))

    tasks.forEach(task => task.updateRequired())
    const maxWidth = this.machines.reduce(Machine.highestCMax, 0)
    // weź uszeregowanie od końca i dla każdego zadania spróbuj je "popchnąć" maksymalnie w prawo
    this.machines.forEach(m => m.tasks.slice().reverse().forEach(task => task.shiftRigthIn(m.tasks, maxWidth)))

    return this.machines
  }

  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.addMachine()

  addMachine = () => push(this.machines, new Machine(`M${this.machines.length}`))
}

class Machine {
  static highestCMax  = (max, m) => Math.max(max, m.cMax)

  get cMax() { return this.tasks[this.tasks.length - 1].endTime }

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.canSchedule(task) && this.tasks.push(task)
  canSchedule = task => !this.tasks.some(slot => Task.intersects(task, slot))

  toString = () => `${this.id}: ${this.tasks.map(task => task.toString())}`
}
