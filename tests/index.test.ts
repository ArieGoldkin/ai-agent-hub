import { test } from 'node:test'
import assert from 'node:assert'
import { version } from '../src/index.js'

test('version should be defined', () => {
  assert.strictEqual(typeof version, 'string')
  assert.ok(version.length > 0)
})