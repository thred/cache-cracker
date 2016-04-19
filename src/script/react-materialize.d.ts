declare namespace __React {

    namespace __Materialize {

        interface AnyProps {
            [key: string]: any
        }

        interface ChildrenProps {
            children?: ReactNode;
        }

        interface NodeProps {
            node?: ReactNode;
        }

        type Styles = 'large' | 'floating' | 'flat';

        interface StyleProps {
            large?: boolean;

            floating?: boolean;

            flat?: boolean;
        }

        type Waves = 'light' | 'red' | 'yellow' | 'orange' | 'purple' | 'green' | 'teal';

        type Sizes = 's' | 'm' | 'l';

        interface SizeProps {
            /**
             * Columns for small size screens
             */
            s?: number;

            /**
             * Columns for middle size screens
             */
            m?: number;

            /**
             * Columns for large size screens
             */
            l?: number;
        }

        type Sides = 'left' | 'right';

        interface SideProps {
            left?: boolean;

            right?: boolean;
        }

        type Placements = Sides | 'right';

        interface PlacementProps extends SideProps {
            center?: boolean;
        }

        type Scales = 'big' | 'small';

        interface ScaleProps {
            big?: boolean;

            small?: boolean;
        }

        type IconSizes = 'tiny' | 'small' | 'medium' | 'large';

        interface IconSizeProps {
            tiny?: boolean,

            small?: boolean,

            medium?: boolean,

            large?: boolean
        }

        interface ClassNameProps {
            className?: string;
        }

        export class Button extends Component<ButtonProps, {}> {
        }

        export interface ButtonProps extends ClassNameProps, ChildrenProps, NodeProps, StyleProps, AnyProps {
            disabled?: boolean;

            /**
             * Enable the floating style
             */
            floating?: boolean;

            /**
             * Fixed action button
             * If enabled, any children button will be rendered as actions, remember to provide an icon.
             * @default vertical
             */
            fab?: "vertical" | "horizontal";

            /**
             * The icon to display, if specified it will create a button with the material icon
             */
            icon?: string;

            large?: boolean;

            modal?: "close" | "confirm";

            /**
             * Tooltip to show when mouse hovered
             */
            tooltip?: string;

            waves?: Waves
        }

        export class Card extends Component<CardProps, {}> {
        }

        export interface CardProps extends Props<Card>, ChildrenProps, AnyProps {
            title?: string;

            textClassName?: string;

            reveal?: JSX.Element;

            header?: JSX.Element;

            actions?: JSX.Element[];
        }

        export class CardTitle extends Component<CardTitleProps, {}> {
        }

        export interface CardTitleProps extends Props<CardTitle>, ChildrenProps, AnyProps {
            // Whether the image serves as activator for the reveal
            reveal?: boolean;

            // the waves effect
            waves?: Waves;

            // The path to the image
            image: string
        }

        export class Col extends Component<ColProps, {}> {
        }

        export interface ColProps extends Props<Col>, ClassNameProps, ChildrenProps, NodeProps, SizeProps, AnyProps {
            /**
             * To offset, simply add s2 to the class where s signifies the screen
             * class-prefix (s = small, m = medium, l = large) and the number after
             * is the number of columns you want to offset by.
             */
            offset?: string;
        }

        export class Dropdown extends Component<DropdownProps, {}> {
        }

        export interface DropdownProps extends Props<Dropdown>, ChildrenProps {
            trigger: ReactNode;

            overorigin?: boolean;
        }

        export class Footer extends Component<FooterProps, {}> {
        }

        export interface FooterProps extends Props<Footer>, ClassNameProps, ChildrenProps, AnyProps {
            copyrights?: string,

            links?: ReactNode;

            moreLinks?: ReactNode;
        }

        export class Icon extends Component<IconProps, {}> {
        }

        export interface IconProps extends ClassNameProps, IconSizeProps, PlacementProps, ChildrenProps {
        }

        export class Input extends Component<InputProps, InputState> {
        }

        export interface InputProps extends Props<InputProps>, ChildrenProps, SizeProps, AnyProps {
            label?: ReactNode;

            /**
             * Input field type, e.g. select, checkbox, radio, text, tel, email
             * @default 'text'
             */
            type?: string;

            defaultValue?: string;

            placeholder?: string;

            id?: string;

            name?: string;

            validate?: boolean;

            browserDefault?: boolean;

            onChange?: ReactEventHandler;
        }

        export interface InputState {
            value: boolean | number | string;
        }

        export class Navbar extends Component<NavbarProps, {}> {
        }

        export interface NavbarProps extends Props<Navbar>, ChildrenProps, ClassNameProps, SideProps, AnyProps {
            brand?: ReactNode;
        }

        export class NavItem extends Component<NavItemProps, {}> {
        }

        export interface NavItemProps extends Props<NavItem>, ChildrenProps, AnyProps {
            href?: string;

            divider?: boolean;
        }

        export class Row extends Component<RowProps, {}> {
        }

        export interface RowProps extends Props<Row>, ClassNameProps, NodeProps, AnyProps {
        }

        export class SideNav extends Component<SideNavProps, {}> {
        }

        export interface SideNavProps extends Props<SideNav>, ChildrenProps, SideProps {
        }

    }
}

declare module "react-materialize" {
    import Materialize = __React.__Materialize;
    export = Materialize;
}
