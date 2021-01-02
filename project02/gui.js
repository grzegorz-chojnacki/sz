'use strict'

const join = (acc, str) => acc + str
const seq  = (n, arr = []) => n < 0 ? arr : seq(n - 1, [n, ...arr])

const gui = new class {
  graph    = document.getElementById('graph')
  schedule = document.getElementById('schedule')

  draw = (machines = []) => {
    if (machines.length === 0) throw new Error('Nie znaleziono maszyn')
    const tasks = machines.flatMap(m => m.tasks)

    if (tasks.length === 0) throw new Error('Brak zadań')

    this.drawGraph(tasks.filter(task => task != Task.gap))
    this.drawSchedule(machines)
  }

  drawGraph = tasks => {
    const data = {
      nodes: tasks.map(task => ({
        id: task.id,
        label: `${task.id}: ${task.label}`,
        color: '#FAB795'
      })),
      edges: tasks.flatMap(task => task.required.map(r => ({
        from: r.id,
        to: task.id,
        arrows: 'to',
        color: '#E95678'
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
    : `<td>${task.id}</td>`

  error = (error) => {
    console.error(error)
    document.body.innerHTML = `<h1>${error}</h1>`
  }
}()
