'use strict';
// >----------------------------------------------------------------<
// >                            MODULES                             <
// >----------------------------------------------------------------<

import {
    msg as Msg, msgG as MsgG, msgGV as MsgGV, msgV as MsgV,
    sortAB,
    menu,
    popup,
    createHTMLElem,
    createHTMLElemPrep,
    Button
} from './modules/asm.js';

import * as asm from './modules/asm.js';

import * as others from './others.js';
import {songlist as songList} from './songlist.js';


// ^------------------------ Prepearing ------------------------
songList.sort();


// >----------------------------------------------------------------<
// >                           FUNCTIONS                            <
// >----------------------------------------------------------------<

// window.addEventListener('resize', () => {
//     const popupСontainer      = document.querySelector('.popup-container');
//     let intViewportHeight = window.innerHeight;
//     const search      = document.querySelector('.search');
//     search.setAttribute('placeholder', intViewportHeight);
//     const menuList      = document.querySelector('.menu-list');
//     menuList.style.height = intViewportHeight+'px';

// });

// function changeMenuHeight(params) {
//     const bodyContainer = document.querySelector('.body__container');
//     bodyContainer.style.height = window.innerHeight+'px';
//     console.log('size');
// }

// window.addEventListener('resize', changeMenuHeight);




// >----------------------------------------------------------------<
// >                            SETTINGS                            <
// >----------------------------------------------------------------<

const button = new Button({
    style: ['fill', 'big'],
});
const buttonIcon = new Button({
    style: ['icon', 'big'],
});


// ^------------------------ init ------------------------

const header    = document.querySelector('.header .container');
const main      = document.querySelector('.main .container');
const footer    = document.querySelector('.footer .container');



// ^------------------------ settings ------------------------
// Msg(songList);
let STGS = {};

const loadSettings = () => {
    STGS = {
        transpose: 0,
        songPosition: 0,
        chord: '',
    };
    const pos = STGS.songPosition;
    const url = getUrl(songList[pos]);
    getTextDataFromFile(url);
};

window.addEventListener('load', loadSettings);

const resetAllSettings = () => {

    const resetSettings = {
        transpose: 0,
        songPosition: 0,
        chord: '',
    };

    STGS = {...STGS, ...resetSettings};

    resetTranspose();

    // localStorage.setItem('settings', JSON.stringify(STGS)); // write
};




// >----------------------------------------------------------------<
// >                              BODY                              <
// >----------------------------------------------------------------<

// ^------------------------ Get Url ------------------------

const getUrl = (songName) => `./assets/md/${songName}.md`;


// ^------------------------ Get Text Data From File ------------------------

async function getTextDataFromFile(url) {
    let response, textData;
    try {
        response = await fetch(url);
        textData = await response.text();
        textData = textData.replaceAll('\r\n', '\n'); // replace every \r\n with \n
    } catch(e) {
        Msg(`asm: ${e}`);
    }
    generatePage(textData);
}


const removeSong = () => {
    const songName  = document.querySelectorAll('.song-name');
    const song      = document.querySelectorAll('.song');
    const info      = document.querySelectorAll('.song-info');

    const removeElem = (elements) => {
        for (const i of elements) {
            i.remove();
        }
    };

    removeElem(songName);
    removeElem(song);
    removeElem(info);
};
// ^------------------------ Generate Page ------------------------

const generatePage = (textData) => {

    let textLines = textData.split('\n');

    let isHeader = false;
    let chords = '';
    let comments = '';
    let structure = '';
    let filePart = 'header';
    const info = createHTMLElemPrep(footer, 'div', ['song-info']);
    const song = createHTMLElem(main, 'div', ['song']);
    for (let line of textLines) {

        // *----- skip ``` markdown -----
        if (line.startsWith('```')) {
            continue;
        }
        if (line === '' && filePart !== 'chords') {
            // Msg(line)
            continue;
        }

        // *----- add header -----
        if (!isHeader) {
            const songName = createHTMLElem(header, 'h4', ['song-name', 'h4']);
            songName.innerText = line;
            isHeader = true;
            continue;
        }

        // *----- creaate info block in footer -----


        // *----- add capo -----
        if (isHeader && filePart === 'header') {
            const capo = createHTMLElem(info, 'div', ['song-info__capo']);

            const iconCapo = buttonIcon.create(capo, ['icon__capo']);

            iconCapo.style.webkitMaskImage = 'url("./assets/svg/capo.svg")';
            iconCapo.style.maskImage = 'url("./assets/svg/capo.svg")';

            const songCapo = createHTMLElem(capo, 'p', ['song-info__text', 'p1']);
            const lineArr = line.split('=');
            const capoPos = lineArr[1].substring(0, 1);
            songCapo.innerText = capoPos;
            filePart = 'capo';
            continue;
        }

        // *----- detect start chords pars -----
        if (line.startsWith('--') && filePart === 'capo') {
            filePart = 'chords';
            continue;
        }

        // *----- add chords part -----
        else if (line.startsWith('--') && filePart === 'chords') {
            const songChords    = createHTMLElem(song, 'p', ['song-chords', 'p1', 'scroll']);
            const pre           = createHTMLElem(songChords, 'pre', ['pre__chords']);
            // songChords.innerText = chords;
            STGS.chords = chords;
            setChords(0);
            filePart = 'structure';
            continue;
        }
        // *----- add structure -----
        else if ((line.startsWith('--')) && filePart === 'structure') {
            const structureElem         = createHTMLElemPrep(info, 'div', ['song-info__structure']);
            // const pre               = createHTMLElem(structure, 'pre');
            const songCStructure    = createHTMLElem(structureElem, 'p', ['song-info__text', 'p1']);
            songCStructure.innerText = structure;
            filePart = 'comments';
            continue;
        }
        // *----- add comments -----
        else if (line.startsWith('--') && filePart === 'comments') {
            const songComments    = createHTMLElem(song, 'p', ['song-comments', 'p2', 'scroll']);
            const pre           = createHTMLElem(songComments, 'pre', ['pre__comments']);
            pre.innerText = comments;
            filePart = 'end';
            continue;
        }

        // *----- colect chords line -----
        if (filePart === 'chords') {
            if (chords === '' && line === '') {
                continue;
            }
            chords += line + '\n';
            continue;
        }

        // *----- colect chords structure -----
        if (filePart === 'structure') {
            structure += line + '\n';
            continue;
        }

        // *----- colect comments line -----
        if (filePart === 'comments') {
            comments += line + '\n';
            // Msg(comments);
            continue;
        }

        // // *----- add structure -----
        // if (filePart === 'structure' && line !== '') {
        //     const structure         = createHTMLElemPrep(info, 'div', ['song-info__structure']);
        //     // const pre               = createHTMLElem(structure, 'pre');
        //     const songCStructure    = createHTMLElem(structure, 'p', ['song-info__text', 'p1']);
        //     songCStructure.innerText = line;
        //     filePart = 'comments';
        // }


        // // *----- add comments -----
        // if (filePart === 'comments' && line !== '') {
        //     const structure         = createHTMLElemPrep(info, 'div', ['song-info__structure']);
        //     // const pre               = createHTMLElem(structure, 'pre');
        //     const songCStructure    = createHTMLElem(structure, 'p', ['song-info__text', 'p1']);
        //     songCStructure.innerText = line;
        // }



    }
};






// >----------------------------------------------------------------<
// >                          TRANSPOSE                             <
// >----------------------------------------------------------------<

// ^------------------------ Transpose Chords ------------------------

const transposeKey = (chords, transpose) => {
    const linesFromChords = chords.split('\n');
    const transposedChordsArray = [];
    const transposedChords = [];

    // *----- transpose chords -----
    for (let line of linesFromChords) {
        let chordsFromLine = line.split(' ');

        let transposedLine = chordsFromLine.map( (chord) => {
            return others.transposeChord(chord, transpose);
        });
        transposedChordsArray.push(transposedLine);
    }

    // *----- get max length of chord -----
    let maxLength = 0;
    let maxLengthChord = '';
    let maxLengthSpace = '';
    for (let line of transposedChordsArray) {
        let max = line.reduce((value, item) => {
            if (item.length > value) {
                maxLengthChord = item;
                return item.length;
            } else {
                return value;
            }
        }, 0);
        if (max > maxLength) {
            maxLength = max;
            const joinedLine = line.join(' ');
            const regExp = new RegExp(`${maxLengthChord}\\s+`, 'g');
            maxLengthSpace = String(joinedLine.match(regExp)).length;
        }
    }


    const preChords = document.querySelector('.pre__chords');
    // const tabSize = maxLength+1;


    // preChords.style.tabSize = tabSize;

    let tabSize = maxLength;
    // Msg(maxLengthSpace % tabSize)
    // let abs = -1;
    // while (abs !== 0 ) {
    //     abs = maxLengthSpace % tabSize === 0 ? 0 : maxLengthSpace % tabSize;
    //     tabSize--;
    // }

    while (maxLengthSpace % tabSize !== 0) {
        tabSize--;
    }
    // Msg(tabSize)
    preChords.style.tabSize = tabSize;

    for (let line of transposedChordsArray) {
        // let chordLength = 0;
        // pre__chords

        // Msg(line)
        line = line.join(' ');
        let tempLine = '';
        let lastValue;
        // let separator = '';
        let spaceCount = 0;
        let chordsArr;
        let spacesArr;

        Msg(tabSize)
        if (line.startsWith('-')){
            tempLine = line;
        } else if (line) {

            if (line.startsWith(' ')) {
                chordsArr = ['', ...line.match(/\S+|[^\b\s]|\n/g)];
            } else {
                chordsArr = line.match(/\S+|[^\b\s]|\n/g);

            }
            spacesArr = line.match(/[^\n\S]\s*/g);
            // Msg(spacesArr)

            // Msg(chordsArr)
            // Msg(spacesArr)

            for ( let i = 0; i < chordsArr.length; i++) {
                const chord = chordsArr[i];
                let space;
                if (spacesArr) {
                    space = spacesArr[i];
                } else {
                    space = '';
                }

                const chordAndSpace = chord + space;
                const chordAndSpacLength = chordAndSpace.length;
                const minusTabCont = Math.trunc(chord.length / tabSize);

                // Msg(chordAndSpacLength, tabSize, chordAndSpace)
                // Msg(space.length)
                let tabCont;
                if (space !== '') {
                    tabCont = Math.trunc(chordAndSpacLength / tabSize);
                    // Msg(chordAndSpacLength % tabSize)
                    tabCont = (chordAndSpacLength % tabSize) > 0 ? tabCont+1 : tabCont;
                    tabCont = tabCont - minusTabCont;
                    // Msg(tabCont)
                } else {
                    // Msg('zzzzzzzzzzzzzzz')
                    tabCont = 0;
                }

                const tabs = '\t'.repeat(tabCont);

                const element = chord + tabs;
                tempLine += element;
                // Msg(element.length)

                // Msg(value)
                // let element = '';

                // if (value === ' ') {
                //     spaceCount++;
                // } else {
                //     // Msg(spaceCount, value);
                //     // *----- add spaces -----
                //     // if (spaceCount < 3) {
                //     //     separator = ' '.repeat(spaceCount);
                //     //     element = separator + value;
                //     //     spaceCount = 0;
                //     // } else
                //     if (spaceCount > 1) {
                //         spaceCount--;
                //         let tabCont = Math.trunc(spaceCount / tabSize);
                //         // Msg(tabCont, spaceCount % tabSize)
                //         tabCont = (spaceCount % tabSize) > 0 ? tabCont+1 : tabCont;
                //         // Msg(tabCont);
                //         let tabs = '\t'.repeat(tabCont);
                //         // separator = ' '.repeat(spaceCount) + tab;
                //         element = tabs + value;
                //         spaceCount = 0;
                //     } else if (spaceCount > 0) {
                //         // Msg('0')
                //             element = '\t' + value;
                //             spaceCount = 0;
                //     } else {
                //         // Msg('none', value)
                //         element = value;
                //         // separator = '';
                //     }

                // }

                // tempLine += element;
                // // Msg(tempLine)

                // lastValue = value;
            }
        } else {
            tempLine = '';
        }
        // Msg(tempLine)
        transposedChords.push(tempLine.trimEnd());
    }
    return transposedChords.join('\n');
};

// ^------------------------ Set Chords ------------------------
const setChords = (transpose) => {

    // const songChords    = createHTMLElem(pre, 'p', ['song-chords', 'p1']);
    // songChords.innerText = chords;
        const songChords        = document.querySelector('.pre__chords');
        const transposeNumber   = document.querySelector('.transpose__number');
        let chords = STGS.chords;
        chords = transposeKey(chords, transpose);
        songChords.innerText = chords;
        STGS.transpose = transpose;
        transposeNumber.innerText = STGS.transpose;
};

// ^------------------------ Set Transpose Key Down ------------------------

const setTransposeKeyDown = () => {
    if (STGS.transpose > -12) {
        const transpose = STGS.transpose - 1;
        setChords(transpose);
    }
};



// ^------------------------ Set Transpose Key Up ------------------------
// const transposeUp = document.querySelector('.transpose__up');

const setTransposeKeyUp = () => {
    if (STGS.transpose < 12) {
        const transpose = STGS.transpose + 1;
        setChords(transpose);
    }
};


const resetTranspose = () => {
    const transposeNumber = document.querySelector('.transpose__number');
    transposeNumber.innerText = STGS.transpose;
};






// >----------------------------------------------------------------<
// >                           BUILD HTML                           <
// >----------------------------------------------------------------<

const controls  = createHTMLElem(footer, 'div', ['controls']);

// ^------------------------ Fullscreen Icon ------------------------

const showFullscreen = () => {

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        iconSettings.style.webkitMaskImage = 'url("./assets/svg/minimize.svg")';
        iconSettings.style.maskImage = 'url("./assets/svg/minimize.svg")';
    } else {
        if (document.exitFullscreen) {
        document.exitFullscreen();
        iconSettings.style.webkitMaskImage = 'url("./assets/svg/maximize.svg")';
        iconSettings.style.maskImage = 'url("./assets/svg/maximize.svg")';
      }
    }
};

const iconSettings = buttonIcon.create(controls, ['icon__settings'], '--', showFullscreen );
iconSettings.style.webkitMaskImage = 'url("./assets/svg/maximize.svg")';
iconSettings.style.maskImage = 'url("./assets/svg/maximize.svg")';





// ^------------------------ Transpose ------------------------

const transpose = createHTMLElem(controls, 'div', ['transpose']);

// const transposeDown = createHTMLElem(transpose, 'button', ['button', 'transpose__down'], '-'); // button -
button.create(transpose, ['transpose__down'], '-', setTransposeKeyDown, ['big', 'fill']); //! why do not work without one of style parameter



const transposeNumber = createHTMLElem(transpose, 'p', ['p1', 'transpose__number'], '0'); // display number
transposeNumber.addEventListener('click', () => {
    popup.create('Скинути?', 'Ви хочете скинути транспонування аккордів? (поки не працює)', 'Так/Відміна');
});


button.create(transpose, ['transpose__up'], '+', setTransposeKeyUp,  ['big', 'fill']); //! why do not work without one of style parameter



// ^------------------------ List Icon ------------------------

const showSongsList = () => {
    const menuList = document.querySelector('.menu-list');
    if (!menuList) {
        iconList.style.webkitMaskImage = 'url("./assets/svg/close.svg")';
        iconList.style.maskImage = 'url("./assets/svg/close.svg")';
        iconList.removeEventListener('click', showSongsList);
        asm.menu.list.create('Список пісень', songList, [resetAllSettings, openSong, hideSongList], iconList, [hideSongList]);
    }
};

const hideSongList = () => {
    iconList.style.webkitMaskImage = 'url("./assets/svg/list.svg")';
    iconList.style.maskImage = 'url("./assets/svg/list.svg")';
    iconList.addEventListener('click', showSongsList);
};

// const iconList = createHTMLElem(controls, 'button', ['icon', 'icon__list']);

const iconList = buttonIcon.create(controls, 'transpose__down', '', showSongsList);

iconList.style.webkitMaskImage = 'url("./assets/svg/list.svg")';
iconList.style.maskImage = 'url("./assets/svg/list.svg")';
iconList.style.zIndex = 'var(--z-index-5)';



// ^------------------------ Songlist Menu ------------------------

// const showSonglistMenu = () => {

// };







// >----------------------------------------------------------------<
// >                          SONG LIST                             <
// >----------------------------------------------------------------<

// ^------------------------ Open Song ------------------------

const openSong = (event) => {
    const el = event.target;
    const songName = el.innerText;
    const url = getUrl(songName);
    removeSong();
    getTextDataFromFile(url);
};

// ^------------------------ Generate Song List ------------------------

// const generateSongList = (songList) => {
//     const listItems = createHTMLElem(footer, 'div', ['list-items']);
//     for (const songName of songList) {
//         const item = createHTMLElem(listItems, 'p', ['p1', 'list-item'], songName);
//         item.addEventListener('click', openSong);
//     }
// };

// generateSongList(songList);

// asm.menu.list.create('Song List', songList, openSong);
