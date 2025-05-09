const uri = '/Shoes';
let shoes = [];

const getItems = () => {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

const addItem = () => {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isElegant: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to get items.', error));
}

const deleteItem = (id) => {
    fetch(`${uri}/${id}`, {
            method: 'DELETE'
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

const displayEditForm = (id) => {
    const item = shoes.find(item => item.Id === id);

    document.getElementById('edit-name').value = item.Description;
    document.getElementById('edit-id').value = item.Id;
    document.getElementById('edit-isElegant').checked = item.isElegant;
    document.getElementById('editForm').style.display = 'block';
}

const updateItem = () => {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        Id: parseInt(itemId, 10),
        isElegant: document.getElementById('edit-isElegant').checked,
        Description: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

const closeInput = () => {
    document.getElementById('editForm').style.display = 'none';
}

const _displayCount = (itemCount) => {
    const name = (itemCount === 1) ? 'shoes' : 'shoes kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

const _displayItems = (data) => {
    const tBody = document.getElementById('shoes');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isElegantCheckbox = document.createElement('input');
        isElegantCheckbox.type = 'checkbox';
        isElegantCheckbox.disabled = true;
        isElegantCheckbox.checked = item.isElegant;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.Id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.Id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isElegantCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.Description);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    shoes = data;
}