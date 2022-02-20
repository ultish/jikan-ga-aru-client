# jikan-ga-aru-client

This README outlines the details of collaborating on this Ember application. A short introduction of this app could
easily go here.

## Tailwind generation

```
npm run tailwind:watch
```

## Fetch GraphQL Schema from Server

```
get-graphql-schema http://localhost:8080/graphql > schema.graphqls
```

You'll need to clean up the schema file to remove any extra bits that are included (eg ErrorMessage etc)

## Generate Typescript types from GraphQL schema file

```
graphql-schema-typescript generate-ts './schema.graphql' --output app/graphql/schemas.d.ts
```

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd jikan-ga-aru-client`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
    * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
    * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
