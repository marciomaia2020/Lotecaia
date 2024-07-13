let savedGames = [];
let currentPosition = 2; // Começa em 2 porque a primeira posição já está no HTML

function addSelection() {
    const selectionDiv = document.getElementById('selection');
    const selectHtml = `
        <label for="fixed-number-${currentPosition}">Posição ${currentPosition}:</label>
        <select id="fixed-number-${currentPosition}" onchange="validateAndEnableNext(this)">
            <option value="">Selecionar</option>
            <option value="1">Esquerda</option>
            <option value="2">Meio</option>
            <option value="3">Direita</option>
        </select>
        <br>
    `;
    selectionDiv.innerHTML += selectHtml;
    currentPosition++;
}

// Inicialmente liberar 3 seleções
for (let i = 0; i < 3; i++) {
    addSelection();
}

function validateAndEnableNext(selectElement) {
    const selectedValue = selectElement.value;
    if (!selectedValue) return;

    const nextSelectElement = document.getElementById(`fixed-number-${currentPosition}`);
    if (nextSelectElement) {
        nextSelectElement.style.display = 'inline-block';
        nextSelectElement.focus();
        addSelection(); // Adicionar nova seleção ao escolher uma válida
    }
}

function validateDuplicatePositions() {
    const fixedPositions = [];
    for (let i = 1; i < currentPosition; i++) {
        const fixedNumberInput = document.getElementById(`fixed-number-${i}`);
        if (fixedNumberInput && fixedNumberInput.value !== '') {
            const position = `Posição ${i}-${fixedNumberInput.value}`;
            if (fixedPositions.includes(position)) {
                alert(`Número duplicado detectado: Posição ${i}-${fixedNumberInput.value}. Por favor, insira um número diferente.`);
                fixedNumberInput.value = '';
                return false;
            }
            fixedPositions.push(position);
        }
    }
    return fixedPositions.length === 14;
}

function generateNumbers() {
    if (!validateDuplicatePositions()) {
        alert("Por favor, selecione 14 posições fixas válidas.");
        return;
    }

    const fixedNumbers = [];
    for (let i = 1; i < currentPosition; i++) {
        const fixedNumberInput = document.getElementById(`fixed-number-${i}`);
        if (fixedNumberInput && fixedNumberInput.value !== '') {
            fixedNumbers.push({ position: i, value: fixedNumberInput.value });
        }
    }

    const allNumbers = [];
    for (let i = 1; i <= 14; i++) {
        for (let j = 1; j <= 3; j++) {
            allNumbers.push({ position: i, value: j });
        }
    }

    const availableNumbers = allNumbers.filter(num => !fixedNumbers.some(fixed => fixed.position === num.position && fixed.value == num.value));
    const randomNumbers = [];

    while (randomNumbers.length < (42 - fixedNumbers.length)) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const number = availableNumbers.splice(randomIndex, 1)[0];
        randomNumbers.push(number);
    }

    const generatedNumbers = [...fixedNumbers, ...randomNumbers].sort((a, b) => a.position - b.position);

    displayGeneratedNumbers(generatedNumbers);
}

function displayGeneratedNumbers(generatedNumbers) {
    let displayHtml = '<table>';
    for (let i = 1; i <= 14; i++) {
        displayHtml += '<tr>';
        const numberInPosition = generatedNumbers.filter(num => num.position === i);
        for (let j = 1; j <= 3; j++) {
            const number = numberInPosition.find(num => num.value == j);
            displayHtml += `<td>${number ? 'X' : ''}</td>`;
        }
        displayHtml += '</tr>';
    }
    displayHtml += '</table>';
    document.getElementById('generated-numbers').innerHTML = displayHtml;
}

function saveGame() {
    const generatedHtml = document.getElementById('generated-numbers').innerHTML;
    if (!generatedHtml) {
        alert("Nenhum jogo gerado para salvar.");
        return;
    }

    savedGames.push(generatedHtml);

    const savedGamesDiv = document.getElementById('saved-games');
    savedGamesDiv.innerHTML = savedGames.map(game => `<div>${game}</div>`).join('');
}

function exportToExcel() {
    if (savedGames.length === 0) {
        alert('Nenhum jogo salvo para exportar.');
        return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheetData = [['Números Gerados'], ...savedGames.map(game => [game])];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jogos Salvos');

    XLSX.writeFile(workbook, 'jogos_loteca.xlsx');
}
