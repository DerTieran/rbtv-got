import test from 'ava';
import getStream from 'get-stream';
import m from '.';

const key = process.env.RBTV_KEY;
const secret = process.env.RBTV_SECRET;

test('default', async t => {
  const {podcasts} = (await m('podcast')).body;
  t.true(Array.isArray(podcasts));
});

test('full path', async t => {
  const {podcasts} = (await m('http://api.rocketmgmt.de/podcast')).body;
  t.true(Array.isArray(podcasts));
});

test('accepts options', async t => {
  const {podcasts} = (await m('podcast', {})).body;
  t.true(Array.isArray(podcasts));
});

test.serial('global key/secret option', async t => {
  process.env.RBTV_KEY = 'foo';
  process.env.RBTV_SECRET = 'bar';
  await t.throws(m('podcast'), 'Response code 403 (Forbidden)');
  process.env.RBTV_KEY = key;
  process.env.RBTV_SECRET = secret;
});

test('key/secret option', async t => {
  await t.throws(m('podcast', {key: 'foo', secret: 'bar'}), 'Response code 403 (Forbidden)');
});

test('stream interface', async t => {
  const {podcasts} = JSON.parse(await getStream(m.stream('podcast')));
  t.true(Array.isArray(podcasts));
});
