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
            const data = "[b]bold[/b]some random text after a tag";
            const expected = "<strong>bold</strong>some random text after a tag";

            expect(parser.parse(data)).to.equal(expected);
        });

        it("should properly parse line tag", () => {
            const data = "1952: 1st Honkai Eruption in Berlin - 2000: 2nd Honkai Eruption in Siberia - 2014: Honkai Outbreak in Nagazora\n" +
                "↵\n" +
                "↵Honkai is a corrupting force that manifests itself as supernatural disasters, monstrous creatures, plagues, and Herrschers who can bend physical laws on a whim. Human civilization has been at war with the Honkai since the very beginning. The Valkyries are the mightiest warriors of humanity. They are our only hope.\n" +
                "↵\n" +
                "↵The definitive source of lore, background, and epic saga of Honkai Impact 3rd, a 3D anime-style ARPG game developed and published by miHoYo.\n" +
                "↵\n" +
                "↵[url=https://mangadex.org/manga/26804/honkai-impact-3rd-mystery-of-stigmata]# Book 1003 = Mystery of Stigmata[/url]\t\n" +
                "↵[url=https://mangadex.org/manga/26358/honkai-impact-3-moon-shadow]# Book 1008 = Moon Shadow[/url]\t\t[/hr]\t\n" +
                "↵[hr]Side Story :\n" +
                "↵[url=https://mangadex.org/manga/23219/honkai-impact-3-violet-sea-story]# Book 1004 = Violet Sea Tales[/url]\t\t\t\n" +
                "↵[url=https://mangadex.org/manga/15560/guns-girl-schooldayz-ex]# Book 1005 = Dark Sakura Tales |  Guns Girl SchoolDayZ EX - Sakura Arc [/url]\n" +
                "↵[url=https://www.mangadex.org/manga/26186/honkai-impact-3-purple-kite-s-tales]# Book 1009 = Purple Kite's Tales[/url]\t\t\n" +
                "↵[url=https://mangadex.org/title/31991/honkai-impact-3rd-secret-of-the-god-keys]# Book 1010 = Secret of the God Keys[/url]\t\t\n" +
                "↵[url=https://mangadex.org/title/30935/honkai-impact-3rd-2nd-lawman]# Book 1012 = 2nd Herrscher/Lawman\t[/url]\t[/hr]\n" +
                "↵[hr]Spin-off :\n" +
                "↵[url=https://www.mangadex.org/manga/26185/honkai-impact-3-when-kiana-play-honkai-impact]# Book 1011 = When Kiana Play Honkai Impact[/url]\n" +
                "↵[url=https://mangadex.org/manga/26179/honkai-impact-3-valkyries-dining-escapades]# Book 1013 = Valkyries' Dining Escapades[/url][/hr]\n" +
                "↵[url=https://mangadex.org/title/30931/honkai-impact-3rd-summer-memories]# Book 1014 = Summer Memories [/url]\"\n";

            const expected = "1952: 1st Honkai Eruption in Berlin - 2000: 2nd Honkai Eruption in Siberia - 2014: Honkai Outbreak in Nagazora<br /><br /><br /><br />Honkai is a corrupting force that manifests itself as supernatural disasters, monstrous creatures, plagues, and Herrschers who can bend physical laws on a whim. Human civilization has been at war with the Honkai since the very beginning. The Valkyries are the mightiest warriors of humanity. They are our only hope.<br /><br /><br /><br />The definitive source of lore, background, and epic saga of Honkai Impact 3rd, a 3D anime-style ARPG game developed and published by miHoYo.<br /><br /><br /><br /><a href='https://mangadex.org/manga/26804/honkai-impact-3rd-mystery-of-stigmata' target='_blank'># Book 1003 = Mystery of Stigmata</a>\t<br /><br /><a href='https://mangadex.org/manga/26358/honkai-impact-3-moon-shadow' target='_blank'># Book 1008 = Moon Shadow</a>\t\t</hr>\t<br /><br /><hr>Side Story :<br /><br /><a href='https://mangadex.org/manga/23219/honkai-impact-3-violet-sea-story' target='_blank'># Book 1004 = Violet Sea Tales</a>\t\t\t<br /><br /><a href='https://mangadex.org/manga/15560/guns-girl-schooldayz-ex' target='_blank'># Book 1005 = Dark Sakura Tales |  Guns Girl SchoolDayZ EX - Sakura Arc </a><br /><br /><a href='https://www.mangadex.org/manga/26186/honkai-impact-3-purple-kite-s-tales' target='_blank'># Book 1009 = Purple Kite's Tales</a>\t\t<br /><br /><a href='https://mangadex.org/title/31991/honkai-impact-3rd-secret-of-the-god-keys' target='_blank'># Book 1010 = Secret of the God Keys</a>\t\t<br /><br /><a href='https://mangadex.org/title/30935/honkai-impact-3rd-2nd-lawman' target='_blank'># Book 1012 = 2nd Herrscher/Lawman\t</a>\t</hr><br /><br /><hr>Spin-off :<br /><br /><a href='https://www.mangadex.org/manga/26185/honkai-impact-3-when-kiana-play-honkai-impact' target='_blank'># Book 1011 = When Kiana Play Honkai Impact</a><br /><br /><a href='https://mangadex.org/manga/26179/honkai-impact-3-valkyries-dining-escapades' target='_blank'># Book 1013 = Valkyries' Dining Escapades</a></hr><br /><br /><a href='https://mangadex.org/title/30931/honkai-impact-3rd-summer-memories' target='_blank'># Book 1014 = Summer Memories </a>\"<br />";

            expect(parser.parse(data)).to.equal(expected);
        });

    });
});
