'use strict'

const push = (a, arr = []) => {
  arr.push(a)
  return a
}

class TaskMaster {
  machines = [ new Machine(0) ]
  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.prepareNew()

  prepareNew = () => push(new Machine(this.machines.length), this.machines)

  schedule = tasks => {
    tasks.forEach(task => this.getMachineFor(task).schedule(task))
    return this.machines
  }
}

class Machine {
  constructor(id) {
    this.id = id
    this.timetable = []
  }

  canSchedule = task => !this.timetable
    .some(slot => Task.intersects(task, slot))

  schedule = task => this.canSchedule(task)
    ? push(task, this.timetable) : null

  toString = () => `M${this.id}: ${this.timetable.map(task => task.toString())}`
}
