'use strict';

// >----------------------------------------------------------------<
// >                       IMPORT FROM MODULES                      <
// >----------------------------------------------------------------<

//createHTMLElem.js
function createHTMLElem(parent, elementType, classNames = '', text = '') { // create element
    const elName = document.createElement(elementType);
    elName.classList.add(...classNames);
    elName.innerText = text;
    parent.append(elName);

    return elName;
}

const popup = {};






// >----------------------------------------------------------------<
// >                          FUNCTIONS                             <
// >----------------------------------------------------------------<

function create(title, text, button = '', action = () => {}) {

    function closePopup(element, popupContainer, popup, action) {
        element.addEventListener('click', () => {
            popup.classList.remove('show'); // hide popup with animation

            // hideBlackout(); // hide blackout with aniamtion
            action();
            setTimeout(() => {
                popupContainer.remove(); // remove popup
            }, 300);
        });
    }

    const zeroBlock = document.querySelector('.zero-block');

    const popupContainer = createHTMLElem(zeroBlock, 'div', ['popup-container']);

    const popup = createHTMLElem(popupContainer, 'div', ['popup']);

    const popupTitle = createHTMLElem(popup, 'h4', ['h4', 'popup__title'], title);

    const popuptext = createHTMLElem(popup, 'p1', ['p1', 'popup__text'], text);

    if (button !== '') {
        const popupButton = createHTMLElem(popup, 'button', ['button', 'popup__button'], button);
        closePopup(popupButton, popupContainer, popup, action);
    }

    // showBlackout();
    setTimeout(() => {
        popup.classList.add('show');
    }, 0);


}






// >----------------------------------------------------------------<
// >                             COLECT                             <
// >----------------------------------------------------------------<

popup.create = create;






// >----------------------------------------------------------------<
// >                             EXPORT                             <
// >----------------------------------------------------------------<
export {
    popup
};
