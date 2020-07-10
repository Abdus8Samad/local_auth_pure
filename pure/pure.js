//Login Function
function login(user,password){
    let promise = new Promise((resolve,reject) =>{
        let { username } = user;
        //Find the user in the DB
        User.findOne({username})
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
    })
    //It'll return a promise
    return promise;
}
function register(user, password){
    let promise = new Promise((resolve,reject) =>{
        //Gen a new salt
        bcrypt.genSalt(10,(err,salt) =>{
            //Use the salt to create a hash for ur password
            bcrypt.hash(password,salt,(err,hash) =>{
                User.create({
                    ...user,
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
    })
    //It'll return a promise
    return promise;
}

function initialise(req,res,next){
    //The request object will have your user and so will a cookie named user
    req.user = req.cookies['user']
    next();
}

const pure = {
    login,
    register
}

module.exports = pure;