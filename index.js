// List the dependencies here
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Set connection to MySQL database
const db = mysql.createConnection({
    user: 'root',
    password: 'Mysql@124727117372',
    database: 'employee_tracker'
});

// connects to sql server and sql database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    renderQuestion();
})

