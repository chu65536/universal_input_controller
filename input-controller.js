import { Plugin } from "./plugin.js";

export class InputController {
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #target;
    #bindedActions = new Map();
    #keyToActions = new Map();
    #activeActions = new Map();
    #pressedKeys = new Set();
    #plugins = new Map();

    #boundPluginCallback = (params) => this.#pluginCallback(params);

    constructor(actionsToBind = null, target = null) {
        this.enabled = target ? true : false;
        this.focused = true;

        this.#target = target;

        this.bindActions(actionsToBind);
    }

    bindActions(actionsToBind) {
        if (!actionsToBind) return;

        for (const [action, params] of Object.entries(actionsToBind)) {
            if (this.#bindedActions.has(action)) {
                for (const key in this.#bindedActions.get(action).keys) {
                    this.#keyToActions.delete(key);
                }
            }

            this.#bindedActions.set(action, params);
            for (const key of params.keys) {
                this.#keyToActions.set(key, action);
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

    isKeyPressed(keyCode) {
        return this.#pressedKeys.has(keyCode);
    }

    registerPlugins(plugins) {
        for (const plugin of plugins) {
            if (this.#plugins.has(plugin.id)) continue;
            this.#plugins.set(plugin.id, plugin);
            plugin.init(this.#target, this.#boundPluginCallback);
        }
    }

    #pluginCallback(params) {
        switch (params.actionType) {
            case Plugin.actionType.PRESS:
                this.#pluginPressAction(params.actionData);
                break;
            case Plugin.actionType.RELEASE:
                this.#pluginReleaseAction(params.actionData);
                break;
            default:
                throw new Error(
                    `unsupported plugin action type: ${params.actionType}`,
                );
                break;
        }
    }

    #pluginPressAction(pressActionData) {
        this.#pressedKeys.add(pressActionData.keyCode);
        const assignedAction = this.#keyToActions.get(pressActionData.keyCode);
        if (this.#skipEvent(assignedAction)) return;

        if (this.#activeActions.has(assignedAction)) {
            this.#activeActions
                .get(assignedAction)
                .add(pressActionData.keyCode);
        } else {
            this.#activeActions.set(
                assignedAction,
                new Set([pressActionData.keyCode]),
            );
            const eventToDispatch = new CustomEvent(this.ACTION_ACTIVATED, {
                detail: { eventType: assignedAction },
            });
            this.#target.dispatchEvent(eventToDispatch);
        }
    }

    #pluginReleaseAction(releaseActionData) {
        this.#pressedKeys.delete(releaseActionData.keyCode);
        const assignedAction = this.#keyToActions.get(
            releaseActionData.keyCode,
        );
        if (this.#skipEvent(assignedAction)) return;

        this.#activeActions
            .get(assignedAction)
            .delete(releaseActionData.keyCode);
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
    }

    #focusIn(event) {
        this.focused = true;
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
}
