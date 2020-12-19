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
    let html: string | null = null;
    try {
      html = await fetch(url).then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(response.statusText);
      });
    } catch (error) {
      logger.error(error);
    }
    if (html !== null) {
      const oldResults = currentResults;
      currentResults = getStoreResults(html);
      if (first) {
        (async function () {
          while (true) {
            await notifyCurrent(currentResults);
            await sleep(60 * 60 * 1_000);
          }
        })();
      } else {
        const changes = getChanges(oldResults, currentResults);
        if (changes.length > 0) {
          await notifyChanges(changes);
        }
      }
      logger.info('bike inventory updated');
      first = false;
    }
    await sleep(60 * 1_000);
  }
}

main();
