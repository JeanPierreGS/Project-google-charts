
let $select = $('#years');
let $table = document.getElementById("table");
let datos;

document.getElementById('show').addEventListener('click', e => {
    let info = [];
    let year = document.getElementById('years').value;
    let type = document.getElementById('typeS').selectedIndex;
    let option = document.getElementById('typeS').value;

    type = type == 0 ? 1 : type == 1 ? 2 : type == 2 ? 3 : type == 3 ? 4 : 6;
    info.push([`${option}`, 'Sales']);
    let t = '<table class="table table-dark">';
    t += '<thead>';
    t += '<tr>';
    t += `<th class="text-center" scope="col">${option}</th>`;
    t += `<th class="text-center" scope="col">$ Sales</th>`;
    t += '</thead>';
    [info, t] = analytics(datos[year], info, t, type);
    t += "</table>";
    $table.innerHTML = t;

    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawChart);
    $('#div-bars').innerHeight();
    function drawChart() {
        var data = google.visualization.arrayToDataTable(info);
        var options = {
            // chart: {
            // width: 400,
            height: $('#table').innerHeight(),
            title: 'Sales $',
            colors: ['#28a745'],
            is3D: true,
            backgroundColor: {
                fill: '#fff'
            },
            // },
            bars: 'horizontal' // Required for Material Bar Charts.
        };
        var chart = new google.charts.Bar(document.getElementById('barchart_material'));
        chart.draw(data, google.charts.Bar.convertOptions(options));
    }

    $('#div-bars').css({ 'display': 'inline' });
});

function loadData() {
    let guardado = localStorage.getItem('datos');
    if (guardado) {
        datos = JSON.parse(guardado);
        initSelect();  
    } else {
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'data/sales.json', true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                initSelect();
            }
        }
    }
}

function initSelect() {
    for (let year in datos) {
        $select.append(`<option> ${year} </option>`);
    }
}

function analytics(data, info, t, type) {
    var i = 1;
    var value = 0;
    var bimester = 1;
    for (month in data) {
        value += data[month];
        if (i % type == 0) {
            t += "<tr>";
            t += `<td>${bimester}</td>`;
            t += `<td>${value}</td>`;
            t += "</tr>";
            info.push([bimester + "", value]);
            value = 0;
            bimester++;
        }
        i++;
    }
    return [info, t];
}

window.onload = function () {
    this.loadData();
}