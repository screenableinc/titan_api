var express = require('express');
var router = express.Router();
var databaseConnect = require('./databaseconnect');
const fs = require('fs');

/* GET home page. */
router.get('/classmate/setup', function(req, res, next) {
    var program = req.query.program;
    var student_id = req.query.student_id;
    var mode = req.query.mode;
    var level = req.query.level;
    var year = req.query.year;
    var semester = req.query.semester;
    var courses = JSON.parse(req.query.courses);
    console.log(courses[0],program)
    databaseConnect.setup(student_id,program,mode,year,semester,level,courses,function (response) {
        console.log("success11")
        if(response.success){
            console.log("success")
            var rawdata= fs.readFileSync('./public/programs_scheds.json','utf8');
            var classes = JSON.parse(rawdata)
            var allprograms= fs.readFileSync('./public/all_progs.json');
        //     fs.readFile('student.json', (err, data){
        //         if (err) throw err;
        //     let student = JSON.parse(data);
        //     console.log(student);
        // });
            
            fs.readFile('./public/programs_scheds.json',function (err, data) {
                var programs=JSON.parse(data)
                fs.readFile('./public/all_progs.json',function (err, data) {
                    var all_programs=JSON.parse(data)
                    var code = all_programs[program]+year+semester
                    var classes=programs[level][mode][code]
                    //todo fix in case of undefined
                    res.send(JSON.stringify({"success":true,"data":classes}))

                })
            })


            // send_courses();

        }else {
            console.log("here")
            res.send(JSON.stringify({"success":false}))
        }
    })



});

module.exports = router;
