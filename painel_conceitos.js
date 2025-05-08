// Remove o painel anterior se ele já existir
const painelAntigo = document.getElementById("painelConceitosCopiar");
if (painelAntigo) painelAntigo.remove();

// Inicializa os contadores de conceitos
let contador = { A: 0, B: 0, C: 0, D: 0 };
let alunosComA = [], alunosComB = [], alunosComC = [], alunosComD = [];
const listasAlunos = { A: alunosComA, B: alunosComB, C: alunosComC, D: alunosComD };

// Define cores para os conceitos
const cores = { A: "blue", B: "green", C: "yellow", D: "red" };

// Calcula a porcentagem de alunos em cada conceito
function porcentagem(valor, total) {
  return total > 0 ? ((valor / total) * 100).toFixed(2) + "%" : "0.00%";
}

// Extrai o nome do aluno a partir de uma linha (tr)
function getNomeAluno(tr) {
  try {
    const td = tr.querySelector("td:nth-child(2) dd");
    if (td) return td.textContent.trim().split("(")[0].trim();
  } catch (e) {}
  return "Aluno não identificado";
}

// Coleta o nome do curso
const cursoEl = Array.from(document.querySelectorAll(".list-item dt"))
  .find(el => el.textContent.trim() === "Curso");
const nomeCursoCompleto = cursoEl ? cursoEl.nextElementSibling.textContent.trim().split(" - ")[1] : "";
const nomeCurso = nomeCursoCompleto.replace(/\s*\(Campus.*?\)/i, "").trim();

// Coleta o nome da disciplina
const disciplinaH2 = document.querySelector(".title-container h2");
const nomeDisciplina = disciplinaH2 ? disciplinaH2.textContent.trim().split(" - ")[2] : "";

// Coleta o nome do professor
const profEl = Array.from(document.querySelectorAll(".list-item dt"))
  .find(el => el.textContent.trim() === "Professores");
const nomeProfessor = profEl ? profEl.nextElementSibling.textContent.trim().split(" (")[0] : "";

// Percorre os conceitos finais (CF) e coleta informações dos alunos
document.querySelectorAll('td .hint-bottom, td .hint').forEach(hint => {
  if (hint.textContent.trim() === "CF") {
    const trCF = hint.closest("tr");
    if (!trCF) return;

    const input = trCF.querySelector("input");
    if (!input) return;

    const conceito = input.value.trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(conceito)) return;

    // Destaca visualmente o input
    input.style.border = `2px solid ${cores[conceito]}`;

    // Busca a linha principal (que contém foto do aluno)
    let trAtual = input.closest("tr");
    while (trAtual && !trAtual.querySelector(".photo-circle")) {
      trAtual = trAtual.parentElement?.closest("tr");
    }

    // Marca visualmente e adiciona o nome do aluno
    const trPrincipal = trAtual;
    if (trPrincipal) {
      trPrincipal.style.border = `2px solid ${cores[conceito]}`;
      const nome = getNomeAluno(trPrincipal);
      listasAlunos[conceito].push(nome);
    }

    contador[conceito]++;
  }
});

// Cria o painel de resultados
const painel = document.createElement("div");
painel.id = "painelConceitosCopiar";
painel.style = `
  position:fixed;top:10px;right:10px;z-index:9999;
  background:#000;color:white;border:2px solid #000;border-radius:8px;
  padding:12px;width:380px;max-height:90vh;overflow-y:auto;
  font-family:Arial,sans-serif
`;

painel.innerHTML = `
  <h3 style='margin-top:0;'>📋 Alunos por conceito</h3>
  <div><strong>${nomeCurso}</strong><br><em>${nomeDisciplina}</em></div>
`;

// Monta texto para copiar
const total = Object.values(contador).reduce((a, b) => a + b, 0);
let textoCopiar = `Resumo de conceitos\n${nomeDisciplina}\n${nomeCurso}\n(total: ${total})\n`;

// Gera listas visuais e texto
["A", "B", "C", "D"].forEach(conceito => {
  const lista = listasAlunos[conceito];
  const pct = porcentagem(lista.length, total);
  const cor = cores[conceito];

  textoCopiar += `\n${conceito} (${lista.length} - ${pct}):\n`;

  const titulo = document.createElement("div");
  titulo.innerHTML = `<strong style="color:${cor}; font-size: 14px;">${conceito} (${lista.length} - ${pct})</strong>`;
  painel.appendChild(titulo);

  const ul = document.createElement("ul");
  ul.style.paddingLeft = "20px";
  lista.forEach((nome, i) => {
    const li = document.createElement("li");
    li.textContent = nome;
    li.style.color = cor;
    ul.appendChild(li);
    textoCopiar += `${i + 1}. ${nome}\n`;
  });
  painel.appendChild(ul);
});

// Botão de copiar texto
const botao = document.createElement("button");
botao.textContent = `📋 Copiar`;
botao.style = `
  margin-top:10px;padding:6px 10px;
  border:none;border-radius:5px;
  background-color:#0066cc;color:#fff;cursor:pointer
`;
botao.onclick = () => {
  navigator.clipboard.writeText(textoCopiar).then(() => {
    botao.textContent = "✅ Copiado!";
    setTimeout(() => (botao.textContent = `📋 Copiar`), 2000);
  });
};
painel.appendChild(botao);

// Botão de enviar e-mail com alunos com D
const botaoGmail = document.createElement("button");
botaoGmail.textContent = "📨 Enviar SEPAE";
botaoGmail.style = `
  margin-top:10px;margin-left:10px;
  padding:6px 10px;background:#28a745;
  color:#fff;border:none;border-radius:5px;cursor:pointer
`;
botaoGmail.onclick = () => {
  const assunto = encodeURIComponent(`Alunos com conceito D - ${nomeDisciplina}`);
  const corpo = encodeURIComponent(
    `Prezados,\n\nSolicito verificação da seguinte lista de alunos da disciplina ${nomeDisciplina}, curso ${nomeCurso}, que estão com conceito D:\n\n` +
    listasAlunos["D"].map((nome, i) => `${i + 1}. ${nome}`).join("\n") +
    `\n\nAtenciosamente,\n${nomeProfessor}`
  );
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${assunto}&body=${corpo}`;
  window.open(url, '_blank');
};
painel.appendChild(botaoGmail);

// Botão de fechar o painel
const botaoFechar = document.createElement("button");
botaoFechar.textContent = "❌ Fechar";
botaoFechar.style = `
  margin-top:10px;margin-left:10px;
  padding:6px 10px;background:#990000;
  color:#fff;border:none;border-radius:5px;cursor:pointer
`;
botaoFechar.onclick = () => painel.remove();
painel.appendChild(botaoFechar);

// Exibe o painel na tela
document.body.appendChild(painel);
