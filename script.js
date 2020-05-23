window.onload = function () {
    // ---------global variables-------
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 120; // delay to refresh  canvas
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;

    // -------function to initialise canvas----------
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
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    // --------function to refresh canvas------------
    function refreshCanvas() {
        snakee.advance();
        // Game over
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while (applee.isOnSnake(snakee))

            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            drawScore();
            setTimeout(refreshCanvas, delay);
        }
    }

    // ----------function game over---------
    function gameOver() {
        ctx.save();
        ctx.fillText("Game Over", 5, 15);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", 5, 30);
        ctx.restore();
    }

    // ----------function restart game ---------
    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();

    }

    // ----------function to draw score---------
    function drawScore() {
        ctx.save();
        ctx.fillText(score.toString(), 5, canvasHeight - 5);
        ctx.restore();
    }

    // ----------function to draw block---------
    function drawBlock(ctx, position) {
        var xCoord = position[0] * blockSize;
        var yCoord = position[1] * blockSize;
        ctx.fillRect(xCoord, yCoord, blockSize, blockSize);

    }

    // ----------Snake constructor------------
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
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
            if (!this.ateApple) {
                this.body.pop()// delete the last element
            } else {
                this.ateApple = false;
            }

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
        this.checkCollision = function () {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];// head of the snake
            var rest = this.body.slice(1);// rest of snake body
            var snakeX = head[0];//coordX of the head
            var snakeY = head[1];//coordY of the head
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }
            // snakeCollision
            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;

        };
        this.isEatingApple = function (appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            }else{return false;}



        }
    }

    //------- Apple constructor-----------
    function Apple(position) {
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            // get center of circle
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function () {
            //random position
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function (snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;

                }
            }
            return isOnSnake;
        };

    }

    // -------when user click on the keyboard------------
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

            case 32:
                restart();
                break;
            default:
                return// continue function
        }
        snakee.setDirection(newDirection);
    }
};
