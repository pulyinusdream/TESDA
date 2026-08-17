TAESF.Modules.Employee.Manifest = {

    schemaVersion: "1.0",

    id: "employee",

    name: "Employee",

    displayName: "Employee Management",

    version: "1.0.0",

    description: "Employee Management Module",

    author: "TESDA Albay",

    controller:
        "controllers/employee.controller.js",

    dependencies: [

        "models/employee.model.js",

        "repository/employee.repository.js",

        "validation/employee.validator.js",

        "services/employee.service.js",

        "views/employee.list.view.js"

    ],

    routes: [

        {
            path: "/employee",
            view: "views/employee.list.view.js"
        }

    ],

    permissions: [

        "employee.view",
        "employee.create",
        "employee.edit",
        "employee.delete"

    ],

    menu: {

        group: "Administration",

        title: "Employees",

        icon: "users"

    }

};