// Exemplo de dados de pessoas. No cenário real, isso pode vir de um backend ou de uma variável global.
const people = [
    { name: 'João', unit: 'Unidade 1', sector: 'Setor A', extension: '1234', email: 'joao@example.com', corporatePhone: '9999-9999' },
    { name: 'Maria', unit: 'Unidade 2', sector: 'Setor B', extension: '5678', email: 'maria@example.com', corporatePhone: '8888-8888' },
    // Adicione mais pessoas conforme necessário
];

const units = [
    { name: 'Unidade 1' },
    { name: 'Unidade 2' },
    // Adicione mais unidades conforme necessário
];

const sectors = [
    { name: 'Setor A' },
    { name: 'Setor B' },
    // Adicione mais setores conforme necessário
];

function populateFilters() {
    const unitSelect = document.getElementById('filterUnit');
    const sectorSelect = document.getElementById('filterSector');

    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.name;
        option.textContent = unit.name;
        unitSelect.appendChild(option);
    });

    sectors.forEach(sector => {
        const option = document.createElement('option');
        option.value = sector.name;
        option.textContent = sector.name;
        sectorSelect.appendChild(option);
    });
}

function renderPeopleList(filteredPeople) {
    const tableBody = document.getElementById('peopleTable').querySelector('tbody');
    tableBody.innerHTML = '';

    filteredPeople.forEach(person => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.unit}</td>
            <td>${person.sector}</td>
            <td>${person.extension}</td>
            <td>${person.email}</td>
            <td>${person.corporatePhone}</td>
        `;
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const filterName = document.getElementById('filterName').value.toLowerCase();
    const filterUnit = document.getElementById('filterUnit').value;
    const filterSector = document.getElementById('filterSector').value;

    const filteredPeople = people.filter(person => {
        return (person.name.toLowerCase().includes(filterName) || filterName === '') &&
               (person.unit.includes(filterUnit) || filterUnit === '') &&
               (person.sector.includes(filterSector) || filterSector === '');
    });

    renderPeopleList(filteredPeople);
}

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    renderPeopleList(people);
});

document.addEventListener('DOMContentLoaded', function() {
    const storedPeople = JSON.parse(localStorage.getItem('people')) || [];
    if (storedPeople.length > 0) {
        people.length = 0;
        people.push(...storedPeople);
    }
    populateFilters();
    renderPeopleList(people); // Render the initial full list of people
});

