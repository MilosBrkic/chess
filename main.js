

let selectedField = null;
let figures = [];
let turn = Color.WHITE;             // player color at turn
let checked = null;                 // player color that is in check
let end = false;
let playerColor = Color.WHITE;      // permament color of the player in online mode
let onlineMode = true;
let connected = false;
let turnCount = 0;

start();

function start() {
    lobbyPanel.hidden = !onlineMode;
    drawBoard();
    initFigures();
    drawFigures();
}


function drawBoard() {

    console.log(board);
    board.innerHTML = '';

    if (playerColor === Color.BLACK) {
        boardWrapper.classList.add('black-perspective');
    } else {
        boardWrapper.classList.remove('black-perspective');
    }

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {

            let field = document.createElement('div');
            field.setAttribute('class', 'field');
            field.setAttribute('row', row);
            field.setAttribute('column', column);
            field.style = (row + column) %2 === 0 ? 'background-color: white' : 'background-color: gray';
            // field.innerHTML = `x = ${row},  y = ${column}`;
            field.onclick = () => clickField(row, column);

            board.appendChild(field);

        }
    }
}

function initFigures() {
    figures = [];

    // black
    new Rook(0, 0, Color.BLACK);
    new Knight(0, 1, Color.BLACK);
    new Bishop(0, 2, Color.BLACK);
    new Queen(0, 3, Color.BLACK);
    new King(0, 4, Color.BLACK);
    new Bishop(0, 5, Color.BLACK);
    new Knight(0, 6, Color.BLACK);
    new Rook(0, 7, Color.BLACK);

    new Pawn(1, 0, Color.BLACK);
    new Pawn(1, 1, Color.BLACK);
    new Pawn(1, 2, Color.BLACK);
    new Pawn(1, 3, Color.BLACK);
    new Pawn(1, 4, Color.BLACK);
    new Pawn(1, 5, Color.BLACK);
    new Pawn(1, 6, Color.BLACK);
    new Pawn(1, 7, Color.BLACK);

    // white
    new Rook(7, 0, Color.WHITE);
    new Knight(7, 1, Color.WHITE);
    new Bishop(7, 2, Color.WHITE);
    new Queen(7, 3, Color.WHITE);
    new King(7, 4, Color.WHITE);
    new Bishop(7, 5, Color.WHITE);
    new Knight(7, 6, Color.WHITE);
    new Rook(7, 7, Color.WHITE);

    new Pawn(6, 0, Color.WHITE);
    new Pawn(6, 1, Color.WHITE);
    new Pawn(6, 2, Color.WHITE);
    new Pawn(6, 3, Color.WHITE);
    new Pawn(6, 4, Color.WHITE);
    new Pawn(6, 5, Color.WHITE);
    new Pawn(6, 6, Color.WHITE);
    new Pawn(6, 7, Color.WHITE);
}

function drawFigures() {

    const fields = document.getElementsByClassName('field');

    // remove figure sprites
    for (fielt of fields) {
        fielt.setAttribute('class', 'field');
    }

    figures.forEach(figure => {

        let field = document.querySelector(` [row="${figure.x}"][column="${figure.y}"]`);

        field.classList.add('figure');
        field.classList.add(figure.getCssClassName());
    })
}

async function clickField(x, y) {
    console.log(x, y);

    if (end) {
        return;
    }

    if (onlineMode && (playerColor !== turn || !connected)) {
        return;
    }
    
    // if field with figure was selected in last click, move figure to new position 
    if (selectedField) {

        const prevX = +selectedField.getAttribute('row');
        const prevY = +selectedField.getAttribute('column');

        const selectedFigure = findFigure(prevX, prevY);

        if (selectedFigure && selectedFigure.color === turn) {
            console.log('figura', selectedFigure);

            if (selectedFigure.isValidMove(x ,y)) {
                console.log('valid move');
                // backup
                let currentState = createBackup(); 

                removeFigure(x, y);
                selectedFigure.moveTo(x, y);

                // check check, revert backup position if true
                if (chechCheck(turn)) {
                    figures = currentState;
                } else {

                    // if pawn can be swapped wait for player to choose figure
                    if (selectedFigure instanceof Pawn && selectedFigure.canSwap()) {
                        await selectedFigure.swap();
                    }
                    
                    endTurn();
                    drawFigures();

                    if (chechCheck(turn)) {
                        checked = turn;
                    } else {
                        checked = null;
                    }

                    if (checkNoValidMoves(turn)) {
                        endGame();
                    }
                    
                }
            }
        }


        selectedField.classList.remove('selected-field');
        selectedField = null;
    } else { // mark figure as selected
        const selectedFigure = findFigure(x, y);
        if (selectedFigure && selectedFigure.color === turn) {
            selectedField = findField(x, y);
            selectedField.classList.add('selected-field');
        }
    }
}

function findField(x, y) {
   return document.querySelector(` [row="${x}"][column="${y}"]`);
}

function findFigure(x, y) {
    return figures.find(f => f.x === x && f.y === y);
}

function removeFigure(x, y) {
    figures = figures.filter(f => f.x !== x || f.y !== y);
}

function endTurn() {
    if (turn === Color.WHITE) {
        turn = Color.BLACK;
    } else {
        turn = Color.WHITE;
    }
    turnIndicator.innerText = turn;
    turnCount++;
    if (onlineMode) {
        submitMove();
    }
}

function createBackup() {
    return figures.slice().map(f => f.clone());
}

function chechCheck(player) {
    const king = figures.find(f => f.color === player && f instanceof King);
    return figures.some(f => {
        let x = f.isValidMove(king.x, king.y);
        if (x) {
            console.log('figura', f, 'moze da pojede kralja');
            console.log(findFigure(2, 5));
        }
        return x;
    });
}

function checkNoValidMoves(player) {
    return !figures.slice().filter(f => f.color === player).some(f => {
        const oldX = f.x;
        const oldY = f.y;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                f = findFigure(oldX, oldY); // zbog kopiranja figura se gube reference, ovako se osigurava da uvek se uvek radi sa trenutnim figurama na tabli
                if (f.isValidMove(x, y)) {

                    const backup = createBackup();
                    removeFigure(x, y);
                    f.moveTo(x, y);

                    if (chechCheck(player)) {
                        figures = backup;
                    } else {
                        console.warn('check prevent', f.constructor.name, oldX, oldY, '>', x, y);
                        figures = backup;                      
                        return true;
                    }
                }
            }
        }
        return false;
    });
}

function endGame() {
    end = true;
    resetButton.hidden = false;
    let endMessage = "Draw";
    if (checked === Color.WHITE) {
        endMessage = 'Black won!';
    } else if (checked === Color.BLACK) {
        endMessage = 'White won!';
    }
    checkmateIndicator.innerText = endMessage;
    setTimeout(() => alert(endMessage), 100);
}

function resetGame() {
    turnCount = 0;
    end = false;
    turn = Color.WHITE;
    resetButton.hidden = true;
    checkmateIndicator.innerText = '';
    turnIndicator.innerText = Color.WHITE;
    initFigures();
    drawFigures();
}

function applyPosition(position) {
    figures = [];
    position.forEach(jsonFigure => {
        switch(jsonFigure.figureName) {
            case 'pawn': new Pawn(jsonFigure.x, jsonFigure.y, jsonFigure.color, true, jsonFigure.doubleMoveTurn); break;
            case 'rook': new Rook(jsonFigure.x, jsonFigure.y, jsonFigure.color, true, jsonFigure.hasMoved); break;
            case 'bishop': new Bishop(jsonFigure.x, jsonFigure.y, jsonFigure.color, true); break;
            case 'knight': new Knight(jsonFigure.x, jsonFigure.y, jsonFigure.color, true); break;
            case 'queen': new Queen(jsonFigure.x, jsonFigure.y, jsonFigure.color, true); break;
            case 'king': new King(jsonFigure.x, jsonFigure.y, jsonFigure.color, true, jsonFigure.hasMoved);
        }
    });

    drawFigures();

    if (chechCheck(turn)) {
        checked = turn;
    } else {
        checked = null;
    }

    if (checkNoValidMoves(turn)) {
        endGame();
    }
}

function togglePlayerColor() {
    if (playerColor === Color.WHITE) {
        playerColor = Color.BLACK;
    } else {
        playerColor = Color.WHITE;
    }
    playerColorButton.innerText = playerColor.toUpperCase();
    drawBoard();
    drawFigures();
}

function openHelpDialog() {
    helpDialog.showModal();
    // alert(`
    // Welcome to chess game!
    // \n
    // This is online chess game which you can play with anyone by connecting to the same "game".
    // Game is created by pressing "Create new game" button which will generatre unique code. Other player needs to enter same code into "Game code" input and press "Join game" button.
    // If everything is successful you can start playing!
    // drugo
    // `);
}

function closeHelpDialog() {
    helpDialog.close();
}