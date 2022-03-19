'use strict';

// >----------------------------------------------------------------<
// >                       IMPORT FROM MODULES                      <
// >----------------------------------------------------------------<

// createHTMLElem.js
function createHTMLElem(parent, elementType, classNames = '', text = '') { // create element
    const elName = document.createElement(elementType);
    elName.classList.add(...classNames);
    elName.innerText = text;
    parent.append(elName);

    return elName;
}

// *----- Resize Menu Height -----
// function changeMenuHeight(params) {
//     const menu = document.querySelector('.menu-list');
//     menu.style.height = window.innerHeight+'px';
//     console.log('size');
// }

// window.addEventListener('resize', changeMenuHeight);





const menu = {};






// >----------------------------------------------------------------<
// >                          FUNCTIONS                             <
// >----------------------------------------------------------------<

menu.list = {};

// ^------------------------ List Menu ------------------------

// menu.list.create(<Menu title>, <list items>, <[actions for item]>, <button element>, <[actions for button]>)

function listCreate(title, list = '', itemActions = [], button = '', buttomActions = []) {

    // *----- remove menu -----
    function removeMenu(timeOut) {
        setTimeout(() => {
            menu.remove(); // remove menu instanse
        }, timeOut);
    }

    // *----- button action -----
    const buttonMenuAction = (menu, buttomActions) => {

        const doAction = (event) => {
            menu.classList.remove('show'); // hide menu with animation

            // hideBlackout(); // hide blackout with aniamtion
            for (const action of buttomActions) {
                action(event);
            }
            removeMenu(300);
            button.removeEventListener('click', doAction);
        };

        button.addEventListener('click', doAction);
        // window.removeEventListener('resize', changeMenuHeight);

    };


    // *----- menu items action -----
    const menuAction = (menuItem, menu, itemActions) => {

        const doAction = (event) => {
           menu.classList.remove('show'); // hide menu with animation

            // hideBlackout(); // hide blackout with aniamtion
            for (const action of itemActions) {
                action(event);
            }
            removeMenu(300);
            // menuItem.removeEventListener('click', doAction);
            // button.removeEventListener('click', doAction);
        };

        menuItem.addEventListener('click', doAction, true);
        // window.removeEventListener('resize', changeMenuHeight);

    };


    // *----- create elements -----

    const zeroBlock = document.querySelector('.zero-block'); // get zero block

    const menu = createHTMLElem(zeroBlock, 'div', ['menu-list']); // create menu block
    // menu.style.height = window.innerHeight+'px';

    const menuContainer = createHTMLElem(menu, 'div', ['menu-list__container']); // create title + items block

    const menuTitle = createHTMLElem(menuContainer, 'h4', ['h4', 'menu-list__title'], title); // add title

    const menuItemsContainer = createHTMLElem(menuContainer, 'div', ['menu-list__items-container', 'scroll']); // create items block


    // *----- add menu items -----
    for (const item of list) {
        const menuItem = createHTMLElem(menuItemsContainer, 'p1', ['p1', 'menu-list__item'], item); // create menu item
        menuAction(menuItem, menu, itemActions); // add action on menu item
        // menuItem.addEventListener('click', action);
    }


    if (button !== '') {
        // const menuButton = createHTMLElem(menu, 'button', ['button', 'menu__button'], button);
        buttonMenuAction(menu, buttomActions); // add action for specital button
    }

    const addMark = (str, position, length) => {
        return  str.slice(0, position) + '<mark>' +
                str.slice(position, position + length) + '</mark>' +
                str.slice(position+length); // ! посмотреть есть ли возможность просто вставить макр в текст по позиции, возможно переобразовать в массив перед этим
    };

    const filterList = (event) => {
        const el = event.target;
        const input = el.value.trim();
        const listOfItems = document.querySelectorAll('.menu-list__item');
        console.log(listOfItems);
        if (input !== '') {
            listOfItems.forEach((item) => {
                const searchStrPosition = item.innerText.search(RegExp(input,'gi'));
                if(searchStrPosition === -1) {
                    item.classList.add('hide');
                    item.innerHTML = item.innerText;
                } else {
                    item.classList.remove('hide');
                    let str = item.innerText;
                    item.innerHTML = addMark(str, searchStrPosition, input.length);
                }
            });
        } else {
            listOfItems.forEach((item) => {
                item.classList.remove('hide');
                item.innerHTML = item.innerText;
            });
        }

    };

    const search = createHTMLElem(menu, 'input', ['search']);
    search.setAttribute( 'type', 'search');
    search.setAttribute('placeholder', 'Пошук');
    search.addEventListener('input', filterList);
    // showBlackout();


    // *----- show menu -----
    setTimeout(() => {
        menu.classList.add('show');
    }, 0);

    // setTimeout(() => {
    //     search.focus();
    // }, 500);
}






// >----------------------------------------------------------------<
// >                             COLECT                             <
// >----------------------------------------------------------------<

menu.list.create = listCreate;






// >----------------------------------------------------------------<
// >                             EXPORT                             <
// >----------------------------------------------------------------<
export {
    menu
};
