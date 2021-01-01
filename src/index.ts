export interface InsertEmbed {
    image?: string;
    formula?: string;
    video?: string;
}

export interface RunAttributes {
    script?: 'super' | 'sub';
    color?: string;
    background?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    font?: string;
    link?: string;
}

export interface LineAttributes {
    header?: 1 | 2;
    direction?: 'rtl';
    align?: 'right' | 'left' | 'center' | 'justify';
    indent?: number;
    blockquote?: boolean;
    list?: 'ordered' | 'bullet';
    "code-block"?: boolean;
}

interface Attributes extends RunAttributes, LineAttributes {}

interface QuillOp {
    insert?: string | InsertEmbed;
    attributes?: Attributes;
    lineAttributes?: LineAttributes;
    runAttributes?: RunAttributes;
}

export interface RawQuillDelta {
    ops: QuillOp[];
}

// OUTPUT

export interface TextRun {
    text: string;
    attributes?: RunAttributes;
}

export interface Paragraph {
    textRuns?: (TextRun | { formula: string })[];
    embed?: InsertEmbed;
    attributes?: LineAttributes;
}

export interface SetupInfo {
    numberedLists: number;
    hyperlinks: string[];
}

export interface ParsedQuillDelta {
    paragraphs: Paragraph[];
    setup: SetupInfo;
}

// Functions

let activeNumberedList = false;

export function parseQuillDelta(quill: RawQuillDelta): ParsedQuillDelta {
    const parsed: ParsedQuillDelta = {
        paragraphs: [],
        setup: {
            numberedLists: 0,
            hyperlinks: []
        }
    };
    for (const op of quill.ops) {
        parseOp(op, parsed);
    };
    return parsed;
}


function parseOp(op: QuillOp, parsed: ParsedQuillDelta) {
    // handle videos and images
    if ((op.insert as InsertEmbed).video || (op.insert as InsertEmbed).image) {
        insertEmbedParagraph(op, parsed);
    // handle formulas
    } else if ((op.insert as InsertEmbed).formula) {
        insertFormula(op, parsed);
    // handle exclusive newlines
    } else if (op.insert === '\n') {
        insertNewline(op, parsed);
    // handle text and text with newlines intermixed
    } else {
        insertText(op, parsed);
    }
}

// insert a blank paragraph
function startNewParagraph(parsed: ParsedQuillDelta, resetList: boolean) {
    parsed.paragraphs.push({
        textRuns: []
    });
    console.log('setting active list to false from new paragraph');
    activeNumberedList = resetList ? false : activeNumberedList;
}

// inserts a video or image embed
function insertEmbedParagraph(op: QuillOp, parsed: ParsedQuillDelta) {
    parsed.paragraphs.push({
        embed: op.insert as InsertEmbed
    });
    startNewParagraph(parsed, true);
}

// inserts a formula embed
function insertFormula(op: QuillOp, parsed: ParsedQuillDelta) {
    if (parsed.paragraphs.length === 0) {
        startNewParagraph(parsed, false);
    }
    parsed.paragraphs[parsed.paragraphs.length-1].textRuns?.push({
        formula: (op.insert as InsertEmbed).formula!,
        attributes: op.attributes
    });
}

// inserts a new paragraph and applies line formatting
function insertNewline(op: QuillOp, parsed: ParsedQuillDelta) {
    // if line attributes, apply those to the previous paragraph
    if (op.attributes) {
        parsed.paragraphs[parsed.paragraphs.length-1].attributes = op.attributes;
        if (op.attributes.list === 'ordered') {
            if (activeNumberedList) {
                startNewParagraph(parsed, false);
            } else {
                activeNumberedList = true;
                parsed.setup.numberedLists++;
                startNewParagraph(parsed, false);
            }
        } else {
            console.log('setting active list to false');
            activeNumberedList = false;
            startNewParagraph(parsed, true);
        }
    } else {
        startNewParagraph(parsed, true);
    }
}

// handle ordered lists tracking
function handleOrderedList(parsed: ParsedQuillDelta) {
    if (activeNumberedList) {
        console.log('list already active');
        return;
    } else {
        console.log('no active list');
        activeNumberedList = true;
        parsed.setup.numberedLists++;
    }
}

// inserts text with intermixed newlines and run attributes
function insertText(op: QuillOp, parsed: ParsedQuillDelta) {
    if (parsed.paragraphs.length === 0) {
        startNewParagraph(parsed, false);
    }
    // if it contains newline characters
    if ((op.insert as string).match(/\n/)) {
        const strings = splitStrings((op.insert as string));
        for (const text of strings) {
            if (text === '\n') {
                startNewParagraph(parsed, true);
            } else {
                insertSimpleString(text, parsed);
            }
        }
    } else {
        insertSimpleString(op.insert as string, parsed, op.attributes);
    }
}

// inserts simple string with attributes
function insertSimpleString(text: string, parsed: ParsedQuillDelta, attributes?: RunAttributes) {
    if (attributes) {
        parsed.paragraphs[parsed.paragraphs.length-1].textRuns?.push({
            text: text,
            attributes: attributes
        });
        if (attributes.link) {
            parsed.setup.hyperlinks.push(attributes.link);
        }
    } else {
        parsed.paragraphs[parsed.paragraphs.length-1].textRuns?.push({
            text: text
        });
    }
}

// splits strings on every newline character, keeping the newline characters; returns array
function splitStrings(string: string): string[] {
    return string.split(/(\n)/);
}



