![npm](https://img.shields.io/npm/v/quilljs-parser) ![Travis (.org)](https://img.shields.io/travis/com/andrewanthro/quilljs-parser) ![GitHub last commit](https://img.shields.io/github/last-commit/andrewanthro/quilljs-parser) ![GitHub issues](https://img.shields.io/github/issues/andrewanthro/quilljs-parser) ![NPM](https://img.shields.io/npm/l/quilljs-parser) ![npm](https://img.shields.io/npm/dm/quilljs-parser)

# QuillJS Parser
Transform your [QuillJS](https://quilljs.com) contents into an easier-to-use paragraph format.

## Installation
You can install QuillJS Parser with npm.

```
npm i --save quilljs-parser
```
## How Do I Use It?

Call the `getContents()` method of the Quill editor instance to retrieve the contents of the editor in Delta format. Then, call the `parseQuillDelta()` function of the QuillJS Parser package, passing in the raw Quill delta. The `parseQuillDelta()` function will return an easier-to-use paragraph version of the Delta.

```javascript
const rawQuillDelta = quillInstance.getContents();
const parsedQuill = quillParser.parseQuillDelta(rawQuillDelta);
```

## What Does the Package Do?

This package transforms the content of a QuillJS editor into an easy-to-work-with paragraph format.

By default, a QuillJS editor outputs its content in the Quill [delta](https://quilljs.com/docs/delta/) format. While the delta format works great for a browser-based editor like Quill, it's not the most convenient data format if you'd like to generate other types of documents (e.g., Word or PDF) from Quill's contents. 

QuillJS Parser will transform a QuillJS delta into a more convenient paragraph-based format.

## How Does It Work?

QuillJS outputs a delta with a format like the following:

```javascript
ops: [{
    insert: 'Hello, how are you?'
},{
    insert: 'The First Major Section'
},{
    insert: '\n',
    attributes: { header: 1 }
},{
    insert: 'We are writing some '
},{
    insert: 'bolded text',
    attributes: { bold: true }
},{
    insert: '\n'
}]
```

QuillJS Parser will transform a quill Delta into an easier-to-work-with paragraph format, like the one below:

```javascript
paragraphs: [{
    textRuns: [{
        text: 'Hello, how are you?'
    }]
},{
    textRuns: [{
        text: 'The First Major Section'
    }],
    attributes: {
        header: 1
    }
},{
    textRuns: [{
        text: 'We are writing some '
    },{
        text: 'bolded text',
        attributes: { bold: true }
    }]
},{
    textRuns: []
}]
```

## The Paragraph Format

A parsed QuillJS document is composed entirely of **paragraphs**. Each `paragraph` must contain either a `textRuns` property or an `embed` property, which indicates the *content* of the paragraph. A `paragraph` may also contain an `attributes` property, which indicates the *formatting* of the paragraph.

### `textRuns`

In a simple sense, a text run is just a string of characters within a paragraph. If the text content of a paragraph has no formatting (.e.g, bolded or italicized text), then the paragraph will contain a single text run. If, however, the text in a paragraph contains formatting, then the paragraph will be composed of two or more text runs. 

For example, consider the following paragraph:

> I am building a new package in Javascript. This package will be open source, and it will help developers process the text entered into a QuillJS editor.

Because this paragraph contains no formatting, the `textRuns` property of the `paragraph` object will contain a single text run, as seen below.

```javascript
paragraphs: [{
    textRuns: [{
        text: 'I am building a new package in Javascript. This package will be open source, and it will help developers process the text entered into a QuillJS editor.'
    }]
}]
```

Next, consider the same paragraph with formatting:

> I am building a new package in Javascript. This package will be **open source**, and it will help developers process the text entered into a QuillJS editor.

Now, the `textRuns` property of the `paragraph` object will contain **3** runs to reflect that "open source" is bold.

```javascript
paragraphs: [{
    textRuns: [{
        text: 'I am building a new package in Javascript. This package will be '
    },{
        text: 'open source',
        attributes: { bold: true }
    },{
        text: ', and it will help developers process the text entered into a QuillJS editor.'
    }]
}]
```

### `embed`

The other type of content that a paragraph object can contain is an `embed`. An `embed` is an object with either a `video` property or an `image` property. Both values of the property must be a string.

*Note: A QuillJS embed can also be a `formula`, but the parser treats formula embeds as text runs (because a formula can run inline with a paragraph), so they are simply inserted into the `textRuns` property of the paragraph.*

### `attributes`

Finally, a `paragraph` can also have an `attributes` property. This property indicates what type of paragraph-level formatting has been applied. For instance, a header is a paragraph that is formatted as a header. Similarly, a bullet point is a paragraph that is formatted as a bullet point. An example of a `paragraph` with formatting is shown below.

```javascript
paragraphs: [{
    textRuns: [{
        text: 'I am a bullet point.',
    }],
    attributes: { list: 'bullet' }
},{
    textRuns: [{
        text: 'I am also a bullet point, but I have '
    },{
        text: 'underlined text',
        attributes: { underline: true }
    },{
        text: ' included in my paragraph.'
    }],
    attributes: { list: 'bullet' }
}]
```