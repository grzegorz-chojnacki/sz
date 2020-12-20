'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  drawSchedule(id, machines = [], delayStrategy = Task.normal) {
    const maxWidth = machines.reduce(Machine.highestCMax, 0)
    document.getElementById(id).innerHTML = this.makeTimeHeader(maxWidth)
      + machines.map(m => this.makeMachineRow(maxWidth, delayStrategy)(m, m.tasks)).reduce(join)
  }

  makeTimeHeader = n => `<tr><th></th>${seq(n - 1).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

  makeMachineRow = (n, delayStrategy) => (machine, tasks) => `<tr>
    <th>${machine.id}</th>
    ${tasks.map(this.makeTaskCell(delayStrategy)).reduce(join)}
    ${this.maybeFillGapAfter(delayStrategy)(tasks[tasks.length - 1], n)}
  </tr>`

  makeTaskCell = delayStrategy => (task, i, arr) =>
    `${this.maybeFillGapBefore(delayStrategy)(task, i, arr)}
    <td colspan="${task.time}">${this.format(task)}</td>`

  maybeFillGapBefore = delayStrategy => (task, i, arr) => i > 0
    ? '<td class="gap"></td>'.repeat(delayStrategy(task).startTime - delayStrategy(arr[i - 1]).endTime)
    : '<td class="gap"></td>'.repeat(delayStrategy(task).startTime)

  format = task => `${task.id} <em>${task.startTime}->${task.endTime}</em>`

  maybeFillGapAfter = delayStrategy => (task, n) => '<td class="gap"></td>'.repeat(n - delayStrategy(task).endTime)
}()
