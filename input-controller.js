export class InputController {
    enabled = true;
    focused = false;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #bindedActions = new Map();
    #target;

    #keyToActions = new Map();

    constructor(actionsToBind = null, target = null) {
        this.#target = target;

        this.bindActions(actionsToBind);
    }

    bindActions(actionsToBind) {
        if (!actionsToBind) return;

        for (const [action, params] of Object.entries(actionsToBind)) {
            this.#bindedActions.set(action, params);

            for (const keyCode of params.keys) {
                this.#keyToActions.set(keyCode, action);
            }
        }

        this.#target.addEventListener("keydown", (event) =>
            this.#onKeyDown(event),
        );
    }

    enbleAction(actionName) {}

    disableAction(actionName) {}

    attach(target, dontEnable = null) {
        this.#target = target;
        if (dontEnable) this.enabled = false;
    }

    detach() {
        this.#target = null;
        this.enabled = false;
    }

    isActionActive(action) {}

    isKeyPressed(keyCode) {}

    #onKeyDown(key) {
        const assignedEvent = this.#keyToActions.get(key.keyCode);

        if (assignedEvent) {
            const eventToDispatch = new CustomEvent(assignedEvent);
            this.#target.dispatchEvent(eventToDispatch);
        }
    }
}
