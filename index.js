"use strict";

var marked = require('marked');

// This function lifted from 'InlineLexer.prototype.output', then edited to
// summarize the markdown. Looking through the marked code, I didn't see any
// other way to do this than to replace their output function with this one.
function output(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += text;
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += text;
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.output(cap[2] || cap[1]);
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.output(cap[2] || cap[1]);
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(cap[2], true);
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += ' / ';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.output(cap[1]);
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.smartypants(cap[0]);
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

// This function lifted from 'InlineLexer.prototype.outputLink', then edited
// to summarize the markdown. Looking through the marked code, I didn't see
// any other way to do this than to replace their output function with this
// one.
function outputLink(cap, link) {
  if (cap[0][0] !== '!') {
    return this.output(cap[1]);
  } else {
    return '';
  }
}

// This function lifted from 'Parser.prototype.tok', then edited to summarize
// the markdown. Looking through the marked code, I didn't see any other way
// to do this than to replace their output function with this one.
function tok() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '';
    }
    case 'heading': {
      return this.inline.output(this.token.text) + ': ';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += this.token.align[i]
          ? '<th align="' + this.token.align[i] + '">' + heading + '</th>\n'
          : '<th>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += this.token.align[j]
            ? '<td align="' + this.token.align[j] + '">' + cell + '</td>\n'
            : '<td>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return body + ' ';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return body.replace(/\.?\s*$/, '.') + ' ';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return body.replace(/\.?\s*$/, '.') + ' ';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return this.inline.output(this.token.text) + ' ';
    }
    case 'text': {
      return this.parseText();
    }
  }
};

module.exports = function(text, options) {
	var tokens = marked.Lexer.lex(text, marked.defaults);
	var parser = new marked.Parser(marked.defaults);
	// Need to hijack parser.parse, so that we can build our own InlineLexer,
	// so that we can replace some of the imoprtant functions.
	parser.parse = function(src) {
		this.inline = new marked.InlineLexer(src.links, this.options);
		// Replace the output function to not output HTML.
		this.inline.output = output;
		// Replace the outputLink function to not output HTML.
		this.inline.outputLink = outputLink;
		this.tokens = src.reverse();

		var out = '';
		while (this.next()) {
			out += this.tok();
		}

		return out;
	};
	// Replace the tok command to not output HTML.
	parser.tok = tok;

	var ret = parser.parse(tokens);
	return ret.replace(/\s+$/, '');
};
