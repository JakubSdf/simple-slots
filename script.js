let money = 100;
let bet = 2;

document.getElementById("toggleInfo").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the link from refreshing the page
    const infoTab = document.getElementById("infoTab");
    const toggleText = document.getElementById("toggleInfo");

    // Toggle the visibility of the info tab
    if (infoTab.style.display === "none") {
        infoTab.style.display = "block";
        toggleText.textContent = "Hide Info"; // Change the text to "Hide Info"
    } else {
        infoTab.style.display = "none";
        toggleText.textContent = "Show Info"; // Change the text to "Show Info"
    }
});

function DoSpin() {
    const slotImages = ["cherry.png", "bell.png", "7.png", "plum.png", "grape.png"];

    hideMessages();

    if (money >= bet) {
        money -= bet;
        updateMoney(money);

        const slot1 = Math.floor(Math.random() * slotImages.length);
        const slot2 = Math.floor(Math.random() * slotImages.length);
        const slot3 = Math.floor(Math.random() * slotImages.length);

        document.getElementById("SlotImage1").src = slotImages[slot1];
        document.getElementById("SlotImage2").src = slotImages[slot2];
        document.getElementById("SlotImage3").src = slotImages[slot3];

        resetGlow();

        CheckWinner(slot1, slot2, slot3);
    } else {
        displayMessage("You don't have enough money to spin.");
    }
}

function CheckWinner(x, y, z) {
    const winMessage = document.getElementById("winMessage");
    const winAmount = document.getElementById("winAmount");
    let amountWon = 13 * bet;
    let currentMoney = money;

    if (x === y && x === z) {

        document.getElementById("SlotImage1").classList.add("glow");
        document.getElementById("SlotImage2").classList.add("glow");
        document.getElementById("SlotImage3").classList.add("glow");

        document.getElementById("SlotImage1").classList.add("glowBorder");
        document.getElementById("SlotImage2").classList.add("glowBorder");
        document.getElementById("SlotImage3").classList.add("glowBorder");

        winMessage.style.display = "block";
        document.getElementById("spinButton").disabled = true;

        let count = 0;
        let interval = setInterval(function () {
            if (count < amountWon) {
                count += Math.ceil(amountWon / 100);
                winAmount.textContent = count;
            } else {
                winAmount.textContent = amountWon;
                clearInterval(interval);
            }
        }, 30);

        setTimeout(function () {
            let countdown = amountWon;
            let countdownInterval = setInterval(function () {
                if (countdown > 0) {
                    countdown -= Math.ceil(amountWon / 100);
                    winAmount.textContent = countdown;
                } else {
                    winAmount.textContent = "0";
                    clearInterval(countdownInterval);
                }
            }, 30);

            let userBalance = currentMoney;
            let balanceInterval = setInterval(function () {
                if (userBalance < currentMoney + amountWon) {
                    userBalance += Math.ceil(amountWon / 100);
                    updateMoney(userBalance);
                } else {
                    updateMoney(currentMoney + amountWon);
                    clearInterval(balanceInterval);
                }
            }, 30);

        }, 2000);

        setTimeout(function () {
            document.getElementById("spinButton").disabled = false;
        }, 2000);
    }
}

function resetGlow() {
    document.getElementById("SlotImage1").classList.remove("glow");
    document.getElementById("SlotImage2").classList.remove("glow");
    document.getElementById("SlotImage3").classList.remove("glow");
    document.getElementById("SlotImage1").classList.remove("glowBorder");
    document.getElementById("SlotImage2").classList.remove("glowBorder");
    document.getElementById("SlotImage3").classList.remove("glowBorder");
}

function displayMessage(message) {
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.textContent = message;
    messageDisplay.style.display = "block";
}

function hideMessages() {
    document.getElementById("messageDisplay").style.display = "none";
    document.getElementById("winMessage").style.display = "none";
}

function updateMoney(amount) {
    money = amount;
    document.getElementById("moneyDisplay").textContent = `Money: $${money}`;
}

function increaseBet() {
    const betOptions = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    const currentIndex = betOptions.indexOf(bet);

    if (currentIndex < betOptions.length - 1) {
        bet = betOptions[currentIndex + 1];
        document.getElementById("betAmount").textContent = bet;
    }
}

function decreaseBet() {
    const betOptions = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    const currentIndex = betOptions.indexOf(bet);

    if (currentIndex > 0) {
        bet = betOptions[currentIndex - 1];
        document.getElementById("betAmount").textContent = bet;
    }
}
