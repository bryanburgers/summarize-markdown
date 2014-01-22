"use strict";

var marked = require('marked');
var renderer = new marked.Renderer();

//code(string code, string language)
renderer.blockquote = function(quote) {
	return '"' + quote.trim() + '" ';
};
//html(string html)
renderer.heading = function(text, level) {
	return text + ': ';
};
//hr()
renderer.list = function(body, ordered) {
	return body.trim();
};
renderer.listitem = function(text) {
	if (/\.\s*$/.test(text)) {
		return text;
	}
	else {
		return text.replace(/(\s*)$/, '.$1');
	}
	//return '\'' + text + '\'';
};
renderer.paragraph = function(text) {
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
//image(string href, string title, string text)

module.exports = function(text, options) {
	return marked(text, {
		renderer: renderer
	}).trim();
};
