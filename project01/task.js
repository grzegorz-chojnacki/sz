'use strict'

function areCyclic(tasks) {
  const edges = tasks.reduce((acc, task) => acc.concat(task.asEdges()), [])
  const check = edges => {
    const outs = edges.map(edge => edge.out)
    const innerEdges = edges.filter(edge => outs.includes(edge.in))

    if (edges.length === 0) return false
    else if (edges.length === innerEdges.length) return true
    else return check(innerEdges)
  }

  return check(edges)
}

function schedule(tasks) {
  tasks.forEach(task => task.findCriticalTask())
  return Task.startTimeOrder(tasks).map(task => task.toStringWithTime())
}

class Task {
  static topologicalOrder = tasks => tasks.sort((a, b) => a.getComplexity() - b.getComplexity())
  static startTimeOrder   = tasks => tasks.sort((a, b) => a.startTime - b.startTime)
  static complexityDepth  = (prevMax, task) => Math.max(prevMax, task.getComplexity() + 1)
  static minStartTime     = (prevMax, task) => Math.max(prevMax, task.endTime)

  constructor(id, time, required = []) {
    this.id         = id
    this.time       = time
    this.required   = required
    this.complexity = undefined
    this.startTime  = undefined
    this.endTime    = undefined
    this.critical   = undefined
  }

  completeRequired() {
    this.required.forEach(task => task.completeRequired())
    this.startTime = this.startTime || this.required.reduce(Task.minStartTime, 0)
    this.endTime = this.startTime + this.time
  }

  findCriticalTask() {
    this.critical = this.required.find(task => task.endTime === this.startTime)
  }

  getComplexity = () => this.complexity || (this.complexity = this.required.reduce(Task.complexityDepth, 0))

  asEdges = () => this.required.map(task => ({ in: this.id, out: task.id }))

  toString         = () => `[${this.id}:${this.complexity}]`
  toStringWithTime = () => `[${this.id}@${this.startTime}:${this.endTime}]`
}
