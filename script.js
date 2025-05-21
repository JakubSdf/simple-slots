let money = 100;
let bet = 2;
let isAutospinActive = false;
let autospinIntervalId = null;
let autospinCountTarget = 10;
let autospinCountRemaining = 0;

const AUTOSPIN_OPTIONS = Object.freeze([5, 10, 20, 50, 100, "ALL"]);

const SLOT_IMAGES = Object.freeze(["cherry.png", "bell.png", "7.png", "plum.png", "grape.png", "watermelon.png", "lemon.png"]);
const SYMBOL_MULTIPLIERS = Object.freeze({
    "cherry.png": 2,
    "lemon.png": 2,
    "plum.png": 3,
    "grape.png": 5,
    "watermelon.png": 5,
    "bell.png": 8,
    "7.png": 40
});

const SYMBOL_MULTIPLIERS_4X = Object.freeze({
    "cherry.png": 4,
    "lemon.png": 4,
    "plum.png": 9,
    "grape.png": 25,
    "watermelon.png": 25,
    "bell.png": 16,
    "7.png": 160
});

const BET_OPTIONS = Object.freeze([1, 2, 5, 10, 20, 50, 100, 200, 500]);

const REEL_SPIN_INTERVAL = 50;
const MIN_SPIN_CYCLES_PER_REEL = 10;
const EXTRA_SPIN_CYCLES_PER_REEL = 5;
const DELAY_BETWEEN_REELS = 250;
const SYMBOL_HEIGHT = 130;

const BASE_REEL_STRIP = [0, 1, 2, 3, 4, 5, 6, 0, 2, 4, 6, 1, 3, 5, 0, 2, 1, 3, 5, 4, 6];

const REEL_STRIPS = [
    [...BASE_REEL_STRIP],
    [...BASE_REEL_STRIP].reverse(),
    [...BASE_REEL_STRIP],
    [...BASE_REEL_STRIP].reverse()
];

let reelAnimationControllers = [];

const PAYLINES = [
    [ {c:0, r:0}, {c:1, r:0}, {c:2, r:0}, {c:3, r:0} ],
    [ {c:0, r:1}, {c:1, r:1}, {c:2, r:1}, {c:3, r:1} ],
    [ {c:0, r:2}, {c:1, r:2}, {c:2, r:2}, {c:3, r:2} ],
    [ {c:0, r:0}, {c:1, r:1}, {c:2, r:2}, {c:3, r:2} ],
    [ {c:0, r:2}, {c:1, r:1}, {c:2, r:0}, {c:3, r:0} ],
    [ {c:0, r:0}, {c:1, r:1}, {c:2, r:0}, {c:3, r:0} ],
    [ {c:0, r:2}, {c:1, r:1}, {c:2, r:2}, {c:3, r:2} ],
    [ {c:0, r:0}, {c:1, r:1}, {c:2, r:1}, {c:3, r:0} ],
    [ {c:0, r:2}, {c:1, r:1}, {c:2, r:1}, {c:3, r:2} ],
    [ {c:0, r:0}, {c:1, r:1}, {c:2, r:2}, {c:3, r:1} ],
    [ {c:0, r:2}, {c:1, r:1}, {c:2, r:0}, {c:3, r:1} ],
    [ {c:0, r:1}, {c:1, r:0}, {c:2, r:1}, {c:3, r:0} ],
    [ {c:0, r:1}, {c:1, r:2}, {c:2, r:1}, {c:3, r:2} ],
    [ {c:0, r:0}, {c:1, r:2}, {c:2, r:1}, {c:3, r:0} ],
    [ {c:0, r:2}, {c:1, r:0}, {c:2, r:1}, {c:3, r:2} ],
    [ {c:0, r:0}, {c:1, r:0}, {c:2, r:1} ],
    [ {c:0, r:1}, {c:1, r:1}, {c:2, r:2} ],
    [ {c:0, r:1}, {c:1, r:1}, {c:2, r:0} ],
    [ {c:0, r:2}, {c:1, r:2}, {c:2, r:1} ],
    [ {c:0, r:1}, {c:1, r:2}, {c:2, r:2} ],
    [{c:1, r:0}, {c:2, r:0}, {c:3, r:1}],
    [{c:1, r:1}, {c:2, r:1}, {c:3, r:2}],
    [{c:1, r:1}, {c:2, r:1}, {c:3, r:0}],
    [{c:1, r:2}, {c:2, r:2}, {c:3, r:1}],
    [{c:0, r:0}, {c:1, r:1}, {c:2, r:1}, {c:3, r:1}],
    [{c:0, r:2}, {c:1, r:1}, {c:2, r:1}, {c:3, r:1}],
    [{c:0, r:0}, {c:1, r:1}, {c:2, r:0}, {c:3, r:2}],
    [{c:0, r:2}, {c:1, r:1}, {c:2, r:2}, {c:3, r:0}],
    [{c:0, r:0}, {c:1, r:1}, {c:2, r:2}, {c:3, r:0}],
    [{c:0, r:2}, {c:1, r:1}, {c:2, r:0}, {c:3, r:2}],
    [{c:0, r:1}, {c:1, r:0}, {c:2, r:1}, {c:3, r:2}],
    [{c:0, r:1}, {c:1, r:2}, {c:2, r:1}, {c:3, r:0}],
    [{c:0, r:1}, {c:1, r:0}, {c:2, r:0}]
];

function DoSpin() {
    const rows = 3;
    const cols = 4;
    const spinButton = document.getElementById("spinButton");
    const maxBetButton = document.getElementById("maxBetButton");
    const decreaseAutospinBtn = document.getElementById("decreaseAutospin");
    const increaseAutospinBtn = document.getElementById("increaseAutospin");

    hideMessages();
    document.getElementById("winValue").textContent = "0";

    if (isAutospinActive) {
        spinButton.disabled = true;
        maxBetButton.disabled = true;
    }

    if (money >= bet) {
        money -= bet;
        updateMoney(money);
        spinButton.disabled = true; 
        maxBetButton.disabled = true; 
        if (decreaseAutospinBtn) decreaseAutospinBtn.disabled = true;
        if (increaseAutospinBtn) increaseAutospinBtn.disabled = true;

        const finalSlotsGrid = [];
        const finalStopIndicesOnStrip = [];

        for (let r = 0; r < rows; r++) {
            finalSlotsGrid[r] = [];
        }

        for (let c = 0; c < cols; c++) {
            const stripDef = REEL_STRIPS[c % REEL_STRIPS.length];
            if (stripDef.length < rows) {
                for (let r = 0; r < rows; r++) finalSlotsGrid[r][c] = 0;
                finalStopIndicesOnStrip[c] = 0;
                continue;
            }

            const maxStopIndex = stripDef.length - rows;
            const stopIndexOnStrip = Math.floor(Math.random() * (maxStopIndex + 1));
            finalStopIndicesOnStrip[c] = stopIndexOnStrip;

            for (let r = 0; r < rows; r++) {
                finalSlotsGrid[r][c] = stripDef[stopIndexOnStrip + r];
            }
        }
        const finalSlotsGridSymbolNames = finalSlotsGrid.map(row => row.map(symbolIndex => SLOT_IMAGES[symbolIndex]));

        resetGlow(rows, cols);

        for (let c = 0; c < cols; c++) {
            if (reelAnimationControllers[c]) {
                reelAnimationControllers[c].startSpin();
            }
        }

        orchestrateSequentialStop(finalSlotsGrid, finalStopIndicesOnStrip, rows, cols);

    } else {
        displayMessage("You don't have enough money to spin.");
        if (isAutospinActive) {
            toggleAutospin();
        } else {
        }
    }
}

function startSpinAnimation(finalGrid, rows, cols) {
    let currentReel = 0;

    function processNextReel() {
        if (currentReel < cols) {
            const finalSymbolsForReel = [];
            for (let r = 0; r < rows; r++) {
                finalSymbolsForReel.push(finalGrid[r][currentReel]);
            }
            animateReel(currentReel, finalSymbolsForReel, rows, cols, () => {
                currentReel++;
                setTimeout(processNextReel, DELAY_BETWEEN_REELS);
            });
        } else {
            // All reels have stopped
            CheckWinner(finalGrid);
        }
    }
    processNextReel(); // Start with the first reel
}

// Placeholder for animateReel - will be fleshed out next
function animateReel(reelIndex, finalSymbolIndices, rows, cols, callback) {
    let spinCycles = MIN_SPIN_CYCLES_PER_REEL + (reelIndex * EXTRA_SPIN_CYCLES_PER_REEL);
    let currentCycle = 0;

    const reelIntervalId = setInterval(() => {
        for (let r = 0; r < rows; r++) {
            const randomSymbolIndex = Math.floor(Math.random() * SLOT_IMAGES.length);
            document.getElementById(`SlotImage_r${r+1}_c${reelIndex+1}`).src = SLOT_IMAGES[randomSymbolIndex];
        }

        currentCycle++;
        if (currentCycle >= spinCycles) {
            clearInterval(reelIntervalId);
            // Set final symbols for this reel
            for (let r = 0; r < rows; r++) {
                document.getElementById(`SlotImage_r${r+1}_c${reelIndex+1}`).src = SLOT_IMAGES[finalSymbolIndices[r]];
            }
            if (callback) callback();
        }
    }, REEL_SPIN_INTERVAL);
}

function CheckWinner(grid) { 
    const winMessage = document.getElementById("winMessage");
    const winAmountDisplay = document.getElementById("winAmount");
    const spinButton = document.getElementById("spinButton");
    let currentMoney = money;
    let winningLineFound = false;
    let totalAmountWon = 0;
    const rows = 3;
    const cols = 4;
    let glowingViewports = new Set();

    // --- Check all paylines for 4-symbol and 3-symbol wins ---
    for (let i = 0; i < PAYLINES.length; i++) {
        const payline = PAYLINES[i];
        if (payline.length === 4) {
            // 4-symbol win
            const s0 = grid[payline[0].r][payline[0].c];
            const s1 = grid[payline[1].r][payline[1].c];
            const s2 = grid[payline[2].r][payline[2].c];
            const s3 = grid[payline[3].r][payline[3].c];
            if (s0 === s1 && s0 === s2 && s0 === s3) {
                winningLineFound = true;
                const winningSymbolName = SLOT_IMAGES[s0];
                let multiplier4x = SYMBOL_MULTIPLIERS_4X[winningSymbolName] || 1;
                totalAmountWon += multiplier4x * bet;
                for (const pos of payline) {
                    const viewport = document.querySelector(`td[data-row="${pos.r}"][data-col="${pos.c}"] .reel-viewport`);
                    if (viewport) {
                        viewport.classList.add("glow");
                        glowingViewports.add(`${pos.r}-${pos.c}`);
                    }
                }
                continue;
            }
            // 3-symbol win (first 3 positions)
            if (s0 === s1 && s0 === s2) {
                // Only count if not part of a 4-symbol win (already handled above)
                let isSubLineOf4Win = true;
                for (const pos of payline.slice(0,3)) {
                    if (!glowingViewports.has(`${pos.r}-${pos.c}`)) {
                        isSubLineOf4Win = false;
                        break;
                    }
                }
                if (!isSubLineOf4Win) {
                    winningLineFound = true;
                    const winningSymbolName = SLOT_IMAGES[s0];
                    let multiplier3x = SYMBOL_MULTIPLIERS[winningSymbolName] || 1;
                    totalAmountWon += multiplier3x * bet;
                    for (const pos of payline.slice(0,3)) {
                        if (!glowingViewports.has(`${pos.r}-${pos.c}`)) {
                            const viewport = document.querySelector(`td[data-row="${pos.r}"][data-col="${pos.c}"] .reel-viewport`);
                            if (viewport) viewport.classList.add("glow");
                        }
                    }
                }
            }
        } else if (payline.length === 3) {
            // Only check for 3-symbol win
            const s0 = grid[payline[0].r][payline[0].c];
            const s1 = grid[payline[1].r][payline[1].c];
            const s2 = grid[payline[2].r][payline[2].c];
            if (s0 === s1 && s0 === s2) {
                winningLineFound = true;
                const winningSymbolName = SLOT_IMAGES[s0];
                let multiplier3x = SYMBOL_MULTIPLIERS[winningSymbolName] || 1;
                totalAmountWon += multiplier3x * bet;
                for (const pos of payline) {
                    if (!glowingViewports.has(`${pos.r}-${pos.c}`)) {
                        const viewport = document.querySelector(`td[data-row="${pos.r}"][data-col="${pos.c}"] .reel-viewport`);
                        if (viewport) viewport.classList.add("glow");
                    }
                }
            }
        }
    }

    // --- Animate win and update money as before ---
    if (winningLineFound) {
        winMessage.style.display = "block";
        spinButton.disabled = true;
        let count = 0;
        let interval = setInterval(function () {
            if (count < totalAmountWon) {
                count += Math.ceil(totalAmountWon / 100) || 1; 
                winAmountDisplay.textContent = count > totalAmountWon ? totalAmountWon : count;
            } else {
                winAmountDisplay.textContent = totalAmountWon;
                clearInterval(interval);
            }
        }, 20);
        setTimeout(function () {
            let userBalance = currentMoney;
            const finalBalance = currentMoney + totalAmountWon;
            let balanceInterval = setInterval(function () {
                if (userBalance < finalBalance) {
                    userBalance += Math.ceil(totalAmountWon / 100) || 1;
                    updateMoney(userBalance > finalBalance ? finalBalance : userBalance);
                } else {
                    updateMoney(finalBalance);
                    document.getElementById("winValue").textContent = totalAmountWon;
                    clearInterval(balanceInterval);
                    setTimeout(() => {
                        winMessage.style.opacity = "0";
                        setTimeout(() => {
                            winMessage.style.display = "none";
                            if (isAutospinActive) {
                                if (money >= bet) {
                                    if (autospinCountRemaining !== Infinity) autospinCountRemaining--;
                                    updateAutospinDisplay();
                                    if (autospinCountRemaining > 0 || autospinCountRemaining === Infinity) {
                                        autospinIntervalId = setTimeout(DoSpin, 1500);
                                    } else {
                                        displayMessage("Autospin sequence finished.");
                                        toggleAutospin();
                                    }
                                } else {
                                    displayMessage("Autospin stopped: Not enough money.");
                                    toggleAutospin();
                                }
                            } else {
                                spinButton.disabled = false;
                                document.getElementById("maxBetButton").disabled = false;
                                document.getElementById("decreaseAutospin").disabled = false;
                                document.getElementById("increaseAutospin").disabled = false;
                                updateAutospinDisplay();
                            }
                        }, 10);
                    }, 2000);
                }
            }, 20);
        }, 1500);
    } else {
        if (isAutospinActive) {
            if (money >= bet) {
                if (autospinCountRemaining !== Infinity) autospinCountRemaining--;
                updateAutospinDisplay();
                if (autospinCountRemaining > 0 || autospinCountRemaining === Infinity) {
                    autospinIntervalId = setTimeout(DoSpin, 1500); 
                } else {
                    displayMessage("Autospin sequence finished.");
                    toggleAutospin();
                }
            } else {
                displayMessage("Autospin stopped: Not enough money.");
                toggleAutospin();
            }
        } else {
            spinButton.disabled = false;
            document.getElementById("maxBetButton").disabled = false;
            document.getElementById("decreaseAutospin").disabled = false;
            document.getElementById("increaseAutospin").disabled = false;
            updateAutospinDisplay();
        }
    }
}

function resetGlow(rows, cols) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const viewport = document.querySelector(`td[data-row="${r}"][data-col="${c}"] .reel-viewport`);
            if (viewport) {
                viewport.classList.remove("glow");
            }
        }
    }
}

function displayMessage(message) {
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.textContent = message;
    messageDisplay.style.display = "block";
}

function hideMessages() {
    document.getElementById("messageDisplay").style.display = "none";
    document.getElementById("winMessage").style.display = "none";
    document.getElementById("winMessage").style.opacity = "0";
}

function updateMoney(amount) {
    money = amount;
    document.getElementById("moneyDisplay").querySelector("#moneyAmount").textContent = amount;
}

function updateBetDisplay() {
    document.getElementById("betAmount").textContent = bet;
}

function increaseBet() {
    const currentIndex = BET_OPTIONS.indexOf(bet);
    if (currentIndex < BET_OPTIONS.length - 1) {
        bet = BET_OPTIONS[currentIndex + 1];
        updateBetDisplay();
    }
}

function decreaseBet() {
    const currentIndex = BET_OPTIONS.indexOf(bet);
    if (currentIndex > 0) {
        bet = BET_OPTIONS[currentIndex - 1];
        updateBetDisplay();
    }
}

function setMaxBet() {
    let newBet = bet;
    for (let i = BET_OPTIONS.length - 1; i >= 0; i--) {
        if (BET_OPTIONS[i] <= money) {
            newBet = BET_OPTIONS[i];
            break;
        }
    }
    if (money > 0) {
        let affordableBet = BET_OPTIONS[0];
        for (const option of BET_OPTIONS) {
            if (option <= money) {
                affordableBet = option;
            } else {
                break;
            }
        }
        bet = affordableBet;
    } else {
    }

    updateBetDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    const maxBetButton = document.getElementById("maxBetButton");
    if (maxBetButton) {
        maxBetButton.addEventListener("click", setMaxBet);
    }

    const autoSpinButton = document.getElementById("autoSpinButton");
    if (autoSpinButton) {
        autoSpinButton.addEventListener("click", toggleAutospin);
    }

    const decreaseAutospinButton = document.getElementById("decreaseAutospin");
    const increaseAutospinButton = document.getElementById("increaseAutospin");

    if (decreaseAutospinButton) {
        decreaseAutospinButton.addEventListener("click", decreaseAutospinCount);
    }
    if (increaseAutospinButton) {
        increaseAutospinButton.addEventListener("click", increaseAutospinCount);
    }

    updateMoney(money);
    updateBetDisplay();
    updateAutospinDisplay();
    initializeReels(3, 4, SYMBOL_HEIGHT);
    reelAnimationControllers = [];
    for (let c = 0; c < 4; c++) {
        setupReelAnimation(c, 3);
    }
});

function toggleAutospin() {
    const autoSpinButton = document.getElementById("autoSpinButton");
    const spinButton = document.getElementById("spinButton");
    const maxBetButton = document.getElementById("maxBetButton");
    const winMessage = document.getElementById("winMessage"); 
    const decreaseAutospinBtn = document.getElementById("decreaseAutospin");
    const increaseAutospinBtn = document.getElementById("increaseAutospin");

    isAutospinActive = !isAutospinActive;

    if (isAutospinActive) {
        autospinCountRemaining = (autospinCountTarget === "ALL") ? Infinity : autospinCountTarget;
        autoSpinButton.classList.add("autospin-active-btn");
        spinButton.disabled = true;
        maxBetButton.disabled = true;
        decreaseAutospinBtn.disabled = true;
        increaseAutospinBtn.disabled = true;
        updateAutospinDisplay();

        if (money >= bet) {
            if (autospinCountRemaining > 0) {
                DoSpin();
            } else { 
                isAutospinActive = false; 
                autoSpinButton.classList.remove("autospin-active-btn");
                decreaseAutospinBtn.disabled = false;
                increaseAutospinBtn.disabled = false;
                updateAutospinDisplay();
                if (winMessage.style.display === 'none') {
                    spinButton.disabled = false;
                    maxBetButton.disabled = false;
                }
            }
        } else {
            displayMessage("Not enough money to start autospin.");
            isAutospinActive = false; 
            autoSpinButton.classList.remove("autospin-active-btn");
            decreaseAutospinBtn.disabled = false;
            increaseAutospinBtn.disabled = false;
            updateAutospinDisplay();
            if (winMessage.style.display === 'none') { 
                 spinButton.disabled = false;
                 maxBetButton.disabled = false;
            }
        }
    } else {
        autoSpinButton.classList.remove("autospin-active-btn");
        decreaseAutospinBtn.disabled = false;
        increaseAutospinBtn.disabled = false;
        if (autospinIntervalId) {
            clearTimeout(autospinIntervalId); 
            autospinIntervalId = null;
        }
        updateAutospinDisplay();
        if (winMessage.style.display === 'none' || winMessage.style.opacity === '0') {
             spinButton.disabled = false;
             maxBetButton.disabled = false;
        }
    }
}

function updateAutospinDisplay() {
    const countDisplay = document.getElementById("autospinCountDisplay");
    if (countDisplay) {
        countDisplay.textContent = autospinCountTarget;
    }
}

function increaseAutospinCount() {
    const currentIndex = AUTOSPIN_OPTIONS.indexOf(autospinCountTarget);
    if (currentIndex < AUTOSPIN_OPTIONS.length - 1) {
        autospinCountTarget = AUTOSPIN_OPTIONS[currentIndex + 1];
    }
    updateAutospinDisplay();
}

function decreaseAutospinCount() {
    const currentIndex = AUTOSPIN_OPTIONS.indexOf(autospinCountTarget);
    if (currentIndex > 0) {
        autospinCountTarget = AUTOSPIN_OPTIONS[currentIndex - 1];
    }
    updateAutospinDisplay();
}

function initializeReels(rows, cols, symbolHeight) {
    const gameGridTable = document.getElementById("gameGridTable");
    if (!gameGridTable) {
        return;
    }

    for (let c = 0; c < cols; c++) { 
        const stripDef = REEL_STRIPS[c % REEL_STRIPS.length]; 
        
        const prefix = stripDef.slice(-rows);
        const suffix = stripDef.slice(0, rows);
        const displayStripIndices = [...prefix, ...stripDef, ...suffix];

        for (let r = 0; r < rows; r++) { 
            const cell = gameGridTable.querySelector(`td[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                const symbolsContainer = cell.querySelector(".reel-symbols-container");
                if (symbolsContainer) {
                    symbolsContainer.innerHTML = ''; 
                    displayStripIndices.forEach(symbolIndex => {
                        const img = document.createElement('img');
                        img.src = SLOT_IMAGES[symbolIndex];
                        img.alt = "Slot Symbol"; 
                        symbolsContainer.appendChild(img);
                    });
                    symbolsContainer.style.height = `${displayStripIndices.length * symbolHeight}px`;
                    
                    const initialYOffset = prefix.length * symbolHeight;
                    symbolsContainer.style.transform = `translateY(-${initialYOffset}px)`;
                }
            }
        }
    }
}

function setupReelAnimation(colIndex, numRows) {
    const reelContainersInCol = [];
    for (let r = 0; r < numRows; r++) {
        const container = document.querySelector(`td[data-row="${r}"][data-col="${colIndex}"] .reel-symbols-container`);
        if (container) reelContainersInCol.push(container);
    }

    if (reelContainersInCol.length === 0) {
        return null;
    }

    const stripDefinition = REEL_STRIPS[colIndex % REEL_STRIPS.length];
    const prefixLength = numRows; 
    const stripCycleLength = stripDefinition.length * SYMBOL_HEIGHT;
    
    let initialCurrentYValue = 0;
    const transformString = getComputedStyle(reelContainersInCol[0]).transform;
    if (transformString && transformString !== 'none') {
        try {
            const matrix = new DOMMatrix(transformString);
            initialCurrentYValue = matrix.m42;
        } catch (e) {
            const match = transformString.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^\)]+)\)/);
            if (match && match[2]) {
                initialCurrentYValue = parseFloat(match[2]);
            } else {
                initialCurrentYValue = NaN;
            }
        }
    } else {
        initialCurrentYValue = -(prefixLength * SYMBOL_HEIGHT);
    }

    if (typeof initialCurrentYValue !== 'number' || isNaN(initialCurrentYValue)) {
        initialCurrentYValue = -(prefixLength * SYMBOL_HEIGHT);
    }
    
    let currentY = initialCurrentYValue;

    const scrollSpeed = 3000 + (colIndex * 200);
    let animationFrameId = null;
    let isSpinning = false;

    function spinStep() {
        if (!isSpinning) return;
        currentY -= (scrollSpeed / 60); 
        if (currentY < -(prefixLength * SYMBOL_HEIGHT + stripCycleLength)) {
            currentY += stripCycleLength; 
        }
        reelContainersInCol.forEach(container => { container.style.transform = `translateY(${currentY}px)`; });
        animationFrameId = requestAnimationFrame(spinStep);
    }

    const controller = {
        startSpin: () => {
            if (isSpinning) {
                return;
            }
            isSpinning = true;
            reelContainersInCol.forEach(container => {
                container.style.transition = '';
                container.classList.add('reel-spinning-blur');
            });
            animationFrameId = requestAnimationFrame(spinStep);
        },
        stopSpin: (finalSymbolsForCol, targetStripIndex, stopCallback) => {
            if (!isSpinning) { 
                if(stopCallback) stopCallback(); 
                return; 
            }
            isSpinning = false;
            cancelAnimationFrame(animationFrameId);
            
            reelContainersInCol.forEach(container => container.classList.remove('reel-spinning-blur'));

            let actualStopIndexOnStripDef = targetStripIndex;

            let baseTargetY = - (prefixLength + actualStopIndexOnStripDef) * SYMBOL_HEIGHT;
            
            let finalAnimatedY_ForRow0 = baseTargetY; 
            
            reelContainersInCol.forEach((container, rowIndex) => {
                const finalTranslateYForRow = finalAnimatedY_ForRow0 - (rowIndex * SYMBOL_HEIGHT);
                container.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
                container.style.transform = `translateY(${finalTranslateYForRow}px)`;
            });

            setTimeout(() => {
                reelContainersInCol.forEach(container => container.style.transition = '');
                if (stopCallback) stopCallback();
            }, 750);
        },
    };
    reelAnimationControllers[colIndex] = controller;
    return controller;
}

function orchestrateSequentialStop(finalGrid, finalStopIndices, rows, cols) {
    let currentReelToStop = 0;
    let stoppedReelsCount = 0;
    const baseStopDelay = 1500;
    const delayBetweenStops = 500;

    function stopNextReel() {
        if (currentReelToStop < cols) {
            const colIdx = currentReelToStop;
            const finalSymbolsForThisCol = [];
            for (let r = 0; r < rows; r++) {
                finalSymbolsForThisCol.push(finalGrid[r][colIdx]);
            }

            const timeToInitiateStop = baseStopDelay + (colIdx * delayBetweenStops);
            
            setTimeout(() => {
                if (reelAnimationControllers[colIdx]) {
                    reelAnimationControllers[colIdx].stopSpin(finalSymbolsForThisCol, finalStopIndices[colIdx], () => {
                        stoppedReelsCount++;
                        if (stoppedReelsCount === cols) {
                            CheckWinner(finalGrid);
                        }
                    });
                }
            }, timeToInitiateStop);

            currentReelToStop++;
            if(currentReelToStop < cols) {
                 stopNextReel();
            }

        } 
    }
    stopNextReel();
}


