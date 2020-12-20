'use strict'

const next = (arr, a)  => arr[arr.findIndex(x => x === a) + 1]

class Task {
  static startTimeOrder  = tasks  => tasks.sort((a, b) => a.startTime  - b.startTime)
  static endTimeOrder    = tasks  => tasks.sort((a, b) => a.endTime    - b.endTime)
  static intersects      = (a, b) => a.startTime < b.endTime && b.startTime < a.endTime
  static maxEndTime      = (prevMax, task) => Math.max(prevMax, task.endTime)
  static minMaxStartTime = (prevMin, task) => Math.min(prevMin, task.maxStartTime)
  static normal          = task => task
  static delayed         = task => ({ ...task, startTime: task.maxStartTime, endTime: task.maxEndTime })

  static parseList = template => {
    const tasks = []

    try {
      template.forEach(node => {
        const required = tasks.filter(task => (node.required || []).includes(task.id))

        if ((node.required || []).length !== required.length)
          throw new Error(`Nie znaleziono wszystkich wymaganych zadań dla ${node.id}`)

        tasks.push(new Task(node.id, node.time, required))
      })
    } catch (e) { gui.error('Błędny format listy zadań', e) }
    tasks.forEach(task => task.updateRequired())
    return tasks
  }

  constructor(id, time = 1, required = []) {
    this.id           = id
    this.time         = time
    this.requiredFor  = []
    this.required     = required
    this.startTime    = this.required.reduce(Task.maxEndTime, 0)
    this.endTime      = this.startTime + this.time
    this.critical     = this.required.find(task => task.endTime === this.startTime)
    this.maxStartTime = this.startTime
    this.maxEndTime   = this.endTime
  }

  updateRequired = () => this.required.forEach(task => task.requiredFor.push(this))

  shiftRigthIn = (tasks, cMax) => {
    this.maxEndTime = Math.min(this.minRequiredFor(cMax), this.minInList(tasks, cMax))
    this.maxStartTime = this.maxEndTime - this.time
  }

  minRequiredFor = cMax => this.requiredFor.reduce(Task.minMaxStartTime, cMax)
  minInList      = (tasks, cMax) => next(tasks, this) !== undefined
    ? next(tasks, this).maxStartTime
    : cMax

  getCriticalPath = () => this.critical !== undefined
    ? [...this.critical.getCriticalPath(), this]
    : [this]

  toString = () => `${this.id}: ${this.time}`
}
