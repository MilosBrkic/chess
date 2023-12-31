
class King extends Figure {

    hasMoved = false;

    constructor(x, y, color, autoInsert = true, hasMoved = false) {
        super(x, y, color, autoInsert);
        this.hasMoved = hasMoved;
    }

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }
        
        if (Math.abs(this.x - newX) <= 1 && Math.abs(this.y - newY) <= 1) {
            return true;
        }

        if (this.isCastleValid(newX, newY)) {
            console.log('moguca je');
            return true;
        }

        return false;
    }

    moveTo(newX, newY) {
        if (this.y + 2 === newY) { // small castle
            const rook = findFigure(this.x, 7);
            rook.moveTo(this.x, this.y + 1);
        } else if (this.y - 2 === newY) { // big castle
            const rook = findFigure(this.x, 0);
            rook.moveTo(this.x, this.y - 1);
        }

        super.moveTo(newX, newY);
        this.hasMoved = true;
    }

    isCastleValid(newX, newY) {

        if (this.hasMoved) {
            return false;
        }

        if (checked === this.color) {
            return false;
        }

        if (newX !== this.x) {
            return false;
        }

        // small castle
        if (this.y + 2 === newY) {
            console.log('mala rokada?')
            const rook = findFigure(this.x, 7);
            if (rook instanceof Rook && !rook.hasMoved) {
                return !checkFiguresInBetween(this.x, this.y, this.x, 7);
            }
        } else if (this.y - 2 === newY) { // big castle
            const rook = findFigure(this.x, 0);
            if (rook instanceof Rook && !rook.hasMoved) {
                return !checkFiguresInBetween(this.x, this.y, this.x, 0);
            }
        }

        return false;

    }
}