'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 1 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  graph     = document.getElementById('graph')
  schedule  = document.getElementById('schedule')

  draw = machines => {
    if (!machines || machines.length === 0) return gui.error('Nie znaleziono maszyn')
    const tasks = machines.flatMap(m => m.tasks)

    if (tasks.length === 0) return gui.error('Brak zadań')

    this.drawSchedule(machines)
  }

  drawSchedule = (machines = []) => {
    const maxWidth = Machine.cMax(machines)
    this.schedule.innerHTML = this.makeTimeHeader(maxWidth) + machines
      .map(m => this.makeMachineRow(maxWidth)(m.id, m.tasks))
      .reduce(join)
  }

  makeTimeHeader = n => `<tr><th></th>${seq(n).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

  makeMachineRow = n => (id, tasks) => `<tr>
    <th>${id}</th>
    ${tasks.map(this.makeTaskCell).reduce(join)}
  </tr>`

  makeTaskCell = task => `<td>${task.id}</td>`

  error = (text, error = 'Coś poszło nie tak') => {
    console.error(error)
    document.body.innerHTML = `<h1>${text}</h1><p>${error}</p>`
  }
}()
