var mysql = require("mysql");


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'w1se097768638810',
    database: "classmate"

});

connection.connect(function(err) {
    if (err) return callback(err);

});

function setup_user(student_id,program,mode,year,semester,level,courses, callback) {
    /*TODO::
        check if user is in database
        if yes ...update details given
        in no ...register them and put details
        put courses in courses table */
//    check if user exists
    var sql = "INSERT INTO students (student_id, program, mode, year,semester,level) VALUES ('"+student_id+"', '"+program+"', '"+mode+"', '"+year+"', '"+semester+"', '"+level+"')";
    
    connection.query(sql, function (err,result) {

            if(!err){
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
            }
            if (err.errno === 1062) {
                //    user exists update
                console.log("calling this one")
                var fields = [program, mode, year, semester, level, student_id];
                sql = 'UPDATE students SET program = ?, mode =?, year =?, semester =?, level =? WHERE student_id=?';
                connection.query(sql, fields, function (err, result) {
                    if (err) {
                        //    callback
                        console.log("here222",err.message)
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
                        console.log("done for loop")
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

                })
            }else {
                console.log("anotherone")
            }

        })
}

module.exports={
    setup:setup_user
}