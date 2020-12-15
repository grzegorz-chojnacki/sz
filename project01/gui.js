'use strict'

const join = (acc, str) => acc + str
const seq = (n, arr = []) => n < 1 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  table = document.getElementById('table')

  drawSchedule(machines = []) {
    const maxWidth = machines.reduce(Machine.highestCMax, 0)
    this.table.innerHTML = this.makeTimeHeader(maxWidth)
      + machines.map(this.makeMachineRow(maxWidth)).reduce(join)
  }

  makeTimeHeader = n => `<tr><th></th>${seq(n).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

  makeMachineRow = n => machine => `<tr>
    ${this.makeMachineHeader(machine)}
    ${machine.tasks.map(this.makeTaskCell).reduce(join)}
    ${this.maybeFillGapAfter(machine.tasks[machine.tasks.length - 1], n)}
  </tr>`

  makeMachineHeader = machine => `<th>${machine.id}</th>`

  makeTaskCell = (task, i, arr) =>
    `${this.maybeFillGapBefore(task, i, arr)}
    <td colspan="${task.time}">${task.id}</td>`

  maybeFillGapBefore = (task, i, arr) => i > 0
    ? '<td class="gap"></td>'.repeat(task.startTime - arr[i - 1].endTime)
    : ''

  maybeFillGapAfter = (task, n) => '<td class="gap"></td>'.repeat(n - task.endTime)
}()