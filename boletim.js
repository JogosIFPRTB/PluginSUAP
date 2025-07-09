// ===================================================================================
// SCRIPT DE DESTAQUE PARA BOLETIM DO ALUNO - v1.2
// ===================================================================================

(function() {

    // Define a paleta de cores para os conceitos e alertas.
    // A cor de destaque para a disciplina com 'D' foi removida, pois usaremos a mesma cor do conceito D.
    const cores = {
        A: "#5c9ded",
        B: "#40c057",
        C: "#ffd43b",
        D: "#fa5252",
        BAIXA_FREQUENCIA: "#fa5252"
    };

    // --- ETAPA 1 e 2: Colorir conceitos e destacar disciplina com conceito D ---

    const spansDeConceito = document.querySelectorAll("table.bordered tbody span");

    spansDeConceito.forEach(span => {
        const conceito = span.textContent.trim().toUpperCase();

        if (cores[conceito]) {
            // Aplica estilo de etiqueta para o conceito (A, B, C, D).
            span.style.backgroundColor = cores[conceito];
            span.style.color = conceito === 'C' ? 'black' : 'white';
            span.style.padding = '3px 8px';
            span.style.borderRadius = '5px';
            span.style.fontWeight = 'bold';
            span.style.display = 'inline-block';
            span.style.minWidth = '25px';
            span.style.textAlign = 'center';

            // Se o conceito for 'D', destaca a célula da disciplina.
            if (conceito === 'D') {
                const linha = span.closest('tr');
                if (linha) {
                    const celulaDisciplina = linha.querySelector('td[headers="th_disciplina"]');
                    if (celulaDisciplina) {
                        // ALTERAÇÃO: Usa a mesma cor do conceito D e ajusta a cor do texto.
                        celulaDisciplina.style.backgroundColor = cores.D;
                        celulaDisciplina.style.color = 'white';
                        celulaDisciplina.style.fontWeight = 'bold';
                    }
                }
            }
        }
    });

    // --- ETAPA 3: Destacar a frequência abaixo de 75% ---

    const celulasFrequencia = document.querySelectorAll('td[headers="th_frequencia"]');

    celulasFrequencia.forEach(td => {
        try {
            const textoFreq = td.textContent.trim();
            const valorFrequencia = parseFloat(textoFreq.replace('%', '').replace(',', '.'));

            if (!isNaN(valorFrequencia) && valorFrequencia < 75) {
                td.style.backgroundColor = cores.BAIXA_FREQUENCIA;
                td.style.color = 'white';
                td.style.fontWeight = 'bold';
            }
        } catch (e) {
            console.error("Erro ao analisar a célula de frequência:", td, e);
        }
    });

})();
