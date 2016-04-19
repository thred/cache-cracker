import * as React from "react";
import {Button, Card, CardTitle, Col, Dropdown, Icon, Input, Navbar, NavItem, Row} from "react-materialize";
// import * as JSX from "JSX";

import * as Sheet from "./Sheet";
import * as Model from "./Model";

import * as Command from "./../command/Command";

import {msg} from "./../Msg";
import * as Utils from "./../Utils";

interface Props {
    defaultSheet?: Model.Sheet;
}

interface State {
    sheet?: Model.Sheet;
}

export class Component extends React.Component<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            sheet: props.defaultSheet || {
                name: msg("Sheet.defaultName"),
                lines: []
            }
        };
    }

    onAction(action: Model.Action): void {
        console.log(action);

        if (action.updates) {
            let sheet = this.state.sheet;
            let object: any = Model.findIdentable(sheet, action.$id);

            if (object) {
                for (let key in action.updates) {
                    object[key] = action.updates[key];
                }

                this.setState({ sheet: sheet });
            }
            else {
                console.error("Identable with $id=" + action.$id + " not found in %o", sheet);
            }
        }
    }

    componentDidMount() {
        ($(".dropdown-button") as any).dropdown();
    }

    render() {
        let sheet = this.state.sheet;

        return <div className="container">
            <Row>
                <Col s={12}>
                    <TitleComponent sheet={sheet} onAction={(action) => this.onAction(action) }/>
                </Col>
            </Row>

            {sheet.lines.map((line, index) => this.renderLine(line, index)) }
        </div>;
    }

    renderLine(line: Model.Line, index: number) {
        return <div className="section" key={line.key} >
            <LineComponent line={line} index={index + 1} onAction={(action) => this.onAction(action) } />

            <Row>
                <Button className="red center-align" medium waves="light"><Icon left>add</Icon>Zeile einfügen</Button>

                <Col s={8} style={{ paddingTop: "18px" }}>
                    <div className="divider"/>
                </Col>
            </Row>
        </div>;
    }

}

interface TitleProps {
    sheet: Model.Sheet;

    onAction: (action: Model.Action) => any;
}

class TitleComponent extends React.Component<TitleProps, {}> {

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

    onAction: (action: Model.Action) => any;
}

export class LineComponent extends React.Component<LineComponentProps, {}> {

    render() {
        let line = this.props.line;
        let key = line.key || "#" + this.props.index;
        let comment: JSX.Element = null;

        if (line.comment) {
            comment = <p>{line.comment}</p>
        }

        return <div>
            <LineHeaderComponent index={this.props.index} line={line} onAction={(action) => this.props.onAction(action) }/>
            <Row>
                <Col s={2}><h2>{key}</h2></Col>
                <Col s={10}>
                    {comment}
                    <InstructionComponent instruction={line.instruction} onAction={(action) => this.props.onAction(action) }/>

                    <p>
                        Result of {key}:
                    </p>
                </Col>
            </Row>
        </div>;
    }
}

export class LineHeaderComponent extends React.Component<LineComponentProps, {}> {
    render() {
        let line = this.props.line;
        let key = line.key || "#" + this.props.index;

        return <div>

        </div>;
    }
}

interface InstructionComponentProps {
    instruction: Model.Instruction;

    onAction: (action: Model.Action) => any;
}

export class InstructionComponent extends React.Component<InstructionComponentProps, {}> {

    render() {
        let instruction = this.props.instruction;
        let commandKey = instruction.definitionKey;
        let definition = Command.definition(commandKey);
        let component: JSX.Element;

        if (definition) {
            if (definition.componentFactory) {
                component = definition.componentFactory(instruction, (action) => this.props.onAction(action));
            }
        }

        return <div className="category-line">
            <Button style={{ marginTop: "18px" }} floating medium className="red right" waves="light" icon="edit" />
            <InstructionSelectComponent instruction={instruction} onAction={(action) => this.props.onAction(action) }/>
            <Row>
                <Col s={10}>
                    {component}
                </Col>
            </Row>
        </div>;
    }

}

class InstructionSelectComponent extends React.Component<InstructionComponentProps, {}> {

    onChange(event: React.SyntheticEvent) {
        let action: Model.Action = {
            $id: this.props.instruction.$id,
            updates: {
                definitionKey: (event.target as HTMLInputElement).value
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

        return <Row>
            <Input s={10} type="select" label={msg("Instruction.function") } onChange={(event) => this.onChange(event) }>
                {options}
            </Input>
        </Row>;
    }
}