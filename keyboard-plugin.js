import { Plugin } from "./plugin.js";

export class KeyboardPlugin extends Plugin {
    static INPUT = Object.freeze({
        W: Symbol("W"),
        A: Symbol("A"),
        S: Symbol("S"),
        D: Symbol("D"),

        ARROW_UP: Symbol("ARROW_UP"),
        ARROW_LEFT: Symbol("ARROW_LEFT"),
        ARROW_DOWN: Symbol("ARROW_DOWN"),
        ARROW_RIGHT: Symbol("ARROW_RIGHT"),

        SPACE: Symbol("SPACE"),
    });

    static #keyCodeToInput = {
        37: this.INPUT.ARROW_LEFT,
        38: this.INPUT.ARROW_UP,
        39: this.INPUT.ARROW_RIGHT,
        40: this.INPUT.ARROW_DOWN,

        65: this.INPUT.A,
        68: this.INPUT.D,
        83: this.INPUT.S,
        87: this.INPUT.W,

        32: this.INPUT.SPACE,
    };

    #boundKeyDown = this.#onKeyDown.bind(this);
    #boundKeyUp = this.#onKeyUp.bind(this);

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
        const input = KeyboardPlugin.#keyCodeToInput[event.keyCode];

        const params = {
            inputType: Plugin.actionType.PRESS,
            inputData: input,
        };
        this.callCallback(params);
    }

    #onKeyUp(event) {
        const input = KeyboardPlugin.#keyCodeToInput[event.keyCode];

        const params = {
            inputType: Plugin.actionType.RELEASE,
            inputData: input,
        };
        this.callCallback(params);
    }
}
