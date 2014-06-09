"use strict";

var he = require('he');
var marked = require('marked');
var renderer = new marked.Renderer();

renderer.code = function(code, language) {
	return '';
};
renderer.blockquote = function(quote) {
	quote = he.decode(quote);
	return '"' + quote.trim() + '" ';
};
//html(string html)
renderer.heading = function(text, level) {
	text = he.decode(text);
	return text + ': ';
};
//hr()
renderer.list = function(body, ordered) {
	return body.trim();
};
renderer.listitem = function(text) {
	text = he.decode(text);
	if (/\.\s*$/.test(text)) {
		return text;
	}
	else {
		return text.replace(/(\s*)$/, '.$1');
	}
	//return '\'' + text + '\'';
};
renderer.paragraph = function(text) {
	if (text === '') {
		return '';
	}
	text = he.decode(text);
	return text + ' ';
};
//table(string header, string body)
//tablerow(string content)
//tablecell(string content, object flags)

renderer.strong = function(text) {
	return text;
};
renderer.em = function(text) {
	return text;
};
//codespan(string code)
renderer.br = function() {
	return ' / ';
};
//del(string text)
renderer.link = function(href, title, text) {
	return text;
};
renderer.image = function(href, title, text) {
	return '';
};

module.exports = function(text, options) {
	return marked(text, {
		renderer: renderer
	}).trim();
};
