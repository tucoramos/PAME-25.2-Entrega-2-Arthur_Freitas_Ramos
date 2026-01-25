const requisicao = require("readline-sync");
const Sistema = require("./models/sistema");

let sistema = new Sistema();

let sair = false;
while (sair === false) {
  /* Opcoes iniciais para o usuario */
  console.log(
    "Digite o número correspondente a ação desejada\n" +
      "1)Fazer login.\n" +
      "2)Fazer cadastro.\n" +
      "3)Sair do sistema.",
  );
  let escolha = Number(requisicao.question("Escolha: "));
  console.log("");

  if (escolha == 1) {
    let email = requisicao.question("Email: ");
    let senha = requisicao.question("Senha: ");
    let Id = sistema.procurarUsuario(email, senha);
    if (Id === false) {
      console.log("Email ou senha errados...", "\n");
      continue;
    }
    Logar(Id);
  } else if (escolha == 2) {
    while (true) {
      console.log(
        "Que tipo de usuario voce deseja cadastrar Agente de trânsito[A] ou Condutor[C]?",
      );
      let tipo = requisicao.question("Digite a letra correspondente: ");
      console.log("");
      if (tipo === "A") {
        let valido = false;
        while (valido === false) {
          try {
            console.log("----Registro de agente de trânsito----");
            let nome = requisicao.question("Nome: ");
            let cpf = requisicao.question("CPF: ");
            let matr = requisicao.question("Número de matrícula: ");
            let email = requisicao.question("Email: ");
            let senha = requisicao.question("Senha: ");
            sistema.criarAgente(nome, cpf, matr, email, senha);
            valido = true;
          } catch (err) {
            console.log(
              "Erro ao criar agente de trânsito: ",
              err.message,
              "\n",
            );
          }
        }
        break;
      } else if (tipo === "C") {
        let valido = false;
        while (valido === false) {
          try {
            console.log("----Registro de condutor----");
            let nome = requisicao.question("Nome: ");
            let cpf = requisicao.question("CPF: ");
            let nascimento = requisicao.question("Data de nascimento: ");
            let email = requisicao.question("Email: ");
            let senha = requisicao.question("Senha: ");
            sistema.criarCondutor(nome, cpf, nascimento, email, senha);
            valido = true;
          } catch (err) {
            console.log("Erro ao criar condutor: ", err.message, "\n");
          }
        }
        break;
      } else {
        console.log("Opção invalida, tente novamente.", "\n");
      }
    }
  } else if (escolha == 3) {
    break;
  } else {
    console.log("Numero Invalido, tente novamente.", "\n");
  }
}

function Logar(Id) {
  let tipo = sistema.tipoId(Id);
  if (tipo === "condutor") {
    let sair = false;
    while (sair === false) {
      console.log(
        "\n----Menu de Condutor (" +
          sistema.nomeUsuario(Id) +
          ")----\n" +
          "Digite o número correspondente a ação desejada\n" +
          "1)Visualizar informações pessoais.\n" +
          "2)Consultar histórico pessoal de infrações.\n" +
          "3)Cadastrar um novo veículo.\n" +
          "4)Pagar multa.\n" +
          "5)Recorrer multa.\n" +
          "6)Sair",
      );
      let escolha = Number(requisicao.question("Escolha: "));
      console.log("");
      switch (escolha) {
        case 1:
          console.log(sistema.infoCondutor(Id));
          break;
        case 2:
          console.log(sistema.infraCondutor(Id));
          break;
        case 3:
          cadastrarVeiculo();
          break;
        case 4:
          pagarMulta();
          break;
        case 5:
          recorrerMulta();
          break;
        case 6:
          console.log("Voltando para o menu principal...", "\n");
          sair = true;
          break;
        default:
          console.log("Opção invalida, tente novamente.", "\n");
      }
    }
  } else if (tipo === "agente") {
    let sair = false;
    while (sair === false) {
      console.log(
        "\n----Menu de Agente (" +
          sistema.nomeUsusario(Id) +
          ")----\n" +
          "Digite o número correspondente a ação desejada\n" +
          "1)Visualizar informações do perfil.\n" +
          "2)Consultar veículos cadastrados.\n" +
          "3)Consultar base de motoristas.\n" +
          "4)Registrar uma nova infração para um condutor.\n" +
          "5)Listagem geral das multas.\n" +
          "6)Atualizar a situação da infração.\n" +
          "7)Sair",
      );
      let escolha = Number(requisicao.question("Escolha: "));
      console.log("");
      switch (escolha) {
        case 1:
          console.log(sistema.infoAgente(Id));
          break;
        case 2:
          console.log(sistema.veiculosCadastrados(Id));
          break;
        case 3:
          console.log(sistema.motoristasCadastrados(Id));
          break;
        case 4:
          registrarInfração();
          break;
        case 5:
          console.log(sistema.multasCadastradas(Id));
          break;
        case 6:
          atualizarInfração();
          break;
        case 7:
          console.log("Voltando para o menu principal...", "\n");
          sair = true;
          break;
        default:
          console.log("Opção invalida, tente novamente.", "\n");
      }
    }
  }
}

function cadastrarVeiculo() {
  let valido = false;
  while (valido === false) {
    try {
      console.log("----Cadastro de Veículo----");
      let placa = requisicao.question("Placa: ");
      let modelo = requisicao.question("Modelo: ");
      let marca = requisicao.question("Marca: ");
      let cor = requisicao.question("Cor: ");
      sistema.criarCarro(placa, modelo, marca, cor);
      valido = true;
    } catch (err) {
      console.log("Erro ao registrar veiculo: ", err.message, "\n");
    }
  }
}

function pagarMulta() {
  let valido = false;
  while (valido === false) {
    try {
      console.log("----Pagamento de Infração----");
      let multa = requisicao.question("Id da multa que deseja pagar: ");
      sistema.pagarMulta(multa);
      valido = true;
    } catch (err) {
      console.log("Erro ao pagar multa: ", err.message, "\n");
    }
  }
}
function recorrerMulta() {
  let valido = false;
  while (valido === false) {
    try {
      console.log("----Recorrência de Infração----");
      let multa = requisicao.question("Id da multa que deseja recorrer: ");
      sistema.recorrerMulta(multa);
      valido = true;
    } catch (err) {
      console.log("Erro ao recorrer multa: ", err.message, "\n");
    }
  }
}

function registrarInfração() {
  let valido = false;
  while (valido === false) {
    try {
      console.log("----Registro de Infração----");
      let cliente = requisicao.question("Id do cliente: ");
      let tipo = requisicao.question("tipo da infração: ");
      let valor = requisicao.question("valor da infração: ");
      let data = requisicao.question("data: ");
      sistema.addMulta(cliente, tipo, valor, data);
      valido = true;
    } catch (err) {
      console.log("Erro ao registrar multa: ", err.message, "\n");
    }
  }
}

function atualizarInfração() {
  let valido = false;
  while (valido === false) {
    try {
      console.log("----Atualização de Infração----");
      let multa = requisicao.question("Id da multa que deseja atualizar: ");
      let valido2 = false;
      while (valido2 === false) {
        console.log(
          "Digite o numero correspondente ao status da multa: \n" +
            "    1)pendente\n" +
            "    2)paga\n" +
            "    3)cancelada\n" +
            "    4)recorrida",
        );
        let escolha = Number(requisicao.question("opção: "));
        var status;
        switch (escolha) {
          case 1:
            status = "pendente";
            valido2 = true;
            break;
          case 2:
            status = "paga";
            valido2 = true;
            break;
          case 3:
            status = "cancelada";
            valido2 = true;
            break;
          case 4:
            status = "recorrida";
            valido2 = true;
            break;
          default:
            console.log("Opção Invalida, tente novamente!");
        }
      }
      sistema.atualizarMulta(multa, status);
      valido = true;
    } catch (err) {
      console.log("Erro ao atualizar multa:", err.message, "\n");
    }
  }
}
