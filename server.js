
/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Sunitha Jayakumar Student ID: 137410213 Date: 09-04-2022
*
*  Online (Heroku) Link: __https://id.heroku.com/account/accept/11646423/e689a3bb821d819cc1c00dba6ccb04b1
*
********************************************************************************/ 





const Sequelize = require('sequelize');
const DatabaseConfig = require('./db_configfiles').DatabaseConfig
var express = require("express")
var app = express()
app.engine(".hbs", expressHbs.engine({
    extname: '.hbs'
}))
app.set('view engine', '.hbs');

//console.log(DatabaseConfig);

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(DatabaseConfig.DATABASE_NAME, DatabaseConfig.DATABASE_USER, DatabaseConfig.DATABASE_PASSWORD, {
    host: DatabaseConfig.DATABASE_HOSTNAME,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });



    var Student = sequelize.define('Student', {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        city: Sequelize.STRING,
        description: Sequelize.TEXT
    });
    var Task = sequelize.define('Task', {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        user_id: Sequelize.STRING,
    });
    



    sequelize.sync().then(function () {
    
        // Create user "Jason Bourne"
        Student.create({
            fullName: "Sunitha Jayakumar",
            title: "developer"
        }).then(function (user) {
    
            console.log("user created");
            
                // Create "Task 1" for the new user
            Task.create({
                title: "Task 1",
                description: "Task 1 description",
                UserId: user.id // set the correct Userid foreign key
            }).then(function(){ console.log("Task 1 created")});
    
            // Create "Task 2" for the new user
            Task.create({
                title: "Task 2",
                description: "Task 2 description",
                UserId: user.id // set the correct Userid foreign key
            }).then(function(){ console.log("Task 2 created")});
        });
    
    });

    sequelize.sync().then(function () {

        Student.create({
            fName: "Peter",
            lName: "Parker"
        }).then(function(){ console.log("Kyler Odin created")});
    
            Student.create({
            fName: "Janet",
            lName: "Garrick"
        }).then(function(){ console.log("Grier Garrick created")});
    
            Student.create({
            fName: "James",
            lName: "Greyson"
        }).then(function(){ console.log("Kolby Greyson created")});
    
    });
    sequelize.sync().then(() => {

        // return all first names only
        Student.findAll({ 
            attributes: ['first_name', 'last_name']
        }).then((data) => {
            console.log("All first and last names");
            for(var i =0; i < data.length; i++){
                console.log(`${data[i].first_name} - ${data[i].last_name} `);
            }
        });
    
        // return all first names where id == 1
        Student.findAll({ 
            attributes: ['first_name'],
            where: {
                id: 1
            }
        }).then((data) => {
            console.log("All first names where id == 1");
            for(var i =0; i < data.length; i++){
                console.log(data[i].first_name);
            }
        });
    
    });


    app.get("/", (req, res) => {
        res.render("home", { data: home,  layout: false})
    })
    app.get("/student/add", (req, res) => {
    })
    app.post("/student/add", (req,res) => {
        let s = {
            sid: 1,
            fnm: sunitha,
            lnm: Jayakumar
        }
        res.send(JSON.stringify(s))
    })
    
    app.post("/student/update", (req, res) => {
        console.log(req.body);
        res.redirect("/students");
    });

    app.get("/", (req, res) => {
        res.render("home", { data: home,  layout: false})
    })
    app.get("/courses/add", (req, res) => {
    })
    app.post("/courses/add", (req,res) => {
        let s = {
            courseid: WEB700,
            Name: WebProgramming
        }
        res.send(JSON.stringify(s))
    })
    
    app.post("/courses/update", (req, res) => {
        console.log(req.body);
        res.redirect("/courses");
    });

    app.post("/courses/getCourseByid", (req, res) => {
        console.log(req.body);
        res.status(404).send("Course Not Found")
        res.redirect("/courses");
    });


    app.get("/courses/deleteCourseByid", (req, res) => {
    })
    app.post("/courses/delete", (req,res) => {
        res.status(500).send("Unable to Remove Course / Course not found)")
        res.send(JSON.stringify(s))
    })

    app.get("/student/:studentNum", (req, res) => {

        // initialize an empty object to store the values
        let viewData = {};
    
        data.getStudentByNum(req.params.studentNum).then((data) => {
            if (data) {
                viewData.student = data; //store student data in the "viewData" object as "student"
            } else {
                viewData.student = null; // set student to null if none were returned
            }
        }).catch(() => {
            viewData.student = null; // set student to null if there was an error 
        }).then(data.getCourses)
        .then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"
    
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching 
            // viewData.courses object
    
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
    
        }).catch(() => {
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {
            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
    });
    
    
    