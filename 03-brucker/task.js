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
      tasks.push(new Task(node.id, node.deadline, required))
    })

    return tasks
  }

  static gap    = new Task('GAP')
  static notGap = task => task !== Task.gap

  constructor(id, deadline, required = []) {
    this.id         = id
    this.deadline   = deadline
    this.required   = required
  }

  toString = () => `${this.id} (${this.deadline})`
}
