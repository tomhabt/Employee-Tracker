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

// view all employees in the database
 viewEmployees = () => {
        const sql = 'SELECT * FROM employee';
        db.query(sql, (err, res) => {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            renderQuestion();
        });
    };
    
    
    // view all departments in the database
     viewDepartments = () => {
        const sql = 'SELECT * FROM department';
        db.query(sql, function(err, res) {
            if(err)throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            renderQuestion();
        })
    };
    
    
    // view all roles in the database
    viewRoles = () => {
        const sql = 'SELECT * FROM role';
        db.query(sql, (err, res) => {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            renderQuestion();
        })
    };
    
    
    // add an employee to the database
    addEmployee = () =>  {
        db.query('SELECT * FROM role',  (err, res) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input', 
                        message: "What is the employee's fist name? ",
                    },
                    {
                        name: 'last_name',
                        type: 'input', 
                        message: "What is the employee's last name? "
                    },
                    {
                        name: 'manager_id',
                        type: 'input', 
                        message: "What is the employee's manager's ID? "
                    },
                    {
                        name: 'role', 
                        type: 'list',
                        choices: ()  => {
                        const roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                        },
                        message: "What is this employee's role? "
                    }
                    ]).then((answer) => {
                        let role_id;
                        for (let a = 0; a < res.length; a++) {
                            if (res[a].title == answer.role) {
                                role_id = res[a].id;
                                console.log(role_id)
                            }                  
                        }  
                        db.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            manager_id: answer.manager_id,
                            role_id: role_id,
                        },
                        (err) => {
                            if (err) throw err;
                            console.log('The employee has been added!');
                            renderQuestion();
                        })
                    })
            })
    };
    
    
    // add a department to the database
    function addDepartment() {
        inquirer
            .prompt([
                {
                    name: 'newDepartment', 
                    type: 'input', 
                    message: 'Which department would you like to add?'
                }
                ]).then( (answer) =>  {
                    db.query(
                        'INSERT INTO department SET ?',
                        {
                            name: answer.newDepartment
                        });
                    const sql = 'SELECT * FROM department';
                    db.query(sql, (err, res) => {
                    if(err)throw err;
                    console.log('Your department has been added!');
                    console.table('All Departments:', res);
                    renderQuestion();
                    })
                })
    };
    
    
    // add a role to the database
    addRole = () => {
        db.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;
        
            inquirer 
            .prompt([
                {
                    name: 'new_role',
                    type: 'input', 
                    message: "What new role would you like to add?"
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this role? (Enter a number)'
                },
                {
                    name: 'Department',
                    type: 'list',
                    choices: () => {
                        const deptArry = [];
                        for (let i = 0; i < res.length; i++) {
                        deptArry.push(res[i].name);
                        }
                        return deptArry;
                    },
                }
            ]).then(answer => {
                let department_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].name == answer.Department) {
                        department_id = res[a].id;
                    }
                }
        
                db.query(
                    'INSERT INTO role SET ?',
                    {
                        title: answer.new_role,
                        salary: answer.salary,
                        department_id: department_id
                    },
                    (err, res) => {
                        if(err)throw err;
                        console.log('Your new role has been added!');
                        console.table('All Roles:', res);
                        renderQuestion();
                    })
            })
        })
    };
    
    
    // update a role in the database
     updateRole = ()=> {
    
    
    };
    
    
    //  delete an employee
    deleteEmployee =  () => {
    
    
    };
    
    
    // exit the app
     exitApp = () => {
        db.end();
    };
    
    
