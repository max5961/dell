class Board {
    constructor() {
        this.board = [
           [0,1,0,1,0,1,1,1,0,0],
           [0,1,0,1,0,0,0,0,0,0],
           [0,1,0,1,0,1,1,1,0,0],
           [0,1,0,1,0,0,0,0,0,0],
           [0,1,0,0,0,1,1,1,0,0],
           [0,0,0,0,0,0,0,0,0,0],
           [0,1,0,0,0,1,1,0,1,1],
           [0,1,0,0,0,0,0,0,0,0],
           [0,1,0,0,0,0,1,0,1,0],
           [0,1,0,0,0,0,1,0,1,0]
        ];
        this.fleet = {
            carriers: [],
            battleships: [],
            submarines: [],
            destroyers: [],
            invalid: [],

            addShip(ship) {
                if (ship.length === 5) {
                    this.carriers.push(ship);
                } else if (ship.length === 4) {
                    this.battleships.push(ship);
                } else if (ship.length === 3) {
                    this.submarines.push(ship);
                } else if (ship.length === 2) {
                    this.destroyers.push(ship);
                } else if (ship.length < 2 || ship.length > 5) {
                    this.invalid.push(ship);
                }
            }
        }

    }

    validateBoard() {
        const invalidSpaces = new Set();
        const takenSpaces = new Set();

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.board[x][y] === 1) {
                    const coord = `${x},${y}`;
                    if (invalidSpaces.has(coord)) return false;
                    if (!takenSpaces.has(coord)) {
                        const ship = this.mapShip(x, y, takenSpaces, invalidSpaces);
                        this.fleet.addShip(ship);
                    }
                }
            }
        }

        return this.fleet.carriers.length === 1 && this.fleet.battleships.length === 2 && this.fleet.submarines.length === 3 && this.fleet.destroyers.length === 4 && this.fleet.invalid.length === 0;
    }

    mapShip(x, y, takenSpaces, invalidSpaces) {
        let vertical;
        if (this.board[x+1]) {
            if (this.board[x+1][y] === this.board[x][y]) {
                vertical = true;
            } 
        } else {
            vertical = false;
        }

        const ship = [];

        let inBounds = true;
        while (inBounds && this.board[x][y] === 1) {
            ship.push([x, y]);
            takenSpaces.add(`${x},${y}`)

            if (vertical) {
                if (!this.board[x+1]) {
                    inBounds = false;
                }
                x++;
            } else {
                if (!this.board[x][y+1]) {
                    inBounds = false;
                }
                y++;
            }
        }
        const coords = this.markInvalid(ship);
        for (const coord of coords) {
            invalidSpaces.add(coord);
        }
        return ship;
    }

    markInvalid(ship) {
        let vertical;
        if (ship[1]) {
            if (ship[0][0] === ship[1][0]) {
                vertical = true;
            }
        } else {
            vertical = false;
        }
        
        const invalid = [];
        for (const [x, y] of ship) {
            if (vertical) {
               invalid.push(`${x},${y+1}`) 
               invalid.push(`${x},${y-1}`) 
            } else {
               invalid.push(`${x+1},${y}`) 
               invalid.push(`${x-1},${y}`) 
            }
        }

        const [fx, fy] = ship[0];
        const [lx, ly] = ship[ship.length - 1];
        for (let i = -1; i <= 1; i++) {
            if (vertical) {
                invalid.push(`${fx+1},${fy+i}`);
                invalid.push(`${lx-1},${ly+i}`);
            } else {
                invalid.push(`${fx+i},${fy+1}`);
                invalid.push(`${lx+i},${ly-1}`);
            }
        }

        return invalid;
    }

    resetBoard() {
        this.fleet.carriers = [];
        this.fleet.battleships = [];
        this.fleet.submarines = [];
        this.fleet.destroyers = [];
        this.fleet.invalid = [];

        this.board[0] = [0,0,0,0,0,0,0,0,0,0];
        for (let i = 1; i < this.board.length; i++) {
            this.board[i] = this.board[0];
        }
    }

    placeShips() {
        const invalidSpaces = new Set();
        const takenSpaces = new Set();
        const stack = [2, 2, 2, 2, 3, 3, 3, 4, 4, 5];
        while (stack.length) {
            const shipLength = stack.pop();

            let path = this.getValidStartingPoint(invalidSpaces, takenSpaces, shipLength);
            while (!path) {
                path = this.getValidStartingPoint(invalidSpaces, takenSpaces, shipLength);
            }

            for (const [x, y] of path) {
                takenSpaces.add(`${x}.${y}`);
                this.board[x][y] = 1;
            }

            const invalid = this.markInvalid(path);
            for (const coord of invalid) {
                invalidSpaces.add(coord);
            }
        }
        
        return this.board;
    }

    getRandomSquare() {
        return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
    }

    getValidStartingPoint(invalidSpaces, takenSpaces, shipLength) {
        const [x, y] = this.getRandomSquare();
        // substract the starting point from the length since this will factored in regardless
        shipLength--;

        if (takenSpaces.has(`${x},${y}`) || invalidSpaces.has(`${x},${y}`)) {
            return false;
        }

        const possibleMoves = [
            [0, shipLength], [0, -shipLength], [shipLength, 0], [-shipLength, 0]
        ]
        
        const path = [];
        for (const [dx, dy] of possibleMoves) {
            const coord = `${x + dx}, ${y + dy}`;
            if (!takenSpaces.has(coord) && !invalidSpaces.has(coord)) {
                if (x + dx < 10 && x + dx >= 0 && y + dy < 10 && y + dy >= 0) {
                    return this.getPath([x, y], [x + dx, y + dy]);
                }
            }
        }
        return false;
    }

    getPath(start, end) {
        const path = [];
        let vertical;
        start[0] === end[0] ? vertical = true : vertical = false;

        let difference = end[0] - start[0] || end[1] - start[1];
        if (difference < 0) {
            difference = Math.abs(difference);
            const startPointer = start;
            start = end;
            end = startPointer;
        }

        for (let i = 0; i <= difference; i++) {
            if (vertical) {
                path.unshift([start[0], end[0] + i]);
            } else {
                path.unshift([start[0] + 1, end[0]]);
            }
        }

        return path;
    }
}

const cpu = new Board();
cpu.resetBoard();
console.log(cpu.placeShips());
