const body = document.body;
document.title = "Javascript Calculator";

const calcSpan = document.createElement('span');
    const span1 = document.createElement('span');
        const calcHead = document.createElement("h1");
            calcHead.innerText = "Calculator";
            span1.append(calcHead);
        const table = document.createElement('table');
            const trShow = document.createElement('tr');
                const tdShow = document.createElement('td');
                    tdShow.setAttribute("colspan", 5);
                    tdShow.setAttribute("class", "num");
                    tdShow.setAttribute("id", "show");
                    tdShow.innerText = "";
                    trShow.append(tdShow);
                table.append(trShow);
            const tr0 = document.createElement('tr');
                const tdDivide = document.createElement('td');
                    tdDivide.innerText = "/";
                    tr0.append(tdDivide);
                const tdMulti = document.createElement('td');
                    tdMulti.innerText = "*";
                    tr0.append(tdMulti);
                const tdSub = document.createElement('td');
                    tdSub.innerText = "-";
                    tr0.append(tdSub);
                const tdMod = document.createElement('td');
                    tdMod.setAttribute("colspan", 2);
                    tdMod.innerText = "%";
                    tr0.append(tdMod);
                table.append(tr0);
            const tr1 = document.createElement('tr');
                const td7 = document.createElement('td');
                    td7.setAttribute("class", "num");
                    td7.innerText = 7;
                    tr1.append(td7);
                const td8 = document.createElement('td');
                    td8.setAttribute("class", "num");
                    td8.innerText = 8;
                    tr1.append(td8);
                const td9 = document.createElement('td');
                    td9.setAttribute("class", "num");
                    td9.innerText = 9;
                    tr1.append(td9);
                const tdSquare = document.createElement('td');
                    tdSquare.setAttribute("colspan", 2);
                    tdSquare.innerText = "^";
                    tr1.append(tdSquare);
                table.append(tr1);
            const tr2 = document.createElement('tr');
                const td4 = document.createElement('td');
                    td4.setAttribute("class", "num");
                    td4.innerText = 4;
                    tr2.append(td4);
                const td5 = document.createElement('td');
                    td5.setAttribute("class", "num");
                    td5.innerText = 5;
                    tr2.append(td5);
                const td6 = document.createElement('td');
                    td6.setAttribute("class", "num");
                    td6.innerText = 6;
                    tr2.append(td6);
                const tdPlus = document.createElement('td');
                    tdPlus.innerText = "+";
                    tr2.append(tdPlus);
                const tdDot = document.createElement('td');
                    tdDot.innerText = ".";
                    tr2.append(tdDot);
                table.append(tr2);
            const tr3 = document.createElement('tr');
                const td1 = document.createElement('td');
                    td1.setAttribute("class", "num");
                    td1.innerText = 1;
                    tr3.append(td1);
                const td2 = document.createElement('td');
                    td2.setAttribute("class", "num");
                    td2.innerText = 2;
                    tr3.append(td2);
                const td3 = document.createElement('td');
                    td3.setAttribute("class", "num");
                    td3.innerText = 3;
                    tr3.append(td3);
                const tdEquals = document.createElement('td');
                tdEquals.setAttribute("colspan", 2);
                    tdEquals.innerText = "=";
                    tr3.append(tdEquals);
                table.append(tr3);
            const tr4 = document.createElement('tr');
                const td0 = document.createElement('td');
                    td0.setAttribute("class", "num");
                    td0.innerText = 0;
                    tr4.append(td0);
                const tdColor = document.createElement('td');
                    tdColor.setAttribute("colspan", 2);
                    const colorInput = document.createElement('input');
                        colorInput.setAttribute("type", "color");
                        colorInput.setAttribute("value", "#ffccff");
                        tdColor.append(colorInput);
                    tr4.append(tdColor);
                const tdClear = document.createElement('td');
                    tdClear.setAttribute("colspan", 2);
                    tdClear.innerText = "C";
                    tr4.append(tdClear);
                table.append(tr4);
        span1.append(table);
    calcSpan.append(span1);
    const span2 = document.createElement('span');
        const historyHead = document.createElement('h1');
            historyHead.innerText = "History";
            span2.append(historyHead);
        const historyContainor = document.createElement("div");
        historyContainor.setAttribute('class', 'containor')
        span2.append(historyContainor);
body.append(calcSpan);
body.append(span2);


let entry = "";
let divColor = "#ffccff";

tdDot.addEventListener('click', function () {
   entry += ".";
   tdShow.innerText = entry;
});

tdDivide.addEventListener('click', function () {
    entry += " / ";
    tdShow.innerText = entry;
});

tdMulti.addEventListener('click', function () {
    entry += " * ";
    tdShow.innerText = entry;
});

tdSub.addEventListener('click', function () {
    entry += " - ";
    tdShow.innerText = entry;
});

tdMod.addEventListener('click', function () {
    entry += " % ";
    tdShow.innerText = entry;
});

tdSquare.addEventListener('click', function () {
    entry += " ^ ";
    tdShow.innerText = entry;
});

tdPlus.addEventListener('click', function () {
    entry += " + ";
    tdShow.innerText = entry;
});

// got from https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function evaluate(equation) {
    if (equation.length === 0) {
        return "";
    } else if (equation.length === 1) {
        return "Invalid Expression";
    } else if (equation.length === 2) {
        return "Invalid Expression";
    } else if (!isNumeric(equation[equation.length-1])) {
        return "Invalid Expression";
    }
    let currentValue = eval(equation[0]);
    let mode = "num";
    let operation = equation[1];
    for (let i = 2; i < equation.length; i++) {
        if (mode === "num") {
            let nextValue = eval(equation[i]);
            switch (operation) {
                case "+":
                    currentValue = currentValue + nextValue;
                    break;
                case "-":
                    currentValue = currentValue - nextValue;
                    break;
                case "/":
                    if (nextValue === 0) {
                        return "Divide on 0"
                    }
                    currentValue = currentValue / nextValue;
                    break;
                case "*":
                    currentValue = currentValue * nextValue;
                    break;
                case "%":
                    if (nextValue === 0) {
                        return "Divide on 0"
                    }
                    currentValue = currentValue % nextValue;
                    break;
                case "^":
                    currentValue = currentValue ** nextValue;
                    break;
            }
            mode = "operator";
        } else {
            operation = equation[i];
            mode = "num";
        }
    }
    return currentValue;
}

function addToHistory(equation, answer) {
    const historyDiv = document.createElement('div');
        const historySpanDate = document.createElement('span');
                historySpanDate.innerText = new Date().toString();
        historyDiv.append(historySpanDate);
        const historySpanEquation = document.createElement('span');
            if (isNumeric(answer)) {
                historyDiv.setAttribute("style", "background-color: " + divColor.toString());
                historyDiv.innerText = equation.toString() + " = " + answer.toString();
                entry = answer;
            } else {
                historyDiv.setAttribute("class", "red");
                historyDiv.innerText = answer.toString();
                entry = "Error";
            }
        historyDiv.setAttribute('class', 'history')
        historyDiv.append(historySpanEquation);
    tdShow.innerText = entry;
    historyContainor.prepend(historyDiv);
}

tdEquals.addEventListener('click', function () {
    for (let i = 0; i < entry.length; i++) {
        if (entry[i] === " ") {
            let equation = entry.split(' ');
            let answer = evaluate(equation);
            if (answer !== "") {
                addToHistory(equation, answer);
            }
            break;
        }
    }
});

tdClear.addEventListener('click', function () {
    entry = "";
    tdShow.innerText = entry;
});

tdColor.addEventListener('click', function () {
    divColor = colorInput.value;
});

td0.addEventListener('click', function () {
    entry += "0";
    tdShow.innerText = entry;
});

td1.addEventListener('click', function () {
    entry += "1";
    tdShow.innerText = entry;
});

td2.addEventListener('click', function () {
    entry += "2";
    tdShow.innerText = entry;
});

td3.addEventListener('click', function () {
    entry += "3";
    tdShow.innerText = entry;
});

td4.addEventListener('click', function () {
    entry += "4";
    tdShow.innerText = entry;
});

td5.addEventListener('click', function () {
    entry += "5";
    tdShow.innerText = entry;
});

td6.addEventListener('click', function () {
    entry += "6";
    tdShow.innerText = entry;
});

td7.addEventListener('click', function () {
    entry += "7";
    tdShow.innerText = entry;
});

td8.addEventListener('click', function () {
    entry += "8";
    tdShow.innerText = entry;
});

td9.addEventListener('click', function () {
    entry += "9";
    tdShow.innerText = entry;
});
