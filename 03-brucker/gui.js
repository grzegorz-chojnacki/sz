'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  graph    = document.getElementById('graph')
  schedule = document.getElementById('schedule')
  lmax     = document.getElementById('lmax')

  draw = (machines = []) => {
    if (machines.length === 0) throw new Error('Nie znaleziono maszyn')

    const tasks = Machine.allTasks(machines).filter(Task.notGap)
    if (tasks.length === 0) throw new Error('Brak zadań')

    this.drawGraph(tasks.sort(Task.priorityOrder))
    this.lmax.innerHTML = Machine.lMax(machines)
    this.drawSchedule(machines)
  }

  drawGraph = tasks => {
    const data = {
      nodes: tasks.map(task => ({
        id: task.id,
        label: task.id,
        color: '#FAB795',
        font: { face: 'monospace', vadjust: 1 }
      })),
      edges: tasks.flatMap(task => task.required.map(r => ({
        from: r.id,
        to: task.id,
        arrows: 'to',
        color: '#E95678'
      }))),
      options: {
        edges: { arrows: { to: { scaleFactor: 0.5 }}},
        physics: false,
        layout: {
          hierarchical: {
            enabled: true,
            levelSeparation: 75,
            nodeSpacing: 50,
            treeSpacing: 100,
            direction: 'LR',
            sortMethod: 'directed',
            shakeTowards: 'leaves'
          }
        }
      }
    }
    new vis.Network(this.graph, data)
  }

  drawSchedule = (machines = []) => {
    const maxWidth = Machine.cMax(machines)
    this.schedule.innerHTML = this.makeTimeHeader(maxWidth) + machines
      .map(m => this.makeMachineRow(m.id, m.tasks))
      .reduce(join)
  }

  makeTimeHeader = n => `<tr>
      <th></th>
      ${seq(n - 1).map(time => `<th><div>${time}<div></th>`).reduce(join)}
    </tr>`

  makeMachineRow = (id, tasks) => `<tr>
      <th>${id}</th>
      ${tasks.map(this.makeTaskCell).reduce(join)}
    </tr>`

  makeTaskCell = task => task === Task.gap
    ? `<td class="gap"></td>`
    : `<td>${task.id}
        <ul class="details">
          <li>C:  ${task.time}</li>
          <li>d:  ${task.deadline}</li>
          <li>L:  ${task.time - task.deadline}</li>
          <li>*: ${task.priority}</li>
        </ul>
      </td>`

  error = error => {
    console.error(error)
    document.body.innerHTML = `<h1>${error}</h1>`
  }
}()
