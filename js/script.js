const KEY_BD='@paciente'


var listaRegistros = {
    ultimoIdGerado:0,
    pacientes:[]
}


var FILTRO = ''

// Funções de gravar e ler os dados no local storage.
function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}

// Essa função desenha as tabelas.
function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.pacientes
        if(FILTRO.trim()){  //Condição que faz o filtro funcionar
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( paciente => {
                return expReg.test( paciente.nome ) // Aqui faz o filtro realizar as pesquisar pelo nome.
            } )
        }
        data = data
        .sort( (a, b) => {
            return a.nome < b.nome ? -1 : 1 // Deixa a lista em ordem alfabética.
            })
            .map( paciente => {

                return `<tr>
                        <td>${paciente.id}</td>
                        <td>${paciente.nome}</td>
                        <td>${paciente.dataNascimento}</td>
                        <td>${paciente.cpf}</td>
                        <td>${paciente.sexo}</td>
                        <td>${paciente.endereco}</td>
                        <td>${paciente.statusPaciente}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${paciente.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${paciente.id})'>Deletar</button>                        
                        </td>
                        <tr>`
            } )
    }   tbody.innerHTML = data.join('')
}

//Aqui será inserido os dados do formulário de cadastro na lista de cadastrados.
function insertPaciente(nome, dataNascimento, cpf, sexo, endereco, statusPaciente){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.pacientes.push({
        id,nome, dataNascimento, cpf, sexo, endereco, statusPaciente
   })
   gravarBD()
   desenhar()
   vizualizar('lista')
}

//Edição dos dados da lista.
function editPaciente(id,nome, dataNascimento, cpf, sexo, endereco, statusPaciente){
    var paciente = listaRegistros.pacientes.find(paciente => paciente.id == id)
    paciente.nome = nome;
    paciente.dataNascimento = dataNascimento;
    paciente.cpf = cpf;
    paciente.sexo = sexo;
    paciente.endereco = endereco;
    paciente.statusPaciente = statusPaciente;

    gravarBD()
    desenhar()
    vizualizar('lista')    
}

//Deletar pacientes.
function deletePaciente(id){
    listaRegistros.pacientes = listaRegistros.pacientes.filter( paciente => {
        return paciente.id != id
    })
    gravarBD()
    desenhar()
}

//Apenas faz uma verificação se realmente deseja deletar o cadastro do paciente.
function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro?')){
        deletePaciente(id)      
    }
}


//Limpa os campos de edição, para quando clicar em salvar deixar os campos do formulário vazio.
function limparEdicao(){
    document.getElementById('id').value = ''
    document.getElementById('nome').value = ''
    document.getElementById('dataNascimento').value = ''
    document.getElementById('cpf').value = ''
    document.getElementById('sexo').value = ''
    document.getElementById('endereco').value = ''
    document.getElementById('status').value = ''

}

function vizualizar(pagina, novo = false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const paciente = listaRegistros.pacientes.find(paciente => paciente.id == id)
            if(paciente){ //Aqui puxa o ID de cada imput do html para adicionar os dados em seus respectivos campos.
                document.getElementById('id').value = paciente.id
                document.getElementById('nome').value = paciente.nome
                document.getElementById('dataNascimento').value = paciente.dataNascimento
                document.getElementById('cpf').value = paciente.cpf
                document.getElementById('sexo').value = paciente.sexo
                document.getElementById('endereco').value = paciente.endereco
                document.getElementById('status').value = paciente.statusPaciente
                
            }
        }
        document.getElementById('nome').focus()
    }

}

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        cpf: document.getElementById('cpf').value,
        sexo: document.getElementById('sexo').value,
        endereco: document.getElementById('endereco').value,
        statusPaciente: document.getElementById('status').value,
    }
    if (data.id){
        editPaciente(data.id, data.nome, data.dataNascimento, data.cpf, data.sexo, data.endereco, data.statusPaciente)
    }else{
        insertPaciente( data.nome, data.dataNascimento, data.cpf, data.sexo, data.endereco, data.statusPaciente)
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => { //Toda vez que for adicionada uma letra no input de pesquisa a tabela já atualiza.
        pesquisar(e.target.value)
    })
})