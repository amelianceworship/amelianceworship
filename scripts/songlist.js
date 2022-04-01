'use strict';
// (.+?/){2}  →           ["
//  "],         →           "],

let tempSonglist = `
assets/md/Бог наш Отець (capo=3).md
assets/md/Боже дякуєм Тобі (capo=3).md
assets/md/Боже мій на Тебе надія моя.md
assets/md/Від загибелі спасла.md
assets/md/Господи — Ти надія у житті (capo=5).md
assets/md/Господи — Ти надія у житті (NEW).md
assets/md/Господи — Ти надія у житті.md
assets/md/Господь є Добрий Пастир (capo=3).md
assets/md/Дай мне гореть Тобой.md
assets/md/Довгий час ми всі чекали (capo=4).md
assets/md/Довгий час ми всі чекали.md
assets/md/ІІІ Назва пісні ТЕСТ.md
assets/md/Ім'я Йому Дивний.md
assets/md/Ісус — Ти мій кращий Друг.md
assets/md/Когда отрада.md
assets/md/Краю мій, рідний мій (capo=2).md
assets/md/Любовь Христа безмірна і палка.md
assets/md/Не умру я, но буду.md
assets/md/О, молитва.md
assets/md/Ой в небі зоря.md
assets/md/Повний благості.md
assets/md/Руки опущены (capo=1).md
assets/md/Скеля мого порятунку.md
assets/md/Создатель всей вселенной.md
assets/md/Твердо я вірю (capo=2).md
assets/md/Тільки з Богом (capo=3).md
assets/md/Ты искупил мир от греха.md
assets/md/Хліб життя (capo=1).md
assets/md/Хори ангелів (capo=5).md
assets/md/Хори ангелів.md
assets/md/Хочу вклонитись Тобі.md
assets/md/Христе Ти живеш в душі моїй.md
assets/md/Цар воскреслий.md
assets/md/Що вину мою простить.md
assets/md/Я вірю в безсмертя душі (capo=4).md
assets/md/Я до Тебе молюся.md
assets/md/Я дякую за плин мого життя.md
assets/md/Я хочу исполнить волю Твою (capo=3).md
assets/md/Я хочу исполнить волю Твою.md
assets/md/Як сум і мука мою душу огорне (capo=1).md
`;

let songlist = [];
songlist = tempSonglist.trim().split('\n').map((item) => {
    item = item.replace(/^(.+?\/){2}/, '');
    item = item.replace(/\..+/, '');
    return item;
});

// const songlist = [

// ];

export {
    songlist,
};
