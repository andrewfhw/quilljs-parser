interface InsertEmbed {
    image?: string;
    formula?: string;
    video?: string;
}

interface RunAttributes {
    script?: 'super' | 'sub';
    color?: string;
    background?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    font?: string;
}

interface LineAttributes {
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

// INTERMEDIATE

interface IntermediateOp extends QuillOp {
    paragraph: boolean;
    embed?: InsertEmbed;
}

interface IntermediateDelta {
    ops: IntermediateOp[];
}

// OUTPUT

interface TextRun {
    text: string;
    attributes?: RunAttributes;
}

interface Paragraph {
    textRuns?: (TextRun | { formula: string })[];
    embed?: InsertEmbed;
    attributes?: LineAttributes;
}

export interface ParsedQuillDelta {
    paragraphs: Paragraph[];
}

export function parseQuill(rawQuill: RawQuillDelta): ParsedQuillDelta {
    const parsed: ParsedQuillDelta = {
        paragraphs: []
    };
    const splitNewline = splitNewlines(rawQuill);
    const parsedParagraphs = parseParagraphs(splitNewline);
    const mergedRuns = mergeTextRuns(parsedParagraphs);
    return mergedRuns;
}

function splitNewlines(rawQuill: RawQuillDelta): RawQuillDelta {
    const splitDelta: RawQuillDelta = {
        ops: []
    };
    for (const op of rawQuill.ops) {
        // simply pass on insert embeds
        if ((op.insert as InsertEmbed).image || (op.insert as InsertEmbed).formula || (op.insert as InsertEmbed).video) {
            splitDelta.ops.push({
                insert: op.insert,
                runAttributes: op.attributes ? op.attributes : undefined
            });
        // simply pass on newline characters
        } else if (op.insert === '\n') {
            splitDelta.ops.push({
                insert: '',
                lineAttributes: op.attributes ? op.attributes : undefined
            });
        // for all other inserts, split on any newline characters
        } else {
            const original = op.insert as string;
            const attributes = op.attributes ? op.attributes : undefined;
            const stringArray = original.split(/(\n)/);
            for (const string of stringArray) {
                splitDelta.ops.push({
                    insert: string,
                    runAttributes: attributes
                });
            };
        }
    };
    // console.log('splitDelta', splitDelta);
    return splitDelta;
}

function parseParagraphs(quill: RawQuillDelta): IntermediateDelta {
    const parsedParagraphs: IntermediateDelta = {
        ops: []
    };
    let newIndex = 0, oldIndex = 0;
    for (const op of quill.ops) {
        // formula embed treated as a run
        if ((op.insert as InsertEmbed).formula) {
            parsedParagraphs.ops.push({
                insert: {
                    formula: (op.insert as InsertEmbed).formula
                },
                runAttributes: op.runAttributes ? op.runAttributes : undefined,
                lineAttributes: op.lineAttributes ? op.lineAttributes : undefined,
                paragraph: false
            });

        // image and video embed treated as paragraphs
        } else if ((op.insert as InsertEmbed).image || (op.insert as InsertEmbed).video) {
            parsedParagraphs.ops.push({
                insert: {
                    image: (op.insert as InsertEmbed).image ? (op.insert as InsertEmbed).image : undefined,
                    video: (op.insert as InsertEmbed).video ? (op.insert as InsertEmbed).video : undefined
                },
                paragraph: true,
                runAttributes: op.runAttributes ? op.runAttributes : undefined,
                lineAttributes: op.lineAttributes ? op.lineAttributes : undefined
            });
            newIndex++;
        // newline marker at op index 0 is a paragraph
        } else if ((op.insert === '' || op.insert === '\n') && oldIndex === 0) {
            parsedParagraphs.ops.push({
                insert: '',
                lineAttributes: op.lineAttributes ? op.lineAttributes : undefined,
                paragraph: true
            });
            newIndex++;
        // newline markers after op index 0 mark preceding op as paragraph
        } else if ((op.insert === '' || op.insert === '\n') && newIndex > 0) {
            const newLength = parsedParagraphs.ops.length;
            parsedParagraphs.ops[newLength-1].lineAttributes = op.lineAttributes;
            parsedParagraphs.ops[newLength-1].paragraph = true;
        // all other text runs
        } else {
            parsedParagraphs.ops.push({
                insert: op.insert,
                runAttributes: op.runAttributes ? op.runAttributes : undefined,
                paragraph: false
            });
            newIndex++;
        }
    oldIndex++;
    };
    // console.log('parsedParagraphs', parsedParagraphs);
    return parsedParagraphs;
}

function mergeTextRuns(quill: IntermediateDelta): ParsedQuillDelta {
    const mergedRuns: ParsedQuillDelta = {
        paragraphs: []
    };
    let indexTracker = 0;
    for (const op of quill.ops) {
        if (indexTracker === 0) {
            if ((op.insert as InsertEmbed).video || (op.insert as InsertEmbed).image || (op.insert as InsertEmbed).formula) {
                mergedRuns.paragraphs.push({
                    embed: op.insert as InsertEmbed,
                    attributes: op.lineAttributes
                });
            } else {
                mergedRuns.paragraphs.push({
                    textRuns: [{
                        text: op.insert as string,
                        attributes: op.runAttributes
                    }],
                    attributes: op.lineAttributes
                });
            }
        } else if (quill.ops[indexTracker-1].paragraph) {
            if ((op.insert as InsertEmbed).video || (op.insert as InsertEmbed).image || (op.insert as InsertEmbed).formula) {
                mergedRuns.paragraphs.push({
                    embed: op.insert as InsertEmbed,
                    attributes: undefined
                });
            } else {
                mergedRuns.paragraphs.push({
                    textRuns: [{
                        text: op.insert as string,
                        attributes: op.runAttributes
                    }],
                    attributes: op.lineAttributes
                });
            }
        } else {
            if ((op.insert as InsertEmbed).image || (op.insert as InsertEmbed).video) {
                mergedRuns.paragraphs.push({
                    embed: op.insert as InsertEmbed,
                    attributes: op.lineAttributes
                });
            } else if ((op.insert as InsertEmbed).formula) {
                mergedRuns.paragraphs[mergedRuns.paragraphs.length-1].textRuns?.push({
                    formula: (op.insert as InsertEmbed).formula!,
                    attributes: op.runAttributes
                });
            } else {
                mergedRuns.paragraphs[mergedRuns.paragraphs.length-1].textRuns?.push({
                    text: op.insert as string,
                    attributes: op.runAttributes
                });
            }
            if (op.lineAttributes) {
                mergedRuns.paragraphs[mergedRuns.paragraphs.length-1].attributes = op.lineAttributes;
            }
        }
        indexTracker++;
    };
    // console.log('mergedRuns', mergedRuns);
    return mergedRuns;
}

