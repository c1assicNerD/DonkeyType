document.fonts.ready.then(() => {
    // Your code to measure and set border height
    typeArea.style.height = (textchild.firstChild.firstChild.getBoundingClientRect().height) * 3 + 'px';

    execGame();

});
let radioListenerInitialized = false;
const customizeChoice = {
    mode: localStorage.getItem("cMode"),
    param: localStorage.getItem("cParam"),
}



const disabledInput = document.querySelectorAll('.disabled')

let anyWithoutEvent = ""
let quote = {};
button.addEventListener('click', async (e) => {
    localRef2.classList.remove("modeSelected")
    let game_words;
    if (typeof anyWithoutEvent == "object") anyWithoutEvent.classList.remove("modeSelected");

    switch (modeType) {
        case "time":
            timeOption(e);
            break;
        case "word":
            WordOption(e);
            break;
        case "quote":
            game_words = await QuoteOption(e);
            break;

    }

    e.target.blur();
    e.target.classList.add("modeSelected")
    localRef2 = e.target


    if (!game_words) playGame();
    else playGame(game_words);

})
choices.addEventListener('click', async function (e) {

    localRef1.classList.remove("modeSelected")
    maxWordsInitialized = true;
    let temp = e.target.closest("button")
    let game_words;
    switch (temp.children[1].textContent) {
        case "words":
            modeType = "word"
            localStorage.setItem("modeType", "word");
            wordMode();
            break;
        case "time":
            modeType = "time"
            localStorage.setItem("modeType", "time");
            timeMode();
            break;
        case "quote":
            modeType = "quote"
            localStorage.setItem("modeType", "quote");
            game_words = await quotesMode();
            break;
        case "customize":
            modeType = 'customize';
            localStorage.setItem("modeType", "customize");
            customizeMode(temp);
            break;
        default:

    }

    temp.blur();

    temp.classList.add("modeSelected")
    localRef1 = temp

    if (temp.children[1].textContent != "customize") {
        if (!game_words) {
            playGame();
        }
        else {

            playGame(game_words)

        }
    }
})
function timerStart() {


    for (let i = 1; i <= counter; i++)  xValues.push(i)

    timer.classList.remove('invisible');
    clear = setInterval(interval, 1000);

    function interval() {

        timer.textContent = --counter;
        time++;
        result = calculate_wpm(wpm_obj.correctCharacters, time / 60);
        if (max < result) max = result;
        if (counter == 0) {

            clearInterval(clear);

            accuracy = calculate_acc(wpm_obj.correctCharacters, wpm_obj.incorrectTyped)

            window.location.href = `./score.html?max=${max}&xValues=` + encodeURIComponent(xValues) + `&yValues=` + encodeURIComponent(wpm_obj.wpm_array) + `&acc=${Math.round(accuracy)}%` + `&char=${wpm_obj.correctCharacters + wpm_obj.incorrectTyped}&time=${rememberChoice}`
            return;
        }


    }
}
function wordTimer() {
    clear = setInterval(wordInterval, 1000);

    timer.classList.remove('invisible');
}
function wordInterval() {
    if (wpm_obj.wordCount != maxWords) {
        time++;
        xValues.push(time);
        result = calculate_wpm(wpm_obj.correctCharacters, time / 60);
        if (result > max) max = result;
        msStart = Date.now();
    }
}
function wordChecker() {
    if (!disp_str[string_pointer]) {
        msEnd = Date.now();
        clearInterval(clear);

        let extraTime = msEnd - msStart;

        xValues.push((xValues.at(-1) + (extraTime / 1000)).toFixed(2));
        calculate_wpm(wpm_obj.correctCharacters, xValues.at(-1) / 60)//wpm of that fractional second;

        accuracy = calculate_acc(wpm_obj.correctCharacters, wpm_obj.incorrectTyped);
        //navigate
        window.location.href = `./score.html?max=${max}&xValues=` + encodeURIComponent(xValues) + `&yValues=` + encodeURIComponent(wpm_obj.wpm_array) + `&acc=${Math.round(accuracy)}%` + `&char=${wpm_obj.correctCharacters + wpm_obj.incorrectTyped}&time=${xValues.at(-1)}`
        return;
    }
    if (wpm_obj.wordCount != prevWordCount) timer.textContent = `${wpm_obj.wordCount}/${maxWords}`;
    prevWordCount = wpm_obj.wordCount;
}
function calculate_wpm(noOfCharacters, time) {
    const no_of_words = noOfCharacters / 5;
    const wpm = Math.round(no_of_words / (time));
    wpm_obj.wpm_array.push(wpm);

    return wpm_obj.wpm_array.at(-1);
}
function calculate_acc(correct, incorrect) {
    return (correct / (correct + incorrect)) * 100
}
function wordMode() {
    maxWordsInitialized = true;
    const modifiedButtons = Array.from(document.querySelectorAll('.button >button'))
    modifiedButtons[0].textContent = 10;
    modifiedButtons[1].textContent = 25;
    modifiedButtons[2].textContent = 50;
    modifiedButtons[3].textContent = 100;
    WordOption();
}
function timeMode() {
    maxWordsInitialized = false;
    maxWords = 200;
    const modifiedButtons = Array.from(document.querySelectorAll('.button > button'));
    modifiedButtons[0].textContent = 15;
    modifiedButtons[1].textContent = 30;
    modifiedButtons[2].textContent = 60;
    modifiedButtons[3].textContent = 120;
    timeOption()
}
async function quotesMode() {
    maxWordsInitialized = true;
    const modifiedButtons = Array.from(document.querySelectorAll('.button > button'));
    modifiedButtons[0].textContent = "any";
    modifiedButtons[1].textContent = "short";
    modifiedButtons[2].textContent = "medium";
    modifiedButtons[3].textContent = "thicc";
    let game_words = await QuoteOption();
    return game_words;
}
function customizeMode(temp) {

    const radiolist = Array.from(document.querySelectorAll('.radio div:nth-child(1) input'));
    const confirm = document.querySelector('dialog button');
    confirm.addEventListener('click', e => {
        e.preventDefault();
        radiolist.forEach(radio => {
            if (radio.checked) {
                customizeChoice.mode = radio.value;
                localStorage.setItem("cMode", customizeChoice.mode);
                customizeChoice.param = radio.parentElement.parentElement.querySelector(".disable").value;
                localStorage.setItem("cParam", customizeChoice.param)
            }

            customGame();
        })
        favDialog.close();
        document.removeEventListener('keypress', modalHandler);
        document.removeEventListener('keydown', modalHandler);
        temp.blur();
        // resetModalState();
    })

    if (!radioListenerInitialized) {
        radiolist.forEach(radio => {

            radioListenerInitialized = true;
            radio.addEventListener('change', (e) => {
                const parent = radio.parentElement.parentElement;
                const toDisable = parent.querySelector('.disable');
                toDisable.disabled = !toDisable.disabled;
                toDisable.required = !toDisable.required
                customizeDisable();
            })

        })
    }
    hideButtons();
    favDialog.showModal();
    document.addEventListener('keypress', modalHandler, true);
    document.addEventListener('keydown', modalHandler, true);
    customizeDisable();
}
function timeOption(e) {
    if (e) {
        switch (e.target.textContent) {
            case "15":
                localStorage.setItem("timeOption", 1);
                break;
            case "30":
                localStorage.setItem("timeOption", 2);
                break;
            case "60":
                localStorage.setItem("timeOption", 3);
                break;
            case "120":
                localStorage.setItem("timeOption", 4);
                break;
        }
    }

    if (!e) {
        
        localRef2.classList.remove("modeSelected");
        localRef2 = document.querySelector(`.button>button:nth-child(${localStorage.getItem("timeOption")})`);
        counter = +localRef2.textContent;
        localRef2.classList.add("modeSelected");
    }
    else {
        localRef2.classList.remove("modeSelected")

        counter = e.target.textContent
    }
    timer.textContent = counter;
    rememberChoice = counter;

}
function WordOption(e) {
    if (e) {
        switch (e.target.textContent) {
            case "10":
                localStorage.setItem("wordOption", 1);
                break;
            case "25":
                localStorage.setItem("wordOption", 2);
                break;
            case "50":
                localStorage.setItem("wordOption", 3);
                break;
            case "100":
                localStorage.setItem("wordOption", 4);
                break;
        }
    }
    if (!e) {
        localRef2.classList.remove("modeSelected");
        localRef2 = document.querySelector(`.button>button:nth-child(${localStorage.getItem("wordOption")})`);
        maxWords = +localRef2.textContent;
        localRef2.classList.add('modeSelected');
    }
    else {
        maxWords = +e.target.textContent;
    }

    timer.textContent = `${wpm_obj.wordCount}/${maxWords}`;

}
//med - 30-55words, thicc - 70upwards  short - 10-25words

async function QuoteOption(e) {
    if (!e) {
        localRef2.classList.remove("modeSelected");
        localRef2 = document.querySelector(`.button>button:nth-child(${localStorage.getItem("quoteOption")})`);
        
        e = {
            target: {
                textContent: localRef2.textContent,
            }
        }
        localRef2.classList.add("modeSelected");

    }


    switch (e.target.textContent) {
        case "any":
            localStorage.setItem("quoteOption", 1)
            quote = await fetch('https://thequoteshub.com/api/');
            quote = await quote.json();
            break;
        case "short":
            localStorage.setItem("quoteOption", 2)
            quote = await fetch_quote(10, 25);
            quote = await quote.json();
            break;
        case "medium":
            localStorage.setItem("quoteOption", 3)
            quote = await fetch_quote(30, 55);
            quote = await quote.json();
            break;
        case "thicc":

            localStorage.setItem("quoteOption", 4)
            quote = await fetch(`https://api.quotable.io/quotes/random?minLength=300`);
            quote = await quote.json();
            break;
    }

    let cleanText = (e.target.textContent != 'any') ? cleanQuoteText(quote[0].content) : cleanQuoteText(quote.text);
    let game_words = cleanText.split(" ");
    maxWords = game_words.length;
    timer.textContent = `${wpm_obj.wordCount}/${maxWords}`
    record = eventClone(e);
    record.quote = game_words;
    return game_words;

    function eventClone(e) {
        return {
            target: {
                textContent: e.target.textContent,
            }
        }
    }
}
async function fetch_quote(minWords, maxWords) {
    const result = await fetch(`https://api.quotable.io/quotes/random?minLength=${minWords * 5}&maxLength=${maxWords * 5}`)
    return result;
}
function cleanQuoteText(text) {

    return text
        // Replace curly apostrophes and quotes with straight ones
        .replace(/[‘’]/g, "'")      // curly single quotes → '
        .replace(/[“”]/g, '"')      // curly double quotes → "
        // Add space after punctuation if it's missing
        .replace(/([.?!,])(?=\S)/g, '$1 ')
        // Normalize multiple spaces to a single space
        .replace(/\s+/g, ' ')
        .trim();
}
function customizeDisable() {
    for (let i = 1; i < 4; i++) {
        const radio = document.querySelector(`.radio:nth-child(${i + 1}) input`);
        const disabledInput = document.querySelector(`.radio:nth-child(${i + 1})>div:nth-child(2) .disable`);
        if (!radio.checked) {
            disabledInput.disabled = true;
        }
        else {
            disabledInput.required = true;
        }
    }
}
function customGame() {
    switch (customizeChoice.mode) {
        case "time":
            maxWordsInitialized = false;
            counter = +(customizeChoice.param);
            rememberChoice = counter;
            game_wordss = null;
            playGame();
            break;
        case "word":
            maxWordsInitialized = true;
            maxWords = +(customizeChoice.param);
            game_wordss = null;
            playGame();
            break;
        case "custom":
            maxWordsInitialized = true;
            game_words = cleanQuoteText(customizeChoice.param).split(" ");

            maxWords = game_words.length;
            game_wordss = game_words;
            playGame(game_words);
            break;
    }
}
function hideButtons() {
    const modifiedButtons = Array.from(document.querySelectorAll('.button > button'));
    modifiedButtons[0].textContent = "";
    modifiedButtons[1].textContent = "";
    modifiedButtons[2].textContent = "";
    modifiedButtons[3].textContent = "";
}

