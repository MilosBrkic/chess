
class Knight extends Figure {
    uuid = Math.random();

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }
        
        const xDif = Math.abs(this.x - newX);
        const yDif = Math.abs(this.y - newY);

        if (!((xDif === 1 && yDif === 2) || (xDif === 2 && yDif === 1))) {
            return false;
        }

        return true;
    }

}