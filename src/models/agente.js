const Usuario = require("./usuario");

class Agente extends Usuario {
  // Constructor
  constructor(id, nome, cpf, email, senha, matr) {
    super(id, nome, cpf, email, senha);
    this.matricula = matr;
  }

  // Setters
  set matricula(valor) {
    // Aqui é possivel adicionar validações específicas para matrícula, se necessário!
    this._matricula = valor;
  }

  set id(valor) {
    // validações específicas para ID de Agente.
    if (!valor.startsWith("AGT")) {
      throw new Error("ID de agente deve começar com 'AGT'.");
    }
    this._id = valor;
  }

  // Getters
  get matricula() {
    return this._matricula;
  }
}
module.exports = Agente;
