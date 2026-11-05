import { InputController } from "./input-controller.js";
import { KeyboardPlugin } from "./keyboard-plugin.js";
import { MousePlugin } from "./mouse-plugin.js";

main();

function main() {
    const actions = {
        left: {
            input: [KeyboardPlugin.INPUT.A, KeyboardPlugin.INPUT.ARROW_LEFT],
        },
        right: {
            input: [KeyboardPlugin.INPUT.D, KeyboardPlugin.INPUT.ARROW_RIGHT],
        },
        up: { input: [KeyboardPlugin.INPUT.W, KeyboardPlugin.INPUT.ARROW_UP] },
        down: {
            input: [KeyboardPlugin.INPUT.S, KeyboardPlugin.INPUT.ARROW_DOWN],
        },

        left_click: { input: [MousePlugin.INPUT.LEFT_CLICK] },
        right_click: { input: [MousePlugin.INPUT.RIGHT_CLICK] },
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
        controller.bindActions({
            jump: {
                input: [
                    KeyboardPlugin.INPUT.SPACE,
                    MousePlugin.INPUT.MIDDLE_CLICK,
                ],
            },
        });
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

    const ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        radius: 30,
        color: "red",
        speed: 20,
        jumping: false,
        radiusScaleX: 1,
        radiusScaleY: 1,
    };

    gsap.ticker.add((time, deltaMs) => {
        const dt = deltaMs / 1000;
        let dx = 0;
        if (controller.isActionActive("left")) dx = -ball.speed;
        if (controller.isActionActive("right")) dx = ball.speed;
        if (controller.isActionActive("jump")) jump();
        ball.x += dx * Math.min(1, dt * 12);
        ball.x = gsap.utils.clamp(
            ball.radius,
            canvas.width - ball.radius,
            ball.x,
        );
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.ellipse(
            ball.x,
            ball.y,
            ball.radius * ball.radiusScaleX,
            ball.radius * ball.radiusScaleY,
            0,
            0,
            Math.PI * 2,
        );
        ctx.fillStyle = ball.color;
        ctx.fill();
    }

    function jump() {
        if (ball.jumping) return;
        ball.jumping = true;
        gsap.timeline({ onComplete: () => (ball.jumping = false) })
            .to(ball, {
                y: canvas.height / 2,
                duration: 0.5,
                radiusScaleX: 0.8,
                radiusScaleY: 1.1,
                ease: "power2.out",
            })
            .to(ball, {
                y: canvas.height - 30,
                radiusScaleX: 1,
                radiusScaleY: 1,
                duration: 0.5,
                ease: "power2.in",
            })
            .to(ball, {
                radiusScaleX: 1.25,
                radiusScaleY: 0.75,
                duration: 0.07,
                ease: "power1.out",
            })
            .to(ball, {
                radiusScaleX: 1,
                radiusScaleY: 1,
                duration: 0.15,
                ease: "elastic.out(1, 0.5)",
            });
    }
}
