'use strict'

const zip = (a, b) => a.map((_, i) => [ a[i], b[i] ])

const schedule = (tasks = []) => {
  const machines = [ new Machine('M1'), new Machine('M2') ]

  {(function labelTasks(i = 1) {
    const labelable = tasks.filter(task => task.isLabelable())
    if (labelable.length > 0) {
      const task = labelable.sort(Task.lexicographicOrder)[0]
      task.label = i
      return labelTasks(i + 1)
    }
  })()}

  tasks.sort(Task.labelOrder)

  {(function scheduleTasks(scheduled = []) {
    const schedulable = tasks
      .filter(task => task.isSchedulableFor(scheduled))
      .slice(0, machines.length)

    if (schedulable.length > 0) {
      zip(schedulable, machines)
        .map(([task, machine]) => machine.schedule(task))
      scheduleTasks(scheduled.concat(schedulable))
    }
  })()}

  return machines
}

class Machine {
  static cMax = machines => machines
    .reduce((max, machine) => Math.max(max, machine.tasks.length), 0)

  constructor(id) {
    this.id = id
    this.tasks = []
  }

  schedule = task => this.tasks.push(task)

  toString = () => `${this.id}: [${this.tasks.map(task => task.label)}]`
}
