import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import {
  Change,
  checkForErrors,
  getChanges,
  getStoreResults,
  StoreResult,
} from '../src/utils';

const html = fs.readFileSync(path.resolve(__dirname, './page.html'), 'utf8');
const errorHtml = fs.readFileSync(
  path.resolve(__dirname, './error.html'),
  'utf8'
);

describe('tests', () => {
  it('html files were loaded', () => {
    expect(html).toBeDefined();
    expect(html.length).toBeGreaterThan(0);
    expect(errorHtml).toBeDefined();
    expect(errorHtml.length).toBeGreaterThan(0);
  });
  describe('getStoreResults', () => {
    it('returns expected results', () => {
      const results = getStoreResults(html);
      const expected: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: true,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Tres Ríos',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: false,
        },
      ];
      expect(results).toEqual(expected);
    });
  });
  describe('getChanges', () => {
    it('returns expected changes', () => {
      const last: StoreResult[] = [];
      const current: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: true,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Tres Ríos',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: false,
        },
      ];
      const expected: Change[] = [
        {
          type: 'new store',
          name: 'Alajuela',
        },
        {
          type: 'new store',
          name: 'Escazú',
        },
        {
          type: 'new store',
          name: 'Heredia',
        },
        {
          type: 'new store',
          name: 'Liberia',
        },
        {
          type: 'new store',
          name: 'Llorente',
        },
        {
          type: 'new store',
          name: 'Santa Ana',
        },
        {
          type: 'new store',
          name: 'Tres Ríos',
        },
        {
          type: 'new store',
          name: 'Zapote',
        },
      ];
      expect(getChanges(last, current)).toEqual(expected);
    });
    it('another test', () => {
      const last: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: true,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Tres Ríos',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: false,
        },
      ];
      const current: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: true,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Tres Ríos',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: false,
        },
      ];
      expect(getChanges(last, current)).toEqual([]);
    });
    it('another another test', () => {
      const last: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: true,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Tres Ríos',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: false,
        },
      ];
      const current: StoreResult[] = [
        {
          name: 'Alajuela',
          hasExistence: true,
        },
        {
          name: 'Escazú',
          hasExistence: true,
        },
        {
          name: 'Heredia',
          hasExistence: true,
        },
        {
          name: 'Liberia',
          hasExistence: false,
        },
        {
          name: 'Llorente',
          hasExistence: true,
        },
        {
          name: 'NuevaTienda',
          hasExistence: true,
        },
        {
          name: 'Santa Ana',
          hasExistence: true,
        },
        {
          name: 'Zapote',
          hasExistence: true,
        },
      ];
      const expected: Change[] = [
        {
          type: 'depleted',
          name: 'Liberia',
        },
        {
          type: 'new store',
          name: 'NuevaTienda',
        },
        {
          type: 'supplied',
          name: 'Zapote',
        },
        {
          type: 'removed store',
          name: 'Tres Ríos',
        },
      ];
      expect(getChanges(last, current)).toEqual(expected);
    });
  });
  describe('error html', () => {
    it('can detect error', () => {
      expect(() => checkForErrors(cheerio.load(errorHtml))).toThrowError(
        /MISSING PRODUCT INFO Please refresh the page./
      );
    });
  });
});
