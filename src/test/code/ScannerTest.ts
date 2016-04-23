/// <reference path="../imports.d.ts" />

import Scanner from "../../script/code/Scanner";
import * as Tokenizer from "../../script/code/Tokenizer";
import {assert} from "chai";

describe("Scanner", () => {

    it("scan \"abc\"", () => {
        let scanner = new Scanner("abc");

        assert.equal(scanner.get(), "a");
        assert.equal(scanner.offset, 0);
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 1);
        
        assert.equal(scanner.next(), "b");
        assert.equal(scanner.lookAhead(), "c");
        assert.equal(scanner.get(), "b");
        assert.equal(scanner.offset, 1);
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 2);

        assert.equal(scanner.next(), "c");
        assert.equal(scanner.lookAhead(), null);
        assert.equal(scanner.get(), "c");
        assert.equal(scanner.offset, 2);
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 3);

        assert.equal(scanner.next(), null);
        assert.equal(scanner.offset, 3);
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 4);

        assert.equal(scanner.next(), null);
        assert.equal(scanner.offset, 3);
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 4);
    });

    it("scan \"\   a\\nb\\nc   \", ignoring the whitespaces", () => {
        let scanner = new Scanner("   a\nb\tc\n   ");

        assert.equal(scanner.next(Tokenizer.isNonWhitespace), "a");
        assert.equal(scanner.line, 1);
        assert.equal(scanner.column, 4);
        
        assert.equal(scanner.next(Tokenizer.isNonWhitespace), "b");
        assert.equal(scanner.line, 2);
        assert.equal(scanner.column, 1);
        
        assert.equal(scanner.next(Tokenizer.isNonWhitespace), "c");
        assert.equal(scanner.line, 2);
        assert.equal(scanner.column, 3);
        
        assert.equal(scanner.next(Tokenizer.isNonWhitespace), null);
        assert.equal(scanner.line, 3);
        assert.equal(scanner.column, 4);
    });

});
