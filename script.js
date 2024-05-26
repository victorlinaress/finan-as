const transactionsList = document.querySelector("#transactions");
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactionsArray = Array.isArray(localStorageTransactions) ? localStorageTransactions : [];

const removeTransaction = ID => {
  transactionsArray = transactionsArray.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
}

const addTransactionIntoDom = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `${transaction.name} <span>${operator} R$ ${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`;

  transactionsList.prepend(li);
};

const updateBalance = () => {
  const transactionAmounts = transactionsArray.map(transaction => transaction.amount);
  const total = transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);
  const income = transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);
  const expense = Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);

  balanceDisplay.textContent = `R$${total}`;
  incomeDisplay.textContent = `R$${income}`;
  expenseDisplay.textContent = `R$${expense}`;
};

const init = () => {
  transactionsList.innerHTML = '';
  transactionsArray.forEach(addTransactionIntoDom);
  updateBalance();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactionsArray));
}

const generateID = () => Math.round(Math.random() * 1000);

form.addEventListener('submit', event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  if (transactionName === '' || transactionAmount === '') {
    alert('Por favor, preencha o nome e o valor da transação');
    return;
  }

  const transaction = { id: generateID(), name: transactionName, amount: Number(transactionAmount) };

  transactionsArray.push(transaction);
  init();
  updateLocalStorage();

  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
});
