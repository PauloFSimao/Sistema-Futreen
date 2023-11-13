const username = document.getElementById('nameUser')
const nomeCom = document.getElementById('nomeCom')
const dataNasc = document.getElementById('dataNasc')
const email = document.getElementById('email')
const bio = document.getElementById('bio')

const btAlterar = document.getElementById('disponibilizar')

const form = document.getElementById('card')

const alterar = document.getElementById('alterar')

window.addEventListener('DOMContentLoaded', buscaDados())

btAlterar.addEventListener('click', function () {
    disponibilizar()
})

btAlterar.addEventListener('click', disponibilizar)

alterar.addEventListener('click', alterarUser)


function disponibilizar() {
    username.removeAttribute('disabled')
    username.style.borderBottom = '2px solid #008000'

    nomeCom.removeAttribute('disabled')
    nomeCom.style.borderBottom = '2px solid #008000'

    dataNasc.removeAttribute('disabled')
    dataNasc.style.borderBottom = '2px solid #008000'

    email.removeAttribute('disabled')
    email.style.borderBottom = '2px solid #008000'

    bio.removeAttribute('disabled')

    btAlterar.style.display = 'none'
    alterar.style.display = 'inline'
}

function desabilitar() {
    username.setAttribute('disabled', true)
    username.style.border = 'none'

    nomeCom.setAttribute('disabled', true)
    nomeCom.style.border = 'none'

    dataNasc.setAttribute('disabled', true)
    dataNasc.style.border = 'none'

    email.setAttribute('disabled', true)
    email.style.border = 'none'

    bio.setAttribute('disabled', true)

    btAlterar.style.display = 'inline'
    alterar.style.display = 'none'
}


async function buscaDados() {
    await fetch(`http://localhost:8080/api/usuario/${sessionStorage.getItem('userId')}`)
        .then((response) => {
            response.json().then((resposta) => {
                username.value = resposta.userName
                nomeCom.value = resposta.nome
                dataNasc.value = resposta.dataNasc
                email.value = resposta.email
                bio.innerText = resposta.bio
            })
        })
}

async function alterarUser() {

    const user = {
        id: sessionStorage.getItem('userId'),
        nome: nomeCom.value,
        dataNasc: dataNasc.value,
        email: email.value,
        bio: bio.value,
        userName: username.value
    }

    const PUT = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }

    await fetch(`http://localhost:8080/api/usuario/${user.id}`, PUT)
        .then((response) => {
            response.json().then((resposta) => {
                console.log(resposta)
                if (resposta.status == "OK") {
                    buscaDados()
                    desabilitar()

                    sessionStorage.setItem('username', user.userName)

                    const sucesso = document.getElementById('sucesso')

                    
                }
            })
        })
}



