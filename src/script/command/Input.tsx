import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Col, Input, Row} from "react-materialize";

import * as Command from "./Command";

import * as SheetModel from "./../sheet/Model";

import {msg} from "./../Msg";

export function initialize() {
    Command.register({
        key: "String",
        category: "Input",
        resultType: Command.Type.String,
        componentFactory: (instruction, onAction) => <StringComponent instruction={instruction} onAction={(action) => onAction(action) } />
    });

    Command.register({
        key: "Number",
        category: "Input",
        resultType: Command.Type.Number,
        componentFactory: (instruction, onAction) => <NumberComponent instruction={instruction} onAction={(action) => onAction(action) } />
    });

    Command.register({
        key: "Boolean",
        category: "Input",
        resultType: Command.Type.Boolean,
        componentFactory: (instruction, onAction) => <BooleanComponent instruction={instruction} onAction={(action) => onAction(action) } />
    });
}

interface StringProps extends Command.Props {
}

export class StringComponent extends React.Component<StringProps, {}> {
    onChange(event: React.SyntheticEvent) {
        let action: SheetModel.Action = {
            $id: this.props.instruction.$id,
            updates: {
                stringValue: (event.target as HTMLInputElement).value
            }
        }

        this.props.onAction(action);
    }

    render() {
        return <div className="command">
            <Row>
                <Input s={12} type="text" label={msg("Command.String.label") } defaultValue={this.props.instruction["stringValue"]} onChange={(event) => this.onChange(event) }/>
            </Row>
        </div>;
    }
}

interface NumberProps extends Command.Props {
}

export class NumberComponent extends React.Component<NumberProps, {}> {
    onChange(event: React.SyntheticEvent) {
        let action: SheetModel.Action = {
            $id: this.props.instruction.$id,
            updates: {
                numberValue: (event.target as HTMLInputElement).value
            }
        }

        this.props.onAction(action);
    }

    render() {
        return <div className="command">
            <Row>
                <Input s={12} type="number" label={msg("Command.Number.label") } defaultValue={this.props.instruction["numberValue"]} onChange={(event) => this.onChange(event) }/>
            </Row>
        </div>;
    }
}

interface BooleanProps extends Command.Props {
}

export class BooleanComponent extends React.Component<BooleanProps, {}> {
    onChange(event: React.SyntheticEvent) {
        let action: SheetModel.Action = {
            $id: this.props.instruction.$id,
            updates: {
                booleanValue: (event.target as HTMLInputElement).checked
            }
        }

        this.props.onAction(action);
    }

    render() {
        return <div className="command">
            <Row>
                <Input s={12} type="checkbox" label={msg("Command.Boolean.label") } checked={this.props.instruction["booleanValue"]} onChange={(event) => this.onChange(event) }/>
            </Row>
        </div>;
    }
}
