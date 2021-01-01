import { RawQuillDelta, ParsedQuillDelta} from './index';

interface ParseTest {
    input: RawQuillDelta,
    output: ParsedQuillDelta
};

export const test_basic: ParseTest = {
    input: {
        ops: [{
            insert: 'Hello there!'
        }]
    },
    output: {
        paragraphs: [{
            textRuns: [{
                text: 'Hello there!'
            }]
        }],
        setup: {
            hyperlinks: [],
            numberedLists: 0
        }
    }
}

export const test_header: ParseTest = {
    input: {
        ops: [{
            insert: 'A Level One Heading'
        },{
            insert: '\n',
            attributes: {
                header: 1
            }
        },{
            insert: 'Level Two Heading Here'
        },{
            insert: '\n',
            attributes: {
                header: 2
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'A Level One Heading'
            }],
            attributes: {
                header: 1
            }
        },{
            textRuns: [{
                text: 'Level Two Heading Here'
            }],
            attributes: {
                header: 2
            }
        },{
            textRuns: []
        }]
    }
}

export const test_multi_paragraph: ParseTest = {
    input: {
        ops: [{
            insert: 'This is a test of the basic paragraph parsing.\nHere is the second paragraph in the editor. Sometimes there will be additional paragraphs in the editor down below.\nThis is the third paragraph in the list.\n'
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'This is a test of the basic paragraph parsing.'
            }]
        },{
            textRuns: [{
                text: 'Here is the second paragraph in the editor. Sometimes there will be additional paragraphs in the editor down below.'
            }]
        },{
            textRuns: [{
                text: 'This is the third paragraph in the list.'
            }]
        },{
            textRuns: [{
                text: ''
            }]
        }]
    }
}

export const test_formatted_runs: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is some basic text that is '
        },{
            insert: 'bolded',
            attributes: {
                bold: true
            }
        },{
            insert: ' and then back to normal.\nWe will then continue typing some text that is '
        },{
            insert: 'italicized',
            attributes: {
                italic: true
            }
        },{
            insert: ' but then back to normal. We can also try to '
        },{
            insert: 'strikethrough the text',
            attributes: {
                strike: true
            }
        },{
            insert: ' and back to normal too.\nAnd then we can try to '
        },{
            insert: 'underline the text.',
            attributes: {
                underline: true
            }
        },{
            insert: '\n'
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            attributes: undefined,
            textRuns: [{
                text: 'Here is some basic text that is ',
                attributes: undefined
            },{
                text: 'bolded',
                attributes: {
                    bold: true
                }
            },{
                text: ' and then back to normal.',
                attributes: undefined
            }]
        },{
            attributes: undefined,
            textRuns: [{
                text: 'We will then continue typing some text that is ',
                attributes: undefined
            },{
                text: 'italicized',
                attributes: {
                    italic: true
                }
            },{
                text: ' but then back to normal. We can also try to ',
                attributes: undefined
            },{
                text: 'strikethrough the text',
                attributes: {
                    strike: true
                }
            },{
                text: ' and back to normal too.',
                attributes: undefined
            }]
        },{
            attributes: undefined,
            textRuns: [{
                text: 'And then we can try to ',
                attributes: undefined
            },{
                text: 'underline the text.',
                attributes: {
                    underline: true
                }
            }]
        },{
            textRuns: []
        }]
    }
}

export const test_other_run_format: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is a test of the '
        },{
            insert: 'subscript',
            attributes: {
                script: 'sub'
            }
        },{
            insert: ' and end the sentence.\nThen start a new paragraph and try a '
        },{
            insert: 'superscript',
            attributes: {
                script: 'super'
            }
        },{
            insert: ' and end the paragraph again.\nNow we will try to use a '
        },{
            insert: 'color for the text',
            attributes: {
                color: '#ee0000'
            }
        },{
            insert: ' but then it will go back to normal color here. We can continue writing the paragraph and add some '
        },{
            insert: 'background color to the text',
            attributes: {
                background: '#00ff00'
            }
        },{
            insert: ' but then back to regular text.\nWe can also try to use a font like '
        },{
            insert: 'sans-serif',
            attributes: {
                font: 'sans-serif'
            }
        },{
            insert: ' and then return to normal.\n'
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is a test of the ',
                attributes: undefined
            },{
                text: 'subscript',
                attributes: {
                    script: 'sub'
                }
            },{
                text: ' and end the sentence.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'Then start a new paragraph and try a '
            },{
                text: 'superscript',
                attributes: {
                    script: 'super'
                }
            },{
                text: ' and end the paragraph again.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'Now we will try to use a ',
                attributes: undefined
            },{
                text: 'color for the text',
                attributes: {
                    color: '#ee0000'
                }
            },{
                text: ' but then it will go back to normal color here. We can continue writing the paragraph and add some ',
                attributes: undefined
            },{
                text: 'background color to the text',
                attributes: {
                    background: '#00ff00'
                }
            },{
                text: ' but then back to regular text.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'We can also try to use a font like ',
                attributes: undefined
            },{
                text: 'sans-serif',
                attributes: {
                    font: 'sans-serif'
                }
            },{
                text: ' and then return to normal.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: ''
            }]
        }]
    }
}

export const test_bullet_list: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is just a basic line of text.\nThis is the first bullet point.'
        },{
            insert: '\n',
            attributes: {
                list: 'bullet'
            }
        },{
            insert: 'This is the second bullet point in the list.'
        },{
            insert: '\n',
            attributes: {
                list: 'bullet'
            }
        },{
            insert: 'Here is a subpoint in the list.',
        },{
            insert: '\n',
            attributes: {
                list: 'bullet',
                indent: 1
            }
        },{
            insert: 'Back to the main level.',
        },{
            insert: '\n',
            attributes: {
                list: 'bullet'
            }
        },{
            insert: 'Here is just some regular text.',
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is just a basic line of text.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'This is the first bullet point.',
                attributes: undefined
            }],
            attributes: {
                list: 'bullet'
            }
        },{
            textRuns: [{
                text: 'This is the second bullet point in the list.',
                attributes: undefined
            }],
            attributes: {
                list: 'bullet'
            }
        },{
            textRuns: [{
                text: 'Here is a subpoint in the list.',
                attributes: undefined
            }],
            attributes: {
                list: 'bullet',
                indent: 1
            }
        },{
            textRuns: [{
                text: 'Back to the main level.',
                attributes: undefined
            }],
            attributes: {
                list: 'bullet'
            }
        },{
            textRuns: [{
                text: 'Here is just some regular text.',
                attributes: undefined
            }],
            attributes: undefined
        }]
    }
}

export const test_list_run_formatting: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is just a normal line of text.\nThen this is the first bullet point which also has some '
        },{
            insert: 'formatted text in bold',
            attributes: {
                bold: true
            }
        },{
            insert: ' but then returns to normal text.'
        },{
            insert: '\n',
            attributes: {
                list: 'ordered'
            }
        },{
            insert: 'This is the second bullet point in the list that will '
        },{
            insert: 'end with underlined text.',
            attributes: {
                underline: true
            }
        },{
            insert: '\n',
            attributes: {
                list: 'ordered'
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 1
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is just a normal line of text.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'Then this is the first bullet point which also has some ',
                attributes: undefined
            },{
                text: 'formatted text in bold',
                attributes: {
                    bold: true
                }
            },{
                text: ' but then returns to normal text.',
                attributes: undefined
            }],
            attributes: {
                list: 'ordered'
            }
        },{
            textRuns: [{
                text: 'This is the second bullet point in the list that will ',
                attributes: undefined
            },{
                text: 'end with underlined text.',
                attributes: {
                    underline: true
                }
            }],
            attributes: {
                list: 'ordered'
            }
        },{
            textRuns: []
        }]
    }
}

export const test_ordered_list_tracking: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is the first bullet point of the first list'
        },{
            insert: '\n',
            attributes: {
                list: 'ordered'
            }
        },{
            insert: 'And then the second bullet point with some formatting '
        },{
            insert: 'underlined text',
            attributes: {
                underline: true
            }
        },{
            insert: ' but then back to normal'
        },{
            insert: '\n',
            attributes: {
                list: 'ordered'
            }
        },{
            insert: '\nAnd then just some regular text in the editor\nBut then we start a new ordered list here'
        },{
            insert: '\n',
            attributes: {
                list: 'ordered'
            }
        },{
            insert: 'And a second bullet point in second list'
        },{
            insert: '\n',
            attributes: {
                list: 'ordered',
                indent: 1
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 2
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is the first bullet point of the first list'
            }],
            attributes: {
                list: 'ordered'
            }
        },{
            textRuns: [{
                text: 'And then the second bullet point with some formatting '
            },{
                text: 'underlined text',
                attributes: {
                    underline: true
                }
            },{
                text: ' but then back to normal'
            }],
            attributes: {
                list: 'ordered'
            }
        },{
            textRuns: [{
                text: ''
            }]
        },{
            textRuns: [{
                text: 'And then just some regular text in the editor'
            }]
        },{
            textRuns: [{
                text: 'But then we start a new ordered list here'
            }],
            attributes: {
                list: 'ordered'
            }
        },{
            textRuns: [{
                text: 'And a second bullet point in second list'
            }],
            attributes: {
                list: 'ordered',
                indent: 1
            }
        },{
            textRuns: []
        }]
    }
}

export const test_hyperlink_tracking: ParseTest = {
    input: {
        ops: [{
            insert: 'I am just writing a string of text with a '
        },{
            insert: 'hyperlink to Google',
            attributes: {
                link: 'https://google.com'
            }
        },{
            insert: ' and then back to normal.\nThen start a new line and include another hyperlink to '
        },{
            insert: 'GitHub',
            attributes: {
                link: 'https://github.com'
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [{
                text: 'hyperlink to Google',
                link: 'https://google.com'
            },{
                text: 'GitHub',
                link: 'https://github.com'
            }],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'I am just writing a string of text with a '
            },{
                text: 'hyperlink to Google',
                attributes: {
                    link: 'https://google.com'
                }
            },{
                text: ' and then back to normal.'
            }]
        },{
            textRuns: [{
                text: 'Then start a new line and include another hyperlink to '
            },{
                text: 'GitHub',
                attributes: {
                    link: 'https://github.com'
                }
            }]
        }]
    }
}

export const test_embed: ParseTest = {
    input: {
        ops: [{
            insert: {
                image: 'base64string'
            }
        },{
            insert: 'Here is some miscellaneous text in the document.\n'
        },{
            insert: {
                video: 'https://www.linktovideotowatch.com/video'
            }
        },{
            insert: 'Then I have some text talking about my video.\nBut then I will continue on and write my own formula here: '
        },{
            insert: {
                formula: 'e=mc^2'
            }
        },{
            insert: '.\n'
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            embed: {
                image: 'base64string'
            },
            attributes: undefined
        },{
            textRuns: [{
                text: 'Here is some miscellaneous text in the document.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: ''
            }]
        },{
            embed: {
                video: 'https://www.linktovideotowatch.com/video'
            },
            attributes: undefined
        },{
            textRuns: [{
                text: 'Then I have some text talking about my video.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'But then I will continue on and write my own formula here: ',
                attributes: undefined
            },{
                formula: 'e=mc^2',
                attributes: undefined
            },{
                text: '.',
                attributes: undefined
            }]
        },{
            textRuns: [{
                text: ''
            }]
        }]
    }
};

export const test_other_line_formatting: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is some basic text.\nThis is formatted as a code block.'
        },{
            insert: '\n',
            attributes: {
                "code-block": true
            }
        },{
            insert: 'Then we go back to some normal text.\nNow this is a block quote.'
        },{
            insert: '\n',
            attributes: {
                blockquote: true
            }
        },{
            insert: 'And back to normal text paragraph.\nNext we will align center.'
        },{
            insert: '\n',
            attributes: {
                align: 'center'
            }
        },{
            insert: 'This is a line aligned to the right.'
        },{
            insert: '\n',
            attributes: {
                align: 'right'
            }
        },{
            insert: 'And this line will go from the right to the left.'
        },{
            insert: '\n',
            attributes: {
                direction: 'rtl'
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is some basic text.',
            }],
        },{
            textRuns: [{
                text: 'This is formatted as a code block.',
            }],
            attributes: {
                "code-block": true
            }
        },{
            textRuns: [{
                text: 'Then we go back to some normal text.',
            }],
        },{
            textRuns: [{
                text: 'Now this is a block quote.',
            }],
            attributes: {
                blockquote: true
            }
        },{
            textRuns: [{
                text: 'And back to normal text paragraph.',
            }],
        },{
            textRuns: [{
                text: 'Next we will align center.',
            }],
            attributes: {
                align: 'center'
            }
        },{
            textRuns: [{
                text: 'This is a line aligned to the right.',
            }],
            attributes: {
                align: 'right'
            }
        },{
            textRuns: [{
                text: 'And this line will go from the right to the left.',
            }],
            attributes: {
                direction: 'rtl'
            }
        },{
            textRuns: []
        }]
    }
}

export const test_full_run_format: ParseTest = {
    input: {
        ops: [{
            insert: 'Some basic text in the editor.\n'
        },{
            insert: 'This line is completely underlined.',
            attributes: {
                underline: true
            }
        },{
            insert: '\nBut then we just start a new line.\n'
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'Some basic text in the editor.',
            }],
        },{
            textRuns: [{
                text: ''
            },{
                text: 'This line is completely underlined.',
                attributes: {
                    underline: true
                }
            },{
                text: ''
            }],
        },{
            textRuns: [{
                text: 'But then we just start a new line.',
            }],
        },{
            textRuns: [{
                text: ''
            }]
        }]
    }
}

export const test_mixed_run_formatting: ParseTest = {
    input: {
        ops: [{
            insert: 'Here is some basic text with mixed run formatting. '
        },{
            insert: 'This text is bold and italicized.',
            attributes: {
                bold: true,
                italic: true
            }
        },{
            insert: ' But then it continues on without the mixed formatting.\nThen we start a line in a bullet '
        },{
            insert: 'with mixed formatting as well',
            attributes: {
                underline: true,
                bold: true
            }
        },{
            insert: '\n',
            attributes: {
                list: 'bullet'
            }
        }]
    },
    output: {
        setup: {
            hyperlinks: [],
            numberedLists: 0
        },
        paragraphs: [{
            textRuns: [{
                text: 'Here is some basic text with mixed run formatting. ',
                attributes: undefined
            },{
                text: 'This text is bold and italicized.',
                attributes: {
                    bold: true,
                    italic: true
                }
            },{
                text: ' But then it continues on without the mixed formatting.',
                attributes: undefined
            }],
            attributes: undefined
        },{
            textRuns: [{
                text: 'Then we start a line in a bullet ',
                attributes: undefined
            },{
                text: 'with mixed formatting as well',
                attributes: {
                    underline: true,
                    bold: true
                }
            }],
            attributes: {
                list: 'bullet'
            }
        },{
            textRuns: []
        }]
    }
}