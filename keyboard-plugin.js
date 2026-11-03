import { Plugin } from "./plugin.js";

export class KeyboardPlugin extends Plugin {
    #boundKeyDown = (event) => this.#onKeyDown(event);
    #boundKeyUp = (event) => this.#onKeyUp(event);

    constructor(id) {
        super(id);
    }

    init(target, callback) {
        this.setTarget(target);
        this.setCallback(callback);

        target.addEventListener("keydown", this.#boundKeyDown);
        target.addEventListener("keyup", this.#boundKeyUp);
    }

    #onKeyDown(event) {
        const actionData = {
            actionType: Plugin.actionType.PRESS,
            actionData: { keyCode: event.keyCode },
        };
        this.callCallback(actionData);
    }

    #onKeyUp(event) {
        const actionData = {
            actionType: Plugin.actionType.RELEASE,
            actionData: { keyCode: event.keyCode },
        };
        this.callCallback(actionData);
    }
}
