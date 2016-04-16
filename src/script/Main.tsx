/// <reference path="refs.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Materialize from "react-materialize";

namespace CachePicker {

    class Foo extends React.Component<{}, {}> {
        render() {
            return <div>lalal</div>;
        }
    }

    export function init() {

        ReactDOM.render(<Materialize.Button>cache-picker</Materialize.Button>, document.getElementById("main"));
        // ReactDOM.render(<h1>cache-picker</h1>, document.getElementById("main"));

    }

    init();
}
