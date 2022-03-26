'use strict';

import {createHTMLElem} from './createHTMLElem.js';






// >----------------------------------------------------------------<
// >                              INIT                              <
// >----------------------------------------------------------------<






// >----------------------------------------------------------------<
// >                           FUNCTIONS                            <
// >----------------------------------------------------------------<

class Button {

    constructor(options) {
        this.parent   = options.parent  || document.querySelector('body');
        this.label    = options.label   || 'BUTTON';
        this.style    = options.style   || ['fill', 'big'];
        this.classes  = options.classes || ['button'];
        this.action   = options.action  || function() { console.log(`Click ${options.label}`); };
    }

    create(btnLabel, btnUnicClass, btnAction, btnParent, btnStyle) {
        const label         = btnLabel       || this.label;
        const classes       = btnUnicClass   || this.classes;
        const action        = btnAction      || this.action;
        const parent        = btnParent      || this.parent;
        const buttonStyle   = btnStyle       || this.style;

        let buttonClasses = ['button'];

        if (buttonStyle.includes('big')) { buttonClasses.push('button__big'); }
        else if (buttonStyle.includes('medium')) { buttonClasses.push('button__medium'); }
        else if (buttonStyle.includes('small')) { buttonClasses.push('button__small'); }

        if (buttonStyle.includes('fill')) { buttonClasses.push('button__fill'); }
        else if (buttonStyle.includes('outline')) { buttonClasses.push('button__outline'); }
        else if (buttonStyle.includes('text')) { buttonClasses.push('button__text'); }
        else if (buttonStyle.includes('icon')) { buttonClasses.push('button__icon'); }

        for (let classItem of classes) {
            buttonClasses.push(classItem);
        }

        const button = createHTMLElem(parent, 'button', buttonClasses);

        if (buttonStyle.includes('icon') && (label === '' || label.length !== 1)) {
            const icon = createHTMLElem(button, 'div', ['icon']);
        }

        if (buttonStyle.includes('left') && !buttonStyle.includes('icon')) {
            const iconLeft = createHTMLElem(button, 'div', ['icon', 'icon__left']);
        }

        if (!buttonStyle.includes('icon') || label.length === 1) {
            const text = createHTMLElem(button, 'span', ['label'], label);
        }


        if (buttonStyle.includes('right') && !buttonStyle.includes('icon')) {
            const iconRight = createHTMLElem(button, 'div', ['icon', 'icon__right']);
        }

        button.addEventListener('click' , action);

        return button;
    }

}



// >----------------------------------------------------------------<
// >                             COLECT                             <
// >----------------------------------------------------------------<







// >----------------------------------------------------------------<
// >                             EXPORT                             <
// >----------------------------------------------------------------<
export {
    Button
};
