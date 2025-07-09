# Painel de Faltas e Conceitos - SUAP IFPR

Este projeto fornece dois **Bookmarklets** úteis para professores do IFPR acessarem rapidamente **resumos de faltas** e **conceitos dos alunos** diretamente no SUAP.

## 🔍 O que são esses painéis?

- **Painel de Faltas**: mostra alunos com faltas, destacando aqueles com mais de 25% de faltas ou próximos ao limite, permitindo copiar a lista ou enviar e-mail direto ao SEPAE.
- **Painel de Conceitos**: mostra alunos com conceitos A, B, C e D, destacando os com D e permitindo copiar a lista ou o envio direto ao SEPAE via Gmail.

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
   
   javascript:(function(){const e=document.getElementById("painelFaltasResumo");e&&e.remove();const t=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Aulas Ministradas"===e.textContent.trim()),a=t?parseInt(t.nextElementSibling.textContent.trim().split(" de ")[0]):0,n=.25*a,l=n-2,o=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Curso"===e.textContent.trim()),r=o?o.nextElementSibling.textContent.trim().split(" - ")[1]:"",c=r.replace(/\s*\(Campus.*?\)/i,"").trim(),i=document.querySelector(".title-container h2"),s=i?i.textContent.trim().split(" - ")[2]:"",d=Array.from(document.querySelectorAll(".list-item dt")).find(e=>"Professores"===e.textContent.trim()),m=d?d.nextElementSibling.textContent.trim().split(" (")[0]:"",u=[],p=[],f=document.querySelectorAll("#table_faltas tbody tr");f.forEach(e=>{const t=e.querySelector("td a[href*='/edu/aluno/']"),o=t?t.textContent.trim():"Aluno não identificado",r=e.querySelectorAll("input[type='text']");let i=0;r.forEach(e=>{const t=parseInt(e.value);!isNaN(t)&&(i+=t,t>0&&(e.style.backgroundColor="#ffcccc"))});let d=0,h=e.querySelector("td.text-start span.status");if(h){const e=h.textContent.match(/(\d+)\s+falta/);e&&(d=parseInt(e[1]))}const g=Math.max(i,d),y=a>0?((1-g/a)*100).toFixed(2):"0.00";let b="white";g>n?(e.style.border="2px solid red",b="red",p.push({nome:o,total:g,frequencia:y})):g>l&&(e.style.border="2px solid orange",b="orange"),g>0&&u.push({nome:o,total:g,frequencia:y,cor:b})});const h=document.createElement("div");h.id="painelFaltasResumo",h.style="position:fixed;top:10px;right:10px;z-index:9999;background:#000;border:2px solid #000;border-radius:8px;padding:12px;width:380px;max-height:90vh;overflow-y:auto;color:white;font-family:Arial,sans-serif",h.innerHTML="<h3 style='margin-top:0;'>📋 Resumo de Faltas<br><small>"+c+" - "+s+"</small></h3>";let g="Resumo de faltas da disciplina\n"+s+"\n"+c+"\n(total de aulas: "+a+")\n";const y=document.createElement("ul");y.style.paddingLeft="20px",u.forEach((e,t)=>{const a=document.createElement("li");a.textContent=e.nome+" - "+e.total+" faltas - "+e.frequencia+"%",a.style.color=e.cor,y.appendChild(a),g+=t+1+". "+e.nome+" - "+e.total+" faltas - "+e.frequencia+"%\n"}),h.appendChild(y);const b=document.createElement("button");b.textContent="📋 Copiar",b.style="margin-top:10px;padding:6px 10px;border:none;border-radius:5px;background-color:#0066cc;color:#fff;cursor:pointer",b.onclick=()=>{navigator.clipboard.writeText(g).then(()=>{b.textContent="✅ Copiado!",setTimeout(()=>b.textContent="📋 Copiar",2e3)})},h.appendChild(b);const v=document.createElement("button");v.textContent="📨 Enviar SEPAE",v.style="margin-top:10px;margin-left:10px;padding:6px 10px;background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer",v.onclick=()=>{const e=encodeURIComponent("Alunos com baixa frequência"),t=encodeURIComponent("Prezados,\n\nSolicito verificação da seguinte lista de alunos da disciplina "+s+", curso "+c+", que estão com frequência abaixo de 75%:\n\n"+p.map((e,t)=>t+1+". "+e.nome+" - "+e.total+" faltas - "+e.frequencia+"% de frequência").join("\n")+"\n\nAtenciosamente,\n"+m),a="https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su="+e+"&body="+t;window.open(a,"_blank")},h.appendChild(v);const E=document.createElement("button");E.textContent="❌ Fechar",E.style="margin-top:10px;margin-left:10px;padding:6px 10px;background:#990000;color:#fff;border:none;border-radius:5px;cursor:pointer",E.onclick=()=>h.remove(),h.appendChild(E),document.body.appendChild(h);})();

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
