module.exports = (app)=>{
    app.post('/login',(req,res,next)=>{
        //para utilizar o req.body.user é necessário habilitar o urlencoded({extended : true}); do npm 'express'
        if(req.body.user === 'andre' && req.body.pwd === '260215'){
            const id = 1;
            //para utilizar jwt é necessário instalar o npm 'jsonwebtoken'
            const jwt = app.locals.jwt;
            //para utilizar o process.env.SECRET é necessário instalar o npm 'dotenv-safe'
            let token = jwt.sign({id},process.env.SECRET,{expiresIn:300});
            res.status(200).send({token:token, message: 'ok'});
        }else {
            res.status(401).send({token:token, message: 'ok'});
        }
    });
}