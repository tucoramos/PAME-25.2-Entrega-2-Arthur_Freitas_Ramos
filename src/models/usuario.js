class Usuario {
  // Constructor
  constructor(id, nome, cpf, email, senha) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.senha = senha;
  }

  // Setters
  set id(valor) {
    // Será substituído por validações específicas em subclasses.
    this._id = valor;
  }

  set nome(valor) {
    // Aqui é possível adicionar validações específicas para nome, se necessário!
    if (valor === "") throw new Error("Nome vazio.");
    this._nome = valor;
  }

  set cpf(valor) {
    // Validações específicas para CPF.
    if (valor === "") throw new Error("CPF vazio.");
    if (!this._isCpf(valor)) throw new Error("CPF inválido." + this.id);
    this._cpf = valor;
  }

  set email(valor) {
    // Validações específicas para email.
    if (valor === "") throw new Error("Email vazio.");
    if (!this._isEmail(valor)) throw new Error("Email inválido.");
    this._email = valor;
  }

  set senha(valor) {
    // Validações específicas para senha.
    if (valor === "") throw new Error("Senha vazia.");
    if (!this._isSenha(valor))
      throw new Error(
        "Senha inválida, ela deve ter no minimo 8 caracteres, sem espaços, com pelo menos uma letra maiúscula, um número e uma caractere especial.",
      );
    this._senha = valor;
  }

  // Getters
  get id() {
    return this._id;
  }

  get nome() {
    return this._nome;
  }

  get cpf() {
    return this._cpf;
  }

  get email() {
    return this._email;
  }

  get senha() {
    return this._senha;
  }

  // Validações auxiliares
  _isSenha(senha) {
    // Pelo menos 8 caracteres, sem espaços, com pelo menos uma letra maiúscula, um número e um caractere especial.
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(senha) && !/\s/.test(senha);
  }

  _isEmail(email) {
    // checa o formato básico de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  _isCpf(cpf) {
    // checa o formato inicial
    const formatoValido =
      /^\d{11}$/.test(cpf) || // 11111111111
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf); // 111.111.111-11
    if (!formatoValido) return false;

    // remove tudo que não for número
    cpf = cpf.replace(/\D/g, "");

    // checa se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // tem que ter 11 dígitos
    if (cpf.length !== 11) return false;

    // calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += Number(cpf[i]) * (10 - i);
    }

    let dig1 = (soma * 10) % 11;
    if (dig1 === 10) dig1 = 0;
    if (dig1 !== Number(cpf[9])) return false;

    // calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += Number(cpf[i]) * (11 - i);
    }

    let dig2 = (soma * 10) % 11;
    if (dig2 === 10) dig2 = 0;
    if (dig2 !== Number(cpf[10])) return false;

    return true;
  }
}
module.exports = Usuario;
