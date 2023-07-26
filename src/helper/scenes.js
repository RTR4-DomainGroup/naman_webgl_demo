// JavaScript source code

class ScenesStack {

    constructor() {
        this.scenes = [];
    }

    push = function (scene) {
        this.scenes.push(scene);
    };

    pop = function () {
        if (this.isEmpty()) {
            console.error("Scene Stack is Empty");
            this.scenes = null;
        } else {
            return this.scenes.pop();
        }
    };

    isEmpty = function () {
        return (this.scenes.length == 0);
    };
}