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

  static gap           = new Task('GAP')
  static notGap        = task => task !== Task.gap
  static isRoot        = task => task.successor === undefined
  static deadlineOrder = (a, b) => b.deadline - a.deadline

  constructor(id, deadline, required = []) {
    this.id        = id
    this.deadline  = deadline
    this.required  = required
    this.successor = undefined

    this.required.forEach(task => task.successor = this)
  }

  updateDeadline = () => {
    this.deadline = (this.successor !== undefined)
      ? Math.max(1 + this.successor.deadline, 1 - this.deadline)
      : 1 - this.deadline

    this.required.forEach(task => task.updateDeadline())
  }

  isSchedulableFor = scheduled =>
    !scheduled.includes(this) &&
    this.required.every(task => scheduled.includes(task))

  toString = () => `${this.id} (${this.deadline})`
}
