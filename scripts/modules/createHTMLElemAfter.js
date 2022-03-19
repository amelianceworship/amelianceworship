'use strict';

function createHTMLElemAfter(parent, elementType, classNames = '', text = '') { // create element
    const elName = document.createElement(elementType);
    elName.classList.add(...classNames);
    elName.innerText = text;
    parent.after(elName);

    return elName;
}

export {
    createHTMLElemAfter,
};
