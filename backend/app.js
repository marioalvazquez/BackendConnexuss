var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Usuario = require('./server/models/usuario');
const jwt = require('jsonwebtoken');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);

const DURACION_TOKEN = '2h';



//Login
app.post('/api/login', function(req, res) {
    let request = req.body;

    Usuario.findOne({ correo_electronico: request.correo_electronico }, (error, usuarioEncontrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                err: error
            })
        }

        if (!usuarioEncontrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario no encontrado',
                    error: error,
                    usuario: usuarioEncontrado
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioEncontrado
        }, 'seed-de-autenticacion', {
            expiresIn: DURACION_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioEncontrado,
            token
        });
    });
});


mongoose.connect('mongodb://localhost:27017/usuario', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log("Conexión a BD exitosa");
})

app.get('/ping', function(req, res) {
    res.send({ ping: 'hello this is server and I am alive!' });
});

let port = 3005;
app.listen(port, () => {
    console.log(`Escuchando en puerto ${port}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;