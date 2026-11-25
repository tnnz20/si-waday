import assert from 'node:assert/strict';
import test from 'node:test';

import { KECAMATAN_TAPIN_LIST, MAP_PRESET_LOCATIONS, TAPIN_CENTER } from '../app/constants/tapin';
import { getDistrictCenter, isWithinTapinBounds, roundCoord } from '../app/lib/map-utils';

test('roundCoord rounds coordinates to 6 decimal places by default', () => {
  assert.equal(roundCoord(-2.933861234), -2.933861);
  assert.equal(roundCoord(115.15397876), 115.153979);
});

test('isWithinTapinBounds accepts valid Kabupaten Tapin coordinates', () => {
  assert.equal(isWithinTapinBounds(-2.93386, 115.15397), true); // Rantau / Tapin Utara
  assert.equal(isWithinTapinBounds(-3.139901, 115.090221), true); // Binuang
  assert.equal(isWithinTapinBounds(-2.879966, 114.930966), true); // Margasari / Candi Laras Utara
});

test('isWithinTapinBounds rejects coordinates outside Kabupaten Tapin', () => {
  assert.equal(isWithinTapinBounds(-6.2, 106.816666), false); // Jakarta
  assert.equal(isWithinTapinBounds(0, 0), false);
  assert.equal(isWithinTapinBounds(Number.NaN, 115.15), false);
});

test('getDistrictCenter resolves every district in KECAMATAN_TAPIN_LIST within Tapin bounds', () => {
  for (const district of KECAMATAN_TAPIN_LIST) {
    const center = getDistrictCenter(district);
    assert.equal(
      isWithinTapinBounds(center.lat, center.lng),
      true,
      `District ${district} should fall within Tapin bounds`
    );
  }

  assert.deepEqual(getDistrictCenter('Kecamatan Tidak Ada'), TAPIN_CENTER);
  assert.deepEqual(getDistrictCenter(undefined), TAPIN_CENTER);
});

test('all MAP_PRESET_LOCATIONS fall within Kabupaten Tapin bounds', () => {
  for (const preset of MAP_PRESET_LOCATIONS) {
    assert.equal(
      isWithinTapinBounds(preset.lat, preset.lng),
      true,
      `Preset ${preset.name} should fall within Tapin bounds`
    );
  }
});
