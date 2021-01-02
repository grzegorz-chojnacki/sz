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

  constructor(id, required = []) {
    this.id       = id
    this.time     = 1
    this.label    = undefined
    this.required = required
  }

  toString = () => `${this.id}:${this.label}`
}
