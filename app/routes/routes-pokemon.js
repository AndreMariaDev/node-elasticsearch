const server = require('../elastic/service')();

module.exports = (app)=>{

    //Valida tokem
    var verifyJWT = (req,res,next)=>{
        //para utilizar o req.headers['x-access-token'] é necessário instalar o npm 'cookie-parse'
        const token = req.headers['x-access-token'];
        //para utilizar jwt é necessário instalar o npm 'jsonwebtoken'
        const jwt = req.app.locals.jwt;
        if(token){
            //para utilizar o process.env.SECRET é necessário instalar o npm 'dotenv-safe'
            jwt.verify(token,process.env.SECRET,(error,decoded)=>{ 
                if(error){ return res.status(500).send({auth:false,message:'Falha na Autenticação!'})}
                res.userId = decoded.id;
                next();
            });
        } else {
            res.status(500).send({message:'Usuario invalido'});
        }
    }

    app.post('/elasticsearch/create-index',verifyJWT,(req,res,nest)=>{
        server.indexData().then(result=>{
            console.log
            res.status(200).send({status: 'Successfully indexed'});
            next();
        }).catch((err)=>{ 
            console.log; 
            res.status(500).send({error: err});
        });
    });

    app.get('/elasticsearch/verify',verifyJWT,(req,res,next)=>{
        server.indices().then((result)=>{
            console.log;
            res.status(200).send(result);
            next();
        }).catch((err)=>{ 
            console.error() 
            res.status(500).send({error: `Error connecting to the es client: ${err}`});
        });
    });

    app.get('/elasticsearch/searchAll/:size/:from',verifyJWT,(req,res,next)=>{
        server.searchAll(parseInt(req.params.size),parseInt(req.params.from))
        .then(results => {
            console.log(`found ${results.hits.total} items in ${results.took}ms`);
            console.log(`returned items:`);
            res.status(200).send(results);
            next();
          }).catch((err)=>{ 
            console.error() 
            res.status(500).send({error: `Error connecting to the es client: ${err}`});
        });
    });

    app.post('/elasticsearch/searchOne',verifyJWT,(req,res,next)=>{
        server.searchAll(parseInt(req.body.size),parseInt(req.body.from),re.body.query)
        .then(results => {
            console.log(`found ${results.hits.total} items in ${results.took}ms`);
            console.log(`returned journals:`);
            if (results.hits.total > 0){
                res.status(401).send({message:"nothing itens"});
                console.log(`returned itens:`);
            } else {
                res.status(200).send(result);
                next();
            }
          }).catch((err)=>{ 
            console.error() 
            res.status(500).send({error: `Error connecting to the es client: ${err}`});
        });
    });

    app.get('/elasticsearch',verifyJWT,(req,res,nest)=>{
        res.status(200).send({message:'Ola mundo!'});
    });
}