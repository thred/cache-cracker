
declare namespace __React {

    namespace __Materialize {

        type Styles = 'large' | 'floating' | 'flat';

        type Waves = 'light' | 'red' | 'yellow' | 'orange' | 'purple' | 'green' | 'teal';

        type Sizes = 's' | 'm' | 'l';

        type Placements = 'left' | 'center' | 'right';

        type Scales = 'big' | 'small';

        type IconSizes = 'tiny' | 'small' | 'medium' | 'large';

        export interface ButtonProps {
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

            node?: ReactNode;

            /**
             * Tooltip to show when mouse hovered
             */
            tooltip?: string;

            waves?: Waves
        }

        export class Button extends Component<ButtonProps, {}> {

        }
    }
}

declare module "react-materialize" {
    import Materialize = __React.__Materialize;
    export = Materialize;
}
