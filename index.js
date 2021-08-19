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

//Welcome table.
console.table(
    "\n------------ EMPLOYEE TRACKER ------------\n"
)

// prompts user with list of options to choose from
 renderQuestion = ()  => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Welcome to our employee database! What would you like to do?',
            choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add a department',
                    'Add a role',
                    'Update employee role',
                    'Delete an employee',
                    'EXIT'
                    ]
            }).then(function (answer) {
                switch (answer.action) {
                    case 'View all employees':
                        viewEmployees();
                        break;
                    case 'View all departments':
                        viewDepartments();
                        break;
                    case 'View all roles':
                        viewRoles();
                        break;
                    case 'Add an employee':
                        addEmployee();
                        break;
                    case 'Add a department':
                        addDepartment();
                        break;
                    case 'Add a role':
                        addRole();
                        break;
                    case 'Update employee role':
                        updateRole();
                        break;
                    case 'Delete an employee':
                        deleteEmployee();
                        break;
                    case 'EXIT': 
                        exitApp();
                        break;
                    default:
                        break;
                }
        })
};

