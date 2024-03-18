document.addEventListener("DOMContentLoaded", () => {
    const cubes = document.querySelectorAll(".cube");
    const shareButton = document.querySelector(".share-btn");
    const restartButton = document.querySelector(".restart-btn");
    let mineIndexes = getRandomIndexes(3, cubes.length);
    let money = getRandomMoney(250, 600);
    let gameOver = false;
    const moneyDisplay = document.createElement("div");
    moneyDisplay.classList.add("money-display");
    updateMoneyDisplay(money);
    document.body.appendChild(moneyDisplay);

    cubes.forEach((cube, index) => {
        cube.addEventListener("click", () => {
            if (gameOver) return;
            if (mineIndexes.includes(index)) {
                revealCube(cube, true);
                endGame();
            } else {
                revealCube(cube, false);
                updateMoney(Math.floor(Math.random() * (100 - 30 + 1)) + 30);
            }
        });
    });

    function revealCube(cube, isMine) {
        cube.innerHTML = isMine ? '<i class="fas fa-bomb"></i>' : '<i class="fa-solid fa-check"></i>';
        cube.style.backgroundColor = isMine ? "red" : "#4CCD99";
    }

    function endGame() {
        cubes.forEach((cube, index) => {
            revealCube(cube, mineIndexes.includes(index));
        });
        gameOver = true;
        shareButton.style.visibility = 'visible';
        restartButton.style.visibility = 'visible';
        shareButton.addEventListener("click", shareGame);
        restartButton.addEventListener("click", restartGame);
    }

    function restartGame() {
        cubes.forEach((cube) => {
            cube.innerHTML = '<i class="fa-solid fa-sack-dollar"></i>';
            cube.style.backgroundColor = "";
            shareButton.style.visibility = 'hidden';
            restartButton.style.visibility = 'hidden';
        });
        money = getRandomMoney(250, 600);
        updateMoneyDisplay(money);
        mineIndexes = getRandomIndexes(3, cubes.length);
        gameOver = false;
    }

    function shareGame() {
        let gameString = "";
        cubes.forEach((cube, index) => {
            gameString += mineIndexes.includes(index) ? "💣" : "🟩";
            if ((index + 1) % Math.sqrt(cubes.length) === 0) {
                gameString += "\n";
            }
        });

        const moneyEmoji = convertMoneyToEmoji(money);
        gameString += `\nMoney: ${moneyEmoji}`;
        navigator.clipboard.writeText(gameString);
        showClipboardNotification();
    }

    function showClipboardNotification() {
        const ClipBoardNotification = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
        });
        ClipBoardNotification.fire({
            icon: "success",
            title: "The game has been copied to your clipboard!"
        });
    }

    function updateMoney(amount) {
        money += amount;
        updateMoneyDisplay(money);
    }

    function updateMoneyDisplay(amount) {
        moneyDisplay.textContent = `Money: $${amount}`;
    }

    function getRandomIndexes(numIndexes, maxIndex) {
        const indexes = [];
        while (indexes.length < numIndexes) {
            const randomIndex = Math.floor(Math.random() * maxIndex);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    }

    function getRandomMoney(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function convertMoneyToEmoji(amount) {
        const amountString = amount.toString();
        let emojiString = "";
        const emojiNumbers = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        for (let i = 0; i < amountString.length; i++) {
            const digit = amountString[i];
            emojiString += emojiNumbers[digit];
        }
        return emojiString;
    }
});
