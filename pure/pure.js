const User = require('../models/user'),
bcrypt = require('bcrypt');
//Login Function
function login(user,password){
    let promise = new Promise((resolve,reject) =>{
        //Find the user in the DB
        if(!user){
            //User obj empty
            reject('User not provided!!')
        } else {
            User.findOne(user)
            .then(user =>{
                if(user){
                    //User is registered
                    //Hash the password entered with the salt in the db
                    bcrypt.hash(password,user.salt,(err,hash) =>{
                        //And match the result hash with the hash stored in the DB
                        if(hash === user.hash && !err){
                            //Correct password
                            resolve(user);
                        } else {
                            (err)?(
                                //Some error in creating the hash
                                reject(err)
                            ):(
                                //Wrong Password
                                reject('Incorrect Username or Password')
                            )
                        }
                    })
                } else {
                    //User not registered
                    reject('Incorrect Username or Password')
                }
            })
            .catch(err =>{
                console.log(err);
                reject(err);
            })                
        }
    })
    //It'll return a promise
    return promise;
}
function register(newUser, password){
    let promise = new Promise((resolve,reject) =>{
        //Check if user alredy registered
        User.findOne({username:newUser.username})
        .then(user =>{
            if(user){
                console.log('asd');
                reject('User already Created');
            } else {
                        //Gen a new salt
        bcrypt.genSalt(10,(err,salt) =>{
            //Use the salt to create a hash for ur password
            bcrypt.hash(password,salt,(err,hash) =>{
                User.create({
                    ...newUser,
                    hash,
                    salt
                })
                .then(user =>{
                    //User successfully created in the db
                    resolve(user);
                })
                .catch(err =>{
                    //Some error occurred in creating a user in the DB
                    reject(err);
                })
            })
        })                    
            }
        })
        .catch(err =>{
            console.log(err);
            reject(err);
        })
    })
    //It'll return a promise
    return promise;
}

module.exports = {
    login,
    register,
    initialise:function(req,res,next){
        //The request object will have your user and so will a cookie named user
            req.user = req.cookies['user']
            next();
    }
};