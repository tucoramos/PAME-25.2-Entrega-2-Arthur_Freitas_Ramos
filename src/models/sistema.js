// models/sistema.js
const Veiculo = require("./veiculo");
const Multa = require("./multa");
const Agente = require("./agente");
const Condutor = require("./condutor");

class Sistema {
  constructor() {
    // id -> { tipo, obj }
    this.mapIds = new Map();

    // email -> { senha, id }
    this.mapLogin = new Map();

    // índices para listagens
    this.idsAgentes = [];
    this.idsCondutores = [];
    this.idsMultas = [];
    this.idsVeiculos = [];

    // multas por condutor
    this.multasPorCondutor = new Map(); // idCondutor -> [idMulta]
    this.veiculosPorCondutor = new Map(); // idCondutor -> [idVeiculo] (not implemented)

    // cont p/ ID único
    this.cntAgente = 1;
    this.cntCondutor = 1;
    this.cntMulta = 1;
    this.cntVeiculo = 1;
  }

  // Helpers
  _gerarId(prefixo, seq) {
    return `${prefixo}-${String(seq)}`;
  }

  _exigirId(id) {
    if (!this.mapIds.has(id)) throw new Error("ID não encontrado no sistema.");
  }

  _getRegistro(id) {
    this._exigirId(id);
    return this.mapIds.get(id); // { tipo, obj }
  }

  // Criação de usuários
  criarAgente(nome, cpf, matr, email, senha) {
    //gera um id para o agente tenta criar o agente caso resulte em erro chama um erro com a msm msg
    //caso nao resulte em erro add 1 ao num de agente, adiciona ele no dicionario de Ids e no de email/senha
    try {
      if (this.mapLogin.has(email)) throw new Error("Email já cadastrado.");
      const id = this._gerarId("AGT", this.cntAgente);

      const agente = new Agente(id, nome, cpf, email, senha, matr);

      this.mapIds.set(id, { tipo: "agente", obj: agente });
      this.mapLogin.set(email, { senha, id });
      this.idsAgentes.push(id);
      this.cntAgente++;

      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  criarCondutor(nome, cpf, nascimento, email, senha) {
    //gera um id para o condutor tenta criar o condutor caso resulte em erro chama um erro com a msm msg
    //caso nao resulte em erro add 1 ao num de condutor, adiciona ele no dicionario de Ids e no de email/senha
    try {
      if (this.mapLogin.has(email)) throw new Error("Email já cadastrado.");
      const id = this._gerarId("CON", this.cntCondutor);

      const condutor = new Condutor(id, nome, cpf, nascimento, email, senha);

      this.mapIds.set(id, { tipo: "condutor", obj: condutor });
      this.mapLogin.set(email, { senha, id });
      this.idsCondutores.push(id);
      this.multasPorCondutor.set(id, []);
      this.veiculosPorCondutor.set(id, []);
      this.cntCondutor++;

      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  editarCondutor(id, mudança, novoValor) {
    try {
      this._exigirId(id);
      if (this.tipoId(id) !== "condutor") {
        throw new Error("ID não é de condutor.");
      }
      const { obj: condutor } = this._getRegistro(id);

      switch (mudança) {
        case "nome":
          condutor.nome = novoValor;
          break;
        case "cpf":
          condutor.cpf = novoValor;
          break;
        case "nascimento":
          condutor.nascimento = novoValor;
          break;
        case "email":
          throw new Error("Nao é possível alterar o email.");
          break;
        case "senha":
          condutor.senha = novoValor;
          break;
        default:
          throw new Error("Campo nao existente para edição.");
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  editarAgente(id, mudança, novoValor) {
    try {
      this._exigirId(id);
      if (this.tipoId(id) !== "agente") {
        throw new Error("ID não é de agente.");
      }
      const { obj: agente } = this._getRegistro(id);

      switch (mudança) {
        case "nome":
          agente.nome = novoValor;
          break;
        case "cpf":
          agente.cpf = novoValor;
          break;
        case "matricula":
          agente.matricula = novoValor;
          break;
        case "email":
          throw new Error("Nao é possível alterar o email.");
          break;
        case "senha":
          agente.senha = novoValor;
          break;
        default:
          throw new Error("Campo nao existente para edição.");
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Criação de Veículos / Multas
  criarCarro(cliente, placa, modelo, marca, cor) {
    //tenta criar o carro caso resulte em erro chama um erro com a msm msg
    try {
      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("O ID informado não pertence a um condutor.");
      }
      const id = this._gerarId("VEI", this.cntVeiculo);

      const veiculo = new Veiculo(id, placa, modelo, marca, cor);

      this.mapIds.set(id, { tipo: "veiculo", obj: veiculo });
      this.idsVeiculos.push(id);

      const lista = this.veiculosPorCondutor.get(cliente) ?? [];
      lista.push(id);
      this.veiculosPorCondutor.set(cliente, lista);

      this.cntVeiculo++;

      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  addMulta(cliente, tipo, valor, data, status = "pendente") {
    // checa se o id do cliente é de condutor
    // gera um id para a multa tenta criar ela caso resulte em erro chama um erro com a msm msg
    // caso nao resulte em erro add 1 ao num de multas, adiciona ela no dicionario de Ids e no do condutor
    try {
      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("O ID informado não pertence a um condutor.");
      }

      const id = this._gerarId("MUL", this.cntMulta);

      const multa = new Multa(id, cliente, tipo, valor, data, status);

      this.mapIds.set(id, { tipo: "multa", obj: multa });
      this.idsMultas.push(id);

      const lista = this.multasPorCondutor.get(cliente) ?? [];
      lista.push(id);
      this.multasPorCondutor.set(cliente, lista);

      this.cntMulta++;
      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  atualizarMulta(multaId, status, cliente = null) {
    // checa se o cliente é o dono da multa
    // atualiza o status da multa caso resulte em erro chama um erro com a msm msg
    try {
      this._exigirId(multaId);
      if (this.tipoId(multaId) !== "multa") {
        throw new Error("ID não é de multa.");
      }
      if (cliente === null) {
        cliente = this._getRegistro(multaId).obj.idCliente;
      }

      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("ID não é de condutor.");
      }

      const ids = this.multasPorCondutor.get(cliente) ?? [];
      if (ids.length === 0) {
        throw new Error("Nenhuma infração registrada para este condutor.");
      }

      if (!this.multasPorCondutor.get(cliente).includes(multaId)) {
        throw new Error("Multa não pertence ao condutor.");
      }

      const { obj: multa } = this._getRegistro(multaId);

      multa.status = status;

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Login e consultas
  procurarUsuario(email, senha) {
    // recebe uma senha e um email e retorna Id do usuario caso ele exista
    // retorna false caso ele nao esteja registrado
    const reg = this.mapLogin.get(email);
    if (!reg) return false; // se n existir email reg é undefined
    if (reg.senha !== senha) return false;
    return reg.id;
  }

  nomeUsuario(Id) {
    //recebe um Id e retorna o nome do usuario correspondente
    try {
      const { obj } = this._getRegistro(Id);
      return obj.nome;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  tipoId(Id) {
    // retorna se é de Multa, de Agente ou de Condutor ou false (nao existe).
    if (!this.mapIds.has(Id)) return false;
    return this.mapIds.get(Id).tipo;
  }

  // Strings pro console
  infoAgente(Id) {
    // retorna uma string com as info do agente de transito
    try {
      if (this.tipoId(Id) !== "agente") throw new Error("ID não é de agente.");
      const { obj: a } = this._getRegistro(Id);

      return (
        "--- PERFIL AGENTE ---\n" +
        `ID: ${a.id}\n` +
        `Nome: ${a.nome}\n` +
        `CPF: ${a.cpf}\n` +
        `Email: ${a.email}\n` +
        `Matrícula: ${a.matricula}\n`
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  infoCondutor(Id) {
    // retorna uma string com as info do condutor
    try {
      if (this.tipoId(Id) !== "condutor")
        throw new Error("ID não é de condutor.");
      const { obj: c } = this._getRegistro(Id);

      const linhas = [];
      const ids = this.veiculosPorCondutor.get(Id) ?? [];
      if (ids.length === 0)
        linhas.push("Nenhum veículo registrado para este condutor.");

      for (let i = 0; i < ids.length; i++) {
        const idV = ids[i];
        const { obj: v } = this._getRegistro(idV);
        linhas.push(
          "ID: " +
            v.id +
            " | Placa: " +
            v.placa +
            " | Modelo: " +
            v.modelo +
            " | Marca: " +
            v.marca +
            " | Cor: " +
            v.cor +
            "\n",
        );
      }

      return (
        "--- PERFIL CONDUTOR ---\n" +
        `ID: ${c.id}\n` +
        `Nome: ${c.nome}\n` +
        `CPF: ${c.cpf}\n` +
        `Nascimento: ${c.nascimento}\n` +
        `Email: ${c.email}\n` +
        `Veículos: ${linhas.join("")}\n`
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  infraCondutor(Id) {
    // retorna uma string com as infrações do condutor
    try {
      if (this.tipoId(Id) !== "condutor")
        throw new Error("ID não é de condutor.");

      const ids = this.multasPorCondutor.get(Id) ?? [];
      if (ids.length === 0)
        return "Nenhuma infração registrada para este condutor.";

      const linhas = [];
      for (let i = 0; i < ids.length; i++) {
        const idM = ids[i];
        const { obj: m } = this._getRegistro(idM);
        linhas.push(
          "ID: " +
            m.id +
            " | Tipo: " +
            m.tipo +
            " | Valor: " +
            m.valor +
            " | Data: " +
            m.data +
            " | Status: " +
            m.status,
        );
      }

      return (
        `--- HISTÓRICO DE INFRAÇÕES (${ids.length}) ---\n` + linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  veiculosCadastrados() {
    // retorna uma string com os veiculos cadastrados
    try {
      if (this.idsVeiculos.length === 0) return "Nenhum veículo cadastrado.";

      const linhas = [];
      for (let i = 0; i < this.idsVeiculos.length; i++) {
        const idV = this.idsVeiculos[i];
        const { obj: v } = this._getRegistro(idV);
        linhas.push(
          "ID: " +
            v.id +
            " | Placa: " +
            v.placa +
            " | Modelo: " +
            v.modelo +
            " | Marca: " +
            v.marca +
            " | Cor: " +
            v.cor,
        );
      }

      return (
        `--- VEÍCULOS CADASTRADOS (${this.idsVeiculos.length}) ---\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  motoristasCadastrados() {
    // retorna uma string com os motoristas cadastrados
    try {
      if (this.idsCondutores.length === 0) return "Nenhum condutor cadastrado.";

      const linhas = [];
      for (let i = 0; i < this.idsCondutores.length; i++) {
        const idC = this.idsCondutores[i];
        const { obj: c } = this._getRegistro(idC);
        linhas.push(
          "ID: " +
            c.id +
            " | Nome: " +
            c.nome +
            " | CPF: " +
            c.cpf +
            " | Email: " +
            c.email,
        );
      }

      return (
        `--- CONDUTORES CADASTRADOS (${this.idsCondutores.length}) ---\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  multasCadastradas() {
    // retorna uma string com as multas cadastrados
    try {
      if (this.idsMultas.length === 0) return "Nenhuma multa cadastrada.";

      const linhas = [];
      for (let i = 0; i < this.idsMultas.length; i++) {
        const idM = this.idsMultas[i];
        const { obj: m } = this._getRegistro(idM);
        linhas.push(
          "ID: " +
            m.id +
            " | Condutor: " +
            m.idCliente +
            " | Tipo: " +
            m.tipo +
            " | Valor: " +
            m.valor +
            " | Data: " +
            m.data +
            " | Status: " +
            m.status,
        );
      }

      return (
        `--- MULTAS CADASTRADAS (${this.idsMultas.length}) ---\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Sistema;
