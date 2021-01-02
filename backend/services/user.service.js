const User = require('../models').User;

class UserService {

    createUser(body) {
        const user = User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.useremail,
            name: body.username,
            password: body.password
        });

        return user;
    }

    updateUser(body) {
        console.log('body--------->',body);
        const user = User.update(body, {
            where: { id: body.id }
        });
        return user;
    }
}

module.exports = new UserService();