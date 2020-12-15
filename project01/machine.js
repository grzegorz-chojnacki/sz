'use strict'

class Machine {
  static makeMachinesFor(tasks) {
    const machines = [ new Machine(0) ]

    const extend = machines => {
      const machine = new Machine(machines.length)
      machines.push(machine)
      return machine
    }

    tasks.forEach(task => (machines.find(m => m.canSchedule(task)) || extend(machines)).schedule(task))

    return machines
  }

  constructor(id) {
    this.id = id
    this.timetable = []
  }

  schedule = task => this.timetable.push(task)

  canSchedule = task => !this.timetable.some(slot =>
    task.startTime < slot.endTime && slot.startTime < task.endTime)

  toString = () => `M${this.id}: ${this.timetable.map(task => task.toString())}`
}