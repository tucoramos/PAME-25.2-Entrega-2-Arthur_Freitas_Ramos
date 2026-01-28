const Usuario = require("./Usuario");

class Condutor extends Usuario {
  // Constructor
  constructor(id, nome, cpf, nascimento, email, senha) {
    super(id, nome, cpf, email, senha);
    this.nascimento = nascimento;
  }

  // Setters
  set nascimento(valor) {
    // validações específicas para data de nascimento.
    if (valor === "") throw new Error("Data de nascimento vazia.");
    if (!this._isDate(valor)) throw new Error("Data de nascimento inválida.");
    this._nascimento = valor;
  }

  set id(valor) {
    // validações específicas para ID de Condutor.
    if (valor === "") throw new Error("ID de condutor vazio.");
    if (!valor.startsWith("CON")) {
      throw new Error("ID de condutor deve começar com 'CON'.");
    }
    this._id = valor;
  }

  mudar(mudança, novoValor) {
    switch (mudança) {
      case "nome":
        if (novoValor === this.nome)
          throw new Error("Novo nome igual ao atual.");
        this.nome = novoValor;
        break;
      case "cpf":
        if (novoValor === this.cpf) throw new Error("Novo CPF igual ao atual.");
        this.cpf = novoValor;
        break;
      case "nascimento":
        if (novoValor === this.nascimento)
          throw new Error("Nova data de nascimento igual à atual.");
        this.nascimento = novoValor;
        break;
      case "email":
        if (novoValor === this.email)
          throw new Error("Novo email igual ao atual.");
        throw new Error("Não é possível alterar o email.");
        break;
      case "senha":
        if (novoValor === this.senha)
          throw new Error("Nova senha igual à atual.");
        this.senha = novoValor;
        break;
      default:
        throw new Error("Campo não existente para edição.");
    }
  }

  // Getters
  get nascimento() {
    return this._nascimento;
  }

  get id() {
    return this._id;
  }

  // Validações auxiliares
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

  // Strings pro console
  info() {
    // Retorna uma string formatada com os detalhes do condutor
    return (
      "--- PERFIL CONDUTOR ---\n" +
      `ID: ${this.id}\n` +
      `Nome: ${this.nome}\n` +
      `CPF: ${this.cpf}\n` +
      `Email: ${this.email}\n` +
      `Nascimento: ${this.nascimento}\n`
    );
  }

  infoResumo() {
    // Retorna uma string resumida com os detalhes do condutor
    return `ID: ${this.id} | Nome: ${this.nome} | CPF: ${this.cpf} | Nascimento: ${this.nascimento}`;
  }

  // JSON
  // converte o condutor para um objeto JSON
  toJson() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      nascimento: this.nascimento,
      email: this.email,
      senha: this.senha,
    };
  }
}

module.exports = Condutor;
