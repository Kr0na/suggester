/** @flow */
import type {Registry, Provider, Query, Trigger, Unsubscriber, SuggestionListener, Suggestion, RegistryOptions} from './types'

type ProviderEntry = {
  provider: Provider,
  tokens?: Trigger
}

export function createRegistry(options: RegistryOptions): Registry {
  const {separator = ' ', limit} = options
  let
    providers: Map<string, ProviderEntry> = new Map(),
    listeners: Map<string, SuggestionListener> = new Map(),
    queryId = 0
  return {
    register(provider, tokens) {
      const
        entry = {
          provider,
          tokens
        },
        name = provider.name || 'provider' + Math.floor(Math.random() * 10000)
      providers.set(name, entry)
      return () => providers.delete(name)
    },
    suggest(query: Query) {
      const
        id = ++queryId,
        parts = query.split(separator)
      function trigger(list: Array<Suggestion>, provider: Provider) {
        if (id == queryId) {
          listeners.forEach(listener => listener({list, queryId}, provider))
        }
      }
      providers.forEach(async (entry) => {
        const
          tokens = typeof entry.tokens == 'string' ? [entry.tokens] : entry.tokens
        if (
          tokens == undefined
          || tokens.filter(token => parts.filter(part => token.indexOf(part))).length
        ) {
          trigger(await entry.provider.suggest(query), entry.provider)
        }
      })
    },
    listen(listener: SuggestionListener) {
      const name = 'listener' + Math.floor(Math.random() * 10000)
      listeners.set(name, listener)
      return () => listeners.delete(name)
    }
  }
}