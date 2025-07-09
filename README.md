# Painel de Faltas e Conceitos - SUAP IFPR

Este projeto fornece três **Bookmarklets** úteis para professores do IFPR acessarem rapidamente **resumos de faltas**, **conceitos dos alunos** e **boletim destacado** diretamente no SUAP.

## 🔍 O que são esses painéis?

- **Painel de Faltas**: mostra alunos com faltas, destacando aqueles com mais de 25% de faltas ou próximos ao limite, permitindo copiar a lista ou enviar e-mail direto ao SEPAE.
- **Painel de Conceitos**: mostra alunos com conceitos A, B, C e D, destacando os conceitos e permitindo copiar a lista ou o envio direto ao SEPAE via Gmail.

---

## 🚀 Como Usar (via Bookmarklet)

### 1. Criar um favorito (Bookmark)

#### 🟦 Painel de Conceitos

- Acesse seu navegador e adicione qualquer página aos favoritos.
- No campo Nome, renomeie o título como: `📋 Conceitos SUAP`.
- No campo do **URL**, cole o código fornecido abaixo (totalmente minificado).
   ```javascript
    javascript:(function(){const p=document.getElementById("painelConceitosCopiar");if(p)p.remove();const c={A:0,B:0,C:0,D:0},l={A:[],B:[],C:[],D:[]},k={A:"#5c9ded",B:"#40c057",C:"#ffd43b",D:"#fa5252"};function q(v,t){return t>0?`${((v/t)*100).toFixed(2)}%`:"0.00%"}function g(t){try{const d=t.querySelector("td:nth-child(2) dd");if(d)return d.textContent.trim().split("(")[0].trim()}catch(e){console.error("Erro ao extrair nome do aluno:",e)}return"Aluno não identificado"}const u=Array.from(document.querySelectorAll(".list-item dt")).find(e=>e.textContent.trim()==="Curso"),nC=u?u.nextElementSibling.textContent.trim().split(" - ")[1]:"",nC2=nC.replace(/\s*\(Campus.*?\)/i,"").trim(),h2=document.querySelector(".title-container h2"),nD=h2?h2.textContent.trim().split(" - ")[2]:"",pE=Array.from(document.querySelectorAll(".list-item dt")).find(e=>e.textContent.trim()==="Professores"),nP=pE?pE.nextElementSibling.textContent.trim().split(" (")[0]:"";document.querySelectorAll("td .hint-bottom, td .hint").forEach(h=>{if(h.textContent.trim()==="CF"){const t=h.closest("tr");if(!t)return;const i=t.querySelector("input");if(i){const o=i.value.trim().toUpperCase();if(k[o]){i.style.border=`3px solid ${k[o]}`;let r=i.closest("tr");while(r&&!r.querySelector(".photo-circle"))r=r.parentElement?.closest("tr");const s=r;if(s){const a=g(s);if(!l[o].includes(a)){l[o].push(a);c[o]++}}}}const d=h.closest("td"),n=d.nextElementSibling;if(n){const o=n.textContent.trim().toUpperCase();if(k[o]){n.style.backgroundColor=k[o];n.style.color=o==="C"?"black":"white";n.style.fontWeight="bold";n.style.textAlign="center"}}}});const d=document.createElement("div");d.id="painelConceitosCopiar";d.style="position:fixed; top:10px; right:10px; z-index:9999; background:#1e1e1e; color:white; border:1px solid #555; border-radius:8px; padding:15px; width:380px; max-height:95vh; overflow-y:auto; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);";d.innerHTML=`<h3 style='margin-top:0; margin-bottom:10px;'>📋 Alunos por Conceito<br><small style="font-weight:normal; color:#ccc;">${nC2} - ${nD}</small></h3>`;const t=Object.values(c).reduce((a,b)=>a+b,0);if(t===0)d.innerHTML+=`<p style="color:#ffc107;">Nenhum aluno com Conceito Final (CF) preenchido foi encontrado nesta página.</p>`;else{let x=`Resumo de conceitos\n${nD}\n${nC2}\n(Total de alunos: ${t})\n`;["A","B","C","D"].forEach(o=>{const s=l[o];if(s.length===0)return;const a=q(s.length,t),e=k[o];x+=`\n${o} (${s.length} - ${a}):\n`;s.forEach((n,i)=>{x+=`${i+1}. ${n}\n`});const r=document.createElement("div");r.innerHTML=`<strong style="color:${e}; font-size:14px; display:block; margin-top:8px;">${o} (${s.length} - ${a})</strong>`;d.appendChild(r);const C=document.createElement("ul");C.style.paddingLeft="20px";C.style.marginTop="5px";s.forEach(n=>{const i=document.createElement("li");i.textContent=n;i.style.color=e;C.appendChild(i)});d.appendChild(C)});const e=document.createElement("div");e.style.marginTop="15px";e.style.borderTop="1px solid #444";e.style.paddingTop="10px";const n=document.createElement("button");n.textContent="📋 Copiar Resumo";n.style=`padding:8px 12px; border:none; border-radius:5px; background-color:${k.A}; color:#fff; cursor:pointer;`;n.onclick=()=>{navigator.clipboard.writeText(x).then(()=>{n.textContent="✅ Copiado!";setTimeout(()=>{n.textContent="📋 Copiar Resumo"},2e3)})};e.appendChild(n);if(l.D.length>0){const o=document.createElement("button");o.textContent="📨 Enviar para SEPAE";o.style=`margin-left:10px; padding:8px 12px; border:none; border-radius:5px; background-color:${k.B}; color:#fff; cursor:pointer;`;o.onclick=()=>{const s=encodeURIComponent(`Alunos com conceito D - ${nD}`),a=encodeURIComponent(`Prezados,\n\nSolicito verificação da seguinte lista de alunos da disciplina ${nD}, curso ${nC2}, que estão com conceito D:\n\n`+l.D.map((n,i)=>`${i+1}. ${n}`).join("\n")+`\n\nAtenciosamente,\n${nP}`),e=`https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${s}&body=${a}`;window.open(e,"_blank")};e.appendChild(o)}d.appendChild(e)}const b=document.createElement("button");b.textContent="❌ Fechar";b.style="position:absolute; top:5px; right:8px; background:transparent; color:#aaa; border:none; font-size:18px; cursor:pointer;";b.onmouseover=()=>{b.style.color="white"};b.onmouseout=()=>{b.style.color="#aaa"};b.onclick=()=>d.remove();d.appendChild(b);document.body.appendChild(d);})()
   ```
   
#### 🟥 Painel de Faltas

- Acesse seu navegador e adicione qualquer página aos favoritos.
- No campo Nome, renomeie o título como: `📋 Faltas SUAP` .
- No campo do **URL**, cole o código fornecido abaixo (totalmente minificado).
   ```javascript
   
  javascript:(function(){const e=document.getElementById("painelFaltasResumo");e&&e.remove();const t={LIMITE:"#fa5252",ALERTA:"#ffd43b",PADRAO_BOTAO:"#5c9ded"},o=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Aulas Ministradas"===e.textContent.trim()),l=o?parseInt(o.nextElementSibling.textContent.trim().split(" de ")[0]):0;if(0===l)return void alert("Não foi possível determinar o 'Total de Aulas Ministradas' a partir da página. O script não pode continuar.");const a=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Curso"===e.textContent.trim()),n=a?a.nextElementSibling.textContent.trim().split(" - ")[1]:"",r=n.replace(/\s*\(Campus.*?\)/i,"").trim(),s=document.querySelector(".title-container h2"),c=s?s.textContent.trim().split(" - ")[2]:"",i=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Professores"===e.textContent.trim()),d=i?i.nextElementSibling.textContent.trim().split(" (")[0]:"",u=[],m=[];document.querySelectorAll("#table_faltas tbody tr").forEach(e=>{const o=e.querySelector("td a[href*='/edu/aluno/']");if(!o)return;const a=o.textContent.trim(),n=e.querySelectorAll("input[type='text']");let r=0;n.forEach(e=>{const t=parseInt(e.value,10);isNaN(t)||(r+=t,t>0&&(e.style.backgroundColor="#ffe8e8",e.style.color="#c92a2a",e.style.fontWeight="bold"))});let s=0;const c=e.querySelector("td.text-start span.status");if(c){const e=c.textContent.match(/(\d+)\s+falta/);e&&(s=parseInt(e[1],10))}const i=Math.max(r,s);if(0===i)return;const d=(100*(1-i/l)).toFixed(2),p={nome:a,total:i,frequencia:d,cor:"white"},f=.25*l,g=f>2?f-2:f-1;i>f?(e.style.border=`2px solid ${t.LIMITE}`,p.cor=t.LIMITE,m.push(p)):i>g&&(e.style.border=`2px solid ${t.ALERTA}`,p.cor=t.ALERTA,m.push(p)),u.push(p)}),u.sort((e,t)=>t.total-e.total),m.sort((e,t)=>t.total-e.total);const p=document.createElement("div");p.id="painelFaltasResumo",p.style="position:fixed; top:10px; right:10px; z-index:9999; background:#1e1e1e; color:white; border:1px solid #555; border-radius:8px; padding:15px; width:380px; max-height:95vh; overflow-y:auto; font-family: Arial, sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);",p.innerHTML=`<h3 style='margin-top:0; margin-bottom:10px;'>📋 Resumo de Faltas<br><small style="font-weight:normal; color:#ccc;">${r} - ${c}</small></h3>`,p.innerHTML+=`<p style="margin:0 0 10px 0; font-size:12px; color:#ccc;">Total de Aulas: ${l} | Limite de Faltas (25%): ${(.25*l).toFixed(0)}</p>`,0===u.length?p.innerHTML+=`<p style="color:${t.ALERTA};">Nenhum aluno com faltas registradas.</p>`:(()=>{let e=`Resumo de faltas da disciplina\n${c}\n${r}\n(Total de aulas: ${l})\n\n`;const o=document.createElement("ul");o.style.paddingLeft="20px",o.style.margin="0",u.forEach(e=>{const t=document.createElement("li");t.style.color=e.cor,t.style.marginBottom="5px",t.textContent=`${e.nome} - ${e.total} faltas (${e.frequencia}%)`,o.appendChild(t)}),e+=o.innerText,p.appendChild(o);const a=document.createElement("div");a.style.marginTop="15px",a.style.borderTop="1px solid #444",a.style.paddingTop="10px";const n=document.createElement("button");n.textContent="📋 Copiar Resumo",n.style=`padding:8px 12px; border:none; border-radius:5px; background-color:${t.PADRAO_BOTAO}; color:#fff; cursor:pointer;`,n.onclick=()=>{navigator.clipboard.writeText(e).then(()=>{n.textContent="✅ Copiado!",setTimeout(()=>{n.textContent="📋 Copiar Resumo"},2e3)})},a.appendChild(n),m.length>0&&(()=>{const e=document.createElement("button");e.textContent="📨 Enviar SEPAE",e.style="margin-left:10px; padding:8px 12px; border:none; border-radius:5px; background-color:#28a745; color:#fff; cursor:pointer;",e.onclick=()=>{const e=encodeURIComponent(`Alunos com baixa frequência ou em risco - ${c}`),t=encodeURIComponent(`Prezados,\n\nSegue a lista de alunos da disciplina ${c}, curso ${r}, que estão com baixa frequência ou em situação de alerta (próximos ao limite de 25% de faltas):\n\n`+m.map(e=>`- ${e.nome}: ${e.total} faltas (${e.frequencia}% de frequência)`).join("\n")+`\n\nAtenciosamente,\n${d}`),o=`https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${e}&body=${t}`;window.open(o,"_blank")},a.appendChild(e)})(),p.appendChild(a)})();const f=document.createElement("button");f.textContent="❌",f.style="position:absolute; top:5px; right:8px; background:transparent; color:#aaa; border:none; font-size:18px; cursor:pointer;",f.onmouseover=()=>{f.style.color="white"},f.onmouseout=()=>{f.style.color="#aaa"},f.onclick=()=>p.remove(),p.appendChild(f),document.body.appendChild(p)})();

   ```

#### 🟪 Boletim Destacado

- Acesse seu navegador e adicione qualquer página aos favoritos.
- No campo Nome, renomeie o título como: `📋 Faltas SUAP` .
- No campo do **URL**, cole o código fornecido abaixo (totalmente minificado).
   ```javascript
   javascript:(function(){const o={A:"#5c9ded",B:"#40c057",C:"#ffd43b",D:"#fa5252",BAIXA_FREQUENCIA:"#fa5252"};document.querySelectorAll("table.bordered tbody span").forEach(e=>{const t=e.textContent.trim().toUpperCase();if(o[t]){e.style.backgroundColor=o[t],e.style.color="C"===t?"black":"white",e.style.padding="3px 8px",e.style.borderRadius="5px",e.style.fontWeight="bold",e.style.display="inline-block",e.style.minWidth="25px",e.style.textAlign="center";if("D"===t){const t=e.closest("tr");if(t){const r=t.querySelector('td[headers="th_disciplina"]');r&&(r.style.backgroundColor=o.D,r.style.color="white",r.style.fontWeight="bold")}}}}),document.querySelectorAll('td[headers="th_frequencia"]').forEach(e=>{try{const t=parseFloat(e.textContent.trim().replace("%","").replace(",","."))-75;!isNaN(t)&&t<0&&(e.style.backgroundColor=o.BAIXA_FREQUENCIA,e.style.color="white",e.style.fontWeight="bold")}catch(t){console.error("Erro ao analisar a célula de frequência:",e,t)}})})();
   ```

### 2. Acessar o SUAP

- Vá até o SUAP, acesse **Meus Diários**, aba de **Registro de Faltas** ou **Registro de Conceitos**.

### 3. Clique no Bookmarklet relacionado a aba

- O painel será exibido automaticamente no canto superior direito da tela.

---

## ✉️ Funcionalidade Extra

O botão “Enviar SEPAE” abre o Gmail com um e-mail pronto para o email da sepae.tb, contendo os alunos abaixo do limite de frequência ou com conceito D.

## 🛠️ Requisitos

- Acesso ao SUAP.
- Navegador com suporte a bookmarklets (Chrome, Firefox, Edge, etc.).
- Gmail logado (para envio automático).

## 👨‍🏫 Autor
Desenvolvido por Luiz Carlos Pinheiro Junior, professor do IFPR – Campus Telêmaco Borba.

## 📄 Licença
Este projeto é de uso livre e colaborativo para fins educacionais. Contribuições são bem-vindas!
