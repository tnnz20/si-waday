import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateSavingsPercent,
  calculateTargetDimensions,
  formatFileSize,
} from '../app/lib/image-compressor';

test('calculateTargetDimensions preserves dimensions when already within maxDimension', () => {
  const result = calculateTargetDimensions(1200, 800, 1600);
  assert.deepEqual(result, { width: 1200, height: 800 });
});

test('calculateTargetDimensions scales down landscape images maintaining aspect ratio', () => {
  const result = calculateTargetDimensions(4000, 2000, 1600);
  assert.deepEqual(result, { width: 1600, height: 800 });
});

test('calculateTargetDimensions scales down portrait images maintaining aspect ratio', () => {
  const result = calculateTargetDimensions(2400, 4800, 1600);
  assert.deepEqual(result, { width: 800, height: 1600 });
});

test('calculateTargetDimensions scales down square images', () => {
  const result = calculateTargetDimensions(3000, 3000, 1600);
  assert.deepEqual(result, { width: 1600, height: 1600 });
});

test('formatFileSize formats bytes correctly', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(1024), '1 KB');
  assert.equal(formatFileSize(512000), '500 KB');
  assert.equal(formatFileSize(1048576), '1.0 MB');
  assert.equal(formatFileSize(5242880), '5.0 MB');
});

test('calculateSavingsPercent returns correct reduction percentage', () => {
  assert.equal(calculateSavingsPercent(5000000, 500000), 90);
  assert.equal(calculateSavingsPercent(1000000, 800000), 20);
  assert.equal(calculateSavingsPercent(500000, 600000), 0); // never negative
});
