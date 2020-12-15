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

class Task {
  static topologicalOrder = tasks => tasks.sort((a, b) => a.complexity - b.complexity)
  static startTimeOrder   = tasks => tasks.sort((a, b) => a.startTime - b.startTime)
  static complexityDepth  = (prevMax, task) => Math.max(prevMax, task.complexity + 1)
  static minStartTime     = (prevMax, task) => Math.max(prevMax, task.endTime)
  static critical         = task => task.endTime === this.startTime

  constructor(id, time = 1, required = []) {
    this.id         = id
    this.time       = time
    this.required   = required
    this.critical   = this.required.find(Task.critical)
    this.complexity = this.required.reduce(Task.complexityDepth, 0)
    this.startTime  = this.required.reduce(Task.minStartTime, 0)
    this.endTime    = this.startTime + this.time
  }

  getCriticalPath = () => this.critical
    ? [this.critical, ...this.critical.getCriticalPath()] : []

  asEdges  = () => this.required.map(task => ({ in: this.id, out: task.id }))
  toString = () => `${this.id}[${this.startTime}:${this.endTime}]`
}
