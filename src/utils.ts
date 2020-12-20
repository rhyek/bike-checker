import cheerio from 'cheerio';

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export interface StoreResult {
  name: string;
  hasExistence: boolean;
}

export function checkForErrors($: ReturnType<typeof cheerio.load>) {
  const message = $('#page-error').text();
  if (message) {
    throw new Error(message.trim().replace(/\s+/g, ' '));
  }
}

export function getStoreResults(html: string) {
  const $ = cheerio.load(html);
  checkForErrors($);
  const stores = $('#clubs-selection > div > :nth-child(3) > ul > li');
  const results: StoreResult[] = [];
  for (const store of stores.toArray()) {
    const $store = $(store);
    if ($store.children().length === 0) {
      continue;
    }
    const hasExistence = $store.find('p > i').hasClass('fa-check');
    const storeName = $store.find('p > span').text();
    results.push({
      name: storeName,
      hasExistence,
    });
  }
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}

export interface Change {
  type: 'new store' | 'removed store' | 'supplied' | 'depleted';
  name: string;
}

export function getChanges(
  last: StoreResult[],
  current: StoreResult[]
): Change[] {
  const changes: Change[] = [];
  for (const result of current) {
    const found = last.find((r) => r.name === result.name);
    if (!found) {
      changes.push({
        type: 'new store',
        name: result.name,
      });
    } else {
      if (result.hasExistence !== found.hasExistence) {
        if (result.hasExistence) {
          changes.push({
            type: 'supplied',
            name: result.name,
          });
        } else {
          changes.push({
            type: 'depleted',
            name: result.name,
          });
        }
      }
    }
  }
  for (const result of last) {
    const found = current.find((r) => r.name === result.name);
    if (!found) {
      changes.push({
        type: 'removed store',
        name: result.name,
      });
    }
  }
  return changes;
}
