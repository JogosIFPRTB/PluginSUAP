// Script para exibir painel de faltas de alunos, destacar quem está acima de 25% e enviar email ao SEPAE
(function () {
  // Remove painel anterior se existir
  const painelAntigo = document.getElementById("painelFaltasResumo");
  if (painelAntigo) painelAntigo.remove();

  // Coleta o número total de aulas ministradas
  const aulasMinistradasEl = Array.from(document.querySelectorAll(".list-item dt"))
    .find(el => el.textContent.trim() === "Aulas Ministradas");
  const totalAulas = aulasMinistradasEl
    ? parseInt(aulasMinistradasEl.nextElementSibling.textContent.trim().split(" de ")[0])
    : 0;

  const limiteFaltas = totalAulas * 0.25;
  const alertaLaranja = limiteFaltas - 2;

  // Coleta informações do curso, disciplina e professor
  const cursoEl = Array.from(document.querySelectorAll(".list-item dt"))
    .find(el => el.textContent.trim() === "Curso");
  const nomeCursoCompleto = cursoEl ? cursoEl.nextElementSibling.textContent.trim().split(" - ")[1] : "";
  const nomeCurso = nomeCursoCompleto.replace(/\s*\(Campus.*?\)/i, "").trim();
  const disciplinaH2 = document.querySelector(".title-container h2");
  const nomeDisciplina = disciplinaH2 ? disciplinaH2.textContent.trim().split(" - ")[2] : "";
  const profEl = Array.from(document.querySelectorAll(".list-item dt"))
    .find(el => el.textContent.trim() === "Professores");
  const nomeProfessor = profEl ? profEl.nextElementSibling.textContent.trim().split(" (")[0] : "";

  // Coleta dados por aluno
  const alunos = [];
  const alunosVermelhos = [];
  const linhas = document.querySelectorAll("#table_faltas tbody tr");

  linhas.forEach(tr => {
    const nomeEl = tr.querySelector("td a[href*='/edu/aluno/']");
    const nome = nomeEl ? nomeEl.textContent.trim() : "Aluno não identificado";

    // Coleta faltas diretamente do texto da última coluna
    const statusEl = tr.querySelector("td.text-start span.status-info");
    const textoStatus = statusEl ? statusEl.textContent.trim() : "";
    const matchFaltas = textoStatus.match(/(\d+)\s+falta/);
    const totalFaltas = matchFaltas ? parseInt(matchFaltas[1]) : 0;

    const frequencia = totalAulas > 0 ? ((1 - totalFaltas / totalAulas) * 100).toFixed(2) : "0.00";
    let cor = "white";

    // Marca a linha em vermelho ou laranja se ultrapassar o limite
    if (totalFaltas > limiteFaltas) {
      tr.style.border = "2px solid red";
      cor = "red";
      alunosVermelhos.push({ nome, total: totalFaltas, frequencia });
    } else if (totalFaltas > alertaLaranja) {
      tr.style.border = "2px solid orange";
      cor = "orange";
    }

    if (totalFaltas > 0) {
      alunos.push({ nome, total: totalFaltas, frequencia, cor });
    }
  });

  // Cria o painel flutuante com os dados
  const painel = document.createElement("div");
  painel.id = "painelFaltasResumo";
  painel.style = `
    position:fixed;top:10px;right:10px;z-index:9999;background:#000;
    border:2px solid #000;border-radius:8px;padding:12px;width:380px;
    max-height:90vh;overflow-y:auto;color:white;font-family:Arial,sans-serif
  `;

  painel.innerHTML = `
    <h3 style='margin-top:0;'>📋 Resumo de Faltas<br>
    <small>${nomeCurso} - ${nomeDisciplina}</small></h3>
  `;

  let textoCopiar = `Resumo de faltas da disciplina\n${nomeDisciplina}\n${nomeCurso}\n(total de aulas: ${totalAulas})\n`;

  const ul = document.createElement("ul");
  ul.style.paddingLeft = "20px";

  alunos.forEach((aluno, i) => {
    const li = document.createElement("li");
    li.textContent = `${aluno.nome} - ${aluno.total} faltas - ${aluno.frequencia}%`;
    li.style.color = aluno.cor;
    ul.appendChild(li);
    textoCopiar += `${i + 1}. ${aluno.nome} - ${aluno.total} faltas - ${aluno.frequencia}%\n`;
  });

  painel.appendChild(ul);

  // Botão de copiar texto
  const botaoCopiar = document.createElement("button");
  botaoCopiar.textContent = `📋 Copiar`;
  botaoCopiar.style = `
    margin-top:10px;padding:6px 10px;border:none;border-radius:5px;
    background-color:#0066cc;color:#fff;cursor:pointer
  `;
  botaoCopiar.onclick = () => {
    navigator.clipboard.writeText(textoCopiar).then(() => {
      botaoCopiar.textContent = "✅ Copiado!";
      setTimeout(() => botaoCopiar.textContent = `📋 Copiar`, 2000);
    });
  };
  painel.appendChild(botaoCopiar);

  // Botão para abrir Gmail com alunos vermelhos
  const botaoGmail = document.createElement("button");
  botaoGmail.textContent = "📨 Enviar SEPAE";
  botaoGmail.style = `
    margin-top:10px;margin-left:10px;padding:6px 10px;
    background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer
  `;
  botaoGmail.onclick = () => {
    const assunto = encodeURIComponent("Alunos com baixa frequência");
    const corpo = encodeURIComponent(
      `Prezados,\n\nSolicito verificação da seguinte lista de alunos da disciplina ${nomeDisciplina}, curso ${nomeCurso}, que estão com frequência abaixo de 75%:\n\n` +
      alunosVermelhos.map((a, i) => `${i + 1}. ${a.nome} - ${a.total} faltas - ${a.frequencia}% de frequência`).join("\n") +
      `\n\nAtenciosamente,\n${nomeProfessor}`
    );
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${assunto}&body=${corpo}`;
    window.open(url, "_blank");
  };
  painel.appendChild(botaoGmail);

  // Botão de fechar painel
  const botaoFechar = document.createElement("button");
  botaoFechar.textContent = "❌ Fechar";
  botaoFechar.style = `
    margin-top:10px;margin-left:10px;padding:6px 10px;
    background:#990000;color:#fff;border:none;border-radius:5px;cursor:pointer
  `;
  botaoFechar.onclick = () => painel.remove();
  painel.appendChild(botaoFechar);

  document.body.appendChild(painel);
})();
