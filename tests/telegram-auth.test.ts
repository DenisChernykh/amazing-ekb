import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { validateInitData } from '../src/lib/validate-init-data';

const token = '12345:test-only-bot-token';
const now = Date.UTC(2026, 8, 26, 10);
function signed(age = 0) {
  const data = new URLSearchParams({ auth_date: String(now / 1000 - age), query_id: 'test', user: JSON.stringify({ id: 1234567890123, first_name: '100% Денис + &' }) });
  const check = [...data.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
  const key = createHmac('sha256', 'WebAppData').update(token).digest();
  data.set('hash', createHmac('sha256', key).update(check).digest('hex'));
  return data.toString();
}
test('accepts Telegram signature and decodes user exactly once', () => {
  assert.equal(validateInitData(signed(), token, now)?.user.first_name, '100% Денис + &');
});
test('rejects forged, unsigned, expired, future and duplicate input', () => {
  const forged = new URLSearchParams(signed());
  forged.set('user', JSON.stringify({ id: 1, first_name: 'Admin' }));
  assert.equal(validateInitData(forged.toString(), token, now), null);
  assert.equal(validateInitData('user={"id":1}', token, now), null);
  assert.equal(validateInitData(signed(3601), token, now), null);
  assert.equal(validateInitData(signed(-31), token, now), null);
  assert.equal(validateInitData(signed() + '&auth_date=1', token, now), null);
  assert.equal(validateInitData(signed(), 'wrong-bot', now), null);
});
