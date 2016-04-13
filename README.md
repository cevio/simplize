# simplize

a new application builder for html5 framework.

## install

> npm install -g simplize-cli

then you can make project by simplize-cli

>spz create


## dev

>npm run dev

run the dev mode by npm scripts.

## build

>npm run build

you can choose a project to build.

## code it

``` javascript
// a simple example.
import * as simplize from 'simplize';
simplize.ready(function(){
    const app = simplize.bootstrap(resource, data, toolbar);
    app.$use(
        app
            .$browser('home')
            .$define('index')
    );
    app.$run();
});
```

## last version

we open on branch `es6`, fork it!
