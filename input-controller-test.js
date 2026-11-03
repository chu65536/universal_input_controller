import { InputController } from "./input-controller.js";
import { KeyboardPlugin } from "./keyboard-plugin.js";
import { MousePlugin } from "./mouse-plugin.js";

main();

function main() {
    const actions = {
        left: { keys: [37, 65] },
        right: { keys: [39, 68] },
        up: { keys: [38, 87] },
        down: { keys: [40, 83] },

        left_mouse_click: { keys: ["mouse-click0"] },
        middle_mouse_click: { keys: ["mouse-click1"] },
        right_mouse_click: { keys: ["mouse-click2"] },
    };
    const canvas = document.getElementById("graphics");
    const ctx = canvas.getContext("2d");
    const controller = new InputController(actions, document);

    // event listeners to test controller properly dispatches events
    document.addEventListener(controller.ACTION_ACTIVATED, (event) => {
        console.log("pressed: ", event.detail.eventType);
    });

    document.addEventListener(controller.ACTION_DEACTIVATED, (event) => {
        console.log("released: ", event.detail.eventType);
    });

    // buttons
    const attachButton = document.getElementById("attach");
    attachButton.addEventListener("click", (event) => {
        controller.attach(document);
        console.log("controller attached");
    });
    const detachButton = document.getElementById("detach");
    detachButton.addEventListener("click", (event) => {
        controller.detach();
        console.log("controller detached");
    });
    const activateButton = document.getElementById("activate");
    activateButton.addEventListener("click", (event) => {
        controller.enabled = true;
        console.log("controller activated");
    });
    const deactivateButton = document.getElementById("deactivate");
    deactivateButton.addEventListener("click", (event) => {
        controller.enabled = false;
        console.log("controller deactivated");
    });
    const spaceButton = document.getElementById("space");
    spaceButton.addEventListener("click", (event) => {
        controller.bindActions({ jump: { keys: [32], enabled: true } });
        console.log("binded jump action");
    });
    const actionInputField = document.getElementById("action-input");
    const actionActivateButton = document.getElementById("activate-action");
    actionActivateButton.addEventListener("click", (event) => {
        controller.enableAction(actionInputField.value);
        console.log(`activated ${actionInputField.value} action`);
    });
    const actionDeactivateButton = document.getElementById("deactivate-action");
    actionDeactivateButton.addEventListener("click", (event) => {
        controller.disableAction(actionInputField.value);
        console.log(`deactivcated ${actionInputField.value} action`);
    });
    const registerKeyboardPlugin = document.getElementById("keyboard");
    registerKeyboardPlugin.addEventListener("click", (event) => {
        controller.registerPlugins([new KeyboardPlugin("keyboard")]);
        console.log(`registered keyboard plugin`);
    });
    const registerMousePlugin = document.getElementById("mouse");
    registerMousePlugin.addEventListener("click", (event) => {
        controller.registerPlugins([new MousePlugin("mouse")]);
        console.log(`registered mouse plugin`);
    });

    const square = {
        x: canvas.width / 2 - 25,
        y: canvas.height / 2 - 25,
        size: 50,
        speed: 500,
        color: "red",
    };

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = square.color;
        ctx.fillRect(square.x, square.y, square.size, square.size);
    }

    function update(dt) {
        let dx = 0;
        let dy = 0;

        if (controller.isActionActive("left")) dx -= 1;
        if (controller.isActionActive("right")) dx += 1;
        if (controller.isActionActive("up")) dy -= 1;
        if (controller.isActionActive("down")) dy += 1;

        if (controller.isActionActive("jump")) square.color = "blue";
        else square.color = "red";

        if (dx !== 0 && dy !== 0) {
            const inv = 1 / Math.sqrt(2);
            dx *= inv;
            dy *= inv;
        }

        square.x += dx * square.speed * dt;
        square.y += dy * square.speed * dt;

        square.x = Math.max(0, Math.min(canvas.width - square.size, square.x));
        square.y = Math.max(0, Math.min(canvas.height - square.size, square.y));
    }

    let lastTime = performance.now();
    function loop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        update(dt);
        draw();

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}
