# TODO

## Code

* The class Expression should be called Command
* NextExpressionToken should be called nextToken (rename all expression things)
* The definition should be called Procedure (finally a word that does not collide with function).
* Datatype Array should be List.
* Datatype Object should be Map.
* Other datatypes are String, Quantity, Unit.
* Parse methods should accept objects instead of strings.
* Invoke method of scope should take args - where should the method store values?
* More options for invoke beside Maps: single parameters, arrays
* Implement units mathematically correctly by supporting undefined units, too.
* Chain everything, e.g. Functioncalls (fn(..) is a chain of fn and (..)), units (units may be strings, too), ...
* Interpreting an expression in a Scope variable should be an option and not automatically be performed when invoking get or required, but with a utility method afterwards


