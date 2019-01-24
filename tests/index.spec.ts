import { expect } from "chai";
import "mocha";
import { BBCodeParser } from "../src/BBCodeParser";

describe("BBCodeParser", () => {

    const parser = BBCodeParser.withDefault();

    it("should parse link properly with default html library", () => {
        const data1 = "[url=coolUrl]thisIsMyUrl[test]plusMore[/test][/url]";
        const expected1 = "<a href='coolUrl' target='_blank'>thisIsMyUrl<test>plusMore</test></a>";

        expect(parser.parse(data1)).to.equal(expected1);
    });

});
