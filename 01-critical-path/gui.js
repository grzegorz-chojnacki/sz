'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 1 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  graph           = document.getElementById('graph')
  criticalPath    = document.getElementById('criticalPath')
  normalSchedule  = document.getElementById('table1')
  delayedSchedule = document.getElementById('table2')

  draw = machines => {
    if (!machines || machines.length === 0) return gui.error('Nie znaleziono maszyn')
    const tasks = Task.endTimeOrder(machines.flatMap(m => m.tasks))

    if (tasks.length === 0) return gui.error('Brak zadań')

    this.drawGraph(tasks)
    this.drawCriticalPath(tasks[tasks.length-1].getCriticalPath())
    this.drawSchedule(machines, this.normalSchedule,  Task.normal)
    this.drawSchedule(machines, this.delayedSchedule, Task.delayed)
  }

  drawGraph = tasks => {
    const data = {
      nodes: tasks.map(task => ({
        id: task.id,
        label: task.toString(),
        color: '#FAB795'
      })),
      edges: tasks.flatMap(task => task.required.map(r => ({
        from: r.id,
        to: task.id,
        arrows: 'to',
        color: task.critical === r ? '#E95678' : '#FAB795',
      }))),
      options: {
        physics: false,
        layout: {
          hierarchical: {
            enabled: true,
            levelSeparation: 100,
            nodeSpacing: 75,
            treeSpacing: 100,
            direction: 'LR',
            sortMethod: 'directed',
            shakeTowards: 'roots'
          }
        }
      }
    }
    new vis.Network(this.graph, data)
  }

  drawCriticalPath = criticalPath => this.criticalPath.innerHTML = criticalPath
    .map(this.makePathNode)
    .reduce(join)

  makePathNode = (task, i, tasks) =>
    `${task.id}${ i < tasks.length - 1 ? ' -> ' : ''}`

  drawSchedule = (machines = [], context, delayStrategy) => {
    const maxWidth = Machine.highestCMax(machines)
    context.innerHTML = this.makeTimeHeader(maxWidth) + machines
      .map(m => this.makeMachineRow(maxWidth)(m.id, m.tasks.map(delayStrategy)))
      .reduce(join)
  }

  makeTimeHeader = n => `<tr><th></th>${seq(n).map(time => `<th>${time}</th>`).reduce(join)}</tr>`

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

  error = (text, error = 'Coś poszło nie tak') => {
    console.error(error)
    document.body.innerHTML = `<h1>${text}</h1><p>${error}</p>`
  }

  maybeFillGapAfter = (task, n) => '<td class="gap"></td>'.repeat(n - task.endTime)
}()
