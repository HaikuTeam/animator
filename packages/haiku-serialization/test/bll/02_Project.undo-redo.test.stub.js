const async = require('async')
const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const Project = require('../../src/bll/Project')

tape('Project.undo-redo[1]', (t) => {
  t.plan(29)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-undoredo-01')

  fse.removeSync(folder)

  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }

  Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    if (err) throw err

    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err

      fse.outputFileSync(path.join(folder, 'designs/Rect.svg'), RECT_SVG_1)

      const ac = project.getCurrentActiveComponent()

      const $undo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.undo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      const $redo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.redo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      return async.series([
        (cb) => {
          const snaps = []
          snaps.push(ac.getBytecodeJSON()) // 0
          return ac.instantiateComponent('designs/Rect.svg', undefined, {from: 'test'}, (err) => {
            if (err) throw err
            snaps.push(ac.getBytecodeJSON()) // 1
            return $undo((err) => {
              if (err) throw err
              snaps.push(ac.getBytecodeJSON()) // 2
              return $redo((err) => {
                snaps.push(ac.getBytecodeJSON()) // 3
                t.notEqual(snaps[0], snaps[1])
                t.notEqual(snaps[1], snaps[2])
                t.notEqual(snaps[2], snaps[3])
                t.equal(snaps[0], snaps[2], 'orig = instantiate undone')
                t.equal(snaps[1], snaps[3], 'instantiate = redone instantiate')
                return cb()
              })
            })
          })
        },

        (cb) => {
          const snaps = []
          snaps.push(ac.getBytecodeJSON()) // 0
          return ac.instantiateComponent('designs/Rect.svg', undefined, {from: 'test'}, (err, mana) => {
            if (err) throw err
            snaps.push(ac.getBytecodeJSON()) // 1
            return ac.deleteComponents([mana.attributes['haiku-id']], {from: 'test'}, (err) => {
              if (err) throw err
              snaps.push(ac.getBytecodeJSON()) // 2
              return $undo((err) => {
                if (err) throw err
                snaps.push(ac.getBytecodeJSON()) // 3
                return $redo((err) => {
                  snaps.push(ac.getBytecodeJSON())
                  t.notEqual(snaps[0], snaps[1])
                  t.notEqual(snaps[1], snaps[2])
                  t.notEqual(snaps[2], snaps[3])
                  t.equal(snaps[0], snaps[2], 'orig = deleted')
                  t.equal(snaps[1], snaps[3], 'instantiated = delete undone')
                  t.equal(snaps[0], snaps[4], 'orig = delete redone')
                  return cb()
                })
              })
            })
          })
        },

        (cb) => {
          const snaps = []
          return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, (err, mana) => {
            if (err) throw err
            snaps.push(ac.getBytecodeJSON()) // 0
            const el = ac.findElementByComponentId(mana.attributes['haiku-id'])
            const clip = el.copy()
            return ac.pasteThings([clip], {}, {from: 'test'}, (err) => {
              if (err) throw err
              snaps.push(ac.getBytecodeJSON()) // 1
              return $undo((err) => {
                if (err) throw err
                snaps.push(ac.getBytecodeJSON()) // 2
                return $redo((err) => {
                  snaps.push(ac.getBytecodeJSON()) // 3
                  t.notEqual(snaps[0], snaps[1])
                  t.notEqual(snaps[1], snaps[2])
                  t.notEqual(snaps[2], snaps[3])
                  t.equal(snaps[0], snaps[2], 'pre-paste = paste undone')
                  t.equal(snaps[1], snaps[3], 'pasted = paste redone')
                  return cb()
                })
              })
            })
          })
        },

        (cb) => {
          const snaps = []
          snaps.push(ac.getBytecodeJSON()) // 0
          return ac.upsertStateValue('meow', {value: 1}, {from: 'test'}, (err) => {
            if (err) throw err
            snaps.push(ac.getBytecodeJSON()) // 1
            return $undo((err) => {
              if (err) throw err
              snaps.push(ac.getBytecodeJSON()) // 2
              return $redo((err) => {
                if (err) throw err
                snaps.push(ac.getBytecodeJSON()) // 3
                t.notEqual(snaps[0], snaps[1])
                t.notEqual(snaps[1], snaps[2])
                t.notEqual(snaps[2], snaps[3])
                t.equal(snaps[0], snaps[2], 'state unset')
                t.equal(snaps[1], snaps[3], 'state reset')
                return cb()
              })
            })
          })
        },

        (cb) => {
          const snaps = []
          snaps.push(ac.getBytecodeJSON()) // 0
          return ac.upsertStateValue('ruff', {value: 1}, {from: 'test'}, (err) => {
            if (err) throw err
            snaps.push(ac.getBytecodeJSON()) // 1
            return ac.upsertStateValue('ruff', {value: 2}, {from: 'test'}, (err) => {
              if (err) throw err
              snaps.push(ac.getBytecodeJSON()) // 2
              return $undo((err) => {
                if (err) throw err
                snaps.push(ac.getBytecodeJSON()) // 3
                return $redo((err) => {
                  if (err) throw err
                  snaps.push(ac.getBytecodeJSON()) // 4
                  t.notEqual(snaps[0], snaps[1])
                  t.notEqual(snaps[1], snaps[2])
                  t.notEqual(snaps[2], snaps[3])
                  t.notEqual(snaps[3], snaps[4])
                  t.notEqual(snaps[0], snaps[4])
                  t.equal(snaps[1], snaps[3], 'state unset')
                  t.equal(snaps[2], snaps[4], 'state reset')
                  return cb()
                })
              })
            })
          })
        },
      ], (err) => {
        if (err) throw err
        fse.removeSync(folder)
        t.ok(true, 'finished')
      })
    })
  })
})

tape('Project.undo-redo[2]', (t) => {
  t.plan(17)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-undoredo-02')

  fse.removeSync(folder)

  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }

  Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    if (err) throw err

    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err

      fse.outputFileSync(path.join(folder, 'designs/Rect.svg'), RECT_SVG_1)

      const ac = project.getCurrentActiveComponent()

      const $undo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.undo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      const $redo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.redo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      return async.series([
        (cb) => {
          const snaps = []
          let componentId = null
          return async.series([
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) }, // <~~
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => {
              componentId = ac.getReifiedBytecode().template.children[3].attributes['haiku-id']
              return cb()
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 0
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"1d04cfa992ef"},{"zIndex":3,"haikuId":"8c4b7b1ef094"},{"zIndex":4,"haikuId":"037037c64252"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveToFront(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 1
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"1d04cfa992ef"},{"zIndex":3,"haikuId":"8c4b7b1ef094"},{"zIndex":4,"haikuId":"403bf109aa01"},{"zIndex":5,"haikuId":"a253613d2d06"},{"zIndex":6,"haikuId":"2a321e0a9a80"},{"zIndex":7,"haikuId":"037037c64252"}]')
              return ac.zMoveToBack(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 2
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"037037c64252"},{"zIndex":2,"haikuId":"69e1be578b89"},{"zIndex":3,"haikuId":"1d04cfa992ef"},{"zIndex":4,"haikuId":"8c4b7b1ef094"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveForward(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 3
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"037037c64252"},{"zIndex":3,"haikuId":"1d04cfa992ef"},{"zIndex":4,"haikuId":"8c4b7b1ef094"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveForward(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 4
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"1d04cfa992ef"},{"zIndex":3,"haikuId":"037037c64252"},{"zIndex":4,"haikuId":"8c4b7b1ef094"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveForward(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 5
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"1d04cfa992ef"},{"zIndex":3,"haikuId":"8c4b7b1ef094"},{"zIndex":4,"haikuId":"037037c64252"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveBackward(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 6
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"1d04cfa992ef"},{"zIndex":3,"haikuId":"037037c64252"},{"zIndex":4,"haikuId":"8c4b7b1ef094"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return ac.zMoveBackward(componentId, 'Default', 0, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getRawStackingInfo()) // 7
              t.equal(JSON.stringify(ac.getRawStackingInfo('Default', 0)), '[{"zIndex":1,"haikuId":"69e1be578b89"},{"zIndex":2,"haikuId":"037037c64252"},{"zIndex":3,"haikuId":"1d04cfa992ef"},{"zIndex":4,"haikuId":"8c4b7b1ef094"},{"zIndex":5,"haikuId":"403bf109aa01"},{"zIndex":6,"haikuId":"a253613d2d06"},{"zIndex":7,"haikuId":"2a321e0a9a80"}]')
              return cb()
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[6])
                return cb()
              })
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[5])
                return cb()
              })
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[4])
                return cb()
              })
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[3])
                return cb()
              })
            },
            (cb) => {
              return $redo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[4])
                return cb()
              })
            },
            (cb) => {
              return $redo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[5])
                return cb()
              })
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[4])
                return cb()
              })
            },
            (cb) => {
              return $undo(() => {
                t.deepEqual(ac.getRawStackingInfo(), snaps[3])
                return cb()
              })
            },
          ], cb)
        },
      ], (err) => {
        if (err) throw err
        fse.removeSync(folder)
        t.ok(true, 'finished')
      })
    })
  })
})

tape('Project.undo-redo[3]', (t) => {
  t.plan(3)

  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-undoredo-03')

  fse.removeSync(folder)

  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }

  Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    if (err) throw err

    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err

      fse.outputFileSync(path.join(folder, 'designs/Rect.svg'), RECT_SVG_1)

      const ac = project.getCurrentActiveComponent()

      const $undo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.undo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      const $redo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.redo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      return async.series([
        (cb) => {
          const snaps = []
          const componentIds = []
          const times = [0, 100, 200, 300, 400, 500]
          return async.series([
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {}, {from: 'test'}, cb) },
            (cb) => {
              componentIds.push(ac.getReifiedBytecode().template.children[0].attributes['haiku-id'])
              componentIds.push(ac.getReifiedBytecode().template.children[1].attributes['haiku-id'])
              componentIds.push(ac.getReifiedBytecode().template.children[2].attributes['haiku-id'])
              return cb()
            },
            (cb) => {
              return async.each(componentIds, (componentId, nextComponentId) => {
                return async.each(times, (time, nextN) => {
                  return ac.createKeyframe(
                    componentId,
                    'Default',
                    'svg',
                    'translation.x',
                    time,
                    time * 33,
                    'linear',
                    null,
                    null,
                    {},
                    {from: 'test'},
                    nextN
                  )
                }, nextComponentId)
              }, cb)
            },
            (cb) => {
              // Gonna build up a random moves object based on what we have
              const moves = {Default: {}}
              componentIds.forEach((componentId) => {
                moves.Default[componentId] = {}
                moves.Default[componentId]['translation.x'] = {}
                times.forEach((time) => {
                  moves.Default[componentId]['translation.x'][time] = {
                    value: 66666,
                    curve: 'easeInOutBounce'
                  }
                })
              })
              snaps.push(ac.getBytecodeJSON()) // 0
              return ac.moveKeyframes(moves, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getBytecodeJSON()) // 1
              return $undo(() => {
                snaps.push(ac.getBytecodeJSON()) // 2
                return $redo(() => {
                  snaps.push(ac.getBytecodeJSON()) // 3
                  return cb()
                })
              })
            },
            (cb) => {
              t.equal(snaps[0], snaps[2], 'moves undone ok')
              t.equal(snaps[1], snaps[3], 'moves redone ok')
              return cb()
            }
          ], cb)
        }
      ], (err) => {
        if (err) throw err
        fse.removeSync(folder)
        t.ok(true, 'finished')
        t.end()
      })
    })
  })
})

tape('Project.undo-redo[4]', (t) => {
  t.plan(5)

  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-undoredo-04')

  fse.removeSync(folder)

  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }

  Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    if (err) throw err

    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err

      fse.outputFileSync(path.join(folder, 'designs/Rect.svg'), RECT_SVG_1)

      const ac = project.getCurrentActiveComponent()

      const $undo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.undo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      const $redo = (cb) => {
        return setTimeout(() => {
          project.actionStack.shiftAndProcessLatestAction()
          return project.redo({}, {from: 'test'}, (err) => {
            if (err) throw err
            return cb()
          })
        })
      }

      return async.series([
        (cb) => {
          const snaps = []
          let componentId
          return async.series([
            (cb) => { return ac.instantiateComponent('designs/Rect.svg', {x: 100, y: 100}, {from: 'test'}, cb) },
            (cb) => {
              snaps.push(ac.getBytecodeJSON()) // 0
              componentId = ac.getReifiedBytecode().template.children[0].attributes['haiku-id']
              return cb()
            },
            (cb) => {
              // Create a keyframe where none was before via updateKeyframes
              ac.updateKeyframes({
                Default: {
                  [componentId]: {
                    'translation.x': {
                      1000: {value: 200}
                    },
                    'translation.y': {
                      1000: {value: 200}
                    }
                  }
                }
              }, {}, {from: 'test'}, cb)
            },
            (cb) => {
              snaps.push(ac.getBytecodeJSON()) // 1
              return $undo(() => {
                t.equal(ac.getBytecodeJSON(), snaps[0])
                return cb()
              })
            },
            (cb) => {
              return $redo(() => {
                t.equal(ac.getBytecodeJSON(), snaps[1])
                return cb()
              })
            },
            (cb) => {
              snaps.push(ac.getBytecodeJSON()) // 1
              return $undo(() => {
                t.equal(ac.getBytecodeJSON(), snaps[0])
                return cb()
              })
            },
            (cb) => {
              return $redo(() => {
                t.equal(ac.getBytecodeJSON(), snaps[1])
                return cb()
              })
            }
          ], cb)
        }
      ], (err) => {
        if (err) throw err
        fse.removeSync(folder)
        t.ok(true, 'finished')
        t.end()
      })
    })
  })
})

const RECT_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="79px" height="79px" viewBox="0 0 79 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Rectangle</title>
      <desc>Created with sketchtool.</desc>
      <defs>
          <rect id="path-1" x="0" y="0" width="79" height="79"></rect>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rectangle">
              <use fill="#420000" fill-rule="evenodd" xlink:href="#path-1"></use>
              <rect stroke="#9200FF" stroke-width="16" x="8" y="8" width="63" height="63"></rect>
          </g>
      </g>
  </svg>
`
