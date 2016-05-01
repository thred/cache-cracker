import {Definition} from "./Definition";
import {Scope} from "./Scope";

import * as Conversions from "./Conversions";
import * as Math from "./Math";
import * as Strings from "./Strings";

export let global: Scope = new Scope(null);

global.set("language", "en-US");

Conversions.populate(global);
Math.populate(global);
Strings.populate(global);


