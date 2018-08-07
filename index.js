'use strict';

const crypto = require('crypto');
const got = require('got');
const pkg = require('./package.json');

const encodeBase64 = string => Buffer.from(string).toString('base64');
const wsse = options => {
  const key = options.key || process.env.RBTV_KEY;
  const secret = options.secret || process.env.RBTV_SECRET;

  // NOTE: We need to remove these options otherwise we get
  // RequestError: error:0906D06C:PEM routines:PEM_read_bio:no start line
  delete options.key;
  delete options.secret;

  if (key && secret) {
    const created = new Date();
    const nonce = `${created}${crypto.randomBytes(36).toString('hex')}`;
    const sha = crypto
      .createHash('sha1')
      .update(`${nonce}${created}${secret}`)
      .digest('hex');

    options.headers['x-wsse'] = `UsernameToken Username="${key}", PasswordDigest="${encodeBase64(sha)}", Nonce="${encodeBase64(nonce)}", Created="${created}"`;
  }
};

module.exports = got.extend({
  json: true,
  baseUrl: 'https://api.rocketmgmt.de',
  headers: {
    authorization: 'WSSE profile="UsernameToken"',
    'user-agent': `${pkg.name}@${pkg.version} (${pkg.homepage})`
  },
  hooks: {beforeRequest: [wsse]}
});
