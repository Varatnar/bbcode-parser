import { expect } from "chai";
import "mocha";
import { BBCodeParser } from "../src/BBCodeParser";
import { BBCodeTag } from "../src/BBCodeTag";

describe("BBCodeParser", () => {

    const data = "[url=coolUrl]thisIsMyUrl[test]plusMore[/test][/url]";

    const URL = new BBCodeTag("url", (link) => {
        console.log(link);
    });

    const parser = BBCodeParser.withDefault();

    parser.parse(data);

});
