# rbtv-got [![Build Status](https://travis-ci.org/dertieran/rbtv-got.svg?branch=master)](https://travis-ci.org/dertieran/rbtv-got)

> Convenience wrapper for [`got`](https://github.com/sindresorhus/got) to interact with the [RBTV API](https://dertieran.github.io/RocketBeansAPI/)

## Install

```
$ npm install --save rbtv-got
```

## Usage

Instead of:

```js
const got = require('got');
const key = 'foo';
const secret = 'bar';

const wsse = 'create wsse header from key/secret here'

got('http://api.rocketmgmt.de/podcast', {
  json: true,
  headers: {
    'authorization': 'WSSE profile="UsernameToken"',
    'x-wsse': wsse
  }
}).then(res => {
  console.log(res.body.podcasts);
  //=> [...]
});
```

You can do:

```js
const rbtvGot = require('rbtv-got');

ghGot('podcast', {key: 'foo', secret: 'bar'}).then(res => {
  console.log(res.body.podcasts);
  //=> [...]
});
```

Or:

```js
const rbtvGot = require('rbtv-got');

ghGot('http://api.rocketmgmt.de/podcast', {key: 'foo', secret: 'bar'}).then(res => {
  console.log(res.body.podcasts);
  //=> [...]
});
```


## API

Same as [`got`](https://github.com/sindresorhus/got) (including the stream API and aliases), but with some additional options below.

### key

Type: `string`

RBTV [access key](https://dertieran.github.io/RocketBeansAPI/#header-authorization).

Can be set globally with the `RBTV_KEY` environment variable.

### secret

Type: `string`

RBTV [access secret](https://dertieran.github.io/RocketBeansAPI/#header-authorization).

Can be set globally with the `RBTV_SECRET` environment variable.

## License

[MIT](https://github.com/dertieran/rbtv-got/blob/master/license)
