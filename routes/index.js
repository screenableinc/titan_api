var express = require('express');
var router = express.Router();
var databaseConnect = require('./databaseconnect');
var fs = require('fs');






/* GET home page. */

router.get('/analytics',function(req, res, next){
    res.render('index')
});


router.get('/getappversion',function (req, res, next) {
    databaseConnect.getAppVersion(function (result) {
        res.send(JSON.stringify(result))
    })
})

router.post('/setappversion',function (req, res, next) {
    var password=req.body.passkey
    var version = req.body.version;
    var fixes = req.body.fixes;

    if(password !== "noobMaster69"){
        res.send(JSON.stringify({status:69,message:"password error"}))
    }else {
    databaseConnect.setAppVersion(function (result) {
        res.send(JSON.stringify(result))
    })
    }
})

router.get('/analytics/errors/', function(req, res, next){
    databaseConnect.all_errors(function (result) {
        res.send(JSON.stringify(result))
    })
});

router.get('/reportError', function (req, res, next) {
    var id = req.query.student_id
    var array = JSON.parse(req.query.errors)
    console.log(array)

    databaseConnect.log_errors(array, id, function (result) {
        res.send(JSON.stringify(result))
    })
})

router.get('/updateclasses', function (req, res, next) {
    var mode = req.query.mode;
    var level = req.query.level;
    var program = req.query.program;
    var year = req.query.year;
    var semester = req.query.semester;
    fs.readFile('./public/programs_scheds.json',function (err, data) {
        var programs=JSON.parse(data)
        fs.readFile('./public/all_progs.json',function (err, data) {
            var all_programs=JSON.parse(data)
            var code = all_programs[program]+year+semester
            if(mode==="distance"){
                mode="fulltime"
            }

            fs.readFile('./public/free_classes.json',function (err, data) {
                var classes = programs[level][mode][code]

                var free_classes=JSON.parse(data)
                if (classes === undefined) {
                    res.send(JSON.stringify({success: false}))
                } else {


                    res.send(JSON.stringify({"success": true, "data": classes,"free_classes":free_classes}))
                }
            })

        })
    })
})

router.get('/analytics/data',function (req,res ,next) {
//    access db

    databaseConnect.all_students(function (result) {
        res.send(JSON.stringify(result))
    })
})




router.get('/setup', function(req, res, next) {
    var program = req.query.program;
    var student_id = req.query.student_id;
    var mode = req.query.mode;
    var level = req.query.level;
    var year = req.query.year;
    var semester = req.query.semester;
    var courses = JSON.parse(req.query.courses);

    databaseConnect.setup(student_id,program,mode,year,semester,level,courses,function (response) {

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
                    if(mode==="distance"){
                        mode="fulltime"
                    }
                    fs.readFile('./public/free_classes.json',function (err, data) {
                        var classes = programs[level][mode][code]
                        var free_classes=JSON.parse(data)

                        if (classes === undefined) {
                            res.send(JSON.stringify({success: false}))
                        } else {
                            console.log(err)

                            res.send(JSON.stringify({"success": true, "data": classes,"free_classes":free_classes}))
                        }
                    })

                })
            })


            // send_courses();

        }else if(!response.success){
            console.log("here")
            // res.send(JSON.stringify({"success":false}))
        }
    })



});

module.exports = router;
