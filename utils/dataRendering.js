

const fs = require('fs');
// view all employees in the database
 viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        console.log(`*************************************************************`);
        console.log(`---------------------- LIST OF EMPLOYEES ---------------------`);
        console.log(`*************************************************************`);
        console.table(res);
        renderQuestion();
    });
};


// view all departments in the database
 viewDepartments = () => {
    db.query(`SELECT * FROM department`,(err, res)  => {
        if(err)throw err;
        console.log(`*************************************************************`);
        console.log(`--------------------- LIST OF DEPARTMENTS -------------------`);
        console.log(`*************************************************************`);
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table( departmentArray);
        renderQuestion();
    })
};

// view all roles in the database
viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        console.log(`*************************************************************`);
        console.log(`----------------------LIST OF EMPLOYEE ROLES------------------`);
        console.log(`*************************************************************`);
        let roleArray = [];
        res.forEach(role => roleArray.push(role));
        console.table( roleArray);
        renderQuestion();
    })
};

// add an employee to the database
addEmployee = () =>  {
    
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

                ]).then((answer) => {

        const employeeFullName = [answer.first_name, answer.last_name,answer.manager_id]

        // query function for employee roles
        db.query(`SELECT role.id, role.title FROM role`, (err, res) => {
            if (err) throw err;
            
            const roles = res.map(({ id, title}) => ({ name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Enter employee's role",
                    choices: roles
                }
            ])
            .then(roleAnswer => {
                const employeeRole = roleAnswer.role
                employeeFullName.push(employeeRole);

                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                            Values (?, ?, ?, ?)`, employeeFullName, (err, res) => {
                            if (err) throw err;
                            
                            console.log("Employee successfully added!")
                            console.log(`*************************************************************`);
                            console.log(`---------------THE NEW EMPLOYEE YOU HAVE ADDED IS-------------`);
                            console.log(`*************************************************************`);
                            console.log('First_Name:',employeeFullName[0]);
                            console.log('Last_Name:',employeeFullName[1]);
                            console.log('Role_id:',employeeFullName[2]);
                            console.log('Manager_id:',employeeFullName[3]);
                            renderQuestion();
                        })
                    });
            });
    });  

};

// add a department to the database
addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Which department would you like to add?'
            }
         ]).then(answer =>  {
                db.query(`INSERT INTO department (name) VALUES (?)`, answer.newDepartment, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                        console.log("Your New Department has successfully been added!");    
                        console.log(`*************************************************************`);
                        console.log(`---------------THE NEW DEPARTMENT YOU HAVE ADDED IS-------------`);
                        console.log(`*************************************************************`);
                        console.log(answer, 'department_id:',res.insertId);

                    renderQuestion();
                });
         });
};


// add a role to the database
addRole = () => {
    
    db.query(`SELECT * FROM department`, (err,res) => {
        if (err) {
            console.log(err)
        }
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
                },{
                        name: 'id',
                        type: 'input',
                        message: 'What is the id for the department? (Enter a number)'
                    },
            ]).then(answer => {
                const newRole = [answer.new_role, answer.salary, answer.id]

                    db.query(`INSERT INTO role(title, salary, department_id)  
                    Values (?, ?, ?)`, newRole, (err, res) => {
                    if (err) throw err;
                                    
                        console.log("New Role has successfully been added!")
                        console.log(`*************************************************************`);
                        console.log(`--------THE NEW ROLE YOU HAVE ADDED IS --------`);
                        console.log(`*************************************************************`);
                        console.log('NEW ROLE:',newRole[0], 'SALARY:',newRole[1], 'DEPARTMENT ID:', newRole[2] );
                        renderQuestion();
                    });
            });
    });
       
}
    
    
    
// update a role in the database
 updateRole = ()=> {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if(err) {
            console.log(err);
        }
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Select employee to update',
                choices: employees
            }
        ])
        .then(answerUpdateEmployee => {
            const edittedEmployee = answerUpdateEmployee.updateEmployee;
            const employeeArr = []

            employeeArr.push(edittedEmployee);
            
            db.query(`SELECT * FROM role`, (err,res) => {
                if(err) {
                    console.log(err)
                }
                const roles = res.map(({id, title}) => ({name: title, value: id}))

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: 'Select new role',
                        choices: roles
                    }
                ])
                .then(answerRoles => {
                    const role = answerRoles.roles;
                    employeeArr.push(role);
                    
                    // change order of employeeArr in order to insert proper values into employee
                    employeeArr[0] = role;
                    employeeArr[1] = edittedEmployee;

                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, employeeArr, (err, res) => {
                        if(err) {
                        console.log(err)
                        }
                        console.log("Employee role successfully updated!")
                        console.log(`*************************************************************`);
                        console.log(`------------- Employee role successfully updated!------------`);
                        console.log(`*************************************************************`);
                        renderQuestion();    
                    })
                })
            })
        }) 
    })
};

// delete an employee from the database
deleteEmployee = ()=> {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if(err) {
            console.log(err);
        }
        console.log(res)
        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        console.log(employees)
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'deleteEmployeeQuestion',
                message: 'Please Select the employee name that you want to remove?',
                choices: employees
            }
        ])
        .then(answerDeleteEmployee => {
            
            const deletedEmployeeArr = [];
            const deletedEmployee = answerDeleteEmployee.deleteEmployeeQuestion;
            console.log(deletedEmployee)
            

            deletedEmployeeArr.push(deletedEmployee);
            
            db.query(`DELETE FROM employee WHERE id = ?`, deletedEmployee, (err, res) => {
                if (err) {
                    console.log(err);
                }
                        console.log(`*************************************************************`);
                        console.log(`--------------- Employee successfully deleted! ----------------`);
                        console.log(`*************************************************************`);
                        renderQuestion();  
            });
        });
    });
};

// exit the app
 exitApp = () => {
    db.end();
};


module.exports = dataRendering;