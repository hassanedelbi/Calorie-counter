// Storage Controller
const StorageCtrl = (function () {
    // Public methods
    return {
        storeItem: function (item) {
            let items;
            // Check if any items in ls
            if (localStorage.getItem('items') === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item);

                // Re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();



// Item Controller #item-ctrl
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure/ State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // ItemCtrl public methods
    return {
        // return data
        getItems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            // create ID
            let ID = 0;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // calories to number
            calories = parseInt(calories);

            // create new item 
            newItem = new Item(ID, name, calories);
            // add to items  array 
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function (id) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updateItem: function (name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function (id) {
            //get all ids 
            ids = data.items.map(function (item) {
                return item.id;
            })
            // get index
            const index = ids.indexOf(id);

            // remove from array 
            data.items.splice(index, 1);

        },

        clearAllItems: function () {
            data.items = [];
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;
            // loop thru items and calc total cal
            data.items.forEach(function (item) {
                total += item.calories;
            });
            // set total calories in data structure
            data.totalCalories = total;
            return data.totalCalories;
        },



        logData: function () {
            return data;
        }
    }

})(); // end ItemCtrl

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // UI public methods
    return {
        // populate Item List
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });
            // insert list item html
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },

        addListItem: function (item) {
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // create li element 
            const li = document.createElement('li');
            // Add Class
            li.className = 'collection-item';
            // Add Id
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>`

            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement
                ('beforeend', li);
        },

        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                // HERE FOR EACH 
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
                }
            });
        },

        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();

        },

        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        },

        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        itemDeleteSubmit: function (e) {
            // get id from item
            const currentItem = ItemCtrl.getCurrentItem();


            // Delete from data structure
            ItemCtrl.deleteItem(currentItem.id);

            // delete from ui
            UICtrl.deleteListItem(currentItem.id);

            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Update local storage
            // StorageCtrl.updateItemStorage(updatedItem);

            UICtrl.clearEditState();
            e.preventDefault();
        },



        getSelectors: function () { return UISelectors; }
    }
})(); // end ItemCtrl

// App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {

    // Load Event Listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener
            ('click', itemAddSubmit);

        // disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false
            }
        });


        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',
            itemEditClick);

        // back button event 
        document.querySelector(UISelectors.backBtn).addEventListener
            ('click', UICtrl.clearEditState);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',
            itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',
            UICtrl.itemDeleteSubmit);

        document.querySelector(UISelectors.clearBtn).addEventListener('click',
            clearAllItemsClick);
    }

    const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item id
            const listId = e.target.parentNode.parentNode.id;
            // split to array 
            const listIdArray = listId.split('-');

            // get the actual id
            const id = parseInt(listIdArray[1]);
            // get item 
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // CLEAR ITEM Event
    const clearAllItemsClick = function () {
        // delete all items from data structure

        ItemCtrl.clearAllItems();
        // remove all from ui 
        UICtrl.removeItems();
        StorageCtrl.clearItemsFromStorage();
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        // StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

    }



    // App Public methods
    return {
        // init function
        init: function () {
            // clear edit state / initial 
            UICtrl.clearEditState();

            // fetch items from data structure
            const items = ItemCtrl.getItems();
            // check if any items 
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }


            // get Total Calories and add to UI
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl); // end AppCtrl


// Intitialze App

AppCtrl.init();