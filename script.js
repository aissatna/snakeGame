window.onload = function () {
    // global variables
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100; // delay to refresh  canvas
    var snakee;

    // function to initialise canvas
    init();

    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.bottom = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.margin = "auto";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');// drawing code in the canvas
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        refreshCanvas();
    }

    // function to refresh canvas
    function refreshCanvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.advance();
        snakee.draw();
        setTimeout(refreshCanvas, delay);
    }

    // function to draw block
    function drawBlock(ctx, position) {
        var xCoord = position[0] * blockSize;
        var yCoord = position[1] * blockSize;
        ctx.fillRect(xCoord, yCoord, blockSize, blockSize);

    }

    // function to draw snake body
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = '#ff0000';
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function () {
            var nextPosition = this.body[0].slice();//get first block of body
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;//decrease xCoord of the first block
                    break;
                case"right":
                    nextPosition[0] += 1;//increase xCoord of the first block
                    break;
                case "down":
                    nextPosition[1] += 1;//increase yCoord of the first block
                    break;
                case"up":
                    nextPosition[1] -= 1;//decrease yCoord of the first block
                    break;
                default:
                    throw ("Invalid direction");
            }
            this.body.unshift(nextPosition);// add block nextPosition to the body
            this.body.pop()// delete the last element

        };
        this.setDirection = function (newDirection) {
            var allowedDirection;
            switch (this.direction) {
                case "left":
                case"right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case"up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw ("Invalid direction");

            }
            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;

            }

        };
    }

    // when user click on the keyboard
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            //left
            case 37:
                newDirection = "left";
                break;
            //up
            case 38:
                newDirection = "up";
                break;
            //right
            case 39:
                newDirection = "right";
                break;
            //down
            case 40:
                newDirection = "down";
                break;
            default:
                return// continue function
        }
        snakee.setDirection(newDirection);
    }
};
