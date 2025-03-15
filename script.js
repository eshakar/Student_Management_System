// Global variables
let studentsData = [];
let currentView = "all"; // Tracks the current display mode

// Wait for DOM content to be loaded
document.addEventListener("DOMContentLoaded", function() {
    // Fetch the student data from the JSON file
    fetchStudentData()
        .then(data => {
            studentsData = data;
            renderStudentTable(studentsData);
            setupEventListeners();
        })
        .catch(error => {
            console.error("Error loading student data:", error);
            // Display error message to user
            document.getElementById("tableBody").innerHTML = `
                <tr>
                    <td colspan="7">Error loading student data. Please try again later.</td>
                </tr>
            `;
        });
});

// Function to fetch student data from the JSON file
async function fetchStudentData() {
    try {
        const response = await fetch('students.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data; // Access the students array from the JSON file
    } catch (error) {
        console.error("Failed to fetch student data:", error);
        throw error; // Re-throw to be caught by the calling function
    }
}


// Set up event listeners for search and sort buttons
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    
    searchInput.addEventListener("input", handleSearch);
    searchButton.addEventListener("click", handleSearch);
    
    // Sorting buttons
    document.getElementById("sortAZ").addEventListener("click", () => sortStudents("az"));
    document.getElementById("sortZA").addEventListener("click", () => sortStudents("za"));
    document.getElementById("sortMarks").addEventListener("click", () => sortStudents("marks"));
    document.getElementById("sortPassing").addEventListener("click", () => sortStudents("passing"));
    document.getElementById("sortClass").addEventListener("click", () => sortStudents("class"));
    document.getElementById("sortGender").addEventListener("click", () => sortStudents("gender"));
}

// Handle search functionality
function handleSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    if (!searchTerm.trim()) {
        // If search term is empty, show all students
        if (currentView === "gender") {
            renderGenderTables(studentsData);
        } else {
            renderStudentTable(studentsData);
        }
        return;
    }
    
    // Filter students based on search term
    const filteredStudents = studentsData.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const email = student.email.toLowerCase();
        
        return fullName.includes(searchTerm) || email.includes(searchTerm);
    });
    
    // Render filtered results
    if (currentView === "gender") {
        renderGenderTables(filteredStudents);
    } else {
        renderStudentTable(filteredStudents);
    }
}

// Sort students based on different criteria
function sortStudents(criteria) {
    let sortedStudents = [...studentsData];
    
    switch (criteria) {
        case "az":
            currentView = "all";
            sortedStudents.sort((a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`;
                const nameB = `${b.first_name} ${b.last_name}`;
                return nameA.localeCompare(nameB);
            });
            renderStudentTable(sortedStudents);
            break;
            
        case "za":
            currentView = "all";
            sortedStudents.sort((a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`;
                const nameB = `${b.first_name} ${b.last_name}`;
                return nameB.localeCompare(nameA);
            });
            renderStudentTable(sortedStudents);
            break;
            
        case "marks":
            currentView = "all";
            sortedStudents.sort((a, b) => a.marks - b.marks);
            renderStudentTable(sortedStudents);
            break;
            
        case "passing":
            currentView = "all";
            const passingStudents = sortedStudents.filter(student => student.passing);
            renderStudentTable(passingStudents);
            break;
            
        case "class":
            currentView = "all";
            sortedStudents.sort((a, b) => a.class - b.class);
            renderStudentTable(sortedStudents);
            break;
            
        case "gender":
            currentView = "gender";
            renderGenderTables(sortedStudents);
            break;
    }
}

// Render the main student table
function renderStudentTable(students) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    
    // Show main table, hide gender tables
    document.getElementById("studentsTable").style.display = "table";
    document.getElementById("genderTables").classList.add("hidden");
    
    students.forEach(student => {
        const row = document.createElement("tr");
        
        // Create the student name cell with image
        const nameCell = document.createElement("td");
        nameCell.innerHTML = `
            <div class="student-name">
                <div class="student-image">${student.first_name[0]}</div>
                <span>${student.first_name} ${student.last_name}</span>
            </div>
        `;
        
        // Add all cells to the row
        row.innerHTML = `
            <td>${student.id}</td>
        `;
        row.appendChild(nameCell);
        row.innerHTML += `
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? "Passing" : "Failed"}</td>
            <td>${student.email}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Render separate tables for males and females
function renderGenderTables(students) {
    // Hide main table, show gender tables
    document.getElementById("studentsTable").style.display = "none";
    document.getElementById("genderTables").classList.remove("hidden");
    
    // Split students by gender
    const femaleStudents = students.filter(student => student.gender.toLowerCase() === "female");
    const maleStudents = students.filter(student => student.gender.toLowerCase() === "male");
    
    // Render female table
    const femaleTableBody = document.getElementById("femaleTableBody");
    femaleTableBody.innerHTML = "";
    
    femaleStudents.forEach(student => {
        const row = document.createElement("tr");
        
        // Create the student name cell with image
        const nameCell = document.createElement("td");
        nameCell.innerHTML = `
            <div class="student-name">
                <div class="student-image">${student.first_name[0]}</div>
                <span>${student.first_name} ${student.last_name}</span>
            </div>
        `;
        
        // Add all cells to the row
        row.innerHTML = `
            <td>${student.id}</td>
        `;
        row.appendChild(nameCell);
        row.innerHTML += `
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? "Passing" : "Failed"}</td>
            <td>${student.email}</td>
        `;
        
        femaleTableBody.appendChild(row);
    });
    
    // Render male table
    const maleTableBody = document.getElementById("maleTableBody");
    maleTableBody.innerHTML = "";
    
    maleStudents.forEach(student => {
        const row = document.createElement("tr");
        
        // Create the student name cell with image
        const nameCell = document.createElement("td");
        nameCell.innerHTML = `
            <div class="student-name">
                <div class="student-image">${student.first_name[0]}</div>
                <span>${student.first_name} ${student.last_name}</span>
            </div>
        `;
        
        // Add all cells to the row
        row.innerHTML = `
            <td>${student.id}</td>
        `;
        row.appendChild(nameCell);
        row.innerHTML += `
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>${student.passing ? "Passing" : "Failed"}</td>
            <td>${student.email}</td>
        `;
        
        maleTableBody.appendChild(row);
    });
}