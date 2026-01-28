const Usuario = require("./Usuario");

class Agente extends Usuario {
  // Constructor
  constructor(id, nome, cpf, email, senha, matr) {
    super(id, nome, cpf, email, senha);
    this.matricula = matr;
  }

  // Setters
  set matricula(valor) {
    // Aqui é possivel adicionar validações específicas para matrícula, se necessário!
    if (valor === "") throw new Error("Matrícula vazia.");
    this._matricula = valor;
  }

  set id(valor) {
    // validações específicas para ID de Agente.
    if (valor === "") throw new Error("ID de agente vazio.");
    if (!valor.startsWith("AGT")) {
      throw new Error("ID de agente deve começar com 'AGT'.");
    }
    this._id = valor;
  }

  mudar(mudança, novoValor) {
    switch (mudança) {
      case "nome":
        this.nome = novoValor;
        break;
      case "cpf":
        this.cpf = novoValor;
        break;
      case "matricula":
        this.matricula = novoValor;
        break;
      case "email":
        throw new Error("Não é possível alterar o email.");
        break;
      case "senha":
        this.senha = novoValor;
        break;
      default:
        throw new Error("Campo não existente para edição.");
    }
  }

  // Getters
  get matricula() {
    return this._matricula;
  }

  get id() {
    return this._id;
  }

  // Strings pro console
  info() {
    // Retorna informações completas do agente.
    return (
      "--- PERFIL AGENTE ---\n" +
      `ID: ${this.id}\n` +
      `Nome: ${this.nome}\n` +
      `CPF: ${this.cpf}\n` +
      `Email: ${this.email}\n` +
      `Matrícula: ${this.matricula}\n`
    );
  }

  // JSON
  // converte o agente para um objeto JSON
  toJson() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha,
      matricula: this.matricula,
    };
  }
}
module.exports = Agente;
