const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const user= req.body.name;
    const pwd= req.body.password;

    if(!user || !pwd) return res.status(404).json({ "message": "Username and password are mandatory" });

    const founduser = usersDB.users.find(user => user.name === req.body.name);
    if(!founduser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, founduser.password);

    if(!match) return res.sendStatus(401);

    const accessToken = jwt.sign(
            { "name": founduser.name },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
    );

    const refreshToken = jwt.sign(
            { "name": founduser.name },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
    );
    
    const otherUsers = usersDB.users.filter(pers => pers.name !== founduser.name);
    const currentUser = {...founduser, refreshToken};
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    
    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000});
    res.json({ accessToken });
}

module.exports = {handleLogin};