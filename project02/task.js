'use strict'

class Task {
  static parseList = nodes => {
    const notDistinct = (a, _, arr) => arr.indexOf(a) !== arr.lastIndexOf(a)

    if (nodes.map(node => node.id).filter(notDistinct).length > 0)
      throw new Error('Wykryto powtarzające się zadania')

    const tasks = []

    nodes.forEach(node => {
      const required = tasks.filter(task => (node.required || []).includes(task.id))

      if ((node.required || []).length !== required.length)
        throw new Error(`Nie znaleziono wszystkich wymaganych zadań dla ${node.id}`)

      tasks.push(new Task(node.id, required))
    })

    return tasks
  }

  static deepSort = ([a, ...as], [b, ...bs]) => {
    if (a === undefined) return -1
    else if (b === undefined) return 1
    else if (a === b) return Task.deepSort(as, bs)
    else return a - b
  }

  static label = task => task.label
  static lexicographicOrder = (a, b) => Task.deepSort(a.getComparableSList(), (b.getComparableSList()))
  static isSchedulable      = task   => !task.hasLabel() && task.successors.every(t => t.hasLabel())

  constructor(id, required = []) {
    this.id         = id
    this.time       = 1
    this.label      = undefined
    this.required   = required
    this.successors = []

    this.required.forEach(task => task.successors.push(this))
  }

  getComparableSList = () => this.successors
    .filter(s => s.hasLabel())
    .map(Task.label)
    .sort((a, b) => b - a)

  hasLabel = () => this.label !== undefined
  toString = () => `${this.id}:[${this.getComparableSList()}]`
}
