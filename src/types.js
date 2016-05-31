/** @flow */

export type Unsubscriber = () => bool

export type Query = string

export type Range = {
    start: number,
    end: number
}

export type Suggestion = {
    action(): void,
    name: string,
    description?: string,
    range?: Range | Array<Range>
}

export type SuggestionList = Array<Suggestion> | Promise<Array<Suggestion>>

export type Provider = {
    suggest(query: Query): SuggestionList
}

export type Trigger = Array<string> | string

export type SuggestionResult = {
    list: Array<Suggestion>,
    queryId: number
}

export type SuggestionListener = (suggestion: SuggestionResult, provider: Provider) => void

export type RegistryOptions = {
    separator?: string,
    limit?: number
}

export type Registry = {
    register(provider: Provider, triggers?: Trigger): Unsubscriber,
    suggest(query: Query): void,
    listen(listener: SuggestionListener): Unsubscriber
}
