"use strict";

import { fetchCyclists, fetchStageResults } from "./apiFacade.js";

window.addEventListener("load", start);

let cyclists = [];
let stageResults = [];

async function start() {
    cyclists = await fetchCyclists();
    stageResults = await fetchStageResults();
    console.log(cyclists);
    console.log(stageResults);
    const results = processStageResults(stageResults, cyclists);
    displayResults(results);
}

const processStageResults = (stageResults, cyclists) => {
    // Filter cyclists who are youth riders
    const youthRiders = cyclists.filter(cyclist => cyclist.youthRider);

    // Sort youth riders based on their position in the general classification
    const sortedYouthRiders = [...stageResults]
        .filter(result => youthRiders.some(youth => youth.cyclistId === result.cyclistId))
        .sort((a, b) => {
            const positionA = stageResults.find(res => res.cyclistId === a.cyclistId).position;
            const positionB = stageResults.find(res => res.cyclistId === b.cyclistId).position;
            return positionA - positionB;
        });

    const generalClassification = [...stageResults].sort((a, b) => a.position - b.position);
    
    const greenJersey = [...stageResults].sort((a, b) => b.sprintPoints - a.sprintPoints);
    
    const mountainsJersey = [...stageResults].sort((a, b) => b.mountainPoints - a.mountainPoints);

    return {
        generalClassification,
        greenJersey,
        mountainsJersey,
        whiteJersey: sortedYouthRiders
    };
};

const displayResults = (results) => {
    displayTable(results.generalClassification, 'general', 'general');
    displayTable(results.greenJersey, 'green', 'sprintPoints');
    displayTable(results.mountainsJersey, 'mountains', 'mountainPoints');
    displayTable(results.whiteJersey, 'white', 'general');
};

const displayTable = (results, containerId, jerseyType) => {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content

    // Create table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Define headers based on the type of jersey
    let headers;
    if (jerseyType === 'general') {
        headers = ['Firstname', 'Lastname', 'Stage Time', 'Time Difference'];
    } else if (jerseyType === 'sprintPoints') {
        headers = ['Firstname', 'Lastname', 'Sprint Points'];
    } else if (jerseyType === 'mountainPoints') {
        headers = ['Firstname', 'Lastname', 'Mountain Points'];
    }
    
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Find the fastest time for general classification
    const fastestTime = jerseyType === 'general' ? results[0].stageTime : null;

    // Helper function to calculate time difference
    const calculateTimeDifference = (fastest, current) => {
        const fastestDate = new Date(`1970-01-01T${fastest}Z`);
        const currentDate = new Date(`1970-01-01T${current}Z`);
        const diffMs = currentDate - fastestDate;
        const diffSecs = diffMs / 1000;
        const hours = Math.floor(diffSecs / 3600);
        const minutes = Math.floor((diffSecs % 3600) / 60);
        const seconds = Math.floor(diffSecs % 60);
        return `+${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Add data rows
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        let cells;
        
        if (jerseyType === 'general') {
            cells = [
                result.cyclistFirstname,
                result.cyclistLastname,
                result.stageTime,
                index === 0 ? '0:00' : calculateTimeDifference(fastestTime, result.stageTime)
            ];
        } else if (jerseyType === 'sprintPoints') {
            cells = [
                result.cyclistFirstname,
                result.cyclistLastname,
                result.sprintPoints
            ];
        } else if (jerseyType === 'mountainPoints') {
            cells = [
                result.cyclistFirstname,
                result.cyclistLastname,
                result.mountainPoints
            ];
        }
        
        cells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
};

// Attach openTab function to window object
window.openTab = function(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Set the default open tab
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".tablinks").click();
});
