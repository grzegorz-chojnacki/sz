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
  static label = task => task.label
  static lexicographicOrder = (a, b) => {
    return a.requiredFor.map(Task.label).sort().reverse().toString()
      .localeCompare(
           b.requiredFor.map(Task.label).sort().reverse().toString())
  }
  static lexicographicSort  = tasks => tasks.sort(Task.lexicographicOrder)
  static isSchedulable      = task  => !task.hasLabel() && task.requiredFor.every(t => t.hasLabel())
  static setSuccessors      = task  => task.requiredFor = task.requiredFor.filter(t => t.hasLabel())

  constructor(id, required = []) {
    this.id          = id
    this.time        = 1
    this.label       = undefined
    this.required    = required
    this.requiredFor = []

    this.required.forEach(task => task.requiredFor.push(this))
  }

  hasLabel = () => this.label !== undefined
  toString = () => `${this.label}:[${this.requiredFor.map(task => task.label)}]`
}
