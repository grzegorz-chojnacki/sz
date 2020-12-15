'use strict'

const join = (acc, str) => acc + str
const seq = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  table = document.getElementById('table')

  drawSchedule(machines = []) {
    const maxWidth = machines.reduce(Machine.highestCMax, 0) - 1

    this.table.innerHTML  = this.makeTimeHeader(maxWidth)
    this.table.innerHTML += machines.map(this.makeMachineRow).reduce(join)
  }

  makeMachineHeader = machine => `<th>${machine.id}</th>`
  makeMachineRow = machine => `<tr>
    ${this.makeMachineHeader(machine)}
    ${machine.tasks.map(this.makeTaskCell).reduce(join)}
  </tr>`

  makeTimeHeader = n => `<tr><th></th>
    ${seq(n).map(time => `<th>${time}</th>`).reduce(join)}
  </tr>`

  makeTaskCell = task => `<td colspan="${task.time}">${task.id}</td>`
}()