document.addEventListener('DOMContentLoaded', function() {
    const addUnitSectorButton = document.getElementById('addUnitSectorButton');
    const addPersonButton = document.getElementById('addPersonButton');
    const savePersonButton = document.getElementById('savePersonButton');
    const saveUnitButton = document.getElementById('saveUnitButton');
    const saveSectorButton = document.getElementById('saveSectorButton');
    const unitCnpjInput = document.getElementById('unitCnpj');

    addUnitSectorButton.addEventListener('click', function() {
        openModal('manageUnitSectorModal');
    });

    addPersonButton.addEventListener('click', function() {
        openModal('addPersonModal');
        clearPersonModal();  // Clear the form fields
    });

    document.getElementById('closeManageUnitSectorModal').addEventListener('click', function() {
        closeModal('manageUnitSectorModal');
    });

    document.getElementById('closeAddPersonModal').addEventListener('click', function() {
        closeModal('addPersonModal');
    });

    document.getElementById('nameSearch').addEventListener('input', filterList);
    document.getElementById('sectorSearch').addEventListener('change', filterList);
    document.getElementById('unitSearch').addEventListener('change', filterList);

    savePersonButton.addEventListener('click', addOrUpdatePerson);
    saveUnitButton.addEventListener('click', addOrUpdateUnit);
    saveSectorButton.addEventListener('click', addOrUpdateSector);

    populateUnitSelect();
    populateSectorSelect();
    populateUnitList();
    populateSectorList();
    renderPeopleList();

    unitCnpjInput.addEventListener('input', function() {
        const formattedCnpj = this.value.replace(/\D/g, '');
        const formattedValue = formattedCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        this.value = formattedValue;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    loginButton.addEventListener('click', login);
    closeLoginModal.addEventListener('click', function() {
        closeModal('loginModal');
    });

    // Mostra a tela de login ao carregar a página
    openModal('loginModal');
    
    // Adicione outras funções de inicialização aqui...
});

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Você pode substituir isso por uma verificação real de usuário e senha
    if (username === 'admin' && password === 'admin') {
        closeModal('loginModal');
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

function openModal(modalId) {
    if (modalId === 'manageUnitSectorModal') {
        populateUnitSelect();
        populateUnitList();
        populateSectorList();
    } else if (modalId === 'addPersonModal') {
        populatePersonUnitSelect();
        populatePersonSectorSelect();
        clearPersonModal();
    }
    document.getElementById(modalId).style.display = 'block';
}


function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function clearPersonModal() {
    document.getElementById('editIndex').value = '';
    document.getElementById('personName').value = '';
    document.getElementById('personUnit').value = '';
    document.getElementById('personSector').value = '';
    document.getElementById('personExtension').value = '';
    document.getElementById('personEmail').value = '';
    document.getElementById('personCorporatePhone').value = '';
}

function addOrUpdatePerson() {
    const editIndex = document.getElementById('editIndex').value;
    const name = document.getElementById('personName').value;
    const unit = document.getElementById('personUnit').value;
    const sector = document.getElementById('personSector').value;
    const extension = document.getElementById('personExtension').value;
    const email = document.getElementById('personEmail').value;
    const corporatePhone = document.getElementById('personCorporatePhone').value;

    if (!name || !unit || !sector || !extension || !email || !corporatePhone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const person = {
        name,
        unit,
        sector,
        extension,
        email,
        corporatePhone
    };

    if (editIndex) {
        people[editIndex] = person;
        alert('Alterado com Sucesso!');
    } else {
        people.push(person);
        alert('Salvo com Sucesso!');
    }


    closeModal('addPersonModal');
    renderPeopleList();
}

function editPerson(index) {
    const person = people[index];
    document.getElementById('personName').value = person.name;
    document.getElementById('personUnit').value = person.unit;
    document.getElementById('personSector').value = person.sector;
    document.getElementById('personExtension').value = person.extension;
    document.getElementById('personEmail').value = person.email;
    document.getElementById('personCorporatePhone').value = person.corporatePhone;
    document.getElementById('editIndex').value = index;

    openModal('addPersonModal');
}

function deletePerson(index) {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
        const username = prompt('Digite seu nome de usuário:');
        const password = prompt('Digite sua senha:');

        if (username && password) {
            // Assuming a simple check for demonstration purposes
            if (username === 'admin' && password === 'admin') {
                people.splice(index, 1);
                renderPeopleList();
                alert('Pessoa excluída com sucesso!');
            } else {
                alert('Usuário ou senha incorretos.');
            }
        }
    }
}

function addOrUpdateUnit() {
    const editUnitIndex = document.getElementById('editUnitIndex').value;
    const unitName = document.getElementById('unitName').value;
    const unitCnpj = document.getElementById('unitCnpj').value;

    // Verifica se o CNPJ já existe
    const existingUnitIndex = units.findIndex(unit => unit.cnpj === unitCnpj);
    if (existingUnitIndex !== -1 && existingUnitIndex != editUnitIndex) {
        alert('CNPJ já cadastrado.');
        return;
    }

    if (editUnitIndex) {
        const unit = units[editUnitIndex];
        unit.name = unitName;
        unit.cnpj = unitCnpj;
        alert('Alterado com Sucesso!');
    } else {
        units.push({ name: unitName, cnpj: unitCnpj });
        alert('Salvo com Sucesso!');
    }

    document.getElementById('unitName').value = '';
    document.getElementById('unitCnpj').value = '';
    document.getElementById('editUnitIndex').value = '';

    populateUnitSelect();
    populateUnitList();
}

function deleteUnit(index) {
    if (confirm('Deseja realmente excluir esta unidade?')) {
        openModal('loginModalForDelete', () => {
            if (confirmLoginForDelete()) {
                units.splice(index, 1);
                populateUnitList();
                populateUnitSelect();
                closeModal('loginModalForDelete');
                alert('Unidade excluída com sucesso.');
            }
        });
    }
}

function confirmLoginForDelete() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Verifique as credenciais
    return username === 'admin' && password === 'admin';
}

document.getElementById('loginButtonForDelete').addEventListener('click', function() {
    if (confirmLoginForDelete()) {
        // Lógica para excluir a unidade/setor/pessoa
        alert('Exclusão confirmada.');
    } else {
        alert('Usuário ou senha incorretos.');
    }
    closeModal('loginModalForDelete');
});


function addOrUpdateSector() {
    const editSectorIndex = document.getElementById('editSectorIndex').value;
    const sectorName = document.getElementById('sectorName').value;
    const unitName = document.getElementById('selectUnitForSector').value;

    if (editSectorIndex) {
        const sector = sectors[editSectorIndex];
        sector.name = sectorName;
        sector.unit = unitName;
    } else {
        sectors.push({ name: sectorName, unit: unitName });
    }

    document.getElementById('sectorName').value = '';
    document.getElementById('selectUnitForSector').value = '';
    document.getElementById('editSectorIndex').value = '';

    populateSectorSelect();
    populateSectorList();
}

function populateUnitSelect() {
    const unitSelect = document.getElementById('selectUnitForSector');
    const personUnitSelect = document.getElementById('personUnit');
    unitSelect.innerHTML = '<option value="">Selecione a Unidade</option>';
    personUnitSelect.innerHTML = '<option value="">Selecione a Unidade</option>';

    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.name;
        option.textContent = unit.name;
        unitSelect.appendChild(option);
        personUnitSelect.appendChild(option.cloneNode(true));
    });
}

function populatePersonUnitSelect() {
    const personUnitSelect = document.getElementById('personUnit');
    personUnitSelect.innerHTML = '<option value="">Selecione a Unidade</option>';

    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.name;
        option.textContent = unit.name;
        personUnitSelect.appendChild(option);
    });
}

function populatePersonSectorSelect() {
    const personSectorSelect = document.getElementById('personSector');
    personSectorSelect.innerHTML = '<option value="">Selecione o Setor</option>';

    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        personSectorSelect.appendChild(option);
    });
}


function populateSectorSelect() {
    const sectorSearchSelect = document.getElementById('sectorSearch');
    const personSectorSelect = document.getElementById('personSector');
    sectorSearchSelect.innerHTML = '<option value="">Filtrar por setor</option>';
    personSectorSelect.innerHTML = '<option value="">Selecione o Setor</option>';

    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        sectorSearchSelect.appendChild(option);
        personSectorSelect.appendChild(option.cloneNode(true));
    });
}

function populateUnitList() {
    const unitList = document.getElementById('unitList');
    unitList.innerHTML = '';

    units.forEach((unit, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${unit.name}</td>
            <td>${unit.cnpj}</td>
            <td class="actions">
                <button onclick="editUnit(${index})">Editar</button>
                <button onclick="deleteUnit(${index})">Excluir</button>
            </td>
        `;
        unitList.appendChild(row);
    });
}

function populateSectorList() {
    const sectorTableBody = document.getElementById('sectorTableBody');
    sectorTableBody.innerHTML = '';

    sectors.forEach((sector, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sector.name}</td>
            <td>${sector.unit}</td>
            <td class="actions">
                <button onclick="editSector(${index})">Editar</button>
                <button onclick="deleteSector(${index})">Excluir</button>
            </td>
        `;
        sectorTableBody.appendChild(row);
    });
}

function renderPeopleList() {
    const adminExtensionList = document.getElementById('adminExtensionList');
    adminExtensionList.innerHTML = '';

    people = JSON.parse(localStorage.getItem('people')) || [];

    people.forEach((person, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.unit}</td>
            <td>${person.sector}</td>
            <td>${person.extension}</td>
            <td>${person.email}</td>
            <td>${person.corporatePhone}</td>
            <td class="actions">
                <button onclick="editPerson(${index})">Editar</button>
                <button onclick="deletePerson(${index})">Excluir</button>
            </td>
        `;
        adminExtensionList.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    renderPeopleList();
    populateUnitSelect();
    populateSectorSelect();
    populateUnitList();
    populateSectorList();
});

function filterList() {
    const nameSearch = document.getElementById('nameSearch').value.toLowerCase();
    const sectorSearch = document.getElementById('sectorSearch').value;
    const unitSearch = document.getElementById('unitSearch').value;

    const filteredPeople = people.filter(person => {
        return (
            (person.name.toLowerCase().includes(nameSearch)) &&
            (sectorSearch === '' || person.sector === sectorSearch) &&
            (unitSearch === '' || person.unit === unitSearch)
        );
    });

    renderFilteredPeopleList(filteredPeople);
}

function renderFilteredPeopleList(filteredPeople) {
    const adminExtensionList = document.getElementById('adminExtensionList');
    adminExtensionList.innerHTML = '';

    filteredPeople.forEach((person, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.unit}</td>
            <td>${person.sector}</td>
            <td>${person.extension}</td>
            <td>${person.email}</td>
            <td>${person.corporatePhone}</td>
            <td class="actions">
                <button onclick="editPerson(${index})">Editar</button>
                <button onclick="deletePerson(${index})">Excluir</button>
            </td>
        `;
        adminExtensionList.appendChild(row);
    });
}

function editUnit(index) {
    const unit = units[index];
    document.getElementById('unitName').value = unit.name;
    document.getElementById('unitCnpj').value = unit.cnpj;
    document.getElementById('editUnitIndex').value = index;

    openModal('manageUnitSectorModal');
}

function deleteUnit(index) {
    units.splice(index, 1);
    populateUnitList();
    populateUnitSelect();
}

function editSector(index) {
    const sector = sectors[index];
    document.getElementById('sectorName').value = sector.name;
    document.getElementById('selectUnitForSector').value = sector.unit;
    document.getElementById('editSectorIndex').value = index;

    openModal('manageUnitSectorModal');
}

function deleteSector(index) {
    sectors.splice(index, 1);
    populateSectorList();
    populateSectorSelect();
}

function editPerson(index) {
    const person = people[index];
    document.getElementById('personName').value = person.name;
    document.getElementById('personUnit').value = person.unit;
    document.getElementById('personSector').value = person.sector;
    document.getElementById('personExtension').value = person.extension;
    document.getElementById('personEmail').value = person.email;
    document.getElementById('personCorporatePhone').value = person.corporatePhone;
    document.getElementById('editIndex').value = index;

    openModal('addPersonModal');
}

function deletePerson(index) {
    people.splice(index, 1);
    renderPeopleList();
}

// Mock data for demonstration
let people = [
    { name: 'John Doe', unit: 'Unit 1', sector: 'Sector 1', extension: '1234', email: 'john.doe@example.com', corporatePhone: '555-1234' },
    { name: 'Jane Doe', unit: 'Unit 2', sector: 'Sector 2', extension: '5678', email: 'jane.doe@example.com', corporatePhone: '555-5678' },
];

let units = [
    { name: 'Unit 1', cnpj: '12.345.678/0001-91' },
    { name: 'Unit 2', cnpj: '98.765.432/0001-00' },
];

let sectors = [
    { name: 'Sector 1', unit: 'Unit 1' },
    { name: 'Sector 2', unit: 'Unit 2' },
];

populateUnitSelect();
populateSectorSelect();
populateUnitList();
populateSectorList();
renderPeopleList();

