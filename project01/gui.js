'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  table  = document.getElementById('table')
  table2 = document.getElementById('table2')

  drawSchedule(machines = []) {
    const maxWidth = machines.reduce(Machine.highestCMax, 0)
    this.table2.innerHTML = this.makeTimeHeader(maxWidth)
      + machines.map(m => this.makeMachineRow(maxWidth)(m, m.tasks)).reduce(join)
  }

  // drawDelayedSchedule(machines = []) {
  //   const maxWidth = machines.reduce(Machine.highestCMax, 0)
  //   this.table.innerHTML = this.makeTimeHeader(maxWidth)
  //     + machines.map(this.makeMachineRow(maxWidth)).reduce(join)
  // }

  makeTimeHeader = n => `<tr><th></th>${seq(n - 1).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

  makeMachineRow = n => (machine, tasks) => `<tr>
    <th>${machine.id}</th>
    ${tasks.map(this.makeTaskCell).reduce(join)}
    ${this.maybeFillGapAfter(tasks[tasks.length - 1], n)}
  </tr>`

  makeTaskCell = (task, i, arr) =>
    `${this.maybeFillGapBefore(task, i, arr)}
    <td colspan="${task.time}">${this.format(task)}</td>`

  maybeFillGapBefore = (task, i, arr) => i > 0
    ? '<td class="gap"></td>'.repeat(task.startTime - arr[i - 1].endTime)
    : '<td class="gap"></td>'.repeat(task.startTime)

  format = task => `${task.id} <em>${task.startTime}->${task.endTime}</em>`

  maybeFillGapAfter = (task, n) => '<td class="gap"></td>'.repeat(n - task.endTime)
}()
