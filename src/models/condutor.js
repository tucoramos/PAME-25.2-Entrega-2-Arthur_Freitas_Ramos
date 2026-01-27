const Usuario = require("./usuario");

class Condutor extends Usuario {
  // Constructor
  constructor(id, nome, cpf, nascimento, email, senha) {
    super(id, nome, cpf, email, senha);
    this.nascimento = nascimento;
  }

  // Setters
  set nascimento(valor) {
    if (!this._isDate(valor)) throw new Error("Data de nascimento inválida.");
    this._nascimento = valor;
  }

  set id(valor) {
    // validações específicas para ID de Condutor.
    if (!valor.startsWith("CON")) {
      throw new Error("ID de condutor deve começar com 'CON'.");
    }
    this._id = valor;
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
}

module.exports = Condutor;
