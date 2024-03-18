class Conta {
    #numeroConta;
    #saldo;
    #historicoTransacoes;

    constructor(numeroConta, saldoInicial, nomeUsuario, profissaoUsuario) {
        this.#numeroConta = numeroConta;
        this.#saldo = saldoInicial >= 0 ? saldoInicial : 0;
        this.nomeUsuario = nomeUsuario;
        this.profissaoUsuario = profissaoUsuario;
        this.#historicoTransacoes = [];
        this.registrarTransacao("Criação de conta", saldoInicial);
    }

    registrarTransacao(tipo, valor) {
        const transacao = {
            data: new Date(),
            tipo,
            valor,
            saldoAposTransacao: this.#saldo
        };
        this.#historicoTransacoes.push(transacao);
        console.log(`Transação registrada: ${tipo} de ${valor}, Saldo após transação: ${this.#saldo}`);
    }

    depositar(valor) {
        if (valor > 0) {
            this.#saldo += valor;
            this.registrarTransacao("Depósito", valor);
        } else {
            console.log("Valor de depósito inválido.");
        }
    }

    retirar(valor) {
        if (valor > 0 && valor <= this.#saldo) {
            this.#saldo -= valor;
            this.registrarTransacao("Retirada", valor);
        } else {
            console.log("Valor de retirada inválido ou saldo insuficiente.");
        }
    }

    checarExtrato() {
        console.log(`Extrato da Conta ${this.#numeroConta}`);
        this.#historicoTransacoes.forEach(t => {
            console.log(`${t.data.toLocaleString()}\t${t.tipo}\t${t.valor}\t${t.saldoAposTransacao}`);
        });
    }

    get saldo() {
        return this.#saldo;
    }

    get numeroConta() {
        return this.#numeroConta;
    }
}

class ContaCorrente extends Conta {
    #limiteChequeEspecial;
    #taxaManutencao;

    constructor(numeroConta, saldoInicial, nomeUsuario, profissaoUsuario, limiteChequeEspecial, taxaManutencao) {
        super(numeroConta, saldoInicial, nomeUsuario, profissaoUsuario);
        this.#limiteChequeEspecial = limiteChequeEspecial;
        this.#taxaManutencao = taxaManutencao;
    }

    retirar(valor) {
        if (valor > 0 && (this.saldo + this.#limiteChequeEspecial) >= valor) {
            super.retirar(valor);
            if (this.saldo < 0) {
                console.log("Uso do limite de cheque especial.");
            }
        } else {
            console.log("Valor de retirada inválido ou limite excedido.");
        }
    }

    aplicarTaxaManutencao() {
        this.retirar(this.#taxaManutencao);
        this.registrarTransacao("Taxa de manutenção", this.#taxaManutencao);
    }
}

class ContaPoupanca extends Conta {
    #taxaJuros;
    #limiteSaques;
    #numeroSaques = 0;

    constructor(numeroConta, saldoInicial, nomeUsuario, profissaoUsuario, taxaJuros, limiteSaques) {
        super(numeroConta, saldoInicial, nomeUsuario, profissaoUsuario);
        this.#taxaJuros = taxaJuros;
        this.#limiteSaques = limiteSaques;
    }

    retirar(valor) {
        if (this.#numeroSaques < this.#limiteSaques) {
            super.retirar(valor);
            this.#numeroSaques++;
        } else {
            console.log("Limite de saques atingido.");
        }
    }

    aplicarJuros() {
        const juros = this.saldo * (this.#taxaJuros / 100);
        this.depositar(juros);
        this.registrarTransacao("Juros", juros);
    }

    checarExtrato() {
        super.checarExtrato();
        console.log(`Número de saques realizados: ${this.#numeroSaques}`);
    }

    reiniciarContagemSaques() {
        this.#numeroSaques = 0;
    }
}

// Criação de contas
const contaCorrente = new ContaCorrente(1, 1000, "Maria Silva", "Engenheira", 500, 50);
const contaPoupanca = new ContaPoupanca(2, 2000, "João Pereira", "Médico", 5, 3);

// Testando operações
console.log("\n--- Conta Corrente ---");
contaCorrente.depositar(500);
contaCorrente.retirar(200);
contaCorrente.retirar(1500); // Teste de limite do cheque especial
contaCorrente.aplicarTaxaManutencao();
contaCorrente.checarExtrato();

console.log("\n--- Conta Poupança ---");
contaPoupanca.depositar(1000);
contaPoupanca.retirar(500);
contaPoupanca.aplicarJuros();
contaPoupanca.checarExtrato();
