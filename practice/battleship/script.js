class Fleet {
    constructor() {
        this.carriers = []; // expected 1
        this.battleships = []; // expected 2
        this.submarines = []; // expected 3
        this.destroyers = []; // expected 4
        this.invalid = []; // expected 0
        this.flat = [];
        this.maximumCoords = 30;
    }

    addShip(ship) {
        switch(ship.length) {
            case 5:
                this.carriers.push(ship);
                break;
            case 4:
                this.battleships.push(ship);
                break;
            case 3:
                this.submarines.push(ship);
                break;
            case 2:
                this.destroyers.push(ship);
                break;
            default:
                this.invalid.push(ship);
        }
        ship.forEach(coord => this.flat.push(coord));
    }

    clearFleet() {
        this.carriers = [];
        this.battleships = [];
        this.submarines = [];
        this.destroyers = [];
        this.invalid = [];
        this.flat = [];
    }

    validateFleet() {
        return this.carriers.length === 1 && this.battleships.length === 2 && this.submarines.length === 3 && this.destroyers.length === 4 && this.invalid.length === 0;
    }

    deployFleet(board) {
        [...this.carriers, ...this.battleships, ...this.submarines, ...this.destroyers].forEach(ship => {
            for (const [x, y] of ship) {
                board[x][y] = 1;
            }
        })
    }

    takeShot(y, x) {
        
    }
}

class Board {
    constructor() {
        this.board = [
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,]
        ];

        this.fleet = new Fleet();
    }

    resetBoard() {
        this.fleet.clearFleet();
        this.board = [
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,],
            [0,0,0,0,0,0,0,0,0,0,]
        ];
    }
    
    validateBoard() {
        const invalidSpaces = new Set();
        const takenSpaces = new Set();
        this.fleet.clearFleet();

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.board[x][y] === 1) {
                    if (!takenSpaces.has([x, y].toString())) {
                        if (invalidSpaces.has([x, y].toString())) {
                            return false;
                        } else {
                            this.mapShip(x, y, takenSpaces, invalidSpaces);
                        }
                    }
                }
            }
        }

        return this.fleet.validateFleet();
    }

    mapShip(x, y, takenSpaces, invalidSpaces) {
        const ship = [];
        const horizontal = this.board[x][y] === this.board[x][y+1];
        let inBounds = true;
        while (this.board[x][y] === 1 && inBounds) {
            ship.push([x, y]);
            takenSpaces.add([x, y].toString());
            if (horizontal) {
                this.board[x][y+1] ? y++ : inBounds = false;
            } else {
                this.board[x+1] ? x++ : inBounds = false;
            }
        }
        
        this.fleet.addShip(ship); 
        this.mapInvalidSpaces(ship, invalidSpaces);
    }

    mapInvalidSpaces(ship, invalidSpaces) {
        const horizontal = ship[0][0] === ship[ship.length - 1][0];
        for (const [x, y] of ship) {
           if (horizontal) {
               invalidSpaces.add([x - 1, y].toString());
               invalidSpaces.add([x + 1, y].toString());
           } else {
               invalidSpaces.add([x, y + 1].toString());
               invalidSpaces.add([x, y - 1].toString());
           }
        }

        let [fx, fy] = ship[0];
        let [lx, ly] = ship[ship.length - 1];
        const negative = lx - fx < 0 || ly - fy < 0;
        if (negative) {
            const copyFx = fx;
            const copyFy = fy;
            fx = lx;
            fy = ly;
            lx = copyFx;
            ly = copyFy;
        }
        let i = -1;
        while (i <= 1) {
            if (horizontal) {
                invalidSpaces.add([fx + i, fy - 1].toString());
                invalidSpaces.add([lx + i, ly + 1].toString());
            } else {
                invalidSpaces.add([fx - 1, fy + i].toString());
                invalidSpaces.add([lx + 1, ly + i].toString());
            }
            i++
        }
    }

    mapTakenSpaces(ship, takenSpaces) {
        for (const coord of ship) {
            takenSpaces.add(coord.toString());
        }
    }

    placeShips() {
        this.resetBoard();
        const takenSpaces = new Set();
        const invalidSpaces = new Set();
        const creationStack = [2,2,2,2,3,3,3,4,4,5];
        while (creationStack.length) {
            const shipLength = creationStack.pop();
            const ship = this.getShip(shipLength, invalidSpaces, takenSpaces);
            this.mapInvalidSpaces(ship, invalidSpaces);
            this.mapTakenSpaces(ship, takenSpaces);
            this.fleet.addShip(ship);
        }
        this.fleet.deployFleet(this.board);
    }

    getShip(shipLength, invalidSpaces, takenSpaces) {
        function getRandom() {
            return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        }
        function createShip(x, y, direction, shipLength) {
            const path = [[x, y]];
            const [dx, dy] = direction;
            for (let i = 1; i < shipLength; i++) {
                x += dx;
                y += dy;
                path.push([x, y]);
            }
            return path;
        } 
        
        let [x, y] = getRandom();
        let invalid = true;
        while (invalid) {
            if (!invalidSpaces.has([x, y].toString()) && !takenSpaces.has([x, y].toString())) {
                const ships = [
                    createShip(x, y, [0, -1], shipLength),
                    createShip(x, y, [0, 1], shipLength),
                    createShip(x, y, [-1, 0], shipLength),
                    createShip(x, y, [1, 0], shipLength)
                ];
                const tries = new Set();
                while (tries.size < 4) {
                    const index = Math.floor(Math.random() * 4);
                    const ship = ships[index];
                    let validShip = true;
                    for (const coord of ship) {
                        if (invalidSpaces.has(coord.toString()) || takenSpaces.has(coord.toString())) {
                           validShip = false; 
                        }
                        if (coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9) {
                           validShip = false;
                        } 
                    }
                    if (validShip) {
                        return ship;
                    }
                    tries.add(index);
                }
            }
            [x, y] = getRandom();
        }
    }

    manuallyPlaceShips() {
        let placements = [];
        while (placements.length < this.fleet.maximumCoords) {
            // const [x, y] = getUserInput();
            // placements.push([x, y])
        }

        if (!this.validateBoard()) {
            console.log('invalid ship configuration brah');
            this.manuallyPlace(ships);
        }

        console.log('Congrats you have successfully configured your fleet.  Cograts brah')
    }

    placeCoord(x, y, placements) {
        // 0,0 refers to top left corner of graph instead of the bottom left corner
        // the lines below flip the visual representation to the standard implementation of a 2d graph
        x = Math.abs(x - 10);
        placements.push([y, x])
    }
}

class Game {
    constructor() {
        this.playerBoard = new Board();
        this.cpuBoard = new Board();
        this.pTurn = true;
    }

    newGame() {
        this.playerBoard = new Board();
        this.cpuBoard = new Board();
        this.cpuBoard.placeShips();
        
        let gameOver = false;
        while (!gameOver) {
            if (this.pTurn) {
                this.placeChoice(this.pTurn);
            } else {
                this.placeChoice(this.pTurn);
            }
            this.pTurn = !this.pTurn;
        }
    }
}

const board = new Board();

