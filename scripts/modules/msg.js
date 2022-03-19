'use strict';

// Msg(...args)
function msg(...args) {
    console.log(...args);
}



// MsgG(header, ...args)
function msgG(...args) {
    let lastMsgPosition = args.length - 1;
    console.group(args[0]);

    for (let i = 1; i <= lastMsgPosition; i++) {
        console.log(args[i]);
    }

    console.groupEnd();
}



// MsgGV(header, ...args)
function msgGV(...args) {
    if ((args.length - 1) % 2 === 1) {
        let lastMsgPosition = args.length - 1;
        console.group(args[0]);

        for (let i = 1; i < lastMsgPosition; i += 2) {
            console.log(`${args[i]}: ${args[i + 1]}`);
        }

        console.groupEnd();
    }

}



// MsgV(...args)
function msgV(...args) {
    let lastMsgPosition = args.length - 1;
    if (args.length % 2 === 0) {
        for (let i = 0; i < lastMsgPosition; i += 2) {
            console.log(`${args[i]}: ${args[i + 1]}`);
        }
    }

}



export {
    msg,
    msgG,
    msgGV,
    msgV,
};
