const routes={
    '/login': {templateId:'login'},
    '/dashboard': {templateId:'dashboard',init:refresh},
}
let state=Object.freeze({
    account:null
});

const storageKey = 'savedAccount';

function updateRoute(){
    const path=window.location.pathname
    const route=routes[path]
    if(!route)
    {
        return navigate('/dashboard')
    }
    const template=document.getElementById(route.templateId);
    const view=template.content.cloneNode(true);
    const app=document.getElementById("app");
    app.innerHTML=''
    app.appendChild(view);
    if (typeof route.init === 'function') {
        route.init();
    }
}

async function updateAccountData() {
    const account = state.account;

    if (!account) {
      return logout();
    }
  
    const data = await getAccount(account.user);
    if (data.error) {
      return logout();
    }
  
    updateState('account', data.msg);
}

async function refresh() {
    await updateAccountData();
    updateDashboard();
}

function navigate(path){
    window.history.pushState({},path,path);
    updateRoute();
}

function onLinkClick(event){
    event.preventDefault();
    navigate(event.target.href);
}

async function register(){
    const registerForm=document.getElementById('registerForm');
    const formData=new FormData(registerForm);
    const data=Object.fromEntries(formData);
    const jsonData=JSON.stringify(data);
    const result = await createAccount(jsonData);

    if(result.error)
    {
        return console.log("An Error Occured",result.error)
    }
    updateState('account', result.msg);
    navigate('/dashboard')
}

async function transaction(){
    const transactionForm=document.getElementById("transactionForm")
    const transactionData=new FormData(transactionForm)
    const data=Object.fromEntries(transactionData)
    const jsondata=JSON.stringify(data)
    const result=await createTransaction(jsondata)
    if(result.success == false)
    {
        return updateElement('transactionError',result.msg)
    }
    updateState('account',result.msg)
    navigate('/dashboard')
}

async function createTransaction(accountData){
    try {
        const response=await fetch(`http://localhost:5000/api/accounts/${state.account.user}/transactions`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:accountData,
    })
    return await response.json();
    } catch (error) {
        return {error:error.message || 'Unknown Error'}
    }
}



async function login() {
    const loginForm = document.getElementById('loginForm')
    const user = loginForm.user.value;
    const data = await getAccount(user);
    if(data.success == false)
    {
        return updateElement('loginError',data.msg)
    }
    if (data.error) {
      return updateElement('loginError',data.error)
    }
  
    updateState('account', data.msg);
    navigate('/dashboard');
}


function updateElement(id, textOrNode) {
    const element = document.getElementById(id);
    element.textContent = '';
    element.append(textOrNode);
}

function updateState(property, newData) {
    state = Object.freeze({
      ...state,
      [property]: newData
    });
    localStorage.setItem(storageKey, JSON.stringify(state.account));
}

function init() {
    const savedAccount = localStorage.getItem(storageKey);
    if (savedAccount) {
      updateState('account', JSON.parse(savedAccount));
    }
  
    // Our previous initialization code
    window.onpopstate = () => updateRoute();
    updateRoute();
}
  


function logout() {
    updateState('account', null);
    navigate('/login');
}

function updateDashboard() {
    const account=state.account
    if (!account) {
      return logout();
    }
  
    updateElement('description', account.description);
    updateElement('balance', account.balance.toFixed(2));
    updateElement('currency', account.currency);

    const transactionRows=document.createDocumentFragment();
    for(const transaction of account.transactions)
    {
        const transactionRow=createTransactionRow(transaction);
        transactionRows.appendChild(transactionRow);
    }
    updateElement('transactions',transactionRows)
}

function createTransactionRow(transaction){
    const template=document.getElementById('transaction')
    const transactionRow=template.content.cloneNode(true);
    const tr=transactionRow.querySelector('tr')
    tr.children[0].textContent=transaction.date;
    tr.children[1].textContent=transaction.object;
    tr.children[2].textContent=transaction.amount.toFixed(2);
    return transactionRow
}

async function getAccount(user) {
    try {
      const response = await fetch('http://localhost:5000/api/accounts/' + encodeURIComponent(user));
      return await response.json();
    } catch (error) {
      return { error: error.message || 'Unknown error' };
    }
}

async function createAccount(accountData){
    try {
        const response=await fetch('http://localhost:5000/api/accounts',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:accountData
    });
    
    return await response.json();
    } catch (error) {
        return {error:error.message || 'Unknown Error'}
    }
}

window.onpopstate = () => updateRoute();
updateRoute();

