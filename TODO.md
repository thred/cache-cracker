# TODO

## Code

* Tests using multiple accents
* Implement parsing the \u0000 definitions. Use the AbstratTokenizer.parseCharacter method in other tokenizers, too.
* Use accent for command parser separator (, or ;)
* Use accent for number parsing
* Add Type: RegularExpression
* ? should be called Any instead
* Comments: Comment can happen everywhere. Consume the whole comment in the Tokenizer and add it to the next token. Do not return comments as token.
* Define Units via Definitions, Context and Scope
* Parse methods of Quantity and Unit should accept objects instead of strings.
* Implement units mathematically correct by supporting undefined units, too.
* Fix Map and Array parsing
* Implement asMap, asArray
* Implement UnitParser like QuantityParser
* Type-Parser should work on predefined Types, too. Or maybe we do not even need it
* Add Type-Parsing to CommandParser
* Use Tuples as Maps or Lists in procedure calls.
