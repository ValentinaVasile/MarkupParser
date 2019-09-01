class TextItem {

}
class BoldTextItem extends TextItem {
	constructor(text) {
		super();
		this.text = text;
	}
	
}
class PlainTextItem extends TextItem {
	constructor(text) {
		super();
		this.text = text;
	}
}
class DocumentItem {
	
}
class TitleItem {
	constructor(level, text) {
		this.level =  level;
		this.text = text;
	}
}

class SectionDocumentItem extends DocumentItem {
	constructor(documentItems, titleItem) {
		super();		
		this.documentItems = documentItems;
		this.titleItem = titleItem;
	}
}

class ParagraphDocumentItem extends DocumentItem{
	constructor(textItems) {
		super();
		this.textItems = textItems;
	}
}

class Document {
	constructor(documentItems) {
		this.documentItems = documentItems;
	}
}
const HashToken = 0;
const NewLineToken = 1;
const BoldToken = 2;
const TextToken = 3;


class Parser {
	
	tokenize(text) {
		let tokens = [];
		let tokenValue = '';
	
		for (let i = 0; i < text.length; i++) {
			if (text[i] == "#") {
				if (tokenValue.length > 0) {
					tokens.push({type: TextToken, value: tokenValue});
					tokenValue = "";
				}
				tokens.push({type: HashToken});
			} else if (text[i] == "*" && text[i+1] == "*") {
				if (tokenValue.length > 0) {
					tokens.push({type: TextToken, value: tokenValue});
					tokenValue = "";
				}
				tokens.push({type: BoldToken});
				i++;
			} else if (text[i] == "\n") {
				if (tokenValue.length > 0) {
					tokens.push({type: TextToken, value: tokenValue});
					tokenValue = "";
				}
				tokens.push({type: NewLineToken});
			} else {
				tokenValue += text[i];
			}
		}
		return tokens;
			 
	}
	parseTitle(tokens, cursor) {
		let countHash = 0;
		for (let i = cursor.index; i < tokens.length; i++) {
			if (tokens[i].type == HashToken) {
				countHash++;
			} else {
				break;
			} 
		}
		if (countHash > 0 && tokens[countHash + cursor.index].type == TextToken && tokens[countHash + cursor.index + 1].type == NewLineToken) {
			cursor.index += countHash + 2;
			return new TitleItem(countHash, tokens[cursor.index - 2].value);
			
		} 
	}
	parsePlainText(tokens, cursor) {
		let token = tokens[cursor.index];
		if (token.type == TextToken) {
			cursor.index++;
			return new PlainTextItem(token.value);
		}
	}
	parseBoldText(tokens, cursor) {
		let token = tokens[cursor.index];
		if (token.type == BoldToken && tokens[cursor.index + 1].type == TextToken && tokens[cursor.index + 2].type == BoldToken) {
			cursor.index += 3;
			return new BoldTextItem(tokens[cursor.index - 2].value);
		}
	}
	parseTextItem(tokens, cursor) {
		let plainTextItem = this.parseTextItem(tokens, cursor);
		if (plainTextItem != undefined) {
			return plainTextItem;
		}
		let boldTextItem = this.parseBoldText(tokens, cursor);
		return boldTextItem;		
	}
	parseParagraph(tokens, cursor) {
		let textItems = [];
		let textItem = parseTextItem(tokens, cursor);
		while (true) {
			if (textItem != undefined) {
				textItems.push(textItem);
				textItem = parseTextItem(tokens, cursor);
			} else {
				break;
			}
		}
		if (textItems.length > 0) {
			return new ParagraphDocumentItem(textItems);
		}
	}
	
}
string  = "# Section 1\nSome **(bold) introduction** to Section 1.\n## Section 1.1\nA text describing Section 1.1\nSome conclusion to Section 1.\n# Section 2\nAn introduction to Section 2.\nSome conclusion to Section 2.";


test = new Parser;
const tokens = test.tokenize(string)
c = {index: 0};
let item = test.parseTitle(tokens, c);
console.log(item, c);
item = test.parseTitle(tokens, c);
console.log(item, c);

item = test.parsePlainText(tokens, c);
console.log(item, c);
item = test.parsePlainText(tokens, c);
console.log(item, c);

item = test.parseBoldText(tokens, c);
console.log(item, c);
item = test.parseBoldText(tokens, c);
console.log(item, c);

class HtmlExporter {
	exportDocument(document) {
		let output = "";
		
	}
}


class WikiExporter {
	exportDocument(document) {
		let output = "";

	}
}

class DomExporter {
	exportDocument(document) {
		let output = "";
	}
}



/*# Section 1

Some **(bold) introduction** to Section 1.

## Section 1.1

# Section 2



HASH, TEXT( Section 1), NL, TEXT(Some ), BOLD, TEXT((bold) introduction), BOLD, TEXT( to Section 1.), NL, HASH, HASH, TEXT( Section 1.1), NL,
HASH, TEXT( Section 2)

HASH, TEXT, NL, TEXT, BOLD, TEXT, BOLD, TEXT, NL, HASH, HASH, TEXT, NL, HASH, TEXT, NL
title         , paragraph                       , title               , title
section (1)	                                    , section (2)         , section (1)

HASH
TEXT
NL
BOLD

document:
	[document_item]

document_item:
	paragraph
	section

paragraph:
	[text_item]

section:
	title [document_item]

title:
	[HASH] TEXT NL

text_item:
	plain_text
	bold_text

plain_text:
	TEXT

bold_text:
	BOLD TEXT BOLD
*/


