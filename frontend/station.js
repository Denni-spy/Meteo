const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id')
const url = `http://localhost:8080/station?id=${id}`;
const spinner = document.getElementById('loading-spinner');

let chartInstance = null;

console.log("Send request to:", url);
spinner.style.display = 'block';

fetch(url)
    .then(response => response.json())
    .then(result => {
        spinner.style.display = 'none'
        if (result.errorMessage) {
            alert("Server Response: " + result.errorMessage);
            return;
        }

        annualData = result.data.annual
        seasonalData = result.data.seasonal
        draw(annualData)
        fillTable(seasonalData, annualData)
    })
    .catch(error => {
        spinner.style.display = 'none';
        console.error("Error during fetch:", error);
        alert("Connection to server failed. Is ‘main.go’ running?");
    });

function draw(data) {
    new Chart(
        document.getElementById('station'),
        {
            type: 'line',
            data: {
                labels: data.map(row => row.year),
                datasets: [
                    {
                        label: 'tmin per year',
                        data: data.map(row => row.tmin)
                    },
                    {
                        label: 'tmax per year',
                        data: data.map(row => row.tmax)
                    }
                ]

            }
        }
    );
}

function fillTable(seasonalData, annualData) {
    const yearMap = new Map()
    for (let e of annualData) {
        yearMap.set(e.year, {
            'tmin': e.tmin,
            'tmax': e.tmax
        })
    }
    console.log(annualData)
    bodyData = document.getElementById('tbody')
    console.log(bodyData)

    console.log(seasonalData)
    const tableData = new Map();
    for (let e of seasonalData) {
        let obj = tableData.get(e.year)

        if (!obj) {
            let yearData = yearMap.get(e.year)
            obj = {
                'tmin': yearData?.tmin,
                'tmax': yearData?.tmax
            }
        }

        if (e.season === "Winter") {
            obj.winterMin = e.tmin
            obj.winterMax = e.tmax
            tableData.set(e.year, obj)
        } else if (e.season === "Spring") {
            obj.springMin = e.tmin
            obj.springMax = e.tmax
            tableData.set(e.year, obj)
        } else if (e.season === "Summer") {
            obj.summerMin = e.tmin
            obj.summerMax = e.tmax
            tableData.set(e.year, obj)
        } else if (e.season === "Autumn") {
            obj.autumnMin = e.tmin
            obj.autumnMax = e.tmax
            tableData.set(e.year, obj)
        }
    }
    for (let [year, data] of tableData) {
        const val = (v) => (v !== undefined && v !== null) ? v : '-';

        let tr = document.createElement("tr")
        tr.innerHTML = `
        <td><b>${year}</b></td>
        
        <td style="color: blue; font-weight: bold;">${val(data.tmin)}</td>
        <td style="color: red; font-weight: bold;">${val(data.tmax)}</td>

        <td>${val(data.winterMin)}</td>
        <td>${val(data.winterMax)}</td>
        <td>${val(data.springMin)}</td>
        <td>${val(data.springMax)}</td>
        <td>${val(data.summerMin)}</td>
        <td>${val(data.summerMax)}</td>
        <td>${val(data.autumnMin)}</td>
        <td>${val(data.autumnMax)}</td>
    `;
        bodyData.appendChild(tr)
    }
}

diagramBtn = document.getElementById("btn-chart")
tableBtn = document.getElementById("btn-table")

diagramBtn.addEventListener("click", () => {
    diagramBtn.classList.add("active")
    tableBtn.classList.remove("active")
    document.getElementById("station").classList.remove("hidden")
    document.getElementById("table-container").classList.add("hidden")

})

tableBtn.addEventListener("click", () => {
    tableBtn.classList.add("active")
    diagramBtn.classList.remove("active")
    document.getElementById("station").classList.add("hidden")
    document.getElementById("table-container").classList.remove("hidden")

})
