import { Plugin } from "./plugin.js";

export class MousePlugin extends Plugin {
    static KeyCodes = Object.freeze({
        CLICK: "mouse-click",
    });

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
        const actionData = {
            actionType: Plugin.actionType.PRESS,
            actionData: { keyCode: this.#makeKeyCode(event) },
        };
        this.callCallback(actionData);
    }

    #onRelease(event) {
        const actionData = {
            actionType: Plugin.actionType.RELEASE,
            actionData: { keyCode: this.#makeKeyCode(event) },
        };
        this.callCallback(actionData);
    }

    #makeKeyCode(event) {
        return MousePlugin.KeyCodes.CLICK + event.button;
    }
}
