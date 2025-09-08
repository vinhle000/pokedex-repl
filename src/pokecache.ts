export type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(intervalMs: number) {
    this.#interval = intervalMs;
    this.#startReapLoop();
  }
  add<T>(key: string, val: T): void {
    this.#cache.set(key, { createdAt: Date.now(), val });
  }

  get<T>(key: string): T | undefined {
    // if (this.#cache.has(key)) {
    //   return this.#cache.get(key); // This can return undefined
    // }
    const cached = this.#cache.get(key);
    return cached ? cached.val : undefined;
  }

  #reap(): void {
    // check every => if entry.createAt < Date.now() -this.#interval
    for (const [key, entry] of this.#cache) {
      if (entry.createdAt < Date.now() - this.#interval) {
        this.#cache.delete(key);
      }
    }
  }

  #startReapLoop(): void {
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
  }

  stopReapLoop(): void {
    clearInterval(this.#reapIntervalId);
    this.#reapIntervalId = undefined;
  }
}
