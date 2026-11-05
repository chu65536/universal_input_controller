import { Plugin } from "./plugin.js";

export class MousePlugin extends Plugin {
    static INPUT = Object.freeze({
        LEFT_CLICK: Symbol("LEFT_CLICK"),
        MIDDLE_CLICK: Symbol("MIDDLE_CLICK"),
        RIGHT_CLICK: Symbol("RIGHT_CLICK"),
    });

    static #buttonToInput = {
        0: this.INPUT.LEFT_CLICK,
        1: this.INPUT.MIDDLE_CLICK,
        2: this.INPUT.RIGHT_CLICK,
    };

    #boundClick = (event) => this.#onClick(event);
    #boundRelease = (event) => this.#onRelease(event);

    constructor(id) {
        super(id);
    }

    init(target, callback) {
        this.setTarget(target);
        this.setCallback(callback);

        target.addEventListener("mousedown", this.#boundClick);
        target.addEventListener("mouseup", this.#boundRelease);
    }

    #onClick(event) {
        const input = MousePlugin.#buttonToInput[event.button];

        const actionData = {
            inputType: Plugin.actionType.PRESS,
            inputData: input,
        };
        this.callCallback(actionData);
    }

    #onRelease(event) {
        const input = MousePlugin.#buttonToInput[event.button];

        const actionData = {
            inputType: Plugin.actionType.RELEASE,
            inputData: input,
        };
        this.callCallback(actionData);
    }
}
