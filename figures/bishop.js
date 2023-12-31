
class Bishop extends Figure {

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }
        
        if (Math.abs(this.x - newX) !== Math.abs(this.y - newY)) {
            return false;
        }

        if (checkFiguresInBetween(this.x, this.y, newX, newY)) {
            return false;
        }

        return true;
    }
}