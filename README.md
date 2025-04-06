# Packaged epubcheck.jar

This package contains a specific version of epubcheck. Using this enables managing and updating the epubcheck via NPM.

## Install

* ```npm i epubcheck-static```

## Use

The path to the jar file and the version is exported by the module:

```js
import * as epubcheck from "epubcheck-static";

console.log(epubcheck.path);
// /tmp/test/node_modules/epubcheck-static/vendor/epubcheck.jar
console.log(epubcheck.version);
// v5.1.0
```

Use this when you invoke epubcheck.

## Update

Use the built-in updater tool:

```npm run update```
