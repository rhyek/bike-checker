import fetch from 'node-fetch';
import { url } from './consts';
import { logger } from './logger';
import { notifyChanges, notifyCurrent } from './mail';
import { getChanges, getStoreResults, sleep, StoreResult } from './utils';

async function main() {
  logger.info('bike checker started');
  let currentResults: StoreResult[] = [];
  let first = true;
  while (true) {
    try {
      const html = await fetch(url).then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(response.statusText);
      });
      const oldResults = currentResults;
      currentResults = getStoreResults(html);
      if (first) {
        (async function () {
          while (true) {
            await notifyCurrent(currentResults);
            await sleep(60 * 60 * 1_000);
          }
        })();
        first = false;
      } else {
        const changes = getChanges(oldResults, currentResults);
        if (changes.length > 0) {
          await notifyChanges(changes);
        }
      }
      logger.info('bike inventory updated');
    } catch (error) {
      logger.error(error);
    }
    await sleep(60 * 1_000);
  }
}

main();
