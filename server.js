// opções para servidor local
const express = require("express");
const server = express();

//config do server para acessar aqruivos estáticos
server.use(express.static("public"));

//habilitar prop body do formulário
server.use(express.urlencoded({extended: true}));

//config conexão com banco
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'cavera',
    host: 'localhost',
    port: 5432,
    database: 'blood'
});

// usando nunjucks
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true
});

//acessando home da aplicação
server.get("/", (req,res) => {
    
    db.query("SELECT * FROM donors", (err, result)=>{
        if (err) return res.send("Erro de banco de dados.")
        
        const donors = result.rows;
        
        return res.render("index.html", { donors });
    });
});

//pegando dados do formulário
server.post('/', (req, res) => {
    const name = req.body.name;
    const email = req.body.email
    const blood = req.body.blood

    if (name == ""|| email == ""|| blood == "") {
      return res.send("Todos os campos são obrigatórios.")  
    };

    //adicionando ao banco
    const query = `
    INSERT INTO donors("name","email","blood")
    VALUES ($1,$2,$3)`;

    const values = [name, email, blood];

    db.query(query, values, (err)=>{
        if (err) return res.send("Erro no banco de dados.")
        
        return res.redirect('/');
    });
});

//ligar servidor
//PORT n existe - heroku que vai preencher
server.listen(process.env.PORT || 3000);
