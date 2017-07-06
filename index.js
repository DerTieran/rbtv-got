'use strict';

const crypto = require('crypto');
const got = require('got');

const encodeBase64 = string => Buffer.from(string).toString('base64');
const wsse = (key, secret) => {
  const created = new Date();
  const nonce = `${created}${crypto.randomBytes(36).toString('hex')}`;
  const sha = crypto.createHash('sha1').update(`${nonce}${created}${secret}`).digest('hex');

  return `UsernameToken Username="${key}", PasswordDigest="${encodeBase64(sha)}", Nonce="${encodeBase64(nonce)}", Created="${created}"`;
};

const rbtvGot = function (path, opts) {
  if (typeof path !== 'string') {
    return Promise.reject(new TypeError(`Expected \`path\` to be a string, got ${typeof path}`));
  }

  const env = process.env;

  opts = Object.assign({
    json: true,
    key: env.RBTV_KEY,
    secret: env.RBTV_SECRET
  }, opts);

  opts.headers = Object.assign({
    authorization: 'WSSE profile="UsernameToken"',
    'user-agent': 'https://github.com/DerTieran/rbtv-got'
  }, opts.headers);

  if (opts.key && opts.secret) {
    opts.headers['x-wsse'] = wsse(opts.key, opts.secret);
  }

  const endpoint = 'http://api.rocketmgmt.de/';
  const url = /^https?/.test(path) ? path : endpoint + path.replace(/^\/?/, '');

  if (opts.stream) {
    return got.stream(url, opts);
  }

  return got(url, opts);
};

rbtvGot.stream = (path, opts) => rbtvGot(path, Object.assign({}, opts, {
  json: false,
  stream: true
}));

const methods = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
];

methods.forEach(method => {
  rbtvGot[method] = (path, opts) => rbtvGot(path, Object.assign({}, opts, {method}));
  rbtvGot.stream[method] = (path, opts) => rbtvGot.stream(path, Object.assign({}, opts, {method}));
});

module.exports = rbtvGot;
