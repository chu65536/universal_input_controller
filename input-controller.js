export class InputController {
    enabled = true;
    focused = true;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #bindedActions = new Map();
    #target;
    #keyToActions = new Map();
    #activeActions = new Set();
    #pressedKeys = new Set();

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
        this.#target = target;
        this.enabled = dontEnable ? false : true;
    }

    detach() {
        this.#target = null;
        this.enabled = false;
    }

    isActionActive(action) {
        return this.#activeActions.has(action);
    }

    isKeyPressed(keyCode) {}

    #onKeyDown(key) {
        this.#pressedKeys.add(key.keyCode);
        const assignedAction = this.#keyToActions.get(key.keyCode);
        if (
            this.#skipEvent(assignedAction) ||
            this.#activeActions.has(assignedAction)
        ) {
            return;
        }

        this.#activeActions.add(assignedAction);
        const eventToDispatch = new CustomEvent(this.ACTION_ACTIVATED, {
            detail: { eventType: assignedAction },
        });
        this.#target.dispatchEvent(eventToDispatch);
    }

    #onKeyUp(key) {
        this.#pressedKeys.delete(key.keyCode);
        const assignedAction = this.#keyToActions.get(key.keyCode);
        if (this.#skipEvent(assignedAction)) return;

        this.#activeActions.delete(assignedAction);
        const eventToDispatch = new CustomEvent(this.ACTION_DEACTIVATED, {
            detail: { eventType: assignedAction },
        });
        this.#target.dispatchEvent(eventToDispatch);
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
        this.#target.addEventListener("keydown", (event) =>
            this.#onKeyDown(event),
        );
        this.#target.addEventListener("keyup", (event) => this.#onKeyUp(event));
    }
}
