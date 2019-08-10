var mysql = require("mysql");


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'w1se097768638810',
    database: "classmate"

});

connection.connect(function(err) {
    if (err){
        throw err;
    }


});

function getAppversion(callback){
    var sql = "SELECT mobile_app_version, fixes FROM version_control"
    connection.query(sql, function (err, result, fields) {
        if (err){
            return callback({status:505,message:err})
        }else {
            return callback({status:200,result:result[0]})
        }

    });
}

function setAppversion(version,fixes,callback){
    var fields = [version,fixes];
    sql = "UPDATE version_control SET mobile_app_version = ?, fixes =? WHERE _id='app_version'";
    connection.query(sql, function (err, result, fields) {
        if (err){
            return callback({status:505,message:err})
        }else {
            return callback({status:200,result:result})
        }

    });
}


function logerrors(jsonArray, id,callback) {
   var sql = "INSERT INTO errors (student_id, timestamp, class_origin, function_origin, error_message, severity) VALUES ?"
    var values = []
    for (var i = 0; i < jsonArray.length; i++) {
        var value = [id, jsonArray[i]['timestamp'], jsonArray[i]['class'], jsonArray[i]['method'], jsonArray[i]['message'], jsonArray[i]['severity']]
        values.push(value)
    }
    connection.query(sql, [values], function (err, result) {
        if (err) {

            return callback({"success": false})
        } else {

            return callback({"success": true})
        }
    })
}

function allerrors(callback){
    var sql ="SELECT * FROM errors";

    connection.query(sql, function (err, result, fields) {
        if (err){
            throw err;
        }else {
            return callback(result)
        }
    })
}

function allusers(callback) {
    var sql ="SELECT * FROM students";

    connection.query(sql, function (err, result, fields) {
        if (err){
            throw err;
        }else {
            return callback(result)
        }
    })
}

function setup_user(student_id,program,mode,year,semester,level,courses, callback) {
    /*TODO::
        check if user is in database
        if yes ...update details given
        in no ...register them and put details
        put courses in courses table */
//    check if user exists
    var sql = "INSERT INTO students (student_id, program, mode, year,semester,level) VALUES ('"+student_id+"', '"+program+"', '"+mode+"', '"+year+"', '"+semester+"', '"+level+"')";
    
    connection.query(sql, function (err,result) {

            if(err==null){
            //    no error
                console.log("1calling this one")
                sql = "DELETE FROM courses_taken WHERE student_id = '" + student_id + "'";
                connection.query(sql, function (err, result) {
                    if (err) {
                        console.log("here0022")
                        return callback({"success": false})
                    }
                    //    successfully deleted..now add rows
                    sql = "INSERT INTO courses_taken (student_id, course_code) VALUES ?"
                    var values = []
                    for (var i = 0; i < courses.length; i++) {
                        var value = [student_id, courses[i]]
                        values.push(value)
                    }
                    connection.query(sql,[values],function (err, result) {
                        if(err){
                            console.log("progress")
                            return callback({"success":false})
                        }else {
                            console.log("lets play")
                            return callback({"success":true})
                        }
                    })


                })
            }else {
                if (err.errno === 1062) {
                    //    user exists update
                    console.log("calling this one")
                    var fields = [program, mode, year, semester, level, student_id];
                    sql = 'UPDATE students SET program = ?, mode =?, year =?, semester =?, level =? WHERE student_id=?';
                    connection.query(sql, fields, function (err, result) {
                        if (err) {
                            //    callback
                            console.log("here222", err.message)
                            return callback({"success": false})
                        }
                        //    add courses to courses taken table but first delete those currently there
                        sql = "DELETE FROM courses_taken WHERE student_id = '" + student_id + "'";
                        connection.query(sql, function (err, result) {
                            if (err) {
                                console.log("here0022")
                                return callback({"success": false})
                            }
                            console.log("reached here")
                            //    successfully deleted..now add rows
                            sql = "INSERT INTO courses_taken (student_id, course_code) VALUES ?"
                            var values = []
                            for (var i = 0; i < courses.length; i++) {
                                var value = [student_id, courses[i]]
                                values.push(value)
                            }

                            connection.query(sql, [values], function (err, result) {
                                if (err) {
                                    console.log("progress")
                                    return callback({"success": false})
                                } else {
                                    console.log("lets play")
                                    return callback({"success": true})
                                }
                            })

                        })

                    })
                } else {
                    console.log("anotherone")
                }
            }

        })
}

module.exports={
    setup:setup_user,
    all_students:allusers,
    getAppVersion:getAppversion,
    setAppVersion:setAppversion,
    all_errors:allerrors,
    log_errors:logerrors
}