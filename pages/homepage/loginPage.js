class LoginPage {
  constructor(page) {
    this.page = page;

    // Seletores
    this.inputEmail = 'input[type="text"]';
    this.inputSenha = 'input[type="password"]';
    this.botaoEntrar = 'button:has-text("Entrar")';
  }
  
  async acessarPagina() {
    await this.page.goto('/login');
  }

  async preencherEmail(email) {
    await this.page.locator(this.inputEmail).fill(email);
  }



  async preencherSenha(senha) {
    await this.page.locator(this.inputSenha).fill(senha);
  }

  async clicarEntrar() {
    await this.page.locator(this.botaoEntrar).click();
  }

  async login(email, senha) {
    await this.preencherEmail(email);
    await this.preencherSenha(senha);
    await this.clicarEntrar();
  }
}

module.exports = { LoginPage };