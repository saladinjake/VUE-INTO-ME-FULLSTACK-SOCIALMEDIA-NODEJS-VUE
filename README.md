# node-es6-starter
Node.js ES6+ starter with [Babel.js](https://babeljs.io/), [ESLint](http://eslint.org/) & [nyc](https://github.com/istanbuljs/nyc) with minimal setup.

A social media application with nodejs mongodb and vue js. from authentication, realtime chat and more.. Basically meets the need to show how building enterprise software on aws can be done with code modularization, oop encapsulation A prototype of a complex application structure .and bla bla bla. just take it.

## Motivation

I created this repo to use it as a starting point for build npm libaries using ES6 (& beyond) syntax & features.
work in progress to provide enterprise solution for free

### Configuration

### Babel.js


### Coding style

Airbnb has an excellent [style guide](https://github.com/airbnb/javascript) for ES6. We will follow the guide and adhere to the recommended coding style.

### ESLint


### Unit testing



## Quick Start
1. Make sure you have recent, [stable](https://nodejs.org/en/about/releases/) version of node (>= 12.16.1).

	```
	nave use stable
	node -v
	```
2. Clone or download this repo.

3. Get latest releases of the tools

	```
	npm update --save
	```

## Commands
### Lint
```
npm run lint
```

### Build
```
npm run build
```

### Test
#### Unit test
```
npm run test
```

#### Coverage
```
npm run test-cov
```

### Run
#### ES6 code via babel-node
```
npm run dev
```

#### ES5 code (transpiled)
```
npm run build

node lib/
```
or
```
npm start
```



## Code Directories

`./src` - source code, stays in git repo. Not published to npm.

`./test` - unit tests, stays in git repo. Not published to npm.

`./lib` - transpiled ES5 code, not saved in git, gets published to npm.

## License

  [MIT](LICENSE)
