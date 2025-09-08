import { Cache } from './pokecache.js';

export class PokeAPI {
  private static readonly baseURL = 'https://pokeapi.co/api/v2';
  private cache: Cache;

  constructor(intervalMs?: number) {
    this.cache = new Cache(intervalMs || 500);
  }

  // GET /location-area/?offset=0&limit=20 (or use provided "next" URL)
  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    const url = pageURL ? pageURL : `${PokeAPI.baseURL}/location-area/`;

    // TODO: check if in cache
    // Check if in cache
    const cached = this.cache.get<ShallowLocations>(url);
    if (cached) {
      console.log(`DEBUG ----- ShallowLocations found in cache \n`);
      return cached;
    }

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      console.error('Failed to fetch location areas');
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No locations found in API response');
    }
    const shallowLocations: ShallowLocations = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      locations: data.results,
    };

    // TODO: Add to cache
    this.cache.add<ShallowLocations>(url, shallowLocations);

    return shallowLocations;
  }

  // GET /location-area/{id or name}
  async fetchLocation(locationName: string): Promise<Location> {
    //??? - do we need to urlEncode the location name in the url string literal
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    //TODO check and add to cachei
    const cached = this.cache.get<Location>(url);
    if (cached) {
      console.log(`DEBUG ----- locations found in cache \n`);
      return cached;
    }

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      console.error('Failed to fetch location area by name');
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.location) {
      throw new Error(`No location area found with name-"${locationName}"`);
    }

    const location: Location = {
      name: data.location.name,
      url: data.location.url,
    };

    // TODO: add to cache
    this.cache.add<Location>(url, location);
    return location;
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  locations: Location[]; // results from response.data
};

export type Location = {
  // add properties herelo
  name: string;
  url: string;
};

const sample = {
  count: 1089,
  next: 'https://pokeapi.co/api/v2/location-area/?offset=20&limit=20',
  previous: null,
  results: [
    {
      name: 'canalave-city-area',
      url: 'https://pokeapi.co/api/v2/location-area/1/',
    },
    {
      name: 'eterna-city-area',
      url: 'https://pokeapi.co/api/v2/location-area/2/',
    },
  ],
};
