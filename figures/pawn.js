
class Pawn extends Figure {

    swapped = false;
    doubleMoveTurn = null;

    constructor(x, y, color, autoInsert = true, doubleMoveTurn = null) {
        super(x, y, color, autoInsert);
        
        this.doubleMoveTurn = doubleMoveTurn;
        if (doubleMoveTurn) {
            console.log('double', this);
        }
    }

    isValidMove(newX, newY) {
       
        if (!super.isValidMove(newX, newY)) {
            return false;
        }

        const direction = this.color === Color.WHITE ? 1 : -1;
        
        if (this.y === newY) { // forward move
            console.log('pravo');
            if (this.x === newX + direction) { // forward by one
                console.log('za 1');
                if (!findFigure(newX, newY)) {
                    return true;
                }
            } else if (this.x === newX + 2 * direction && (this.x === 6 || this.x === 1)) { // forward by two
                console.log('za 2');
                if (!findFigure(newX, newY) && !checkFiguresInBetween(this.x, this.y, newX, newY)) {
                    return true;
                }
            }
        } else if (this.x - newX === direction && Math.abs(this.y - newY) === 1) { // diagonal
            const figuteOnNewPosition = findFigure(newX, newY);
            if (figuteOnNewPosition && figuteOnNewPosition.color !== this.color) {
                return true;
            }

            // passant
            const figureLeftOrRight = findFigure(this.x, newY);
            console.log('left or right', figureLeftOrRight);
            if (figureLeftOrRight instanceof Pawn && figureLeftOrRight.doubleMoveTurn === turnCount - 1) {
                return true;
            }
        }

        return false;
    }

    moveTo(newX, newY) {
        if (Math.abs(this.x - newX) === 2) {
            console.log('double move');
            this.doubleMoveTurn = turnCount;
        }

         // passant
        if (Math.abs(this.y - newY) === 1) {
            const figureLeftOrRight = findFigure(this.x, newY);
            if (figureLeftOrRight instanceof Pawn && figureLeftOrRight.doubleMoveTurn === turnCount - 1) {
                removeFigure(this.x, newY);
            }
        }

        super.moveTo(newX, newY);
    }

    canSwap() {
        return (this.color === Color.WHITE && this.x === 0) || (this.color === Color.BLACK && this.x === 7);
    }

    swap() {
        return new Promise(resolve => {
            // upgradePawnDialog.replaceWith(upgradePawnDialog.cloneNode(true));
            upgradePawnDialog.showModal();
            upgradePawnDialog.addEventListener("close", () => {
                if (this.swapped) { // ostaje lisener za zamenjene pijune pa se ignorise njigov callback
                    return;
                }
                this.swapped = true;
                const figureName = upgradePawnDialog.returnValue;
                console.log(figureName);
                removeFigure(this.x, this.y);
                switch (figureName) {
                    case "bishop": new Bishop(this.x, this.y, this.color); break;
                    case "knight": new Knight(this.x, this.y, this.color); break;
                    case "rook": new Rook(this.x, this.y, this.color); break;
                    case "queen": new Queen(this.x, this.y, this.color); break;
                }
                // upgradePawnDialog.removeEventListener('close', abc);
                resolve();
              });
        })
    }

}