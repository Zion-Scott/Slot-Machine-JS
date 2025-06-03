const prompt = require("prompt-sync")();

//Objects
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};
const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// Step 1: deposit x amount of money
// NOTE: const deposit = () => {} is the same as function deposit() {} | they're both different ways of defining a funtion
    const deposit = () => {
        while(true) {
            const depositAmount = prompt("Enter a deposit amount: ");
            const numberDepositAmount = parseFloat(depositAmount); // parseFloat converts string into a floating point value

            if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
                    console.log("Invalid deposit amount, please try again.");
            } else {
                return numberDepositAmount;
            }
        }
    };
    
// Step 2: determine number of lines to bet on
const getNumberOfLines = () => {
    while(true) {
            const lines = prompt("Enter a number of lines to bet on (1-3): ");
            const numberOfLines = parseFloat(lines); // parseFloat converts string into a floating point value

            if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
                    console.log("Invalid number of lines, please try again.");
            } else {
                return numberOfLines;
            }
        }
};

// Step 3: collect a betting amount
const getBet = (balance, lines) => {
    while(true) {
            const bet = prompt("Enter a bet amount per line: ");
            const betAmount = parseFloat(bet); // parseFloat converts string into a floating point value

            if (isNaN(betAmount) || betAmount <= 0 || betAmount > (balance / lines)) {
                    console.log("Invalid betting amount, please try again.");
            } else {
                return betAmount;
            }
        }
};

// Step 4: spin the slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols]; // ...symbols creates a duplicate array of const symbols for this specific loop to work with
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // get random index from symbols array
            const selectedSymbol = reelSymbols[randomIndex]; //get the random index into the symbol
            reels[i].push(selectedSymbol); // push that random index into the final reel
            reelSymbols.splice(randomIndex, 1); //remove that selected index from the symbol list so it can't pop up twice
        }
    }
    return reels;
};




// Step 5: check if the user won
const transpose = (reels) => { // Transpose: a matrix obtained from a given matrix by interchanging each row and the corresponding column.
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};

// Step 6: give the user their winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let matchingSymbols = true;
    
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                matchingSymbols = false;
                break;
            }
        }
        if (matchingSymbols) {
        winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
};

// Step 7: play again
const game = () => {
    let balance = deposit(); //"let" means the value of the defined variable can be changed retroactively

    while(true) {
        console.log(`You're current balance is $${balance}`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines; //remove the betting amount from the user's balance
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log(`You won $${winnings}`);
        if (balance <= 0) {
            console.log(`You're broke bro, you ran out of money.`)
            break;
        }

        const playAgain = prompt("Do you wanna keep gambling (y/n)?");

        if (playAgain != "y") break; 
    }
}

game();