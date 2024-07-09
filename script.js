const exchangeRateAPIKey = '970650b81704466473dc5d26'; // Replace with your ExchangeRate-API key
let exchangeRates = {};

// Function to fetch exchange rates
async function fetchExchangeRates(originCurrency) {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateAPIKey}/latest/${originCurrency}`);
        const data = await response.json();
        console.log('data', data)
        exchangeRates = data.conversion_rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return amount * rate;
}



document.getElementById('adicionar').addEventListener('click', async function() {
    const moedaOrigem = document.getElementById('moedaOrigem').value;
    await fetchExchangeRates(moedaOrigem);
    const descricao = document.getElementById('descricao').value;
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const valor = parseFloat(document.getElementById('valor').value);
    const moedaDestino = document.getElementById('moedaDestino').value;

    if (!descricao || isNaN(quantidade) || isNaN(valor)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const valorConvertido = convertCurrency(valor, moedaOrigem, moedaDestino);

    const totalOrigem = document.getElementById('totalOrigem');
    const totalDestino = document.getElementById('totalDestino');

    totalOrigem.textContent = (parseFloat(totalOrigem.textContent) + (quantidade * valor)).toFixed(2);
    totalDestino.textContent = (parseFloat(totalDestino.textContent) + (quantidade * valorConvertido)).toFixed(2);

    // Create list item for the added expense
    const itemList = document.getElementById('itemList');
    const li = document.createElement('li');
    li.innerHTML = `
        ${descricao} (Qtd. ${quantidade}): ${valor} ${moedaOrigem} => ${(quantidade * valorConvertido).toFixed(2)} ${moedaDestino}
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
    `;

    // Add delete functionality to the button
    li.querySelector('.delete-btn').addEventListener('click', function() {
        itemList.removeChild(li);
        totalOrigem.textContent = (parseFloat(totalOrigem.textContent) - (quantidade * valor)).toFixed(2);
        totalDestino.textContent = (parseFloat(totalDestino.textContent) - (quantidade * valorConvertido)).toFixed(2);
    });

    // Add edit functionality to the button
    li.querySelector('.edit-btn').addEventListener('click', function() {
        document.getElementById('descricao').value = descricao;
        document.getElementById('quantidade').value = quantidade;
        document.getElementById('valor').value = valor;
        document.getElementById('moedaOrigem').value = moedaOrigem;
        document.getElementById('moedaDestino').value = moedaDestino;

        // Remove the item being edited from the list and update totals
        itemList.removeChild(li);
        totalOrigem.textContent = (parseFloat(totalOrigem.textContent) - (quantidade * valor)).toFixed(2);
        totalDestino.textContent = (parseFloat(totalDestino.textContent) - (quantidade * valorConvertido)).toFixed(2);
    });

    itemList.appendChild(li);

    // Clear input fields
    document.getElementById('descricao').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor').value = '';
});
