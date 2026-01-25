const Veiculo = require("./veiculo");
const Multa = require("./multa");
const Agente = require("./agente");
const Condutor = require("./condutor");

class Sistema {
  constructor() {
    const mapIds = new Map();
    const mapLogin = new Map();
  }
  criarAgente(nome, cpf, matr, email, senha) {
    //gera um id para o agente tenta criar o agente caso resulte em erro chama um erro com a msm msg
    //caso nao resulte em erro add 1 ao num de agente, adiciona ele no dicionario de Ids e no de email/senha
  }
  criarCondutor(nome, cpf, nascimento, email, senha) {
    // msm coisa que o Agente
  }
  addMulta(cliente, tipo, valor, data, status) {
    // msm coisa que o Agent
  }
  criarCarro(placa, modelo, marca, cor) {
    //tenta criar o carro caso resulte em erro chama um erro com a msm msg
  }
  atualizarMulta(multa, status) {
    //atualizar status da multa caso resulte em erro chama um erro com a msm msg
  }
  procurarUsuario(email, senha) {
    // recebe uma senha e um email e retorna Id do usuario caso ele exista
    // retorna false caso ele nao esteja registrado
    // temporario para nao dar erro nos requires!
  }
  nomeUsuario(Id) {
    //recebe um Id e retorna o nome do usuario correspondente
  }
  tipoId(Id) {
    // retorna se é de Multa, de Agente ou de Condutor ou false (nao existe).
    // Importante nao checa se o Id realmente esta no sistema
  }
  infoAgente(Id) {
    // retorna uma string com as info do agente
  }
  infoCondutor(Id) {
    // retorna uma string com as info do condutor
  }
  infraCondutor(Id) {
    // retorna uma string com as infrações do condutor
  }
  veiculosCadastrados(Id) {
    // retorna uma string com os veiculos cadastrados
  }
  motoristasCadastrados(Id) {
    // retorna uma string com os motoristas cadastrados
  }
  multasCadastradas(Id) {
    // retorna uma string com as multas cadastrados
  }
  pagarMulta(multa) {
    //busca a multa por ID, caso ela não exista da um erro,caso exista muda o status dela para paga
  }
}

module.exports = Sistema;
