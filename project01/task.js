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
  static gap              = (a, b) => b.startTime - a.endTime
  static intersects       = (a, b) => a.startTime < b.endTime && b.startTime < a.endTime
  static complexityDepth  = (prevMax, task) => Math.max(prevMax, task.complexity + 1)
  static minStartTime     = (prevMax, task) => Math.max(prevMax, task.endTime)

  constructor(id, time = 1, required = []) {
    this.id         = id
    this.time       = time
    this.required   = required
    this.complexity = this.required.reduce(Task.complexityDepth, 0)
    this.startTime  = this.required.reduce(Task.minStartTime,    0)
    this.critical   = this.required.find(task => task.endTime === this.startTime)
    this.endTime    = this.startTime + this.time
  }

  getCriticalPath = () => this.critical !== undefined
    ? [this.critical, ...this.critical.getCriticalPath()]
    : []

  toString = () => `${this.id}[${this.startTime}:${this.endTime}]`
}
