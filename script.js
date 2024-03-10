const year = document.querySelector("#year")
const switchBtn = document.querySelector(".switch")
const displayBalance = document.querySelector(".balance p")
const incomeForm = document.querySelector("#income")
const expensesForm = document.querySelector("#expenses")
const incomeInput = document.querySelector(".income_value")
const sourceInput = document.querySelector(".income_source")
const expensesInput = document.querySelector(".expenses_value")
const categoryInput = document.querySelector(".expenses_category")
const historyDiv = document.querySelector(".history")
const printBtn = document.querySelector("#print")
const clearBtn = document.querySelector("#clear")

if(localStorage.getItem("transactions") === null){
    localStorage.setItem("transactions",JSON.stringify({transactions:[],balance:0,mode:"lightmode"}))
    render()
}else{
    render()
}

const data = JSON.parse(localStorage.getItem("transactions"))
document.body.setAttribute("class",data.mode)

switchBtn.addEventListener("click",(event)=>{
    let {transactions,balance,mode} = JSON.parse(localStorage.getItem("transactions"))
   if(document.body.className==="lightmode"){
    mode="darkmode"
    document.body.removeAttribute("class")
    document.body.setAttribute("class",mode)
    event.target.innerText = "Toggle Light Mode"
    localStorage.setItem("transactions",JSON.stringify({transactions,balance,mode}))
   }
   else{
    mode="lightmode"
    document.body.removeAttribute("class")
    document.body.setAttribute("class",mode)
    event.target.innerText = "Toggle Dark Mode"
    localStorage.setItem("transactions",JSON.stringify({transactions,balance,mode}))
   }
})

// incomeInput.addEventListener("keypress",(event)=>{
//     if (!(event.charCode===46||(event.charCode>47&&event.charCode<58))){
//         event.preventDefault()
//     }
// })
// expensesInput.addEventListener("keypress",(event)=>{
//     if (!(event.keyCode===46||(event.keyCode>47&&event.keyCode<58))){
//         event.preventDefault()
//     }
// })
sourceInput.addEventListener("keyup",(event)=>{
    event.target.value = (sentenceCase(event.target.value))
})
categoryInput.addEventListener("keyup",(event)=>{
    event.target.value = (sentenceCase(event.target.value))
})


incomeForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    const entry = incomeInput.value
    const source = sourceInput.value
    let data = JSON.parse(localStorage.getItem("transactions"))
    let {transactions,balance,mode} = data
    balance= Number(balance) + Number(entry)
    transactions.unshift({entry,source,type:"INCOME"})
        localStorage.setItem("transactions",JSON.stringify({transactions,balance,mode}))
    render()
    incomeInput.value=""
    sourceInput.value=""
    });

expensesForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    const entry = expensesInput.value
    const source = categoryInput.value
    let data = JSON.parse(localStorage.getItem("transactions"))
    let {transactions,balance,mode} = data
    balance= Number(balance) - Number(entry)
    transactions.unshift({entry,source,type:"EXPENSE"})
        localStorage.setItem("transactions",JSON.stringify({transactions,balance,mode}))
    render()
    expensesInput.value=""
    categoryInput.value=""
    })

function render(){
    const {transactions,balance,mode} = JSON.parse(localStorage.getItem("transactions"))
    displayBalance.innerText = `#${balance}`;
    historyDiv.innerHTML =""
    if(transactions.length === 0){
        historyDiv.innerText = "No Transaction History"
    }
    else{
        const h3 = document.createElement("h3")
        h3.innerText = "Transaction History"
        const table = document.createElement("table")
        const thead = document.createElement("thead")
        const tbody = document.createElement("tbody")
        const headRow = document.createElement("tr")
        const sourceHead = document.createElement("th")
        sourceHead.innerText = "Source"
        const typeHead = document.createElement("th")
        typeHead.innerText = "Type"
        const amountHead = document.createElement("th")
        amountHead.innerText = "Amount"
        const dateHead = document.createElement("th")
        dateHead.innerText = "Date";
        const timeHead = document.createElement("th")
        timeHead.innerText = "Time";
        headRow.append(sourceHead,typeHead,amountHead,dateHead,timeHead)
        thead.append(headRow)
        table.append(thead)

        transactions.map((elm,index)=>{
            const tr = document.createElement("tr")
            const source = document.createElement("td")
            const type = document.createElement("td")
            const amount = document.createElement("td")
            const date = document.createElement("td")
            const time = document.createElement("td")
            tr.append(source,type,amount,date,time)
            tbody.append(tr)
            table.append(tbody)
            historyDiv.append(h3,table)
            amount.innerText=`#${parseInt(elm["entry"])}`
            type.innerText=elm["source"]
            source.innerText=elm["type"]
            date.innerText=new Date().toLocaleDateString()
            time.innerText=new Date().toLocaleTimeString()
        })
    }
}

const sentenceCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

printBtn.addEventListener("click",(event)=>{
    let printContent = document.querySelector(".history").innerHTML
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
})
clearBtn.addEventListener("click",()=>{
    localStorage.setItem("transactions",JSON.stringify({transactions:[],balance:0,mode:"lightmode"}))
    render()
})

year.innerText = `${new Date().getFullYear()}`
