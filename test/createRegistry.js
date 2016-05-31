/** @flow */
import {assert} from 'chai'
import {createRegistry} from '../src'

describe('createRegistry', () => {
  it('should work with sync Provider', () => {
    const
      registry = createRegistry(':'),
      provider = {
        suggest(query) {
          assert.equal(query, 'some')
          return [{
            name: 'test',
            action() {
              
            }
          }]
        },
        name: 'some'
      }
    registry.register(provider)
    return new Promise(resolve => {
      registry.listen(suggest => {
        assert.lengthOf(suggest.list, 1)
        resolve()
      })
      registry.suggest('some')
    })
  })

  it('should work with async Provider', () => {
    const
      registry = createRegistry(':'),
      provider = {
        suggest(query) {
          assert.equal(query, 'some')
          return Promise.resolve([{
            name: 'test',
            action() {
              
            }
          }])
        },
        name: 'some'
      }
    registry.register(provider)
    return new Promise(resolve => {
      registry.listen(suggest => {
        assert.lengthOf(suggest.list, 1)
        resolve()
      })
      registry.suggest('some')
    })
  })

  it('should work with two Providers', () => {
    const
      registry = createRegistry(':'),
      syncProvider = {
        suggest(query) {
          assert.equal(query, 'some')
          return [{
            name: 'test',
            action() {
              
            }
          }]
        },
        name: 'syncProvider'
      },
      provider = {
        suggest(query) {
          assert.equal(query, 'some')
          return Promise.resolve([{
            name: 'test',
            action() {
              
            }
          }])
        },
        name: 'some'
      }
    registry.register(syncProvider)
    registry.register(provider)
    return new Promise(resolve => {
      let results = []
      registry.listen(suggest => {
        assert.lengthOf(suggest.list, 1)
        results = [...results, ...suggest.list]
        if (results.length == 2) resolve()
      })
      registry.suggest('some')
    })
  })

  it('should not use providers that different from needed', () => {
    const
      registry = createRegistry(':'),
      syncProvider = {
        suggest(query) {
          assert.isFalse(true, 'provider called')
          return [{
            name: 'test',
            action() {
              
            }
          }]
        },
        name: 'syncProvider'
      },
      provider = {
        suggest(query) {
          assert.equal(query, 'trueValue')
          return new Promise(resolve => {
            setTimeout(function() {
              resolve([{
                name: 'test',
                action() {
                  
                }
              }])
            }, 20)
          })
        },
        name: 'some'
      }
    registry.register(syncProvider, 'wrong')
    registry.register(provider, 'true')
    return new Promise(resolve => {
      let results = []
      registry.listen(suggest => {
        assert.lengthOf(suggest.list, 1)
        resolve()
      })
      registry.suggest('trueValue')
    })
  })
})