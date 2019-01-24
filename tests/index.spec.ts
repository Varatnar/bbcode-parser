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

        it("should parse img code", () => {
            const data = "[img]imgPath[/img]";
            const expected = "<img src='imagePath'>";

            expect(parser.parse(data)).to.equal(expected);
        });

        for (let i = 1; i < 7; i++) {
            it("should parse h" + i + " code", () => {
                const data = `[h${i}]content[/h${i}]`;
                const expected = `<h${i}>content</h${i}>`;

                expect(parser.parse(data)).to.equal(expected);
            });
        }
    });
});
