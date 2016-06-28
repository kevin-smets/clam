# Clam

Keep clam and use the Html shell.

## Badgis!

[![Build Status](https://travis-ci.org/kevin-smets/clam.svg?branch=master)](https://travis-ci.org/kevin-smets/clam)

[![Coverage Status](https://coveralls.io/repos/kevin-smets/clam/badge.svg?branch=master&service=github)](https://coveralls.io/github/kevin-smets/clam?branch=master)
[![bitHound Score](https://www.bithound.io/github/kevin-smets/clam/badges/score.svg)](https://www.bithound.io/github/kevin-smets/clam)

[![Dependency Status](https://david-dm.org/kevin-smets/clam.svg)](https://david-dm.org/kevin-smets/clam)
[![devDependency Status](https://david-dm.org/kevin-smets/clam/dev-status.svg)](https://david-dm.org/kevin-smets/clam#info=devDependencies)

# Get started

```
npm i
```

```
gulp
```

In another term run

```
npm run electron
```

# Testing and coverage

```
npm run test

npm run coverage
```

## Posting coverage to coveralls.io

Travis builds will push the coverage report to [coveralls.io](https://coveralls.io/github/kevin-smets/clam).

To do this locally, create a .coveralls.yml file with the following content:

```
service_name: travis-ci
repo_token: <repo-token-from-coveralls>
```

# ToDo

## RC1

- ctrl - r to search cmd's
- multiple windows / tabs
- tab completion

## RC2
    
- Standalone installer / program
- add version history / changelog

## Nice to have

- code color highlighting for cat

## Extended

- plugin system
    - drag and drop files
    - git integration
    - typeahead
    - themes
    
# Done

- ~~integrate a build tool (Gulp)~~
- ~~setup testing and coverage~~
- ~~up and down to cycle through cmd's~~
- ~~use travis-cs~~
- ~~use david-dm~~
- ~~show pwd in term~~
