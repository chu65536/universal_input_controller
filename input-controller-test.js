import { InputController } from "./input-controller.js";

main();

function main() {
    const actions = { test: { keys: [13], enabled: true } };
    const controller = new InputController(actions, document);

    document.addEventListener("test", (event) => {
        console.log("hello world!");
    });
}
