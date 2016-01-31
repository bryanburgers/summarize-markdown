var assert = require('assert');

var summarize = require('../index.js');

function t(input, expectedOutput, options) {
	var output = summarize(input, options);
	assert.equal(output, expectedOutput);
}

describe('summarize', function() {
	it('summarizes a paragraph', function() {
		t('Test paragraph', 'Test paragraph');
	});

	it('summarizes a headline and a paragraph', function() {
		t('# Headline\r\n\r\nTest paragraph', 'Headline: Test paragraph');
	});

	it('summarizes two headlines and a paragraph', function() {
		t('# Headline 1\r\n\r\n## Headline 2\r\n\r\nTest paragraph', 'Headline 1: Headline 2: Test paragraph');
	});

	it('summarizes a paragraph with a link', function() {
		t('Test paragraph with a [link](http://google.com).', 'Test paragraph with a link.');
	});

	it('summarizes a paragraph with bold', function() {
		t('Test paragraph with **bold** text.', 'Test paragraph with bold text.');
	});

	it('summarizes a paragraph with italics', function() {
		t('Test paragraph with *italic* text.', 'Test paragraph with italic text.');
	});

	it('summarizes multiple paragraphs', function() {
		t('Test paragraph 1.\r\n\r\nTest paragraph 2.', 'Test paragraph 1. Test paragraph 2.');
	});

	it('summarizes unordered lists', function() {
		t('* Item 1.\r\n\r\n* Item 2.\r\n\r\n* Item 3.', 'Item 1. Item 2. Item 3.');
	});

	it('summarizes ordered lists', function() {
		t('1. Item 1.\r\n\r\n2. Item 2.\r\n\r\n3. Item 3.', 'Item 1. Item 2. Item 3.');
	});

	it('summarizes lists by adding a period to the end', function() {
		t('* Item 1\r\n\r\n* Item 2\r\n\r\n* Item 3', 'Item 1. Item 2. Item 3.');
	});

	it('summarizes poetry', function() {
		t('Line 1  \r\nLine 2  \r\nLine 3', 'Line 1 / Line 2 / Line 3');
	});

	it('summarizes block quotes', function() {
		t('> This is a blockquote.', '"This is a blockquote."');
	});

	it('summarizes block quotes with a trailing paragraph', function() {
		t('> This is a blockquote.\r\n\r\nThis is a paragraph.', '"This is a blockquote." This is a paragraph.');
	});

	it('doesn\'t make entities of quotes', function() {
		t('It\'s complicated.', 'It\'s complicated.');
		t('**It\'s** complicated.', 'It\'s complicated.');
	});

	it('ignores images', function() {
		t('First content.\r\n\r\n![Alt](/assets/images/image.png)\r\n\r\nSome other content.', 'First content. Some other content.');
	});

	it('decodes HTML character references correctly', function() {
		t('> foo &#x1D306; bar &amp; baz', '"foo \uD834\uDF06 bar & baz"');
	});

	it('ignores code block', function() {
		t('First content.\r\n\r\n```js\r\nvar x = 3;\r\nvar y = 4;\r\n```\r\n\r\nSome other content.', 'First content. Some other content.');
	});

	it('summarize a codespan', function() {
		t('This is some `code`.', 'This is some code.');
	});
});
