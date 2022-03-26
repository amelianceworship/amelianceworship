'use strict';
import {
    msg as Msg,
    createHTMLElem,
    Button
} from './modules/asm.js';
// import * as asm from 'ASM_js-unctions.js';


// const sheetID = '1VLFuJzPUtRJ6yQUMJbw_QCmWwrd5xtu2wUJAj5qkR3A'; // Amelianve worship song list
// const sheetTitle = 'Ameliance Worship API';

const sheetID = '16wsDcFtQ7J1nYrlSkEB8KgLp_XpyCdwH-SIi0fuqapc'; // woody-songlist
const sheetTitle = '✅ Загальний Список';
const sheetTitles = [
    '✅ Загальний Список',
    '⏳ Вивчити/Зробити',
    '🌠 Різдво',
    '🙌🏻 Пасха',
    '♻️ Відкласти на час',
];
const sheetRange = '';
const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tqx=out:json&sheet=' + sheetTitle + '&range=' + sheetRange;
// const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tqx=out:json&sheet=' + sheetTitle + '&range=' + sheetRange;
// const url = 'https://docs.google.com/spreadsheets/feeds/list/' + sheetID + '/od6/public/values?alt=json'
// const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '/values' + sheetTitle + '?alt=json';
// const url = 'https://sheets.googleapis.com/v4/spreadsheets/1VLFuJzPUtRJ6yQUMJbw_QCmWwrd5xtu2wUJAj5qkR3A/values/Ameliance Worship API/';

// https://docs.google.com/spreadsheets/d/1R7BRDqcHCRsU1_IIMfyArQ4qjosn64WA5gSO1_3Rv6I/edit#gid=0


async function getGoogleSheetsData(sheetID, sheetTitle, sheetRange) {
    const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tqx=out:json&sheet=' + sheetTitle + '&range=' + sheetRange;
    const res = await fetch(url);
    const textData = await res.text();

    const dataJson = JSON.parse(textData.substr(47).slice(0, -2));

    // *----- Get data from bit table with auto headers detected -----
    function getTableWsLabels(data) {
        const dataObj = {};

        for (let i = 0; i < data.table.cols.length; i++) {
            let col = data.table.cols[i];
            let rowDate = [];

            for (let j = 0; j < data.table.rows.length; j++) {
                let row = data.table.rows[j];
                let value = '';
                if (row.c[i]) {
                    if (row.c[i].v) {
                        value = row.c[i].v;
                    }
                }
                rowDate[j] = value;
            }
            dataObj[col.label] = rowDate;
        }
        return dataObj;
    }

    // *----- Get data from simpla table when first row is header -----
    function getTableOnlyRowsWithHeaders(data) {
        const dataObj = {};
        const table = data.table;
        const maxLengthOfColumn = table.rows[0].c.length; // TODO: get max
        for (let i = 0; i < maxLengthOfColumn; i++) {
            let colDate = [];
            for (let j = 1; j < table.rows.length; j++) {
                if (table.rows[j].c[i]) {
                    colDate[j-1] = table.rows[j].c[i].v ?? '';
                } else {
                    colDate[j] = '';
                }
            }
            dataObj[table.rows[0].c[i].v] = colDate;
        }

        return dataObj;
    }

    // *----- Get data from simpla table with no headers . return arrays-----
    function getTableOnlyRows(data) {
        const dataArr = [];
        const table = data.table;
        const maxLengthOfColumn = table.rows[0].c.length; // TODO: get max
        for (let i = 0; i < maxLengthOfColumn; i++) {
            let colDate = [];
            for (let j = 0; j < table.rows.length; j++) {
                if (table.rows[j].c[i]) {
                    colDate[j] = table.rows[j].c[i].v ?? '';
                } else {
                    colDate[j] = '';
                }
            }
            dataArr[i] = colDate;
        }

        return dataArr;
    }

    const data = getTableOnlyRows(dataJson);

    createPage(data, sheetTitle);

    localStorage.setItem('songList', JSON.stringify(data)); // write
    //     let receivedSettings = JSON.parse(localStorage.getItem('settings')); // read
    //     GS = {...GS, ...receivedSettings};
}




// >----------------------------------------------------------------<
// >                                                              <
// >----------------------------------------------------------------<

const createPage = (data, sheetTitle) => {
    Msg(data)
    const main = document.querySelector('.main .container');
    const listTest = document.querySelector('.list');
    const listSheetTitle = document.querySelector('.list__sheet-title');
    const listNameLeft = document.querySelector('.list-name__left');
    const listNameRight = document.querySelector('.list-name__right');
    if (listTest) listTest.remove();
    if (listSheetTitle) listSheetTitle.remove();
    if (listNameLeft) listNameLeft.remove();
    if (listNameRight) listNameRight.remove();

    const list = createHTMLElem(main, 'div', ['list']);


    const listName = document.querySelector('.list-name');
    const button = new Button({
        style: ['icon', 'big'],
    });

    const alertTryLater = () => {
        alert('Сорі, ще не робить, спробуйте пізніше');
    };


    button.create(listName, ['list-name__left'], '◄', selectPrevList);
    createHTMLElem(listName, 'h1', ['h1', 'list__sheet-title'], sheetTitle);
    button.create(listName, ['list-name__right'], '►', selectNextList);

    const songs = data[data.length-1];


    let lastLetter = '';
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        if (lastLetter !== song[0]) {
            createHTMLElem(list, 'h3', ['h3', 'list-letters__letter'], song[0]);
            lastLetter = song[0];
        }

        createHTMLElem(list, 'p', ['p1', 'list__song-title'], song);
    }

};

const selectPrevList = () => {
    const sheetID = '16wsDcFtQ7J1nYrlSkEB8KgLp_XpyCdwH-SIi0fuqapc'; // woody-songlist
    const sheetRange = '';
    const sheetTitles = [
        '✅ Загальний Список',
        '⏳ Вивчити/Зробити',
        '🌠 Різдво',
        '🙌🏻 Пасха',
        '♻️ Відкласти на час'
    ];
    const listSheetTitle = document.querySelector('.list__sheet-title');
    const title =  listSheetTitle.innerText;
    const currIndex = sheetTitles.indexOf(title);
    let index = currIndex-1;
    if (index < 0) index = sheetTitles.length - 1;


    getGoogleSheetsData(sheetID, sheetTitles[index], sheetRange);
};
const selectNextList = () => {
    const sheetID = '16wsDcFtQ7J1nYrlSkEB8KgLp_XpyCdwH-SIi0fuqapc'; // woody-songlist
    const sheetRange = '';
    const sheetTitles = [
        '✅Загальний Список',
        '⏳Вивчити/Зробити',
        '🌠Різдво',
        '🙌🏻Пасха',
        '♻️Відкласти на час'
    ];
    const listSheetTitle = document.querySelector('.list__sheet-title');
    const title =  listSheetTitle.innerText;
    const currIndex = sheetTitles.indexOf(title);
    let index = currIndex+1;
    if (index > sheetTitles.length - 1) index = 0;


    getGoogleSheetsData(sheetID, sheetTitles[index], sheetRange);
};



// >----------------------------------------------------------------<
// >                                                              <
// >----------------------------------------------------------------<

getGoogleSheetsData(sheetID, sheetTitle, sheetRange);
