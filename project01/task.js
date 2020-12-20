'use strict'

function haveCycle(tasks) {
  const asEdges = task => task.required.map(r => ({ in: r.id, out: task.id }))

  const check = edges => {
    const outs       = edges.map(edge => edge.out)
    const innerEdges = edges.filter(edge => outs.includes(edge.in))

    if (edges.length === 0) return false
    else if (edges.length === innerEdges.length) return true
    else return check(innerEdges)
  }

  return check(tasks.flatMap(asEdges))
}

const next   = (arr, a)  => arr[arr.findIndex(x => x === a) + 1]
const unique = (element, index, arr) => arr.indexOf(element) !== index

class Task {
  static startTimeOrder   = tasks  => tasks.sort((a, b) => a.startTime  - b.startTime)
  static endTimeOrder     = tasks  => tasks.sort((a, b) => a.endTime    - b.endTime)
  static topologicalOrder = tasks  => tasks.sort((a, b) => a.complexity - b.complexity)
  static intersects       = (a, b) => a.startTime < b.endTime && b.startTime < a.endTime
  static complexityDepth  = (prevMax, task) => Math.max(prevMax, task.complexity + 1)
  static maxEndTime       = (prevMax, task) => Math.max(prevMax, task.endTime)
  static minMaxStartTime  = (prevMin, task) => Math.min(prevMin, task.maxStartTime)
  static normal           = task => task
  static delayed          = task => ({ ...task, startTime: task.maxStartTime, endTime: task.maxEndTime })

  static parseList = (template = []) => {
    const tasks = template.map(node => new Task(node.id, node.time))
    tasks.forEach(task => {
      const node = template.find(node => node.id === task.id)
      const required = node.required.map(id => tasks.find(task => task.id === id))
      task.setRequired(required)
    })
    return tasks
  }

  constructor(id, time = 1, required = []) {
    this.id           = id
    this.time         = time
    this.required     = required
    this.complexity   = this.required.reduce(Task.complexityDepth, 0)
    this.startTime    = this.required.reduce(Task.maxEndTime, 0)
    this.endTime      = this.startTime + this.time
    this.critical     = this.required.find(task => task.endTime === this.startTime)
    this.requiredFor  = []
    this.maxStartTime = this.startTime
    this.maxEndTime   = this.endTime
  }

  setRequired = (required = []) => {
    this.required     = required
    this.complexity   = this.required.reduce(Task.complexityDepth, 0)
    this.startTime    = this.required.reduce(Task.maxEndTime, 0)
    this.endTime      = this.startTime + this.time
    this.critical     = this.required.find(task => task.endTime === this.startTime)
    this.maxStartTime = this.startTime
    this.maxEndTime   = this.endTime
  }

  updateRequired = () => this.required.forEach(task => task.requiredFor.push(this))

  shiftRigthIn = (context, cMax) => {
    this.maxEndTime = Math.min(
      this.minimumRequiredFor(cMax),
      this.minimumInContext(context, cMax))
    this.maxStartTime = this.maxEndTime - this.time
  }

  minimumRequiredFor = cMax => this.requiredFor.reduce(Task.minMaxStartTime, cMax)
  minimumInContext   = (context, cMax) => next(context, this) !== undefined
    ? next(context, this).maxStartTime
    : cMax

  updateMaxEndTime = time => {
    this.maxEndTime = Math.min(this.maxEndTime, time)
    this.maxStartTime = this.maxEndTime - this.time
    this.required.forEach(task => task.updateMaxEndTime(this.maxStartTime))
  }

  getCriticalPath = () => this.critical !== undefined
    ? [...this.critical.getCriticalPath(), this]
    : [this]

  toString = () => `${this.id}: ${this.time}`
}
