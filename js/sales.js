let $select = $('#years');
let $content = $('#content');
let container = document.querySelector('#content');
let $newYear = $('#newYear');
var year;
var newYear;
let datos;
let newStatistics;
let month = [];

document.getElementById('years').addEventListener('change', e => {
    year = $select.val();
    $newYear.val('');
    $('#msgS').css('display', 'none');
    init();
});

document.getElementById('newYear').addEventListener("input", e => {
    console.log('cambia');
    newYear = $newYear.val();
    console.log(newYear);
});

document.getElementById('new').addEventListener('click', e => {
    newYear = $newYear.val();
    if (newYear) {
        var inner = container.querySelectorAll('input');
        if (datos[newYear]) {
            alert('This year yet exits')
        } else {
            inner.forEach(input => {
                input.value = '';
            });
            $('#msgS').css('display', 'none');
            $('#msg').css('display', 'inline');
            newStatistics = true;
            $newYear.prop('disabled', true);
            $select.prop('disabled', true);
        }
    } else {
        alert('Enter a new year')
    }
});

document.getElementById('save').addEventListener('click', e => {
    var inner = container.querySelectorAll('input');
    let nYear = {};
    var i = 0;
    inner.forEach(input => {
        nYear[month[i]] = Number(input.value);
        i++;
    });
    if(!$newYear.val()) {
        update($select.val(), nYear);
    } else if(newStatistics){
        $select.append(`<option> ${newYear} </option>`);
        update(newYear, nYear);
        $newYear.prop('disabled', false);
        $select.prop('disabled', false);
    } else {
        alert('Click in Add Statistics')
    }
});

function update(year, nYear) {
    datos[year] = nYear;
    $('#msg').css('display', 'none');
    $newYear.val('');
    localStorage.setItem('datos', JSON.stringify(datos));
    $('#msgS').css('display', 'inline');
}

function loadData() {
    let guardado = localStorage.getItem('datos');
    if (guardado) {
        datos = JSON.parse(guardado);
        initSelect();
        init();
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET', '../data/sales.json', true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                initSelect();
                init();
            }
        }
    }
}

function initSelect() {
    for (let year in datos) {
        $select.append(`<option> ${year} </option>`);
    }
}

function init() {
    year = document.getElementById('years').value;
    initContent();
    initMonth();
}

function initContent() {
    document.getElementById('content').innerHTML = '';
    $content.append(`<div class="col-12"><h6 class="text-white text-center d-block bg-secondary p-1 mb-2">Data</h6></div>`)
    for (let month in datos[year]) {
        $content.append(
            `<div class="col-5">
            <label>${month}</label>
            </div>
            <div class="col-5">
                <input type="number" class="form-control" value="${datos[year][month]}">
            </div>
        `);
    }
}

function initMonth() {
    for (let m in datos[year]) {
        month.push(m);
    }
}

window.onload = function () {
    this.loadData();
}