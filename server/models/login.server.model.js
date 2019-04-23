var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loginSchema = new Schema ({

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    created_at: Date,
    updated_at: Date

});

loginSchema.pre('save', function (next) {

    var time = new Date;
    this.updated_at = time;
    if(!this.created_at) {
        this.created_at = time;
    }
    next();

});

//maybe hash method

var Logins = mongoose.model('Logins', loginSchema);

module.exports = Logins;
