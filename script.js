//  Reset language to Eng
document.getElementById('radio-en').checked = true
document.getElementById('radio-ar').checked = false

// Check for an Arabic Region
const getLanguage = () => navigator.userLanguage || (navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || navigator.browserLanguage || navigator.systemLanguage || 'en';
if (getLanguage().match(/ar/i)){
  toggleLanguage('ar')
}

// Elements
let list = document.querySelector('#list')
let list_ar = document.querySelector('#list-ar')
const text = document.querySelector('#text')
const number = document.querySelector('#amount')
const buttons = document.querySelectorAll('button')
const balanceElEn = document.getElementsByTagName('h1')[0]
const balanceElAr = document.getElementsByTagName('h1')[1]
const errors = document.querySelectorAll('.error')
errors[0].style.opacity = 0 //?

// let itemList = [
//   ['Flower', -20, 1],
//   ['Salary', 300, 2],
//   ['Book',   -10, 3],
//   ['Camera', 150, 4],
// ]
let itemList = JSON.parse(localStorage.getItem(('list'))) || []

let balance =  itemList.reduce((a, b) => a + Number(b[1]), 0)
let income =  itemList.filter((a) => a[1] > 0).reduce((a, b) => a + Number(b[1]), 0)
let expense =  itemList.filter((a) => a[1] < 0).reduce((a, b) => a + Number(b[1]), 0)

// Set balance
setBalance()
function setBalance(b=0) {
  balance += Number(b)
  balanceElEn.innerText = (balance >= 0 ? '$' : '-$') + Math.abs(balance).toFixed(2)
  balanceElAr.innerText = Math.abs(balance).toFixed(2) + (balance >= 0 ? ' $' : ' $-')
}

// Set income
setIncome()
function setIncome(i=0) {
  income += Number(i)
  document.getElementById('income-ar').innerText = '$' + income
  document.getElementById('income-en').innerText = '$' + income
}

// Set expense
setExpense()
function setExpense(e=0) {
  expense += Number(e)
  document.getElementById('expense-en').innerText = '$' + Math.abs(expense)
  document.getElementById('expense-ar').innerText = '$' + Math.abs(expense)
}

// Populate lists
itemList && populator()

// Delete item
document.addEventListener('click', (e) => {
  if (e.target.textContent === '\uf2ed') {
    const delButton = e.target
    const transaction = Number(
      delButton.previousElementSibling.textContent.replace('$', ''),
    )
    balance -= transaction
    setBalance()
    transaction < 0
      ? ((expense -= transaction), setExpense())
      : (income -= transaction),
      setIncome()
    let dataId = delButton.parentElement.getAttribute('data-id')
    let toberemoved = document.querySelectorAll(`[data-id="${dataId}"]`)
    toberemoved.forEach((a) => a.remove())
    itemList = itemList.filter(entry=>entry[2] != dataId)//?
    localStorage.setItem('list', JSON.stringify(itemList))

  }
})

// Add item
buttons.forEach((el) => {
  el.addEventListener('click', (e) => {
    const id = new Date().getTime().toString()
    const textValue = el.previousElementSibling.previousElementSibling.previousElementSibling.value
    const cost = el.previousElementSibling.value
    if (textValue && cost.match(/^-?[0-9]+$/)){
      itemList.push([textValue, cost, id])
      newListItem(textValue, cost, id)
      setBalance(cost)
      cost > 0 ? setIncome(cost) : setExpense(cost)
      localStorage.setItem('list', JSON.stringify(itemList))
      errors.forEach(a=>a.style.opacity = 0)
    } else {
      errors.forEach(a=>a.style.opacity = 1)
    }

  })
})

// ### FUNCTIONS ###
function populator() {
  return itemList.map((item, i) => {
    newListItem(item[0], item[1], item[2])
  })
}

function toggleLanguage(e) {
  if (e === 'ar') {
    document.getElementById('container-ar').style.display = 'block'
    document.getElementById('container-en').style.display = 'none'
    document.getElementById('radio2-ar').checked = true
    document.getElementById('radio2-en').checked = false
  }
  if (e === 'en') {
    document.getElementById('container-en').style.display = 'block'
    document.getElementById('container-ar').style.display = 'none'
    document.getElementById('radio-en').checked = true
    document.getElementById('radio-ar').checked = false
  }
}

function newListItem(name, amount, id) {
  function addToEachList(elem) {
    // New list with text
    elem
      .appendChild(document.createElement('li'))
      .appendChild(document.createTextNode(name))
    // Amount and sign
    elem.lastChild
      .appendChild(document.createElement('span'))
      .appendChild(
        document.createTextNode((amount >= 0 ? '$' : '-$') + Math.abs(amount)),
      )
    // Trash can
    elem.lastChild
      .appendChild(document.createElement('span'))
      .appendChild(document.createTextNode('\uf2ed'))
    // Class
    elem.lastChild.setAttribute('class', amount >= 0 ? 'plus' : 'minus')
    // Data id
    elem.lastChild.setAttribute('data-id', id)
  }
  addToEachList(list)
  addToEachList(list_ar)
}

// localStorage.setItem('list', JSON.stringify(itemList))
// JSON.parse(localStorage.getItem(('list')))//?


