
class Queen extends Figure {

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }

        // biship or rook moves
        if ((Math.abs(this.x - newX) !== Math.abs(this.y - newY)) && (this.x !== newX && this.y !== newY)) {
            return false;
        }

        if (checkFiguresInBetween(this.x, this.y, newX, newY)) {
            return false;
        }

        return true;
    }

}