const body = document.getElementById('formForum')
if(body == null){
    window.addEventListener('DOMContentLoaded', listar)
} 

const btCriar = document.getElementById('btCriarForum')
btCriar.addEventListener('click', cadastrar)

async function listar() {
    const campName = document.getElementById('nomeUsuario')
    campName.innerText = sessionStorage.getItem("username")

    const main = document.getElementById('main')

    const response = await fetch("http://localhost:8080/api/forum").then((resposta) => {
        resposta.json().then((forum) => {

            forum.forEach(forum => {
                
                const divForum = document.createElement('div')
                divForum.classList.add('forum')
                const img = document.createElement('img')
                img.src = '../img/emdia.png'
                img.id = "fotoForum"
                const liNome = document.createElement('li')
                liNome.textContent = `${forum.nome}`
                const pDescricao = document.createElement('p')
                pDescricao.innerHTML = `${forum.descricao}`
                pDescricao.id ='assuntoForum'
                const divPart = document.createElement('div')
                divPart.classList.add('participar')
                const pCriador = document.createElement('p')
                pCriador.id = 'criadoPor'
                pCriador.innerHTML = `Criado por ${forum.criador.nome}`
                const btParticipar = document.createElement('button')
                btParticipar.id = 'participar'
                btParticipar.innerHTML = "Participar"
                
                divPart.appendChild(pCriador)
                divPart.appendChild(btParticipar)

                divForum.appendChild(pDescricao)
                divForum.appendChild(img)
                divForum.appendChild(liNome)
                divForum.appendChild(pDescricao)
                divForum.appendChild(divPart)

                main.append(divForum)
            });
        })
    })
}

async function cadastrar() {

    const forum = {
        nome: nomeForum.value, 
        descricao: descForum.value,
        criador:{
            id: sessionStorage.getItem('userId')
        }
    }

    const post = {
        method: 'POST', 
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(forum)
    }

    await fetch('http://localhost:8080/api/forum', post).then((response) =>{
        response.json().then((resposta) =>{
            console.log(resposta)
            if(resposta.mensagem == 'Sucesso'){
                const sucesso = document.getElementById('sucesso')
                sucesso.style.animation = 'notificar 2s'
                sucesso.style.display = 'block'
            }
        })
    })
}