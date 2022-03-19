'use strict';

function createHTMLElemBefore(parent, elementType, classNames = '', text = '') { // create element
    const elName = document.createElement(elementType);
    elName.classList.add(...classNames);
    elName.innerText = text;
    parent.before(elName);

    return elName;
}

export {
    createHTMLElemBefore,
};
