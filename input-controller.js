export class InputController {
    enabled = false;
    focused = false;

    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind, target) {}

    bindActions(actionsToBind) {}
    enbleAction(actionName) {}
    disableAction(actionName) {}
    attach(target, dontEnable) {}
    detach() {}
    isActionActive(action) {}
    isKeyPressed(keyCode) {}
    
}
