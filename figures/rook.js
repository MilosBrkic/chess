
class Rook extends Figure {

    hasMoved = false;

    constructor(x, y, color, autoInsert = true, hasMoved = false) {
        super(x, y, color, autoInsert);
        this.hasMoved = hasMoved;
    }

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }

        if (this.x !== newX && this.y !== newY) {
            return false;
        }

        if (checkFiguresInBetween(this.x, this.y, newX, newY)) {
            return false;
        }

        return true;
    }

    moveTo(newX, newY) {
        super.moveTo(newX, newY);
        this.hasMoved = true;
    }

}