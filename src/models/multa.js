class Multa {
  _statusValido(status) {
    return ["pendente", "paga", "cancelada", "recorrida"].includes(status);
  }
  setStatus() {
    //
  }
  //if (!this._statusValido(status)) throw new Error("Status inválido.");
}
module.exports = Multa;
