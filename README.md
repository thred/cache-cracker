# cache-cracker

> A collection of tools handy for solving geocaching riddles.

**THIS IS WORK IN PROGRESS AND NOT OF ANY USE, YET!**

## Language

### Value Types

#### Identifier

A refrence to a procedure or variable. 

#### Quantity

A number with a unit, e.g. `4.2 kg` or `4 ft`. If the unit is undefined, the quantity is treated as simple number. 

#### Unit

A unit for a quantity, e.g. `kg` or `ft`.

#### string

Defines some text, e.g. `"Hello World!"`. It may be multiline and contain references, e.g. `"At location $A you will find ${name}"` (with single-letter
variables you can omit the curly braces). Special characters can be escaped with a backslash, e.g. `\$` writes a $ instead of treating the next letter 
as reference.

Strings will automatically be parsed as Quantity (with unit), if necessary, e.g. `4 * "2"` will return `6`. 

#### List

A list of values, e.g. `\[1, 2, 3\]` or `\["a", "b", "c"\]`.

#### Maps

A map of values. e.g. `\{a: 1, b: 2, c: 3\}`. 

### asdf

#### Chaining

The language allows value chaining as common principle, e.g. `4 m 20 cm`. This is a chain of four elements: two qantities without unit and two units.
This statement will have a quantity with the value `4.2 m` as a result. 

A chaining operation will always be executed on two values and it will perform some special tasks, depending on the involved value types.




## Development

### Prerequisites

* [Node.js](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)
* [Gulp CLI](http://gulpjs.com/) - `npm install --global gulp-cli` (as root/admin).
* [TypeScript](http://www.typescriptlang.org/) - `npm install --global typescript` (as root/admin).
* [TypeScript Definition Manager](https://github.com/typings/typings) - `npm install typings --global` (as root/admin)

### Preparations

* Install the dependencies with `npm install`.

