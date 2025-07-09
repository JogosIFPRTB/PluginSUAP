// ===================================================================================
// SCRIPT DE ANÁLISE DE FALTAS - v2.1 (Padrão Moderno)
// ===================================================================================

(function() {

    const painelAntigo = document.getElementById("painelFaltasResumo");
    if (painelAntigo) painelAntigo.remove();

    // --- INICIALIZAÇÃO E CONFIGURAÇÕES ---
    const cores = {
        LIMITE: "#fa5252",
        ALERTA: "#ffd43b",
        PADRAO_BOTAO: "#5c9ded"
    };

    const aulasMinistradasEl = Array.from(document.querySelectorAll(".list-item dt"))
        .find(el => el.textContent.trim() === "Aulas Ministradas");
    const totalAulas = aulasMinistradasEl ?
        parseInt(aulasMinistradasEl.nextElementSibling.textContent.trim().split(" de ")[0]) :
        0;

    if (totalAulas === 0) {
        alert("Não foi possível determinar o 'Total de Aulas Ministradas' a partir da página. O script não pode continuar.");
        return;
    }
    
    const limiteFaltas = totalAulas * 0.25;
    const alertaLaranja = limiteFaltas > 2 ? limiteFaltas - 2 : limiteFaltas - 1;

    // --- EXTRAÇÃO DE DADOS ---
    const cursoEl = Array.from(document.querySelectorAll(".list-item dt")).find(el => el.textContent.trim() === "Curso");
    const nomeCursoCompleto = cursoEl ? cursoEl.nextElementSibling.textContent.trim().split(" - ")[1] : "";
    const nomeCurso = nomeCursoCompleto.replace(/\s*\(Campus.*?\)/i, "").trim();
    const disciplinaH2 = document.querySelector(".title-container h2");
    const nomeDisciplina = disciplinaH2 ? disciplinaH2.textContent.trim().split(" - ")[2] : "";
    const profEl = Array.from(document.querySelectorAll(".list-item dt")).find(el => el.textContent.trim() === "Professores");
    const nomeProfessor = profEl ? profEl.nextElementSibling.textContent.trim().split(" (")[0] : "";

    const alunos = [];
    // MUDANÇA 1: Lista unificada para os alunos que precisam de atenção.
    const alunosParaEmail = [];

    // --- LÓGICA PRINCIPAL: ANÁLISE DAS FALTAS ---
    const linhas = document.querySelectorAll("#table_faltas tbody tr");

    linhas.forEach(tr => {
        const nomeEl = tr.querySelector("td a[href*='/edu/aluno/']");
        if (!nomeEl) return;
        
        const nome = nomeEl.textContent.trim();
        const inputs = tr.querySelectorAll("input[type='text']");
        let faltasInputs = 0;
        inputs.forEach(input => {
            const val = parseInt(input.value, 10);
            if (!isNaN(val)) {
                faltasInputs += val;
                // MUDANÇA 2: Melhoria de contraste no campo de input.
                if (val > 0) {
                    input.style.backgroundColor = "#ffe8e8";
                    input.style.color = "#c92a2a"; // Vermelho escuro para o texto
                    input.style.fontWeight = "bold";   // Texto em negrito
                }
            }
        });

        let faltasTexto = 0;
        const statusSpan = tr.querySelector("td.text-start span.status");
        if (statusSpan) {
            const match = statusSpan.textContent.match(/(\d+)\s+falta/);
            if (match) faltasTexto = parseInt(match[1], 10);
        }

        const totalFaltas = Math.max(faltasInputs, faltasTexto);
        if (totalFaltas === 0) return;

        const frequencia = ((1 - totalFaltas / totalAulas) * 100).toFixed(2);
        const alunoInfo = { nome, total: totalFaltas, frequencia, cor: "white" };

        if (totalFaltas > limiteFaltas) {
            tr.style.border = `2px solid ${cores.LIMITE}`;
            alunoInfo.cor = cores.LIMITE;
            alunosParaEmail.push(alunoInfo); // Adiciona à lista do e-mail
        } else if (totalFaltas > alertaLaranja) {
            tr.style.border = `2px solid ${cores.ALERTA}`;
            alunoInfo.cor = cores.ALERTA;
            alunosParaEmail.push(alunoInfo); // Adiciona também os em alerta à lista do e-mail
        }

        alunos.push(alunoInfo);
    });

    alunos.sort((a, b) => b.total - a.total);
    // Ordena também a lista do e-mail para consistência.
    alunosParaEmail.sort((a, b) => b.total - a.total);

    // --- CRIAÇÃO DO PAINEL DE RESULTADOS ---
    const painel = document.createElement("div");
    painel.id = "painelFaltasResumo";
    painel.style = `
        position:fixed; top:10px; right:10px; z-index:9999;
        background:#1e1e1e; color:white; border:1px solid #555; border-radius:8px;
        padding:15px; width:380px; max-height:95vh; overflow-y:auto;
        font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;

    painel.innerHTML = `<h3 style='margin-top:0; margin-bottom:10px;'>📋 Resumo de Faltas<br><small style="font-weight:normal; color:#ccc;">${nomeCurso} - ${nomeDisciplina}</small></h3>`;
    painel.innerHTML += `<p style="margin:0 0 10px 0; font-size:12px; color:#ccc;">Total de Aulas: ${totalAulas} | Limite de Faltas (25%): ${limiteFaltas.toFixed(0)}</p>`;
    
    if (alunos.length === 0) {
        painel.innerHTML += `<p style="color:${cores.ALERTA};">Nenhum aluno com faltas registradas.</p>`;
    } else {
        let textoCopiar = `Resumo de faltas da disciplina\n${nomeDisciplina}\n${nomeCurso}\n(Total de aulas: ${totalAulas})\n\n`;
        const ul = document.createElement("ul");
        ul.style.paddingLeft = "20px";
        ul.style.margin = "0";

        alunos.forEach(aluno => {
            const li = document.createElement("li");
            li.style.color = aluno.cor;
            li.style.marginBottom = '5px';
            li.textContent = `${aluno.nome} - ${aluno.total} faltas (${aluno.frequencia}%)`;
            ul.appendChild(li);
        });
        textoCopiar += ul.innerText;
        painel.appendChild(ul);
        
        const containerBotoes = document.createElement("div");
        containerBotoes.style.marginTop = "15px";
        containerBotoes.style.borderTop = "1px solid #444";
        containerBotoes.style.paddingTop = "10px";

        const botaoCopiar = document.createElement("button");
        botaoCopiar.textContent = "📋 Copiar Resumo";
        botaoCopiar.style = `padding:8px 12px; border:none; border-radius:5px; background-color:${cores.PADRAO_BOTAO}; color:#fff; cursor:pointer;`;
        botaoCopiar.onclick = () => {
            navigator.clipboard.writeText(textoCopiar).then(() => {
                botaoCopiar.textContent = "✅ Copiado!";
                setTimeout(() => { botaoCopiar.textContent = "📋 Copiar Resumo"; }, 2000);
            });
        };
        containerBotoes.appendChild(botaoCopiar);

        // O botão agora aparece se houver QUALQUER aluno na lista de e-mail.
        if (alunosParaEmail.length > 0) {
            const botaoGmail = document.createElement("button");
            botaoGmail.textContent = "📨 Enviar SEPAE";
            botaoGmail.style = `margin-left:10px; padding:8px 12px; border:none; border-radius:5px; background-color:#28a745; color:#fff; cursor:pointer;`;
            botaoGmail.onclick = () => {
                // MUDANÇA 1: Assunto e corpo do e-mail atualizados.
                const assunto = encodeURIComponent(`Alunos com baixa frequência ou em risco - ${nomeDisciplina}`);
                const corpo = encodeURIComponent(
                    `Prezados,\n\nSegue a lista de alunos da disciplina ${nomeDisciplina}, curso ${nomeCurso}, que estão com baixa frequência ou em situação de alerta (próximos ao limite de 25% de faltas):\n\n` +
                    alunosParaEmail.map(a => `- ${a.nome}: ${a.total} faltas (${a.frequencia}% de frequência)`).join("\n") +
                    `\n\nAtenciosamente,\n${nomeProfessor}`
                );
                const url = `https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${assunto}&body=${corpo}`;
                window.open(url, "_blank");
            };
            containerBotoes.appendChild(botaoGmail);
        }
        painel.appendChild(containerBotoes);
    }
    
    const botaoFechar = document.createElement("button");
    botaoFechar.textContent = "❌";
    botaoFechar.style = `position:absolute; top:5px; right:8px; background:transparent; color:#aaa; border:none; font-size:18px; cursor:pointer;`;
    botaoFechar.onmouseover = () => { botaoFechar.style.color = 'white'; };
    botaoFechar.onmouseout = () => { botaoFechar.style.color = '#aaa'; };
    botaoFechar.onclick = () => painel.remove();
    painel.appendChild(botaoFechar);

    document.body.appendChild(painel);

})();
