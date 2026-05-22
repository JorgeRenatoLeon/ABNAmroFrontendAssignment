export interface TVMazeShow {
    id: number
    url: string
    name: string
    type: string
    language: string | null
    genres: string[]
    status: string
    runtime: number | null
    averageRuntime: number | null
    premiered: string | null
    ended: string | null
    officialSite: string | null
    schedule: TVMazeSchedule
    rating: TVMazeRating
    weight: number
    network: TVMazeNetwork | null
    webChannel: TVMazeNetwork | null
    dvdCountry: TVMazeCountry | null
    externals: TVMazeExternals | null
    image: TVMazeImage | null
    summary: string | null
    updated: number
}

export interface TVMazeImage {
    // Image Sizes
    medium: string
    original: string
}

export interface TVMazeCountry {
    name: string
    code: string
    timezone: string
}

export interface TVMazeNetwork {
    id: number
    name: string
    country: TVMazeCountry | null
    officialSite: string | null
}

export interface TVMazeRating {
    average: number | null
}

export interface TVMazeSchedule {
    time: string
    days: string[]
}

// Object with keys that can vary between shows, e.g. "thetvdb", "imdb", "tvrage" and values that are either strings or numbers or null
export interface TVMazeExternals {
    [key: string]: string | number | null
}

export interface TVMazeSearchResult {
    score: number
    show: TVMazeShow
}

export interface TVMazePerson {
    id: number
    url: string | null
    name: string
    image: TVMazeImage | null
    country: TVMazeCountry | null
    birthday: string | null
    deathday: string | null
    gender: string | null
    updated: number
}

export interface TVMazeCharacter {
    id: number
    name: string
    image: TVMazeImage | null
}

export interface TVMazeCastMember {
    person: TVMazePerson
    character: TVMazeCharacter
    self: boolean
    voice: boolean
}

export interface GenreSection {
    genre: string
    shows: TVMazeShow[]
}
