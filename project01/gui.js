'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  normalSchedule  = document.getElementById('table1')
  delayedSchedule = document.getElementById('table2')

  drawNormalSchedule  = machines => this.drawSchedule(machines, this.normalSchedule, Task.normal)
  drawDelayedSchedule = machines => this.drawSchedule(machines, this.delayedSchedule, Task.delayed)

  drawSchedule(machines = [], context, delayStrategy) {
    const maxWidth = Machine.highestCMax(machines)
    context.innerHTML = this.makeTimeHeader(maxWidth) + machines
      .map(m => this.makeMachineRow(maxWidth)(m.id, m.tasks.map(delayStrategy)))
      .reduce(join)
  }

  makeTimeHeader = n => `<tr><th></th>${seq(n - 1).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

  makeMachineRow = n => (id, tasks) => `<tr>
    <th>${id}</th>
    ${tasks.map(this.makeTaskCell).reduce(join)}
    ${this.maybeFillGapAfter(tasks[tasks.length - 1], n)}
  </tr>`

  makeTaskCell = (task, i, arr) =>
    `${this.maybeFillGapBefore(task, i, arr)}
    <td colspan="${task.time}">${this.format(task)}</td>`

  maybeFillGapBefore = (task, i, arr) => i > 0
    ? '<td class="gap"></td>'.repeat(task.startTime - arr[i - 1].endTime)
    : '<td class="gap"></td>'.repeat(task.startTime)

  format = task => `${task.id}`

  maybeFillGapAfter = (task, n) => '<td class="gap"></td>'.repeat(n - task.endTime)
}()
