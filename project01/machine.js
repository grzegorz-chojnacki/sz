'use strict'

class Machine {
  static makeMachines(tasks) {
    const machines = [ new Machine(0) ]

    const prepareNew = id => {
      const machine = new Machine(id)
      machines.push(machine)
      return machine
    }

    tasks.forEach(task => {
      const machine = machines.find(m => m.canSchedule(task))
        || prepareNew(machines.length)

      machine.schedule(task)
    })

    return machines
  }

  constructor(id) {
    this.id = id
    this.timetable = []
  }

  schedule = task => this.timetable.push(task)

  canSchedule = task => !this.timetable.some(slot =>
    task.startTime < slot.endTime && slot.startTime < task.endTime)

  toString = () => `M${this.id}: ${this.timetable.map(task => task.toStringWithTime())}`
}