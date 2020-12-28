import { parseQuill } from './index';
import {
    test_basic,
    test_header,
    test_multi_paragraph,
    test_formatted_runs,
    test_other_run_format,
    test_bullet_list,
    test_list_run_formatting,
    test_embed,
    test_other_line_formatting,
    test_full_run_format,
    test_mixed_run_formatting,

} from './mock-input-output';


describe('test parsing', () => {

    test('basic parse', () => {
        expect(parseQuill(test_basic.input)).toEqual(test_basic.output);
    });

    test('header', () => {
        expect(parseQuill(test_header.input)).toEqual(test_header.output);
    });

    test('multi paragraph', () => {
        expect(parseQuill(test_multi_paragraph.input)).toEqual(test_multi_paragraph.output);
    });

    test('basic run formatting', () => {
        expect(parseQuill(test_formatted_runs.input)).toEqual(test_formatted_runs.output);
    });

    test('less common run formatting', () => {
        expect(parseQuill(test_other_run_format.input)).toEqual(test_other_run_format.output);
    });

    test('bullet list', () => {
        expect(parseQuill(test_bullet_list.input)).toEqual(test_bullet_list.output);
    });

    test('list with run formatting', () => {
        expect(parseQuill(test_list_run_formatting.input)).toEqual(test_list_run_formatting.output);
    });

    test('embeds', () => {
        expect(parseQuill(test_embed.input)).toEqual(test_embed.output);
    });

    test('other line formatting', () => {
        expect(parseQuill(test_other_line_formatting.input)).toEqual(test_other_line_formatting.output);
    });

    test('line with full run formatting', () => {
        expect(parseQuill(test_full_run_format.input)).toEqual(test_full_run_format.output);
    });

    test('mixed run formatting', () => {
        expect(parseQuill(test_mixed_run_formatting.input)).toEqual(test_mixed_run_formatting.output);
    });

});