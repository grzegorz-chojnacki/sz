'use strict'

class TaskMaster {
  machines = [ new Machine(0) ]
  getMachineFor = task => this.machines.find(m => m.canSchedule(task))
    || this.prepareNew()

  prepareNew = () => {
    const machine = new Machine(this.machines.length)
    this.machines.push(machine)
    return machine
  }

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

  schedule = task => this.canSchedule(task) ? this.timetable.push(task) : null
  toString = () => `M${this.id}: ${this.timetable.map(task => task.toString())}`

  canSchedule = task => !this.timetable.some(slot =>
    task.startTime < slot.endTime && slot.startTime < task.endTime)

}