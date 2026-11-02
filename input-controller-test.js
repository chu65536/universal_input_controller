import { InputController } from "./input-controller.js";

main();

function main() {
    const actions = {
        left: { keys: [37, 65] },
        right: { keys: [39, 68] },
        up: { keys: [38, 87] },
        down: { keys: [40, 83] },
        test: { keys: [13], enabled: false },
    };
    const controller = new InputController(actions, document);

    document.addEventListener(controller.ACTION_ACTIVATED, (event) => {
        let msg = "";
        switch (event.detail.eventType) {
            case "test":
                msg = "enter pressed";
                break;
            case "left":
                msg = "left pressed";
                break;
            case "right":
                msg = "right pressed";
                break;
            case "up":
                msg = "up pressed";
                break;
            case "down":
                msg = "down pressed";
        }

        console.log(msg);
    });

    document.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
        let msg = "";
        switch (event.detail.eventType) {
            case "test":
                msg = "enter released";
                break;
            case "left":
                msg = "left released";
                break;
            case "right":
                msg = "right released";
                break;
            case "up":
                msg = "up released";
                break;
            case "down":
                msg = "down released";
        }

        console.log(msg);
    });
}
