import fetch from 'node-fetch';
import { url } from './const';
import { logger } from './logger';
import { notifyChanges, notifyCurrent } from './mail';
import { getChanges, getStoreResults, sleep, StoreResult } from './utils';

async function main() {
  logger.info('bike checker started');
  let currentResults: StoreResult[] = [];
  let first = true;
  while (true) {
    await sleep(5_000);
    let html: string;
    try {
      html = await fetch(url).then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(response.statusText);
      });
    } catch (error) {
      logger.error(error);
      continue;
    }
    const oldResults = currentResults;
    currentResults = getStoreResults(html);
    if (first) {
      (async function () {
        await notifyCurrent(currentResults);
        await sleep(60 * 1_000);
      })();
    } else {
      const changes = getChanges(oldResults, currentResults);
      if (changes.length > 0) {
        await notifyChanges(changes);
      }
    }
    first = false;
    logger.info('bike inventory updated');
  }
}

main();
