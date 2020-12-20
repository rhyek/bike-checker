// @ts-ignore
import gmail from 'gmail-send';
import { url } from './consts';
import { logger } from './logger';
import { Change, StoreResult } from './utils';

const sender = gmail({
  user: 'carlos.rgn@gmail.com',
  pass: process.env.MAIL_PASS,
  to: 'carlos.rgn@gmail.com',
});

async function send(subject: string, text: string) {
  try {
    await sender({
      subject,
      text,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function notifyCurrent(results: StoreResult[]): Promise<void> {
  const text =
    `${url}\n\n` +
    results
      .map((r) => `${r.name}: ${r.hasExistence ? 'supplied' : 'depleted'}`)
      .join('\n');
  await send('current bike inventory', text);
  logger.info('bike inventory notified');
}

export async function notifyChanges(changes: Change[]): Promise<void> {
  await send(
    'new changes for bike inventory',
    `${url}\n\n` + JSON.stringify(changes, null, 2)
  );
  logger.info('bike inventory changes notified');
}
