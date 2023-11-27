if(sessionStorage.getItem('token') == null){
    location.replace('http://127.0.0.1:5500/index.html')
}

const username = document.getElementById('nomeUsuario')
username.innerText = sessionStorage.getItem('username')

const perfil = document.getElementById('perfil')
perfil.src = sessionStorage.getItem('fotoPerfil')

const mainForuns = document.getElementById('mainForuns')
const convForum = document.getElementById('conversaForum')

const btAlterar = document.getElementById('btAlterar')
const btRegistrar = document.getElementById('btRegistrar')

const infoNome = document.getElementById('nomeForumInfo')
const descInfo = document.getElementById('descInfo')

const imgPerfil = document.getElementById('imgPerfil')
const inpForum = document.getElementById('inpForum')

window.addEventListener('DOMContentLoaded', buscarForuns())


async function buscarForuns() {
    await fetch(`http://localhost:8080/api/forum/${sessionStorage.getItem('userId')}`)
        .then((response) => {
            response.json().then((foruns) => {
                console.log(foruns);

                foruns.forEach(forum => {
                    const divForum = document.createElement('div')
                    divForum.className = 'forum'
                    divForum.id = forum.id

                    const img = document.createElement('img')
                    img.src = forum.foto
                    img.id = 'fotoForum'

                    const li = document.createElement('li')
                    li.innerText = forum.nome

                    const p = document.createElement('p')
                    p.innerText = forum.descricao
                    p.id = 'assuntoForum'

                    const divSair = document.createElement('div')
                    divSair.className = 'sair'

                    const pCria = document.createElement('p')
                    pCria.innerText = `Criado por ${forum.criador.userName}`
                    pCria.id = 'criadoPor'

                    const btSair = document.createElement('button')
                    btSair.id = 'sair'
                    btSair.innerText = "Sair"

                    divSair.appendChild(pCria)
                    divSair.appendChild(btSair)

                    divForum.appendChild(img)
                    divForum.appendChild(li)
                    divForum.appendChild(p)
                    divForum.appendChild(divSair)

                    mainForuns.append(divForum)

                    divForum.addEventListener('click', function () {
                        sessionStorage.setItem('idChatForum', this.id)
                        mainForuns.style.width = '45%'
                        convForum.style.display = 'flex'
                        abrirForum()
                        forumName.innerText = li.innerText
                        imgPerfil.src = forum.foto
                        buscaInfo()
                    })

                    btSair.addEventListener('click', async function() {
                        const PUT = {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }

                        await fetch(`http://localhost:8080/api/forum/sair/${forum.id}/${sessionStorage.getItem('userId')}`, PUT)
                        .then((response) => {
                            response.json().then((resposta) => {
                                if(resposta.mensagem == "Sucesso"){
                                    location.reload()
                                    buscarForuns()
                                }
                            })
                        })
                    })
                });
            })
        })
}

async function abrirForum(){
    const mainConversa = document.getElementById('mainConv')
    const forumName = document.getElementById('forumName')

    mainConversa.innerHTML = ""

    await fetch(`http://localhost:8080/api/postagem/forum/${sessionStorage.getItem('idChatForum')}`)
    .then((response) => {
        response.json().then((postagens) => {

            postagens.forEach(postagem => {
                if(postagem.autor.id == sessionStorage.getItem('userId')){
                    const divEu = document.createElement('div')
                    divEu.className = 'divEu'
                    const pEu = document.createElement('p')
                    pEu.id = 'mensagemEu'
                    pEu.innerText = postagem.conteudo

                    divEu.appendChild(pEu)

                    mainConversa.append(divEu)
                }else{
                    const divOutro = document.createElement('div')
                    divOutro.className = 'divOutro'
                    const divMensagem = document.createElement('div')
                    divMensagem.className = 'divMensagem'
                    const pAutor = document.createElement('span')
                    pAutor.innerText = postagem.autor.userName
                    pAutor.classList.add('pAutor')
                    const pOutro = document.createElement('p')
                    pOutro.id = 'mensagemOutro'
                    pOutro.innerText = postagem.conteudo
                    
                    divMensagem.appendChild(pAutor)
                    divMensagem.appendChild(pOutro)
                    divOutro.appendChild(divMensagem)

                    mainConversa.append(divOutro)
                }
            });
        })
    })
}

const form = document.getElementById('form')
form.addEventListener('submit', function(evt){
    evt.preventDefault()
})

async function mandarPostagem(){

    const texto = document.getElementById('texto')

    const postagem = {
        autor: {id: sessionStorage.getItem('userId')},
        conteudo: texto.value,
        forum: {id: sessionStorage.getItem('idChatForum')}
    }

    const POST = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postagem)
    }

    await fetch(`http://localhost:8080/api/postagem`, POST)
    .then((response) => {
        response.json().then((retorno) => {  
        })
    })
    
    abrirForum()
    texto.value = ''
}

async function buscaInfo(){
    await fetch(`http://localhost:8080/api/forum/id/${sessionStorage.getItem('idChatForum')}`)
    .then((response) => {
        response.json().then((forum) => {
            this.document.getElementById('nomeForumInfo').value = forum.nome
            this.document.getElementById('descInfo').value = forum.descricao
            this.document.getElementById('criadorInfo').innerText = forum.criador.userName
            document.getElementById('imgInfo').src = forum.foto

            if(forum.criador.id == sessionStorage.getItem('userId')){
                btAlterar.style.display = 'inline'
            }
        })
    })
}

const topo = this.document.getElementById('topo')
const info = this.document.getElementById('info')
topo.addEventListener('click', function(){
    info.style.animation = 'informar 1s'
    info.addEventListener('animationend', function(){
        info.style.transform = 'translate(0px)'
    })
})

const fecha = document.getElementById('fechaInfo')
fecha.addEventListener('click', function(){
    info.style.animation = 'sumir 1s'
    info.addEventListener('animationend', function(){
        info.style.transform = 'translate(-10000px)'
    })
    desabilitar()

    btAlterar.style.display = 'none'
})

btAlterar.addEventListener('click', function() {

    infoNome.removeAttribute('disabled')
    infoNome.style.borderBottom = '2px solid #008000'

    descInfo.removeAttribute('disabled')
    descInfo.style.borderBottom = '2px solid #008000'
    descInfo.style.borderLeft = '2px solid #008000'

    inpForum.style.display = 'block'

    btAlterar.style.display = 'none'
    btRegistrar.style.display = 'inline'

})

inpForum.addEventListener('change', function() {
    if(inpForum.files.length > 0){
        const img = inpForum.files[0]
        const leitor = new FileReader()

        leitor.onload = async function(arqCarregado){
            const imgCovertida = arqCarregado.target.result

            document.getElementById('imgInfo').src = imgCovertida

            console.log(imgCovertida);
        }   
        leitor.readAsDataURL(img)
    }
})

btRegistrar.addEventListener('click', async function() {
    const imgInfo = document.getElementById('imgInfo')

    const forum = {
        id: sessionStorage.getItem('idChatForum'),
        nome: document.getElementById('nomeForumInfo').value,
        descricao: document.getElementById('descInfo').value,
        criador: {id: sessionStorage.getItem('userId')},
        foto: imgInfo.src
    }

    const PUT = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(forum)
    }

    const sucesso = document.getElementById('sucesso')
    await fetch(`http://localhost:8080/api/forum/${sessionStorage.getItem('idChatForum')}`, PUT)
    .then((response) => {
        response.json().then((resposta) => {
            console.log(resposta);

            if(resposta.mensagem == "Sucesso"){
                buscaInfo()
                desabilitar()

                sucesso.style.animation = 'notificar 10s'
            }

        })
    })

    sucesso.style.animation = 'none'


})

function desabilitar(){

    infoNome.setAttribute('disabled', true)
    infoNome.style.borderBottom = '1px solid #A1D059'

    descInfo.setAttribute('disabled', true)
    descInfo.style.border = 'none'
    descInfo.style.borderBottom = '1px solid #A1D059'

    inpForum.style.display = 'none'

    btAlterar.style.display = 'inline'
    btRegistrar.style.display = 'none'
    
}