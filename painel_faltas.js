// Painel de Resumo de Faltas por Aluno com Destque Visual e Envio por Gmail
// Desenvolvido para ser executado no console de páginas do IFPR que exibem as faltas dos alunos

// Remove painel anterior, se existir, para evitar duplicação
const painelAntigo = document.getElementById("painelFaltasResumo");
if (painelAntigo) painelAntigo.remove();

// Coleta o número total de aulas ministradas a partir do painel de informações do curso
const aulasMinistradasEl = Array.from(document.querySelectorAll(".list-item dt"))
  .find(el => el.textContent.trim() === "Aulas Ministradas");
const totalAulas = aulasMinistradasEl
  ? parseInt(aulasMinistradasEl.nextElementSibling.textContent.trim().split(" de ")[0])
  : 0;

// Define limites de alerta para faltas
const limiteFaltas = totalAulas * 0.25;             // 25% de faltas
const alertaLaranja = limiteFaltas - 2;             // 2 antes do limite

// Coleta dados do curso, disciplina e professor
const cursoEl = Array.from(document.querySelectorAll(".list-item dt"))
  .find(el => el.textContent.trim() === "Curso");
const nomeCursoCompleto = cursoEl ? cursoEl.nextElementSibling.textContent.trim().split(" - ")[1] : "";
const nomeCurso = nomeCursoCompleto.replace(/\s*\(Campus.*?\)/i, "").trim();
const disciplinaH2 = document.querySelector(".title-container h2");
const nomeDisciplina = disciplinaH2 ? disciplinaH2.textContent.trim().split(" - ")[2] : "";
const profEl = Array.from(document.querySelectorAll(".list-item dt"))
  .find(el => el.textContent.trim() === "Professores");
const nomeProfessor = profEl ? profEl.nextElementSibling.textContent.trim().split(" (")[0] : "";

// Inicializa arrays de controle de alunos
const alunos = [];             // Todos os alunos com faltas
const alunosVermelhos = [];    // Apenas alunos com frequência abaixo de 75%

// Coleta todas as linhas da tabela de faltas
const linhas = document.querySelectorAll("#table_faltas tbody tr");

linhas.forEach(tr => {
  // Extrai nome do aluno
  const nomeEl = tr.querySelector("td a[href*='/edu/aluno/']");
  const nome = nomeEl ? nomeEl.textContent.trim() : "Aluno não identificado";

  // Soma de faltas a partir dos campos input (caso existam)
  const inputs = tr.querySelectorAll("input[type='text']");
  let faltasInputs = 0;
  inputs.forEach(input => {
    const val = parseInt(input.value);
    if (!isNaN(val)) {
      faltasInputs += val;
      if (val > 0) input.style.backgroundColor = "#ffcccc";
    }
  });

  // Alternativa: coleta o texto de faltas direto do status na célula final
  let faltasTexto = 0;
  const statusSpan = tr.querySelector("td.text-start span.status");
  if (statusSpan) {
    const match = statusSpan.textContent.match(/(\d+)\s+falta/);
    if (match) {
      faltasTexto = parseInt(match[1]);
    }
  }

  // Usa o maior valor entre os inputs e o status-texto para determinar o total
  const totalFaltas = Math.max(faltasInputs, faltasTexto);

  // Calcula frequência com base no total de aulas ministradas
  const frequencia = totalAulas > 0 ? ((1 - totalFaltas / totalAulas) * 100).toFixed(2) : "0.00";
  let cor = "white";

  // Aplica destaque de acordo com o total de faltas
  if (totalFaltas > limiteFaltas) {
    tr.style.border = "2px solid red";
    cor = "red";
    alunosVermelhos.push({ nome, total: totalFaltas, frequencia });
  } else if (totalFaltas > alertaLaranja) {
    tr.style.border = "2px solid orange";
    cor = "orange";
  }

  // Armazena o aluno na lista geral se tiver faltas
  if (totalFaltas > 0) {
    alunos.push({ nome, total: totalFaltas, frequencia, cor });
  }
});

// Criação do painel flutuante com os dados
const painel = document.createElement("div");
painel.id = "painelFaltasResumo";
painel.style = `
  position:fixed;top:10px;right:10px;z-index:9999;background:#000;
  border:2px solid #000;border-radius:8px;padding:12px;width:380px;
  max-height:90vh;overflow-y:auto;color:white;font-family:Arial,sans-serif
`;

// Cabeçalho do painel
painel.innerHTML = `
  <h3 style='margin-top:0;'>📋 Resumo de Faltas<br>
  <small>${nomeCurso} - ${nomeDisciplina}</small></h3>
`;

// Texto para copiar
let textoCopiar = `Resumo de faltas da disciplina\n${nomeDisciplina}\n${nomeCurso}\n(total de aulas: ${totalAulas})\n`;

const ul = document.createElement("ul");
ul.style.paddingLeft = "20px";

// Lista todos os alunos com faltas
alunos.forEach((aluno, i) => {
  const li = document.createElement("li");
  li.textContent = `${aluno.nome} - ${aluno.total} faltas - ${aluno.frequencia}%`;
  li.style.color = aluno.cor;
  ul.appendChild(li);
  textoCopiar += `${i + 1}. ${aluno.nome} - ${aluno.total} faltas - ${aluno.frequencia}%\n`;
});

painel.appendChild(ul);

// Botão para copiar o conteúdo do painel para a área de transferência
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

// Botão para envio automático via Gmail para o SEPAE
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

// Botão para fechar o painel
const botaoFechar = document.createElement("button");
botaoFechar.textContent = "❌ Fechar";
botaoFechar.style = `
  margin-top:10px;margin-left:10px;padding:6px 10px;
  background:#990000;color:#fff;border:none;border-radius:5px;cursor:pointer
`;
botaoFechar.onclick = () => painel.remove();
painel.appendChild(botaoFechar);

document.body.appendChild(painel);
