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
      // console.log(`DEBUG ----- ShallowLocations found in cache \n`);
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

  // GET /location-area/{id or name} --- basic location info only
  async fetchLocation(locationName: string): Promise<Location> {
    //??? - do we need to urlEncode the location name in the url string literal
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const cacheKey = `${url}/location-only`; // DISTINGUISH unique key for basic location info only

    const cached = this.cache.get<Location>(cacheKey);
    if (cached) {
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

  // GET /location-area/{id or name}  --- includes location info and pokemonEncounters list
  async fetchLocationAreaInfo(locationName: string): Promise<LocationAreaInfo> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    const cached = await this.cache.get<LocationAreaInfo>(url);
    if (cached) {
      return cached;
    }

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      console.error('Failed to fetch location area info by name');
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.location) {
      throw new Error(`No location area found with name-${locationName}`);
    }

    if (!data.pokemon_encounters) {
      throw new Error(
        `No pokemon encounters found for location-area: ${locationName}`
      );
    }

    const pokemonEncounters: Pokemon[] = [];
    data.pokemon_encounters.forEach((item: any) => {
      const pokemon: Pokemon = {
        name: item.pokemon.name,
        baseExperience: item.pokemon.base_experience,
        url: item.pokemon.url,
      };
      pokemonEncounters.push(pokemon);
    });

    const locationAreaInfo: LocationAreaInfo = {
      location: data.location,
      pokemonEncounters: pokemonEncounters,
    };

    this.cache.add<LocationAreaInfo>(url, locationAreaInfo);
    return locationAreaInfo;
  }

  // GET https://pokeapi.co/api/v2/pokemon/{id or name}/
  async fetchPokemonInfo(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      console.error(`Failed to fetch pokemon - "${pokemonName}`);
      throw new Error(`Response status: ${response.status}`);
    }

    //get data
    const data = await response.json();
    const urlById = `${url.replace(pokemonName, data.id)}`;

    // console.debug(' url by ID ---------> ', urlById);

    /* NOTE: base experiences ranges from  635. The lowest base experience values
     are held by Sunkern and Blipbug, both with yields of 36
    */
    const pokemon: Pokemon = {
      name: data.name,
      baseExperience: data.base_experience,
      url: urlById,
    };

    return pokemon;
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  locations: Location[]; // results from response.data
};

export type LocationAreaInfo = {
  location: Location;
  pokemonEncounters: Pokemon[];
};

export type Location = {
  // add properties herelo
  name: string;
  url: string;
};

export type Pokemon = {
  name: string;
  baseExperience?: number;
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

const samplePokemonEncounters = {
  pokemon_encounters: [
    {
      pokemon: {
        name: 'fearow',
        url: 'https://pokeapi.co/api/v2/pokemon/22/',
      },
    },
  ],
};
