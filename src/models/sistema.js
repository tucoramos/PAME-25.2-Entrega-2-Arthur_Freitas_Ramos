// models/sistema.js
const Veiculo = require("./Veiculo");
const Multa = require("./Multa");
const Agente = require("./Agente");
const Condutor = require("./Condutor");
const { loadDB, saveDB } = require("./storage/db");

class Sistema {
  constructor() {
    this.db = loadDB(); // carrega o banco de dados

    // map principal de IDs
    this.mapIds = new Map(); // id -> { tipo, obj }

    // email
    this.mapLogin = new Map(); // email -> { senha, id }

    // cpf
    this.cpfsCondutores = []; // lista de cpfs cadastrados de condutores
    this.cpfsAgentes = []; // lista de cpfs cadastrados de agentes

    // condutor
    this.multasPorCondutor = new Map(); // idCondutor -> [idMulta]
    this.veiculosPorCondutor = new Map(); // idCondutor -> [idVeiculo]

    // veículos
    this.veiculoPorPlaca = new Map(); // placa -> idVeiculo (not implemented)

    // índices para listagens
    this.idsAgentes = [];
    this.idsCondutores = [];
    this.idsMultas = [];
    this.idsVeiculos = [];

    // cont p/ ID único
    this.cntAgente = 1;
    this.cntCondutor = 1;
    this.cntMulta = 1;
    this.cntVeiculo = 1;

    this.load(); // carrega os dados do banco de dados
  }

  // Load e Save do JSON
  load() {
    // carrega os dados do banco de dados
    for (const c of thisdb.condutores) {
      this.criarCondutor(c.nome, c.cpf, c.nascimento, c.email, c.senha, c.id);
    }
    for (const a of db.agentes) {
      this.criarAgente(a.nome, a.cpf, a.matricula, a.email, a.senha, a.id);
    }
    for (const v of db.veiculos) {
      this.criarCarro(v.idDono, v.placa, v.modelo, v.marca, v.cor, v.id);
    }
    for (const m of db.multas) {
      this.addMulta(m.idCliente, m.tipo, m.valor, m.data, m.status, m.id);
    }

    // corrige os contadores de IDs
    max = Math.max(...idsAgentes.map((id) => Number(id.split("-")[1])), 0);
    this.cntAgente = max + 1;
    max = Math.max(...idsCondutores.map((id) => Number(id.split("-")[1])), 0);
    this.cntCondutor = max + 1;
    max = Math.max(...idsVeiculos.map((id) => Number(id.split("-")[1])), 0);
    this.cntVeiculo = max + 1;
    max = Math.max(...idsMultas.map((id) => Number(id.split("-")[1])), 0);
    this.cntMulta = max + 1;
  }

  save() {
    // salva os dados no banco de dados
    const data = {
      agentes: [],
      condutores: [],
      veiculos: [],
      multas: [],
    };

    for (const { tipo, obj } of this.mapIds.values()) {
      if (tipo === "agente") {
        data.agentes.push(obj.toJson());
      } else if (tipo === "condutor") {
        data.condutores.push(obj.toJson());
      } else if (tipo === "veiculo") {
        data.veiculos.push(obj.toJson());
      } else if (tipo === "multa") {
        data.multas.push(obj.toJSON());
      }
    }

    saveDB(data);
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

  _valorData(dataStr) {
    // converte "DD-MM-AAAA" para um valor numérico AAAAMMDD para facilitar comparações
    const partes = dataStr.split("-");
    return Number(
      partes[2] + partes[1].padStart(2, "0") + partes[0].padStart(2, "0"),
    );
  }

  _isDate(str) {
    // 1) formato exato DD-MM-AAAA
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = str.match(regex);

    if (!match) return false;

    const dia = Number(match[1]);
    const mes = Number(match[2]);
    const ano = Number(match[3]);

    // 2) mês válido
    if (mes < 1 || mes > 12) return false;

    // 3) dias por mês
    const diasNoMes = [
      31, // jan
      28, // fev
      31, // mar
      30, // abr
      31, // mai
      30, // jun
      31, // jul
      31, // ago
      30, // set
      31, // out
      30, // nov
      31, // dez
    ];

    // 4) ano bissexto
    const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;

    if (bissexto && mes === 2) {
      if (dia < 1 || dia > 29) return false;
    } else {
      if (dia < 1 || dia > diasNoMes[mes - 1]) return false;
    }

    return true;
  }

  // Criação de usuários
  criarAgente(nome, cpf, matr, email, senha, idAgente = null) {
    //gera um id para o agente tenta criar o agente caso resulte em erro chama um erro com a msm msg
    //caso nao resulte em erro add 1 ao num de agente, adiciona ele no dicionario de Ids e no de email/senha
    let id;
    try {
      if (idAgente === null) {
        id = this._gerarId("AGT", this.cntAgente);
      } else {
        id = idAgente;
      }

      if (this.mapLogin.has(email)) throw new Error("Email já cadastrado.");
      if (this.cpfsAgentes.includes(cpf.replace(/\D/g, ""))) {
        throw new Error("CPF já cadastrado como agente.");
      }

      const agente = new Agente(id, nome, cpf, email, senha, matr);

      this.mapIds.set(id, { tipo: "agente", obj: agente });
      this.mapLogin.set(email, { senha, id });
      this.idsAgentes.push(id);
      this.cntAgente++;
      this.cpfsAgentes.push(cpf.replace(/\D/g, "")); // armazena apenas números, impede cpf duplos por formatação

      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  criarCondutor(nome, cpf, nascimento, email, senha, idCondutor = null) {
    //gera um id para o condutor tenta criar o condutor caso resulte em erro chama um erro com a msm msg
    //caso nao resulte em erro add 1 ao num de condutor, adiciona ele no dicionario de Ids e no de email/senha
    let id;
    try {
      if (idCondutor === null) {
        id = this._gerarId("CON", this.cntCondutor);
      } else {
        id = idCondutor;
      }
      if (this.cpfsCondutores.includes(cpf.replace(/\D/g, ""))) {
        throw new Error("CPF já cadastrado como condutor.");
      }
      if (this.mapLogin.has(email)) throw new Error("Email já cadastrado.");

      const condutor = new Condutor(id, nome, cpf, nascimento, email, senha);

      this.mapIds.set(id, { tipo: "condutor", obj: condutor });
      this.mapLogin.set(email, { senha, id });
      this.idsCondutores.push(id);
      this.multasPorCondutor.set(id, []);
      this.veiculosPorCondutor.set(id, []);
      this.cntCondutor++;
      this.cpfsCondutores.push(cpf.replace(/\D/g, "")); // armazena apenas números, impede cpf duplos por formatação

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

      if (mudança === "cpf") {
        var cpfVelho = condutor.cpf.replace(/\D/g, ""); // salva o cpf antigo para atualizar a lista depois
        // checa se o novo cpf ja existe no sistema
        if (this.cpfsCondutores.includes(novoValor.replace(/\D/g, ""))) {
          // se for o mesmo cpf do proprio condutor da erro de igualdade
          if (novoValor.replace(/\D/g, "") === cpfVelho) {
            throw new Error("Novo CPF igual ao atual.");
          }
          // se for cpf de outro condutor da erro de cpf ja cadastrado
          throw new Error("CPF já cadastrado como condutor.");
        }
      }

      condutor.mudar(mudança, novoValor);

      if (mudança === "cpf") {
        this.cpfsCondutores = this.cpfsCondutores.filter(
          (cpf) => cpf !== cpfVelho,
        ); // remove o cpf antigo da lista
        this.cpfsCondutores.push(condutor.cpf.replace(/\D/g, "")); // adiciona o novo cpf na lista
      }

      if (mudança === "senha") {
        const email = condutor.email;
        this.mapLogin.set(email, { senha: novoValor, id }); // atualiza a senha no map de login
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

      if (mudança === "cpf") {
        var cpfVelho = agente.cpf.replace(/\D/g, ""); // salva o cpf antigo para atualizar a lista depois
        // checa se o novo cpf ja existe no sistema
        if (this.cpfsAgentes.includes(novoValor.replace(/\D/g, ""))) {
          // se for o mesmo cpf do proprio agente da erro de igualdade
          if (novoValor.replace(/\D/g, "") === cpfVelho) {
            throw new Error("Novo CPF igual ao atual.");
          }
          // se for cpf de outro agente da erro de cpf ja cadastrado
          throw new Error("CPF já cadastrado como agente.");
        }
      }

      agente.mudar(mudança, novoValor);

      if (mudança === "cpf") {
        this.cpfsAgentes = this.cpfsAgentes.filter((cpf) => cpf !== cpfVelho); // remove o cpf antigo da lista
        this.cpfsAgentes.push(agente.cpf.replace(/\D/g, "")); // adiciona o novo cpf na lista
      }

      if (mudança === "senha") {
        const email = agente.email;
        this.mapLogin.set(email, { senha: novoValor, id }); // atualiza a senha no map de login
      }

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Criação de Veículos / Multas
  criarCarro(cliente, placa, modelo, marca, cor, idCarro = null) {
    //tenta criar o carro caso resulte em erro chama um erro com a msm msg
    let id;
    try {
      if (idCarro === null) {
        id = this._gerarId("VEI", this.cntVeiculo);
      } else {
        id = idCarro;
      }

      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("O ID informado não pertence a um condutor.");
      }
      if (this.veiculoPorPlaca.has(placa)) {
        throw new Error("Placa já cadastrada no sistema.");
      }

      const veiculo = new Veiculo(id, placa, modelo, marca, cor, cliente);

      this.mapIds.set(id, { tipo: "veiculo", obj: veiculo });
      this.idsVeiculos.push(id);

      this.veiculoPorPlaca.set(placa, id);

      const lista = this.veiculosPorCondutor.get(cliente) ?? [];
      lista.push(id);
      this.veiculosPorCondutor.set(cliente, lista);

      this.cntVeiculo++;

      return id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  excluirCarro(cliente, idVeiculo = null, placa = null) {
    // checa se o id do cliente é de condutor
    // prioridade de busca é pelo id do veiculo
    // checa se o veiculo pertence ao condutor
    // tenta excluir o veiculo caso resulte em erro chama um erro com a msm msg
    try {
      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("O ID informado não pertence a um condutor.");
      }

      let veiculo;
      if (idVeiculo !== null && idVeiculo !== undefined) {
        this._exigirId(idVeiculo);
        const { obj: v } = this._getRegistro(idVeiculo);
        veiculo = v;
      } else if (placa !== null && placa !== undefined) {
        if (!this.veiculoPorPlaca.has(placa)) {
          throw new Error("Veículo não encontrado.");
        }
        idVeiculo = this.veiculoPorPlaca.get(placa);
        const { obj: v } = this._getRegistro(idVeiculo);
        veiculo = v;
      } else {
        throw new Error("É necessário fornecer o ID ou a placa do veículo.");
      }

      if (this.veiculosPorCondutor.get(cliente).includes(idVeiculo) === false) {
        throw new Error("Veículo não pertence ao condutor.");
      }

      this.mapIds.delete(idVeiculo);
      this.idsVeiculos = this.idsVeiculos.filter((id) => id !== idVeiculo);
      this.veiculoPorPlaca.delete(veiculo.placa);

      const lista = this.veiculosPorCondutor.get(cliente) ?? [];
      const index = lista.indexOf(idVeiculo);
      if (index > -1) {
        lista.splice(index, 1);
        this.veiculosPorCondutor.set(cliente, lista);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  addMulta(cliente, tipo, valor, data, status = "pendente", idMulta = null) {
    // checa se o id do cliente é de condutor
    // gera um id para a multa tenta criar ela caso resulte em erro chama um erro com a msm msg
    // caso nao resulte em erro add 1 ao num de multas, adiciona ela no dicionario de Ids e no do condutor
    let id;
    try {
      if (idMulta === null) {
        id = this._gerarId("MUL", this.cntMulta);
      } else {
        id = idMulta;
      }

      this._exigirId(cliente);
      if (this.tipoId(cliente) !== "condutor") {
        throw new Error("O ID informado não pertence a um condutor.");
      }

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

      return a.info();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  infoCondutor(Id) {
    // retorna uma string com as info do condutor e seus veiculos
    try {
      if (this.tipoId(Id) !== "condutor")
        throw new Error("ID não é de condutor.");
      const { obj: c } = this._getRegistro(Id);

      return c.info() + `Veículos: ${this.veiculosCondutor(Id)}\n`;
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
        linhas.push(m.infoResumo());
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
        linhas.push(v.infoResumo());
      }

      return (
        `--- VEÍCULOS CADASTRADOS (${this.idsVeiculos.length}) ---\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  veiculosCondutor(Id) {
    // retorna uma string com os veiculos do condutor
    try {
      if (this.tipoId(Id) !== "condutor")
        throw new Error("ID não é de condutor.");
      const linhas = [];
      const ids = this.veiculosPorCondutor.get(Id) ?? [];
      if (ids.length === 0)
        linhas.push("Nenhum veículo registrado para este condutor.");

      for (let i = 0; i < ids.length; i++) {
        const idV = ids[i];
        const { obj: v } = this._getRegistro(idV);
        linhas.push(v.infoResumo());
      }
      return linhas.join("\n");
    } catch (err) {
      throw new Error(err.message);
    }
  }

  buscarVeiculoPorPlaca(placa) {
    // retorna uma string com as info do veiculo correspondente a placa
    try {
      if (!this.veiculoPorPlaca.has(placa)) {
        return "Nenhum veículo encontrado com a placa informada.";
      }
      const id = this.veiculoPorPlaca.get(placa);
      const { obj: v } = this._getRegistro(id);
      return v.info();
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
        linhas.push(c.infoResumo());
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
        linhas.push(m.infoResumo());
      }

      return (
        `--- MULTAS CADASTRADAS (${this.idsMultas.length}) ---\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  gerarRelatorioMultas(inicio, fim) {
    try {
      if (!this._isDate(inicio)) throw new Error("Data de início inválida.");
      if (!this._isDate(fim)) throw new Error("Data de fim inválida.");
      if (this.idsMultas.length === 0) return "Nenhuma multa cadastrada.";

      const linhas = [];
      let valorTotal = 0;
      let valorCobrado = 0;
      for (let i = 0; i < this.idsMultas.length; i++) {
        const idM = this.idsMultas[i];
        const { obj: m } = this._getRegistro(idM);
        if (
          this._valorData(m.data) >= this._valorData(inicio) &&
          this._valorData(m.data) <= this._valorData(fim)
        ) {
          linhas.push(m.infoResumo());
          if (m.status === "paga") {
            valorTotal += Number(m.valor);
          }
          valorCobrado += Number(m.valor);
        }
      }

      return (
        `--- RELATÓRIO DE MULTAS ---\n` +
        `Período: ${inicio} a ${fim}\n` +
        `Valor Total Cobrado: R$ ${valorCobrado.toFixed(2)}\n` +
        `Valor Total Arrecadado: R$ ${valorTotal.toFixed(2)}\n` +
        `Total de Multas: ${linhas.length}\n` +
        linhas.join("\n")
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Sistema;
