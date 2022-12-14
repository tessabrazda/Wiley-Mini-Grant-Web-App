document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:3000/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}); // OK

document.querySelector('table tbody').addEventListener('click', function(event){
    if(event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
        //console.log(event.target.dataset.id);
    }
}); // OK

function deleteRowById(id) {
    fetch('http://localhost:3000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => { if(data.success) {
        reloadData();
        }
    });
} // OK

function handleEditRow(id){
    const updateSection = document.querySelector('#update-row');
    document.querySelector('#selected-name').innerHTML = "Selected ID: "+ id;
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;
    
} // UPDATE

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

updateBtn.onclick = function() {
    const updateSum = document.querySelector('#update-summary');
    const updateDesc = document.querySelector('#update-description');
    const updateDep = document.querySelector('#update-department');
    const updateSpons = document.querySelector('#update-sponsor');
    const sum = updateSum.value;
    const desc = updateDesc.value;
    const dep = updateDep.value;
    const spons = updateSpons.value;
    updateSum.value = "";
    updateDesc.value = "";
    updateDep.value = "";
    updateSpons.value = "";

    const updateAppId = document.querySelector('#update-row-btn').dataset.id;
    fetch('http://localhost:3000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            app_id: updateAppId,
            summary: sum,
            description: desc,
            department: dep,
            sponsor: spons
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const updateSection = document.querySelector('#update-row');
            updateSection.hidden = true;
            reloadData();
        }
    })
} // OK

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;
    const searchType = document.querySelector('#search-type').value;
    const url = 'http://localhost:3000/search?' + searchType + '=' + searchValue;

    fetch(url)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
} //FIX unsure what's happening, inspect-->network setting says something with promise is messed up...

function reloadData() {
    // fetch all data
    fetch('http://localhost:3000/get')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
} //OK

const createNewItemBtn = document.querySelector('#create-new-item-btn');
const addBtn = document.querySelector('#add-app-btn');
const toAppDataBtn = document.querySelector('#to-app-data-btn');
const toBudgetDataBtn = document.querySelector('#to-budget-data-btn');

toAppDataBtn.onclick = function(){
    const userDataSection = document.querySelector('#get-user-data');
    const appDataSection = document.querySelector('#get-app-data');
    userDataSection.hidden = true;
    appDataSection.hidden = false;
} // OK

toBudgetDataBtn.onclick = function(){
    const appBudgetSection = document.querySelector('#get-budget-data');
    const appDataSection = document.querySelector('#get-app-data');
    appDataSection.hidden = true;
    appBudgetSection.hidden = false;
} // OK

createNewItemBtn.onclick = function() {
    const createSection = document.querySelector('#creation-section');
    createSection.hidden = false;
} // OK

addBtn.onclick = function () {
    // add input validation here
    const firstNameInput = document.querySelector('#first-name-input');
    const lastNameInput = document.querySelector('#last-name-input');
    const emailInput = document.querySelector('#email-input');
    const phoneInput = document.querySelector('#phone-input');
    const summaryInput = document.querySelector('#summary-input');
    const descriptionInput = document.querySelector('#description-input');
    const departmentInput = document.querySelector('#department-input');
    const sponsorInput = document.querySelector('#sponsor-input');
    const budgetAmtInput = document.querySelector('#budget-amt-input');
    const budgetDueInput = document.querySelector('#budget-due-input');
    const budgetUseInput = document.querySelector('#budget-use-input');

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const summary = summaryInput.value;
    const desc = descriptionInput.value;
    const department = departmentInput.value;
    const sponsor = sponsorInput.value;
    const budgetAmt = budgetAmtInput.value;
    const budgetDue = budgetDueInput.value;
    const budgetUse = budgetUseInput.value;
    
    firstNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    summaryInput.value = "";
    descriptionInput.value = "";
    departmentInput.value = "";
    sponsorInput.value = "";
    budgetAmtInput.value = "";
    budgetDueInput.value = "";
    budgetUseInput.value = "";

    // temporary values
    const userId = 1;
    const budgetId = 1;
    const status = 1;

    fetch('http://localhost:3000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({userId, budgetId, status, summary, desc, department, sponsor})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));

    // reset creation UI
    const appBudgetSection = document.querySelector('#get-budget-data');
    const userDataSection = document.querySelector('#get-user-data');
    appBudgetSection.hidden = true;
    userDataSection.hidden = false;
} // UPDATE temporary values & input validation, otherwise OK

function insertRowIntoTable(data) {    
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)){
            if (key === 'app_date') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHtml = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
    const createSection = document.querySelector('#creation-section');
    createSection.hidden = true;
    reloadData();
} // OK

function loadHTMLTable(data){
  const table = document.querySelector('table tbody');
  
  if (data.length ===0){
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    return;
  }
  let tableHtml = "";
  data.forEach(function({app_id, user_id, budget_id, app_date, app_status_id, summary, description, department, sponsor}){
    tableHtml += "<tr>";
    tableHtml += `<td>${app_id}</td>`;
    tableHtml += `<td>${user_id}</td>`; // want to show user_id's first_name and last_name from users
    tableHtml += `<td>${new Date(app_date).toLocaleString()}</td>`;
    tableHtml += `<td>${app_status_id}</td>`; // want to show app_status_id's name from app_statuses
    tableHtml += `<td>${summary}</td>`;
    tableHtml += `<td>${description}</td>`;
    tableHtml += `<td>${department}</td>`;
    tableHtml += `<td>${sponsor}</td>`;
    tableHtml += `<td>${budget_id}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${app_id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${app_id}>Edit</td>`;
    tableHtml += "</tr>";
  });
  table.innerHTML = tableHtml;
} // OK
