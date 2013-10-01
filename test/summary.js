var assert = require('assert');

var summarize = require('../index.js');

function t(input, expectedOutput, options) {
	var output = summarize(input, options);
	assert.equal(input, output);
}

describe('summarize', function() {
	it('summarizes a paragraph', function() {
		t('Test paragraph', 'Test Paragraph');
	});

	it('summarizes a headline and a paragraph', function() {
		t('# Headline\r\n\r\nTest paragraph', 'Headline. Test paragraph');
	});

	it('summarizes two headlines and a paragraph', function() {
		t('# Headline 1\r\n\r\n## Headline 2\r\n\r\nTest paragraph', 'Headline 1. Headline 2. Test paragraph');
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

	it('summarizes a maximum length', function() {
		t('Test paragraph that would exceed the length', 'Test paragraph that…', { maximumLength: 20 });
	});

	it('summarizes a maximum length - bold', function() {
		t('Test **paragraph** that would exceed the length', 'Test paragraph that…', { maximumLength: 20 });
	});

	it('summarizes a maximum length - with headline', function() {
		t('# Headline\r\nTest paragraph that would exceed the length', 'Headline. Test para…', { maximumLength: 20 });
	});
});
