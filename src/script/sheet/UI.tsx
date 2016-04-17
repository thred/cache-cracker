import * as React from "react";
import {Button, Card, CardTitle, Col, Input, Row} from "react-materialize";
// import * as JSX from "JSX";

import * as Controller from "./Controller";
import * as Model from "./Model";

import * as Command from "./../command/Command";

import {msg} from "./../Msg";
import * as Utils from "./../Utils";


export interface SheetProps {
    sheet: Model.Sheet

    onAction: (action: Controller.Action) => any;
}

export class SheetComponent extends React.Component<SheetProps, {}> {

    render() {
        let sheet = this.props.sheet;

        return <div className="container">
            <Row>
                <Col s={12}>
                    <SheetTitleComponent sheet={sheet} onAction={(action) => this.props.onAction(action) }/>
                </Col>
            </Row>

            {sheet.lines.map((line, index) => this.renderLine(line, index)) }
        </div>;
    }

    renderLine(line: Model.Line, index: number) {
        return <div className="section" key={line.key} >
            <LineComponent line={line} index={index + 1} onAction={(action) => this.props.onAction(action) } />
            <div className="divider" />
        </div>;
    }

}

class SheetTitleComponent extends React.Component<SheetProps, {}> {

    render() {
        let sheet = this.props.sheet;
        let image = sheet.image || "media/sheet-title-schober.jpg";
        let comment = sheet.comment || msg("Sheet.defaultComment");

        return <Card header={
            <CardTitle image={image}>{sheet.name}</CardTitle>
        }>
            {comment}
        </Card>;
    }

}

interface LineComponentProps {
    index: number;

    line: Model.Line;

    onAction: (action: Controller.Action) => any;
}

export class LineComponent extends React.Component<LineComponentProps, {}> {

    render() {
        let line = this.props.line;
        let key = line.key || "#" + this.props.index;
        let comment: JSX.Element = null;

        if (line.comment) {
            comment = <p>{line.comment}</p>
        }

        return <Row>
            <Col s={2}><h2>{key}</h2></Col>
            <Col s={10}>
                {comment}
                <InstructionComponent instruction={line.instruction} onAction={(action) => this.props.onAction(action) }/>
            </Col>
        </Row>;
    }

}

interface InstructionComponentProps {
    instruction: Model.Instruction;

    onAction: (action: Controller.Action) => any;
}

export class InstructionComponent extends React.Component<InstructionComponentProps, {}> {

    render() {
        let instruction = this.props.instruction;
        let commandKey = instruction.definitionKey;
        let definition = Command.definition(commandKey);
        let component: JSX.Element;

        if (definition) {
            if (definition.componentFactory) {
                component = definition.componentFactory(instruction);
            }
        }

        return <div>
            <Row>
                <Col s={12}>
                    <InstructionSelectComponent instruction={instruction} onAction={(action) => this.props.onAction(action) }/>
                </Col>
            </Row>
            <Row>
                <Col s={12}>
                    {component}
                </Col>
            </Row>
        </div>;
    }

}

class InstructionSelectComponent extends React.Component<InstructionComponentProps, {}> {

    changed(event: React.SyntheticEvent) {
        let action: Controller.UpdateAction = {
            id: this.props.instruction.id,
            updates: {
                definitionkey: (event.target as HTMLInputElement).value
            }
        }
        
        this.props.onAction(action);
    }

    render() {
        let categories = Command.categories();
        let options: JSX.Element[] = [];

        for (let categoryKey in categories) {
            options.push(
                <optgroup key={`category-${categoryKey}`}
                    label={msg(`Command.category.${categoryKey}.title`) }>
                    {categories[categoryKey].map((definition) => {
                        return <option key={`definition-${definition.key}`} value={definition.key}>
                            {msg(`Command.${definition.key}.title`) }
                        </option>;
                    }) }
                </optgroup>);
        }

        return <Input s={12} type="select" label={msg("Instruction.function") } onChange={(event) => this.changed(event) }>
            {options}
        </Input>;
    }
}