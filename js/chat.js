if(sessionStorage.getItem('token') == null){
    location.replace('http://127.0.0.1:5500/index.html')
}

const nomeUser = document.getElementById('nomeUsuario')
nomeUser.innerText = sessionStorage.getItem("username")

const perfil = document.getElementById('perfil')
perfil.src = sessionStorage.getItem('fotoPerfil')

const idChat = document.getElementById('chat')
const idConversa = document.getElementById('conversa')

const pesquisar = document.getElementById('pesquisar')
const lupa = document.getElementById('lupa')

const fotoConv = document.getElementById('imgPerfilConv')

window.addEventListener('DOMContentLoaded', buscaHistorico())

async function buscaHistorico() {
    const main = this.document.getElementById('main')

    usuariosBd = await this.fetch(`http://localhost:8080/api/mensagem/${this.sessionStorage.getItem("userId")}`)
        .then((resposta) => {
            resposta.json().then((usuarios) => {
                console.log(usuarios);
                usuarios.forEach(usuario => {
                    if (usuario.id != this.sessionStorage.getItem('userId')) {

                        const divConversa = this.document.createElement('div')
                        divConversa.className = 'conversa'
                        const imagem = this.document.createElement('img')
                        imagem.src = usuario.foto
                        imagem.id = 'fotoUsuario'
                        const nome = this.document.createElement('p')
                        nome.id = 'usuario'
                        nome.innerHTML = usuario.userName

                        divConversa.id = usuario.id
                        divConversa.appendChild(imagem)
                        divConversa.appendChild(nome)

                        main.appendChild(divConversa)

                        divConversa.addEventListener('click', function () {
                            sessionStorage.setItem('idConversa', this.id)
                            idChat.style.width = '45%'
                            idConversa.style.display = 'flex'
                            fotoConv.src = imagem.src
                            document.getElementById('covName').innerText = usuario.userName
                            mostrarConversa()
                            buscaInfo()
                        })
                    }
                });
            })
        })

}


async function mostrarConversa() {
    const main = this.document.getElementById('mainConv')
    const nomeConversa = document.getElementById('covName')

    main.innerHTML = ""

    const response = await fetch(`http://localhost:8080/api/mensagem/${sessionStorage.getItem('userId')}/${sessionStorage.getItem('idConversa')}`)
        .then((resposta) => {
            resposta.json().then((mensagens) => {
                mensagens.forEach(mensagem => {


                    if (mensagem.remetente.id == sessionStorage.getItem('userId')) {
                        const divEu = document.createElement('div')
                        divEu.className = 'divEu'
                        const pEu = document.createElement('p')
                        pEu.id = 'mensagemEu'
                        pEu.innerText = mensagem.mensagem

                        divEu.appendChild(pEu)

                        main.append(divEu)
                    } else {
                        const divOutro = document.createElement('div')
                        divOutro.className = 'divOutro'
                        const pOutro = document.createElement('p')
                        pOutro.id = 'mensagemOutro'
                        pOutro.innerText = mensagem.mensagem

                        divOutro.appendChild(pOutro)

                        main.appendChild(divOutro)
                    }
                })
            })
        })
}

const form = document.getElementById('form')
form.addEventListener('submit', function (evt) {
    evt.preventDefault()
})

async function mandarMensagem() {

    const texto = document.getElementById('texto')

    const mensagem = {
        remetente: { id: sessionStorage.getItem('userId') },
        destinatario: { id: sessionStorage.getItem('idConversa') },
        mensagem: texto.value
    }

    const POST = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensagem)
    }

    await fetch('http://localhost:8080/api/mensagem', POST).then((response) => {
        response.json().then((resposta) => {
            console.log(resposta);

            if (resposta.mensagem == 'Sucesso') {
                mostrarConversa()
                texto.value = ''

            }
        })
    })
}

async function buscaInfo() {

    await fetch(`http://localhost:8080/api/usuario/${sessionStorage.getItem('idConversa')}`)
        .then((response) => {
            response.json().then((usuario) => {

                this.document.getElementById('nomeInfo').innerText = usuario.userName
                this.document.getElementById('bioInfo').innerText = usuario.bio
                document.getElementById('imgInfo').src = usuario.foto

            })
        })
}

const topo = this.document.getElementById('topo')
const info = this.document.getElementById('info')
topo.addEventListener('click', function () {
    info.style.animation = 'informar 1s'
    info.addEventListener('animationend', function () {
        info.style.transform = 'translate(0px)'
    })
})

const fecha = document.getElementById('fechaInfo')
fecha.addEventListener('click', function () {
    info.style.animation = 'sumir 1s'
    info.addEventListener('animationend', function () {
        info.style.transform = 'translate(-10000px)'
    })
})

lupa.addEventListener('click', pesquisarUser)

async function pesquisarUser() {
    const main = document.getElementById('main')

    if (pesquisar.value == "") {
        main.innerHTML = ""
        buscaHistorico()
    } else {
        main.innerHTML = ""
        usuariosBd = await fetch(`http://localhost:8080/api/usuario/nome/${pesquisar.value}`)
            .then((resposta) => {
                resposta.json().then((usuarios) => {

                    usuarios.forEach(usuario => {

                        const divConversa = document.createElement('div')
                        divConversa.className = 'conversa'
                        const imagem = document.createElement('img')
                        imagem.src = usuario.foto
                        imagem.id = 'fotoUsuario'
                        const nome = document.createElement('p')
                        nome.id = 'usuario'
                        nome.innerHTML = usuario.userName

                        divConversa.id = usuario.id
                        divConversa.appendChild(imagem)
                        divConversa.appendChild(nome)

                        main.appendChild(divConversa)

                        divConversa.addEventListener('click', function () {
                            sessionStorage.setItem('idConversa', this.id)
                            idChat.style.width = '45%'
                            idConversa.style.display = 'flex'
                            fotoConv.src = imagem.src
                            document.getElementById('covName').innerText = usuario.userName
                            mostrarConversa()
                            buscaInfo()
                        })
                    });
                })
            })
    }
}


