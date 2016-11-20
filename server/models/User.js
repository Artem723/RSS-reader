'use strict';
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let Schema = mongoose.Schema;

let savedCategoriesSchema = new Schema({
    categoryName: { type: String, required: true },
    links: [String]
});

let userSchema = new Schema({
    name: String,
    userName: { type: String, required: true, unique: true },
    __password: { type: String, required: true },
    salt: { type: String, required: true },
    savedCategories: [savedCategoriesSchema],
    created_at: Date,
    updated_at: Date,
});

userSchema.methods.getCategoryByName = function (categoryName) {
    let indexOfCategory = -1;

    this.savedCategories.forEach(function (el, ind) {
        if (el.categoryName == categoryName) indexOfCategory = ind;
    });

    if (indexOfCategory === -1)
        return null;
    else
        return this.savedCategories[indexOfCategory];
}

userSchema.methods.addLinkTo = function (categoryName, link) {
    let category = this.getCategoryByName(categoryName);
    if (!link && !category) {
        this.savedCategories.push({ categoryName: categoryName, links: [] });
        return;
    }
    if (!category) {
        console.log(categoryName, link)
        this.savedCategories.push({ categoryName: categoryName, links: [link] });
    }
    else
        category.links.push(link);
}
//remove link or category
userSchema.methods.removeLinkIn = function (categoryName, link) {
    let category = this.getCategoryByName(categoryName);
    if (!category) return;
    if (!link) {
        //DONE Remove category
        this.savedCategories.pull(category);

    } else {
        //DONE Remove link
        category.links.pull(link);
    }
}

userSchema.methods.isPasswordValidSync = function (passwordText) {
    //TODO Hashing
    //return this.__password === passwordText;
    return bcrypt.compareSync(passwordText, this.__password);
}

userSchema.methods.isPasswordValid = function (passwordText, cb) {
    //TODO Hashing
    //return this.__password === passwordText;
    if (typeof cb !== "function") {
        console.err("collback is not a function");
        return;
    }

    bcrypt.compare(passwordText, this.__password, cb);

}

userSchema.virtual('password').set(function (passwordText) {
    //TODO: Hashing
    // this.salt = "salt";
    // this.__password = passwordText;
    let self = this;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) throw err;
        self.salt = salt;
        bcrypt.hash(passwordText, salt, null, function (err, result) {
            if (err) throw err;
            self.__password = result;
        })
    })
});

userSchema.methods.hashPassword = function (passwordText, cb) {
    let self = this;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            cb(err);
            return;
        }
        self.salt = salt;
        bcrypt.hash(passwordText, salt, null, function (err, result) {
            if (err) {
                cb(err);
                return;
            }
            self.__password = result;
            cb(null, result);
        })
    })
}

userSchema.virtual('password').get(function () {
    return this.__password;
});

userSchema.pre('save', function (next) {

    var currentDate = new Date();

    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});



let User = mongoose.model('User', userSchema);

module.exports = User;