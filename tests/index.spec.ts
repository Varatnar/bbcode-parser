import { expect } from "chai";
import "mocha";
import { BBCodeParser } from "../src/BBCodeParser";

describe("BBCodeParser", () => {

    const parser = BBCodeParser.withDefault();

    describe("Default HTML Library", () => {

        it("should parse bold code", () => {
            const data = "[b]content[/b]";
            const expected = "<strong>content</strong>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse italic code", () => {
            const data = "[i]content[/i]";
            const expected = "<em>content</em>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse underline code", () => {
            const data = "[u]content[/u]";
            const expected = "<u>content</u>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse stroked code", () => {
            const data = "[s]content[/s]";
            const expected = "<s>content</s>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse highlight code", () => {
            const data = "[h]content[/h]";
            const expected = "<mark>content</mark>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse subscript code", () => {
            const data = "[sub]content[/sub]";
            const expected = "<sub>content</sub>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse supscript code", () => {
            const data = "[sup]content[/sup]";
            const expected = "<sup>content</sup>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse basic script code", () => {
            const data = "[code]content[/code]";
            const expected = "<code>content</code>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse link code", () => {
            const data = "[url=coolUrl]thisIsMyUrl[/url]";
            const expected = "<a href='coolUrl' target='_blank'>thisIsMyUrl</a>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse link code with no property", () => {
            const data = "[url]coolUrl[/url]";
            const expected = "<a href='coolUrl' target='_blank'>coolUrl</a>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should parse img code", () => {
            const data = "[img]imagePath[/img]";
            const expected = "<img src='imagePath'>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should throw an error when parsing an img tag with child tags", () => {
            const data = `[img]imgUrl[b]badContent[/b][/img]`;

            expect(parser.parse.bind(parser, data)).to.throw();
        });

        for (let i = 1; i < 7; i++) {
            it("should parse h" + i + " code", () => {
                const data = `[h${i}]content[/h${i}]`;
                const expected = `<h${i}>content</h${i}>`;

                expect(parser.parse(data)).to.equal(expected);
            });
        }

        it("should not convert code that are not part of the library", () => {
            const data = `[falseTag]content[/falseTag]`;

            expect(parser.parse(data)).to.equal(data);
        });

        it("should not convert code with attribute that are not part of the library", () => {
            const data = `[falseTag=attribute]content[/falseTag]`;

            expect(parser.parse(data)).to.equal(data);
        });

        it("should properly parse long complex input", () => {
            const data = "[b][u]English[/u][/b]\n" +
                "↵It is the summary of the story of a bride whose love attack power is 255 but her defensive power is 0.\n" +
                "↵\n" +
                "↵[b][u]Portuguese / Portugu&ecirc;s[/u][/b]\n" +
                "↵&Eacute; um resumo da hist&oacute;ria de uma noiva que tem o poder de ataque de amor n&iacute;vel 255, mas a poder de defesa dela &eacute; 0.\n" +
                "↵\n" +
                "↵[b][u]Italian[/u][/b]\n" +
                "↵Questo &egrave; il riassunto di una sposa il cui potere d'attacco d'amore &egrave; 255 ma quello difensivo &egrave; 0.\n" +
                "↵\n" +
                "↵[B]Links:[/B]\n" +
                "↵[*][url=https://twitter.com/hosimaki]Author's Twitter[/url]";

            const expected = "<strong><u>English</u></strong><br /><br />It is the summary of the story of a bride whose love attack power is 255 but her defensive power is 0.<br /><br /><br /><br /><strong><u>Portuguese / Portugu&ecirc;s</u></strong><br /><br />&Eacute; um resumo da hist&oacute;ria de uma noiva que tem o poder de ataque de amor n&iacute;vel 255, mas a poder de defesa dela &eacute; 0.<br /><br /><br /><br /><strong><u>Italian</u></strong><br /><br />Questo &egrave; il riassunto di una sposa il cui potere d'attacco d'amore &egrave; 255 ma quello difensivo &egrave; 0.<br /><br /><br /><br /><strong>Links:</strong><br /><br />[*]<a href='https://twitter.com/hosimaki' target='_blank'>Author's Twitter</a>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should properly parse input with no tags", () => {
            const data = "some random text with no tags";

            expect(parser.parse(data)).to.equal(data);
        });

        it("should properly parse input with text before a tag", () => {
            const data = "some random text before a tag[b]bold[/b]";
            const expected = "some random text before a tag<strong>bold</strong>";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should properly parse input with text after a tag", () => {
            const data = "[b]bold[/b]some random text before a tag";
            const expected = "<strong>bold</strong>some random text before a tag";

            expect(parser.parse(data)).to.equal(expected);
        });

    });
});
