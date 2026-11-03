export class InputController {
    enabled = true;
    focused = true;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #bindedActions = new Map();
    #target;
    #keyToActions = new Map();
    #activeActions = new Map();
    #pressedKeys = new Set();

    #boundKeyDown = (event) => this.#onKeyDown(event);
    #boundKeyUp = (event) => this.#onKeyUp(event);

    constructor(actionsToBind = null, target = null) {
        this.#target = target;

        this.bindActions(actionsToBind);
        this.#addEventListeners();
    }

    bindActions(actionsToBind) {
        if (!actionsToBind) return;

        for (const [action, params] of Object.entries(actionsToBind)) {
            for (const keyCode of params.keys) {
                this.#keyToActions.delete(keyCode);
            }
            this.#bindedActions.set(action, params);
            for (const keyCode of params.keys) {
                this.#keyToActions.set(keyCode, action);
            }
        }
    }

    enableAction(actionName) {
        const bindedAction = this.#bindedActions.get(actionName);
        if (!bindedAction) return;

        bindedAction.enabled = true;
    }

    disableAction(actionName) {
        const bindedAction = this.#bindedActions.get(actionName);
        if (!bindedAction) return;

        bindedAction.enabled = false;
    }

    attach(target, dontEnable = null) {
        this.#removeEventListeners();
        this.#target = target;
        this.enabled = dontEnable ? false : true;
        this.#addEventListeners();
    }

    detach() {
        this.#removeEventListeners();
        this.#target = null;
        this.enabled = false;
    }

    isActionActive(action) {
        return this.#activeActions.has(action);
    }

    isKeyPressed(keyCode) {
        return this.#pressedKeys.has(keyCode);
    }

    #onKeyDown(key) {
        this.#pressedKeys.add(key.keyCode);
        const assignedAction = this.#keyToActions.get(key.keyCode);
        if (this.#skipEvent(assignedAction)) return;

        if (this.#activeActions.has(assignedAction)) {
            this.#activeActions.get(assignedAction).add(key.keyCode);
        } else {
            this.#activeActions.set(assignedAction, new Set([key.keyCode]));
            const eventToDispatch = new CustomEvent(this.ACTION_ACTIVATED, {
                detail: { eventType: assignedAction },
            });
            this.#target.dispatchEvent(eventToDispatch);
        }
    }

    #onKeyUp(key) {
        this.#pressedKeys.delete(key.keyCode);
        const assignedAction = this.#keyToActions.get(key.keyCode);
        if (this.#skipEvent(assignedAction)) return;

        this.#activeActions.get(assignedAction).delete(key.keyCode);
        if (this.#activeActions.get(assignedAction).size === 0) {
            this.#activeActions.delete(assignedAction);
            const eventToDispatch = new CustomEvent(this.ACTION_DEACTIVATED, {
                detail: { eventType: assignedAction },
            });
            this.#target.dispatchEvent(eventToDispatch);
        }
    }

    #focusOut(event) {
        this.focused = false;
        console.log("lost focus");
    }

    #focusIn(event) {
        this.focused = true;
        console.log("got focus");
    }

    #isActionActivated(action) {
        const actionParams = this.#bindedActions.get(action);
        return actionParams.enabled == undefined || actionParams.enabled;
    }

    #skipEvent(action) {
        return (
            !this.enabled ||
            !this.focused ||
            !action ||
            !this.#isActionActivated(action)
        );
    }

    #addEventListeners() {
        if (!this.#target) return;

        this.#target.addEventListener("keydown", this.#boundKeyDown);
        this.#target.addEventListener("keyup", this.#boundKeyUp);
    }

    #removeEventListeners() {
        if (!this.#target) return;

        this.#target.removeEventListener("keydown", this.#boundKeyDown);
        this.#target.removeEventListener("keyup", this.#boundKeyUp);
    }
}
