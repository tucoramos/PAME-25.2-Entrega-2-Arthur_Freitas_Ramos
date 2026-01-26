class Veiculo {
  // Constructor
  constructor(id, placa, modelo, marca, cor) {
    this.id = id;
    this.placa = placa;
    this.modelo = modelo;
    this.marca = marca;
    this.cor = cor;
  }

  // Setters
  set id(valor) {
    if (!valor.startsWith("VEI")) {
      throw new Error("ID de veículo deve começar com 'VEI'.");
    }
    this._id = valor;
  }

  set placa(valor) {
    if (!this._isPlaca(valor)) throw new Error("Placa inválida.");
    this._placa = valor;
  }

  set modelo(valor) {
    // Aqui é possível adicionar validações específicas para modelo, se necessário!
    this._modelo = valor;
  }

  set marca(valor) {
    // Aqui é possível adicionar validações específicas para marca, se necessário!
    this._marca = valor;
  }

  set cor(valor) {
    // Aqui é possível adicionar validações específicas para cor, se necessário!
    this._cor = valor;
  }

  // Getters
  get id() {
    return this._id;
  }
  get placa() {
    return this._placa;
  }
  get modelo() {
    return this._modelo;
  }
  get marca() {
    return this._marca;
  }
  get cor() {
    return this._cor;
  }

  // Validações auxiliares
  _isPlaca(placa) {
    // Formato padrão brasileiro:
    const regex = /^[A-Z]{3}\d{4}$/; // Formato antigo: ABC1D23
    const regexNew = /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/; // Formato novo: ABC1D23
    return regex.test(placa) || regexNew.test(placa);
  }
}
module.exports = Veiculo;
