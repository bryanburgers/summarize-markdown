# Markdown Summarizer

Summarize markdown into a simple string, rather than into HTML.

## Why?

Why would anybody want to do this? There are times when HTML is not accepted,
and a simple string is far more useful. The examples that motivated this
library are meta descriptions and the metadata in the Open Graph and Twitter
Cards protocols.

## Contributing

Contributing tests, documentation, or code is all appreciated.

## Installation

Eventually, as long as nobody squats:

```
npm install summarize-markdown
```

## Usage

```js
var summarize = require('summarize-markdown');

summarize('Test paragraph with a [link](http://google.com).');
//=> 'Test paragraph with a link.'

summarize('# Headline\n\nTest paragraph.');
//=> 'Headline: Test paragraph.'
```

