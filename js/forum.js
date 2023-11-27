if (sessionStorage.getItem('token') == null) {
    location.replace('http://127.0.0.1:5500/index.html')
}

const lupa = document.getElementById('lupa')

const body = document.getElementById('formForum')
if (body == null) {
    const campName = document.getElementById('nomeUsuario')
    campName.innerText = sessionStorage.getItem("username")

    const perfil = document.getElementById('perfil')
    perfil.src = sessionStorage.getItem('fotoPerfil')

    window.addEventListener('DOMContentLoaded', listar)

    lupa.addEventListener('click', pesquisarForum)
} else {
    const btCriar = document.getElementById('btCriarForum')
    const imgPerfil = document.getElementById('imgPerfil')

    imgPerfil.addEventListener('change', function() {
        if(imgPerfil.files.length > 0){
            const img = imgPerfil.files[0]
            const leitor = new FileReader()
    
            leitor.onload = async function(arqCarregado){
                const imgCovertida = arqCarregado.target.result
    
                document.getElementById('imgForum').src = imgCovertida
    
                console.log(imgCovertida);
            }   
            leitor.readAsDataURL(img)
        }
    })

    btCriar.addEventListener('click', cadastrar)
}

async function listar() {

    const main = document.getElementById('main')

    const response = await fetch("http://localhost:8080/api/forum").then((resposta) => {
        resposta.json().then((forum) => {

            forum.forEach(forum => {

                const divForum = document.createElement('div')
                divForum.classList.add('forum')
                const img = document.createElement('img')
                img.src = forum.foto
                img.id = "fotoForum"
                const liNome = document.createElement('li')
                liNome.textContent = `${forum.nome}`
                const pDescricao = document.createElement('p')
                pDescricao.innerHTML = `${forum.descricao}`
                pDescricao.id = 'assuntoForum'
                const divPart = document.createElement('div')
                divPart.classList.add('participar')
                const pCriador = document.createElement('p')
                pCriador.id = 'criadoPor'
                pCriador.innerHTML = `Criado por ${forum.criador.userName}`
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

                console.log(forum.integrantes);

                forum.integrantes.forEach(participante => {
                    if (participante.id == sessionStorage.getItem('userId')) {
                        btParticipar.style.display = 'none'
                    }
                });

                btParticipar.addEventListener('click', async function () {
                    const PUT = {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" }
                    }

                    await fetch(`http://localhost:8080/api/forum/${forum.id}/${sessionStorage.getItem('userId')}`, PUT)
                        .then((response) => {
                            response.json().then((resposta) => {
                                if (resposta.mensagem == "Sucesso") {
                                    btParticipar.style.display = 'none'
                                }
                            })
                        })
                })
            });
        })
    })
}

async function cadastrar() {
    const imgForum = document.getElementById('imgForum')

    const forum = {
        nome: nomeForum.value,
        descricao: descForum.value,
        criador: {
            id: sessionStorage.getItem('userId')
        }, 
        foto: imgForum.src
    }

    const post = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(forum)
    }

    await fetch('http://localhost:8080/api/forum', post).then((response) => {
        response.json().then((resposta) => {
            console.log(resposta)
            if (resposta.mensagem == 'Sucesso') {
                const sucesso = document.getElementById('sucesso')
                sucesso.style.animation = 'notificar 2s'
                sucesso.style.display = 'block'
            }
        })
    })
}

async function pesquisarForum() {
    const main = document.getElementById('main')
    const pesquisar = document.getElementById('pesquisar')

    if (pesquisar.value == "") {
        main.innerHTML = ""
        listar()
    } else {
        main.innerHTML = ""
        const response = await fetch(`http://localhost:8080/api/forum/palavra/${pesquisar.value}`).then((resposta) => {
            resposta.json().then((forum) => {

                forum.forEach(forum => {

                    const divForum = document.createElement('div')
                    divForum.classList.add('forum')
                    const img = document.createElement('img')
                    img.src = forum.foto
                    img.id = "fotoForum"
                    const liNome = document.createElement('li')
                    liNome.textContent = `${forum.nome}`
                    const pDescricao = document.createElement('p')
                    pDescricao.innerHTML = `${forum.descricao}`
                    pDescricao.id = 'assuntoForum'
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


}