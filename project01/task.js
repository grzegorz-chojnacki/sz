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

class Task {
  static startTimeOrder   = tasks  => tasks.sort((a, b) => a.startTime  - b.startTime)
  static topologicalOrder = tasks  => tasks.sort((a, b) => a.complexity - b.complexity)
  static intersects       = (a, b) => a.startTime < b.endTime && b.startTime < a.endTime
  static complexityDepth  = (prevMax, task) => Math.max(prevMax, task.complexity + 1)
  static maxEndTime       = (prevMax, task) => Math.max(prevMax, task.endTime)
  static minMaxStartTime  = (prevMin, task) => Math.min(prevMin, task.maxStartTime)
  static normal           = task => task
  static delayed          = task => ({ ...task, startTime: task.maxStartTime, endTime: task.maxEndTime })

  constructor(id, time = 1, required = []) {
    this.id           = id
    this.time         = time
    this.required     = required
    this.complexity   = this.required.reduce(Task.complexityDepth, 0)
    this.startTime    = this.required.reduce(Task.maxEndTime, 0)
    this.critical     = this.required.find(task => task.endTime === this.startTime)
    this.endTime      = this.startTime + this.time
    this.requiredFor  = []
    this.maxStartTime = this.startTime
    this.maxEndTime   = this.endTime
  }

  updateRequired = () => this.required.forEach(task => task.requiredFor.push(this))

  shiftRigthIn = (context, maxScheduleLength) => {
    this.maxEndTime = Math.min(this.minimumRequiredFor(maxScheduleLength), this.minimumInContext(context, maxScheduleLength))
    this.maxStartTime = this.maxEndTime - this.time
  }

  minimumRequiredFor = maxScheduleLength => this.requiredFor.reduce(Task.minMaxStartTime, maxScheduleLength)
  minimumInContext   = (context, maxScheduleLength) => next(context, this) !== undefined
    ? next(context, this).maxStartTime
    : maxScheduleLength

  updateMaxEndTime = time => {
    this.maxEndTime = Math.min(this.maxEndTime, time)
    this.maxStartTime = this.maxEndTime - this.time
    this.required.forEach(task => task.updateMaxEndTime(this.maxStartTime))
  }

  getCriticalPath = () => this.critical !== undefined
    ? [this.critical, ...this.critical.getCriticalPath()]
    : []

  toString = () => `${this.id}[${this.startTime}:${this.endTime}~${this.maxStartTime}:${this.maxStartTime + this.time}]`
}
