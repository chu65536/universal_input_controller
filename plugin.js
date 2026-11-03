export class Plugin {
    static actionType = Object.freeze({
        PRESS: "press",
        RELEASE: "release",
    });

    #target;
    #callback;

    constructor(id) {
        this.id = id;
    }

    setTarget(target) {
        this.#target = target;
    }

    setCallback(callback) {
        this.#callback = callback;
    }

    callCallback(params) {
        this.#callback(params);
    }
}
