const mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    correo_electronico: {
        type: String,
        unique: true,
        required: [true, 'Campo requerido']
    },
    password: {
        type: String,
        required: [true, 'Campo obligatorio']
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema);