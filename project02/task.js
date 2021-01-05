'use strict'

class Task {
  static parseList = nodes => {
    const notDistinct = (a, _, arr) => arr.indexOf(a) !== arr.lastIndexOf(a)

    if (nodes.map(node => node.id).filter(notDistinct).length > 0)
      throw new Error('Wykryto powtarzające się zadania')

    const tasks = []
    nodes.forEach(node => {
      const required = node.required?.map(requiredId => {
        const found = tasks.find(task => task.id === requiredId)

        if (found) return found
        else throw new Error(`Nie znaleziono zadania ${requiredId} dla ${node.id}`)
      })
      tasks.push(new Task(node.id, required))
    })

    return tasks
  }

  static deepCompare = ([a, ...as], [b, ...bs]) => {
    if (a === undefined) return -1
    else if (b === undefined) return 1
    else if (a === b) return Task.deepCompare(as, bs)
    else return a - b
  }

  static gap                = new Task('GAP')
  static notGap             = task => task !== Task.gap
  static labelOrder         = (a, b) => b.label - a.label
  static lexicographicOrder = (a, b) => Task.deepCompare(
    a.getSuccessorLabels(), b.getSuccessorLabels())

  constructor(id, required = []) {
    this.id         = id
    this.label      = undefined
    this.required   = required
    this.successors = []

    this.required.forEach(task => task.successors.push(this))
  }

  isLabelable = () =>
    !this.hasLabel() && this.successors.every(task => task.hasLabel())

  isSchedulableFor = scheduled =>
    !scheduled.includes(this) &&
    this.required.every(task => scheduled.includes(task))

  getSuccessorLabels = () => this.successors
    .map(task => task.label)
    .sort((a, b) => b - a)

  hasLabel = () => this.label !== undefined
  toString = () => `${this.id}:[${this.getSuccessorLabels()}]`
}
