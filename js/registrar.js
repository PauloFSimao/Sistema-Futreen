const campNome = document.getElementById('nome');
const campData = document.getElementById('dataNasc');
const campUserName = document.getElementById('usuario');
const campEmail = document.getElementById('email');
const campSenha = document.getElementById('senha');
const campBio = document.getElementById('bio');

const msgSucesso = document.getElementById('sucesso')

const btCadastrar = document.getElementById('cadastrar')

btCadastrar.addEventListener('click', async function() {
    
    const usuario = {
        nome: campNome.value,
        dataNasc: campData.value,
        userName: campUserName.value,
        email: campEmail.value,
        senha: campSenha.value,
        bio: campBio.value
    }

    const post = {
        method: 'POST', 
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(usuario)
    }

    const response = await fetch('http://localhost:8080/api/usuario', post).then((resposta) => {
        resposta.json().then((retorno) => {
            console.log(retorno);
            if(retorno[0].mensagem == 'Sucesso'){
                
                sessionStorage.setItem("userId", retorno[1])
                sessionStorage.setItem("username", retorno[2])

                msgSucesso.style.display = 'flex'
                msgSucesso.style.animationName = 'notificar'
                msgSucesso.style.animationDuration = '2s'

                msgSucesso.style.animationName = 'sumir'
                msgSucesso.style.animationDuration = '2s'
                msgSucesso.style.animationDelay = '5s'

                msgSucesso.addEventListener('animationend', function() {
                    window.location.href = "../telas/foruns.html"
                })
                
            }
        })
    })

    
}); 
