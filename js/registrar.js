const campNome = document.getElementById('nome');
const campData = document.getElementById('dataNasc');
const campUserName = document.getElementById('usuario');
const campEmail = document.getElementById('email');
const campSenha = document.getElementById('senha');
const campBio = document.getElementById('bio');

const msgSucesso = document.getElementById('sucesso')

const btCadastrar = document.getElementById('cadastrar')

const imgPerfil = document.getElementById('imgPerfil')

imgPerfil.addEventListener('change', function() {
    if(imgPerfil.files.length > 0){
        const img = imgPerfil.files[0]
        const leitor = new FileReader()

        leitor.onload = async function(arqCarregado){
            const imgCovertida = arqCarregado.target.result

            document.getElementById('logo').src = imgCovertida

            console.log(imgCovertida);
        }   
        leitor.readAsDataURL(img)
    }
})

btCadastrar.addEventListener('click', async function() {
    let imagem = ""
    if(imgPerfil.files.length > 0){
        imagem = document.getElementById('logo').src
    }else{
        imagem = 'data:image/png;base64,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'
    }
    
    const usuario = {
        nome: campNome.value,
        dataNasc: campData.value,
        userName: `@${campUserName.value}`,
        email: campEmail.value,
        senha: campSenha.value,
        bio: campBio.value,
        foto: imagem
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
                sessionStorage.setItem('fotoPerfil', retorno[3])

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
