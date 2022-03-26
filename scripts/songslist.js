'use strict';;
import {
    msg as Msg,
    createHTMLElem,
    Button
} from './modules/asm.js';
// import * as asm from 'ASM_js-unctions.js';


// const sheetID = '1VLFuJzPUtRJ6yQUMJbw_QCmWwrd5xtu2wUJAj5qkR3A'; // Amelianve worship song list
// const sheetTitle = 'Ameliance Worship API';

const sheetID = '16wsDcFtQ7J1nYrlSkEB8KgLp_XpyCdwH-SIi0fuqapc'; // woody-songlist
const sheetTitle = '✅Загальний Список';
const sheetRange = '';
const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tqx=out:json&sheet=' + sheetTitle + '&range=' + sheetRange;
// const url = 'https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?tqx=out:json&sheet=' + sheetTitle + '&range=' + sheetRange;
// const url = 'https://docs.google.com/spreadsheets/feeds/list/' + sheetID + '/od6/public/values?alt=json'
// const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetID + '/values' + sheetTitle + '?alt=json';
// const url = 'https://sheets.googleapis.com/v4/spreadsheets/1VLFuJzPUtRJ6yQUMJbw_QCmWwrd5xtu2wUJAj5qkR3A/values/Ameliance Worship API/';

// https://docs.google.com/spreadsheets/d/1R7BRDqcHCRsU1_IIMfyArQ4qjosn64WA5gSO1_3Rv6I/edit#gid=0


async function getGoogleSheetsData(url) {

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

    createPage(data);

    localStorage.setItem('songList', JSON.stringify(data)); // write
    //     let receivedSettings = JSON.parse(localStorage.getItem('settings')); // read
    //     GS = {...GS, ...receivedSettings};
}




// >----------------------------------------------------------------<
// >                                                              <
// >----------------------------------------------------------------<

const createPage = (data) => {
    const listName = document.querySelector('.list-name');
    const button = new Button({
        style: ['fill', 'big'],
    });

    const alertTryLater = () => {
        alert('Ця функція знаходиться в розробці, спробуйте пізніше');
    };
    button.create('◄', 'list-name__left', alertTryLater, listName);
    createHTMLElem(listName, 'h4', ['h4', 'list__song-item'], 'Загальний Список');
    button.create('►', 'list-name__right', alertTryLater, listName);

    // <p class="p1 list-name__left">←</p>
    // <h4 class="h4 list-name__title">Загальний Список</h4>
    // <p class="p1 list-name__right">→</p>
    // create(btnLabel, btnUnicClass, btnAction, btnParent, btnStyle)
    const headerLetters = data[0];
    const songs = data[1];

    const list = document.querySelector('.main .container');
    const listLetters = createHTMLElem(list, 'div', ['list__letters']);
    const listTitles = createHTMLElem(list, 'div', ['list__titles']);

    // const listLetters = document.querySelector('.list-letters');
    // const listLetters = createHTMLElem(list, 'div', ['list-letters']);

    for (const letter of headerLetters) {
        // let songItem = createHTMLElem(listLetters, 'div', ['list__song-item']);

        // createHTMLElem(listLetters, 'pre', ['p1', 'list-letters__letter'], letter);
        // const char  = letter || ' ';
        const preElem = createHTMLElem(listLetters, 'pre', ['pre']);
        createHTMLElem(preElem, 'p', ['p1', 'list-letters__letter'], letter + '\t');
    }

    for (const song of songs) {
        createHTMLElem(listTitles, 'p', ['p1', 'list__song-title'], song);
    }

};




// >----------------------------------------------------------------<
// >                                                              <
// >----------------------------------------------------------------<

getGoogleSheetsData(url);
