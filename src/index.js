const requisicao = require("readline-sync");
const Sistema = require("./models/Sistema");

let sistema = new Sistema();

let sair = false;
while (sair === false) {
  /* Opcoes iniciais para o usuario */
  console.log("----Menu Inicial----");
  console.log(
    "1) Fazer login.\n" +
      "2) Fazer cadastro.\n" +
      "3) Sair do sistema.\n" +
      "Digite o número correspondente a ação desejada",
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
            console.log("Agente de trânsito criado com sucesso!");
            console.log("");
          } catch (err) {
            console.log(
              "Erro ao criar agente de trânsito: ",
              err.message,
              "\n",
            );
            let tentarNovamente = requisicao.question(
              "Caso não queira tentar novamente digite 'n', qualquer outra coisa será identificada como sim: ",
            );
            if (tentarNovamente.toLowerCase() === "n") {
              valido = true;
            }
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
            let nascimento = requisicao.question(
              "Data de nascimento(DD-MM-AAAA): ",
            );
            let email = requisicao.question("Email: ");
            let senha = requisicao.question("Senha: ");
            sistema.criarCondutor(nome, cpf, nascimento, email, senha);
            valido = true;
            console.log("Condutor criado com sucesso!");
            console.log("");
          } catch (err) {
            console.log("Erro ao criar condutor: ", err.message, "\n");
            let tentarNovamente = requisicao.question(
              "Caso não queira tentar novamente digite 'n', qualquer outra coisa será identificada como sim: ",
            );
            if (tentarNovamente.toLowerCase() === "n") {
              valido = true;
            }
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
          "1) Visualizar informações pessoais.\n" +
          "2) Editar informações pessoais.\n" +
          "3) Consultar histórico pessoal de infrações.\n" +
          "4) Cadastrar um novo veículo.\n" +
          "5) Excluir veículo cadastrado.\n" +
          "6) Pagar multa.\n" +
          "7) Recorrer multa.\n" +
          "8) Sair",
      );
      let escolha = Number(requisicao.question("Escolha: "));
      console.log("");
      switch (escolha) {
        case 1:
          console.log(sistema.infoCondutor(Id));
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 2:
          editarCondutor(Id);
          break;
        case 3:
          console.log(sistema.infraCondutor(Id));
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 4:
          cadastrarVeiculo(Id);
          break;
        case 5:
          console.log(sistema.veiculosCondutor(Id));
          requisicao.question("Digite qualquer coisa para continuar: ");
          excluirVeiculo(Id);
          break;
        case 6:
          pagarMulta(Id);
          break;
        case 7:
          recorrerMulta(Id);
          break;
        case 8:
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
          sistema.nomeUsuario(Id) +
          ")----\n" +
          "Digite o número correspondente a ação desejada\n" +
          "1) Visualizar informações do perfil.\n" +
          "2) Editar informações pessoais.\n" +
          "3) Consultar veículos cadastrados.\n" +
          "4) Buscar veículos por placa\n" +
          "5) Consultar base de motoristas.\n" +
          "6) Registrar uma nova infração para um condutor.\n" +
          "7) Listagem geral das multas.\n" +
          "8) Atualizar a situação da infração.\n" +
          "9) Relatório de multas\n" +
          "10) Sair",
      );
      let escolha = Number(requisicao.question("Escolha: "));
      console.log("");
      switch (escolha) {
        case 1:
          console.log(sistema.infoAgente(Id));
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 2:
          editarAgente(Id);
          break;
        case 3:
          console.log(sistema.veiculosCadastrados());
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 4:
          BuscarVeiculoPorPlaca();
          break;
        case 5:
          console.log(sistema.motoristasCadastrados());
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 6:
          registrarInfração();
          break;
        case 7:
          console.log(sistema.multasCadastradas());
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 8:
          atualizarInfração();
          break;
        case 9:
          relatorioMultas();
          requisicao.question("Digite qualquer coisa para continuar: ");
          break;
        case 10:
          console.log("Voltando para o menu principal...", "\n");
          sair = true;
          break;
        default:
          console.log("Opção invalida, tente novamente.", "\n");
      }
    }
  }
}

function editarCondutor(Id) {
  try {
    console.log(
      "----Edição de Condutor----\n" +
        "1) Nome\n" +
        "2) CPF\n" +
        "3) Data de nascimento\n" +
        "4) Senha",
      "5) Sair",
    );
    let mudança = Number(requisicao.question("O que deseja editar? "));
    if (mudança === 5) {
      console.log("Operação cancelada.");
      return;
    }
    let novo = requisicao.question("Novo valor: ");
    if (mudança >= 1 && mudança <= 4) {
      let possiveisMud = ["nome", "cpf", "nascimento", "senha"];
      mudança = possiveisMud[mudança - 1];
      sistema.editarCondutor(Id, mudança, novo);
      console.log("Condutor editado com sucesso!");
    } else {
      console.log("Opção inválida.");
    }
  } catch (err) {
    console.log("Erro ao editar condutor: ", err.message, "\n");
  }
}

function editarAgente(Id) {
  try {
    console.log(
      "----Edição de Agente de Trânsito----\n" +
        "1) Nome\n" +
        "2) CPF\n" +
        "3) Número de matrícula\n" +
        "4) Senha",
      "5) Sair",
    );
    let mudança = Number(requisicao.question("O que deseja editar? "));
    if (mudança === 5) {
      console.log("Operação cancelada.");
      return;
    }
    let novo = requisicao.question("Novo valor: ");
    let possiveisMud = ["nome", "cpf", "matricula", "senha"];
    mudança = possiveisMud[mudança - 1];
    sistema.editarAgente(Id, mudança, novo);
    console.log("Agente de trânsito editado com sucesso!");
  } catch (err) {
    console.log("Erro ao editar agente de trânsito: ", err.message, "\n");
  }
}

function cadastrarVeiculo(Id) {
  try {
    console.log("----Cadastro de Veículo----");
    let placa = requisicao.question("Placa: ");
    let modelo = requisicao.question("Modelo: ");
    let marca = requisicao.question("Marca: ");
    let cor = requisicao.question("Cor: ");
    sistema.criarCarro(Id, placa, modelo, marca, cor);
    console.log("Veículo cadastrado com sucesso!");
  } catch (err) {
    console.log("Erro ao registrar veiculo: ", err.message, "\n");
  }
}

function excluirVeiculo(Id) {
  try {
    console.log(
      "----Exclusão de Veículo----\n" +
        "De que forma deseja buscar o veiculo?\n" +
        "\n1) Placa\n2) ID",
    );

    let busca = Number(requisicao.question("Escolha: "));
    if (busca === 1) {
      let placa = requisicao.question(
        "Digite a placa do veículo que deseja excluir: ",
      );
      sistema.excluirCarro(Id, null, placa);
    } else if (busca === 2) {
      let idV = requisicao.question(
        "Digite o ID do veículo que deseja excluir: ",
      );
      sistema.excluirCarro(Id, idV, null);
    } else {
      console.log("Opção inválida.");
      return;
    }
    console.log("Veículo excluído com sucesso!");
  } catch (err) {
    console.log("Erro ao excluir veículo: ", err.message, "\n");
  }
}

function BuscarVeiculoPorPlaca() {
  try {
    console.log("----Busca de Veículo por Placa----");
    let placa = requisicao.question("Digite a placa do veículo: ");
    console.log(sistema.buscarVeiculoPorPlaca(placa));
  } catch (err) {
    console.log("Erro ao buscar veículo: ", err.message, "\n");
  }
}

function pagarMulta(Id) {
  try {
    console.log("----Pagamento de Infração----");
    let multa = requisicao.question("Id da multa que deseja pagar: ");
    sistema.atualizarMulta(multa, "paga", Id);
    console.log("Multa paga com sucesso!");
  } catch (err) {
    console.log("Erro ao pagar multa: ", err.message, "\n");
  }
}

function recorrerMulta(Id) {
  try {
    console.log("----Recorrência de Infração----");
    let multa = requisicao.question("Id da multa que deseja recorrer: ");
    sistema.atualizarMulta(multa, "recorrida", Id);
    console.log("Multa recorrida com sucesso!");
  } catch (err) {
    console.log("Erro ao recorrer multa: ", err.message, "\n");
  }
}

function registrarInfração() {
  try {
    console.log("----Registro de Infração----");
    let cliente = requisicao.question("Id do cliente: ");
    let tipo = requisicao.question("tipo da infração: ");
    let valor = requisicao.question("valor da infração: ");
    let data = requisicao.question("data(DD-MM-AAAA): ");
    sistema.addMulta(cliente, tipo, valor, data);
    console.log("Multa registrada com sucesso!");
  } catch (err) {
    console.log("Erro ao registrar multa: ", err.message, "\n");
  }
}

function atualizarInfração() {
  try {
    console.log("----Atualização de Infração----");
    let multa = requisicao.question("Id da multa que deseja atualizar: ");
    let valido = false;
    while (valido === false) {
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
          valido = true;
          break;
        case 2:
          status = "paga";
          valido = true;
          break;
        case 3:
          status = "cancelada";
          valido = true;
          break;
        case 4:
          status = "recorrida";
          valido = true;
          break;
        default:
          console.log("Opção Invalida, tente novamente!");
      }
    }
    sistema.atualizarMulta(multa, status);
    console.log("Multa atualizada com sucesso!");
  } catch (err) {
    console.log("Erro ao atualizar multa:", err.message, "\n");
  }
}

function relatorioMultas() {
  try {
    console.log("----Relatório de Multas----");
    let inicio = requisicao.question("Data inicial(DD-MM-AAAA): ");
    let fim = requisicao.question("Data final(DD-MM-AAAA): ");
    console.log(sistema.gerarRelatorioMultas(inicio, fim));
  } catch (err) {
    console.log("Erro ao gerar relatório: ", err.message, "\n");
  }
}
