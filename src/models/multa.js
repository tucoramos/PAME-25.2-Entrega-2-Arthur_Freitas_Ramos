class Multa {
  // Constructor
  constructor(id, idcliente, tipo, valor, data, status) {
    this._status = "";
    this.id = id;
    this.idCliente = idcliente;
    this.tipo = tipo;
    this.data = data;
    this.valor = valor;
    this.status = status;
  }

  // Setters
  set id(v) {
    // validações específicas para ID de multa.
    if (!v.startsWith("MUL")) {
      throw new Error("ID de multa deve começar com 'MUL'.");
    }
    this._id = v;
  }

  set idCliente(v) {
    // validações específicas para ID de cliente.
    if (v === "") throw new Error("ID do cliente vazio.");
    if (!v.startsWith("CON")) {
      throw new Error("ID do cliente deve começar com 'CON'.");
    }
    this._cliente = v;
  }

  set tipo(v) {
    // Aqui é possível adicionar validações específicas para tipo de infração, se necessário!
    if (v === "") throw new Error("Tipo de infração Vazio.");
    this._tipo = v;
  }

  set valor(v) {
    // validações específicas para valor da infração.
    if (v === "") throw new Error("Valor da infração vazio.");
    if (!this._isValor(v)) throw new Error("Valor inválido.");
    this._valor = v;
  }

  set data(v) {
    // validações específicas para data da infração.
    if (v === "") throw new Error("Data vazia.");
    if (!this._isDate(v)) throw new Error("Data inválida.");
    this._data = v;
  }

  set status(v) {
    // validações específicas para status da infração.
    if (v === "") throw new Error("Status vazio.");
    if (!this._statusValido(v)) throw new Error("Status inválido.");
    if (this._status === v) return;
    if (
      ["paga", "cancelada", "recorrida"].includes(v) &&
      this._status === "pendente"
    ) {
      this._status = v;
    } else if (this._status === "") {
      this._status = v;
    } else {
      throw new Error(
        "Status só pode ser alterado de 'pendente' para 'paga', 'cancelada' ou 'recorrida'.",
      );
    }
  }

  // Getters
  get id() {
    return this._id;
  }

  get idCliente() {
    return this._cliente;
  }

  get tipo() {
    return this._tipo;
  }

  get valor() {
    return this._valor;
  }

  get data() {
    return this._data;
  }

  get status() {
    return this._status;
  }

  // Validações auxiliares
  _statusValido(status) {
    return ["pendente", "paga", "cancelada", "recorrida"].includes(status);
  }

  _isValor(v) {
    const num = Number(v);
    return !isNaN(num) && num >= 0;
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

  // Strings pro console
  infoResumo() {
    // Retorna uma string resumida com os detalhes da multa
    return (
      "ID: " +
      this.id +
      " | Tipo: " +
      this.tipo +
      " | Valor: " +
      this.valor +
      " | Data: " +
      this.data +
      " | Status: " +
      this.status
    );
  }

  // JSON
  // converte a multa para um objeto JSON
  toJSON() {
    return {
      id: this.id,
      idCliente: this.idCliente,
      tipo: this.tipo,
      valor: this.valor,
      data: this.data,
      status: this.status,
    };
  }
}

module.exports = Multa;
