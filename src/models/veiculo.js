class Veiculo {
  // Constructor
  constructor(id, placa, modelo, marca, cor, idDono) {
    this.id = id;
    this.placa = placa;
    this.modelo = modelo;
    this.marca = marca;
    this.cor = cor;
    this.idDono = idDono;
  }

  // Setters
  set id(valor) {
    // validações específicas para ID de veículo.
    if (!valor.startsWith("VEI")) {
      throw new Error("ID de veículo deve começar com 'VEI'.");
    }
    this._id = valor;
  }

  set placa(valor) {
    // validações específicas para placa.
    if (valor === "") throw new Error("Placa vazia.");
    if (!this._isPlaca(valor)) throw new Error("Placa inválida.");
    this._placa = valor;
  }

  set modelo(valor) {
    // Aqui é possível adicionar validações específicas para modelo, se necessário!
    if (valor === "") throw new Error("Modelo vazio.");
    this._modelo = valor;
  }

  set marca(valor) {
    // Aqui é possível adicionar validações específicas para marca, se necessário!
    if (valor === "") throw new Error("Marca vazia.");
    this._marca = valor;
  }

  set cor(valor) {
    // Aqui é possível adicionar validações específicas para cor, se necessário!
    if (valor === "") throw new Error("Cor vazia.");
    this._cor = valor;
  }
  set idDono(valor) {
    // validações específicas para ID do dono.
    if (valor === "") throw new Error("ID do dono vazio.");
    if (!valor.startsWith("CON")) {
      throw new Error("ID nao pertence a condutor.");
    }
    this._idDono = valor;
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
  get idDono() {
    return this._idDono;
  }

  // Validações auxiliares
  _isPlaca(placa) {
    // Formato padrão brasileiro:
    const regex = /^[A-Z]{3}\d{4}$/; // Formato antigo: ABC1D23
    const regexNew = /^[A-Z]{3}\d{1}[A-Z]{1}\d{2}$/; // Formato novo: ABC1D23
    return regex.test(placa) || regexNew.test(placa);
  }

  // Strings pro console
  info() {
    // Retorna uma string formatada com os detalhes do veículo
    return (
      "--- DETALHES DO VEÍCULO ---\n" +
      `ID: ${this.id}\n` +
      `Placa: ${this.placa}\n` +
      `Modelo: ${this.modelo}\n` +
      `Marca: ${this.marca}\n` +
      `Cor: ${this.cor}\n`
    );
  }

  infoResumo() {
    // Retorna uma string resumida com os detalhes do veículo
    return (
      "ID: " +
      this.id +
      " | Placa: " +
      this.placa +
      " | Modelo: " +
      this.modelo +
      " | Marca: " +
      this.marca +
      " | Cor: " +
      this.cor
    );
  }

  // JSON
  // converte o veículo para um objeto JSON
  toJson() {
    return {
      id: this.id,
      placa: this.placa,
      modelo: this.modelo,
      marca: this.marca,
      cor: this.cor,
      idDono: this.idDono,
    };
  }
}
module.exports = Veiculo;
