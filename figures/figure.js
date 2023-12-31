

class Color {
    static WHITE = 'white';
    static BLACK = 'black';
}

 class Figure {
    
    x;
    y;
    color;
    figureName = this.constructor.name.toLowerCase();

    constructor(x, y, color, autoInsert = true) {
        this.color = color;
        this.x = x;
        this.y = y;
        if (autoInsert) {
            figures.push(this);
        }
    }

    isValidMove(newX, newY) {
        // console.log(`is ${this.constructor.name} move valid?`);

        if (this.x === newX  && this.y === newY) {
            return false;
        }

        if (newX < 0 || newX > 7) {
            return false;
        }

        if (newY < 0 || newY > 7) {
            return false;
        }

        const figuteOnNewPosition = findFigure(newX, newY);

        // you cant eat figure of the same color
        if (figuteOnNewPosition && figuteOnNewPosition.color === this.color) {
            return false;
        }

        return true;
    }

    moveTo(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    getCssClassName() {
        return this.color + '-' + this.constructor.name.toLowerCase();
    }

    clone() {
        return new this.constructor(this.x, this.y, this.color, false);
    }

}

// checks whenever there is figure between two field, excluding two fields
function checkFiguresInBetween(x1, y1, x2, y2) {

    // horizontal
    if (x1 === x2 && Math.abs(y1 - y2) > 1) {
        for (let i = Math.min(y1, y2) + 1; i < Math.max(y1, y2); i++) {
            if (findFigure(x1, i)) {
                return true;
            }
        }
    }

    // vertical
    if (y1 === y2 && Math.abs(x1 - x2) > 1) {
        for (let i = Math.min(x1, x2) + 1; i < Math.max(x1, x2); i++) {
            if (findFigure(i, y1)) {
                return true;
            }
        }
    }

    // diagonal
    if (Math.abs(x1 - x2) === Math.abs(y1 - y2) && Math.abs(x1 - x2) > 1) {

        for (let i = 1; i < Math.abs(x1 - x2); i++ ) {
            
            let xp = 0;
            if (x1 > x2) {
                xp = x1 - i;
            } else {
                xp = x1 + i;
            }
            let yp = 0;
            if (y1 > y2) {
                yp = y1 - i;
            } else {
                yp = y1 + i;
            }
           
            if (findFigure(xp, yp)) {
                return true;
            }
        }
    }

    return false;
}