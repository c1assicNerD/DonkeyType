if (!localStorage.getItem("theme")) {
    document.documentElement.className = 'light';
    localStorage.setItem("theme", "light");
}
else {
    let theme = localStorage.getItem("theme");
    document.documentElement.className = theme;
}
const str = `the of to and a in is it you that he was for on are with as I his they be at one have this from or had by not word but what some we can out other were all there when up use your how said an each she which do their time if will way about many then them write would like so these her long make thing see him two has look more day could go come did number sound no most people my over know water than call first who may down side been now find any new work part take get place made live where after back little only round man year came show every good me give our under name very through just form sentence great think say help low line differ turn cause much mean before move right boy old too same tell does set three want air well also play small end put home read hand port large spell add even land here must big high such follow act why ask men change went light kind off need house picture try us again animal point mother world near build self earth father head stand own page should country found answer school grow study still learn plant cover food sun four between state keep eye never last let thought city tree cross farm hard start might story saw far sea draw left late run don't while press close night real life few north open seem together next white children begin got walk example ease paper`;
const header = document.querySelector('header');
const icon = document.querySelector('.icon > a >div');
const modes = document.querySelector('.modes');
const typeArea = document.querySelector(".type-area");
const textchild = document.createElement('div');
const retry = document.querySelector('.retry>button')
const timer = document.querySelector('.timer span');
const wpm = document.createElement('div');
const button = document.querySelector(".button");
const choices = document.querySelector(".choices")
const favDialog = document.querySelector('#favDialog');
const xValues = [];
const yValues = [];


let rememberChoice;
let quoteFlag = false;
//get the css variable
let maxWordsInitialized = false;

let wpm_obj = {
    correctCharacters: 0,
    wrongCharacters: 0,
    wpm_array: [],
    wordCount: 0,
    incorrectTyped: 0,
}
let headerInvisible = false;
let clear;
let handlerInitialized = false;
let flag = false;
let disp_str = ""
let array = str.split(" ");
let test_words = []
let prevY = ""
let currY = ""
let flip = false;
let scrolll = true;
let string_pointer = 0;
let user_str = ""
let hook = {
    divhook: 1,
    spanhook: 1,
}

let state = {
    key: "",
    curr_div: "",

}
let result = 0;
let word_init = false;
let msStart = 0;
let msEnd = 0;
let max = 0;
let time = 0;
let wrong = 0;
let tabflag = true;
let counter = 30;
let accuracy;
let prevWordCount = 0;
let maxWords = 200;
let toggle = false;
let modeType = "time"
let game_wordss;
let record = {};
let keyNextTemp;
let keyPrev, keyPrevPrev;
let localRef1, localRef2;
let spanHeight;

const theme = document.querySelector(".theme");
const iconTheme = theme.firstElementChild;

iconTheme.className = (document.documentElement.getAttribute('class') == 'light') ? "fa fa-sun-o" : "fa fa-moon-o"
theme.addEventListener('click', switchTheme);

function switchTheme(e) {


    if (document.documentElement.getAttribute('class') == 'light') {
        iconTheme.className = "fa fa-moon-o";
        document.documentElement.className = "dark";
        localStorage.setItem("theme", "dark");
    }
    else {
        document.documentElement.className = "light";
        iconTheme.className = "fa fa-sun-o";
        localStorage.setItem("theme", "light");
    }
}


function resetState() {
    wpm_obj = {
        correctCharacters: 0,
        wrongCharacters: 0,
        wpm_array: [],
        wordCount: 0,
        incorrectTyped: 0,
    }
    flag = false;
    disp_str = ""
    array = str.split(" ");
    test_words.length = 0
    prevY = ""
    currY = ""
    flip = false;
    scrolll = 0;
    string_pointer = 0;
    user_str = ""
    hook = {
        divhook: 1,
        spanhook: 1,
    }

    state = {
        key: "",
        curr_div: "",

    }
    wrong = 0;
    tabflag = true;
    textchild.textContent = "";
    counter = rememberChoice;
    timer.textContent = (maxWordsInitialized) ? `${wpm_obj.wordCount}/${maxWords}` : counter;
    timer.classList.add('invisible')
    result = 0;
    max = 0;
    time = 0;
    keyPrev = keyPrevPrev = undefined;
    clearInterval(clear);
    xValues.length = 0;
    yValues.length = 0;
    toggle = false;
    typeArea.scrollTop = 0;

    if (!maxWordsInitialized) maxWords = 200;

}

retry.addEventListener('click', async () => {
    document.addEventListener('keydown', preventKeyEvent);
    if (modeType == 'customize' && game_wordss) {
        playGame(game_wordss);

    }
    else if (modeType == 'quote') {
        playGame(await QuoteOption(record));
    }
    else playGame();
    retry.blur();

})

function playGame(game_words) {
    resetState();
    document.removeEventListener('keydown', preventKeyEvent);
    if (game_wordss && game_words && modeType == 'customize') game_words = game_wordss.map(i => i);

    if (game_words) {
        test_words = game_words;
        maxWords = test_words.length;
    }
    else {
        for (let i = 0; i < maxWords; i++) {
            test_words.push(array[Math.ceil(Math.random() * 260)]);
        }
    }
    textchild.style.display = 'flex';
    textchild.style.flexWrap = 'wrap';
    test_words.forEach((value) => {
        const word = document.createElement('div');
        word.classList.add("wordFlex")
        let span = "";
        for (let i = 0; i < value.length; i++) {

            span = document.createElement('span');
            span.style.display = "block"

            span.classList.add("caret");
            span.textContent = value.charAt(i);
            span.classList.add("blockPadding");
            disp_str += value[i];
            word.appendChild(span);

        }



        disp_str += " ";
        let space_span = document.createElement("span")
        space_span.classList.add("blockPadding")
        //space_span.classList.add("caret"); if added, underline delay
        space_span.textContent = ' ';
        word.appendChild(space_span);


        //we can place the margin = 1ch if the font is mono
        textchild.appendChild(word);
    })

    textchild.classList.add('text');
    typeArea.appendChild(textchild);




    if (!handlerInitialized) {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keypress', keyPressHandler);
        document.addEventListener('mousemove', mouseMoveHandler);
        handlerInitialized = true;
    }


}

function keyDownHandler(e) {

    if (tabflag && e.key == "Tab") {
        e.preventDefault();
        retry.focus();
        tabflag = false;
    }
    if (!flag && e.key != "Backspace" && e.key != "Enter" && e.key != "Tab" && e.key != "Control") {

        flag = true;
        if (!maxWordsInitialized) timerStart();
        else {
            wordTimer();
        }

    }

    if (e.key == "Backspace") {

        if (wrong) wpm_obj.wrongCharacters--;
        else wpm_obj.correctCharacters--;
        if (wpm_obj.correctCharacters < 0) wpm_obj.correctCharacters = 0;



        if (disp_str[string_pointer - 1] == " " && !wrong) {
            wpm_obj.wordCount -= 1;



        }
        if (wrong) wrong--;
        if (string_pointer > 0) string_pointer--;



        if (maxWordsInitialized && !wrong) wordChecker();

        let cur_caret = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${hook.spanhook})`)
        let behindCaretPointer;

        if (hook.spanhook == 1) {
            if (hook.divhook == 1) {
                cur_caret.classList.remove("wrongColor,correctColor")
                return;
            }


            cur_caret.classList.remove("backgroundCaret", "textDecorationColor", "textDecoration", "backgroundTextDecoration", "backgroundColor", "correctColor", "wrongColor", "wrongTextDecoration")

            state.curr_div.classList.remove("backgroundCaret", "textDecorationColor", "textDecoration", "backgroundColor", "correctColor", "wrongColor", "wrongTextDecoration", "backgroundColor");

            hook.divhook -= 1;
            hook.spanhook = test_words[hook.divhook - 1].length + 1;//-1 is for array indexing


            cur_caret = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${hook.spanhook})`);
            state.curr_div = document.querySelector(`.text div:nth-child(${hook.divhook})`);

            behindCaretPointer = hook.spanhook - 1;
            state.key = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${behindCaretPointer})`);


            state.curr_div.classList.add("textDecoration")


            cur_caret.classList.remove("wrongTextDecoration", "wrongColor");




            cur_caret.classList.remove("backgroundTextDecoration");
            cur_caret.classList.add("textDecoration");
            cur_caret.classList.add("textDecorationColor");
            //transparent space when backspace issue fix
            cur_caret.classList.remove("backgroundColor");

            cur_caret.classList.add("backgroundCaret");





            let obj = (cur_caret.getBoundingClientRect());
            spanHeight = cur_caret.getBoundingClientRect().height;
            currY = obj.y;


            if (prevY != "") {
                if (prevY != currY && flip) {
                    number = +(obj.height)
                    typeArea.scrollTop -= number;

                    obj = (cur_caret.getBoundingClientRect());
                    currY = obj.y;

                }
                else if (prevY != currY) flip = false;
            }
            prevY = currY;


            return;
        }
        //cursor current key remove



        cur_caret.classList.remove("backgroundCaret", "textDecorationColor", "textDecoration", "backgroundTextDecoration", "backgroundColor", "correctColor", "wrongColor", "wrongTextDecoration")
        state.key.classList.remove("backgroundCaret", "textDecorationColor", "textDecoration", "backgroundTextDecoration", "backgroundColor", "correctColor", "wrongColor", "wrongTextDecoration");

        hook.spanhook -= 1;

        if (hook.spanhook - 1 < 1 && hook.divhook != 1) {
            behindCaretPointer = test_words[hook.divhook - 2].length + 1

        }
        else {
            behindCaretPointer = hook.spanhook - 1
        }
        cur_caret = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${hook.spanhook})`);
        state.key = (hook.spanhook == 1) ? document.querySelector(`.text div:nth-child(${hook.divhook - 1}) span:nth-child(${behindCaretPointer})`)
            : document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${behindCaretPointer})`);



        //cursor prev key display

        cur_caret.classList.add("backgroundCaret")
        cur_caret.classList.remove("backgroundColor")

        //Remember spanhook is always pointing ahead, it refers then increments 





        state.curr_div.classList.add("textDecoration")


        state.curr_div.lastChild.classList.add("textDecoration");



        state.curr_div.lastChild.classList.add("backgroundTextDecoration");


    }



}

function keyPressHandler(e) {
    if (e.key == "Enter") return;
    if (!headerInvisible) {
        header.classList.add('invisible');
        modes.classList.add('invisible');
        headerInvisible = true;
        icon.classList.add('iconVisible');
        document.body.classList.add('noCursor');

    }

    if (wrong > 10) return




    if (e.key == disp_str[string_pointer] && !wrong) {
        string_pointer++;
        toggle = false;
        if (disp_str[string_pointer - 1] == " " && !wrong) {
            wpm_obj.wordCount += 1;
            toggle = true;
        }
        if (maxWordsInitialized && !wrong) wordChecker();
    }
    else {
        string_pointer++;
        wrong++;
        wpm_obj.incorrectTyped += 1;
    }

    if (wrong) wpm_obj.wrongCharacters++;
    else wpm_obj.correctCharacters++;




    state.key = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${hook.spanhook++})`);

    state.curr_div = document.querySelector(`.text div:nth-child(${hook.divhook})`);

    if (hook.spanhook > test_words[hook.divhook - 1].length + 1)//added 1 due to added space in actual span
    {
        hook.spanhook = 1;
        hook.divhook++;

        //remove underline on prev div
        state.key.classList.remove("textDecoration");
        state.curr_div.classList.remove("textDecoration");
        state.curr_div = document.querySelector(`.text div:nth-child(${hook.divhook})`);
    }
    const keynext = document.querySelector(`.text div:nth-child(${hook.divhook}) span:nth-child(${hook.spanhook})`);
    keynext.classList.add("caret")

    keynext.classList.add("backgroundCaret");



    state.key.classList.add("backgroundColor")


    state.curr_div.lastChild.classList.add("textDecoration")


    //consistent more 
    state.curr_div.lastChild.classList.remove("textDecorationColor")

    state.curr_div.lastChild.classList.add("backgroundTextDecoration");


    state.curr_div.classList.add("textDecoration");

    if (hook.spanhook == test_words[hook.divhook - 1].length + 1 && !wrong) {
        //space white line issue fix
        keynext.classList.remove('backgroundTextDecoration');

        keynext.classList.add("textDecorationColor");
    }

    if (!wrong) {

        state.key.classList.add("correctColor");
    }
    else {


        state.key.classList.add("wrongColor");


        state.key.classList.add("textDecoration");


        state.key.classList.add("wrongTextDecoration");

    }

    //sliding para


    let obj = (keynext.getBoundingClientRect());
    currY = obj.y;

    if (prevY != "") {
        if (prevY != currY && flip) {

            number = +(obj.height)
            typeArea.scrollTop += number;

            obj = (keynext.getBoundingClientRect());
            currY = obj.y;
        }
        else if (prevY != currY) flip = true;

    }
    prevY = currY;


}
function mouseMoveHandler(e) {
    if (headerInvisible) {
        headerInvisible = false;
        header.classList.remove("invisible");
        modes.classList.remove("invisible");
        icon.classList.remove("iconVisible");
        document.body.classList.remove("noCursor");
    }
}
function preventKeyEvent(e) {
    e.preventDefault();
}
async function execGame() {
    let mode = localStorage.getItem("modeType");
    let option = {
        timeOp: localStorage.getItem("timeOption"),
        wordOp: localStorage.getItem("wordOption"),
        quoteOp: localStorage.getItem("quoteOption"),
        cMode: localStorage.getItem("cMode"),
        cParam: localStorage.getItem("cParam"),
    }
    
    let click = new MouseEvent("click", { bubbles: true, cancelable: true });
    if (!mode || !option) {
        mode = "time";
        localStorage.setItem("modeType", "time");
        option.timeOp = 2;
        option.wordOp = 1;
        option.quoteOp = 1;
        option.cMode = "";
        option.cParam = "";
        localStorage.setItem("timeOption", option.timeOp);
        localStorage.setItem("wordOption", option.wordOp);
        localStorage.setItem("quoteOption", option.quoteOp);
        localStorage.setItem("cMode", option.cMode);
        localStorage.setItem("cParam", option.cParam);
    }

    if (mode == "time") {
        localRef1 = document.querySelector(".choices>button:nth-child(1)");
        localRef2 = document.querySelector(`.button>button:nth-child(${option.timeOp})`)
        localRef1.dispatchEvent(click);
        localRef2.dispatchEvent(click);
    }

    else if (mode == "word") {
        localRef1 = document.querySelector(".choices>button:nth-child(2)");
        localRef2 = document.querySelector(`.button>button:nth-child(${option.wordOp})`);
        localRef1.dispatchEvent(click);
        localRef2.dispatchEvent(click);
    }
    else if (mode == "quote") {
        localRef1 = document.querySelector(".choices>button:nth-child(3)");
        localRef2 = document.querySelector(`.button>button:nth-child(${option.quoteOp})`);
        localRef1.dispatchEvent(click);
        localRef2.dispatchEvent(click);
    }
    else {
        //customize - 3 cases, preserve word/time, do default on custom para
        localRef1 = document.querySelector(".choices>button:nth-child(4)")
        localRef1.classList.add("modeSelected");
        hideButtons();
        customGame();
    }
}
function modalHandler(event) {
    if (!favDialog.open) return;
    event.stopImmediatePropagation();
}