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
    javascript:(function(){const p=document.getElementById("painelConceitosCopiar");if(p)p.remove();let c={A:0,B:0,C:0,D:0},aA=[],aB=[],aC=[],aD=[],l={A:aA,B:aB,C:aC,D:aD},k={A:"blue",B:"green",C:"yellow",D:"red"};function q(v,t){return t>0?((v/t)*100).toFixed(2)+%22%%22:%220.00%%22}function%20g(t){try{const%20d=t.querySelector(%22td:nth-child(2)%20dd%22);if(d)return%20d.textContent.trim().split(%22(%22)[0].trim()}catch(e){}return%22Aluno%20n%C3%A3o%20identificado%22}const%20u=Array.from(document.querySelectorAll(%22.list-item%20dt%22)).find(e=%3Ee.textContent.trim()===%22Curso%22),nC=u?u.nextElementSibling.textContent.trim().split(%22%20-%20%22)[1]:%22%22,nC2=nC.replace(/\s*\(Campus.*?\)/i,%22%22).trim(),h2=document.querySelector(%22.title-container%20h2%22),nD=h2?h2.textContent.trim().split(%22%20-%20%22)[2]:%22%22,pE=Array.from(document.querySelectorAll(%22.list-item%20dt%22)).find(e=%3Ee.textContent.trim()===%22Professores%22),nP=pE?pE.nextElementSibling.textContent.trim().split(%22%20(%22)[0]:%22%22;document.querySelectorAll(%22td%20.hint-bottom,td%20.hint%22).forEach(h=%3E{if(h.textContent.trim()===%22CF%22){const%20t=h.closest(%22tr%22);if(!t)return;const%20i=t.querySelector(%22input%22);if(!i)return;const%20o=i.value.trim().toUpperCase();if(![%22A%22,%22B%22,%22C%22,%22D%22].includes(o))return;i.style.border=`2px%20solid%20${k[o]}`;let%20tr=i.closest(%22tr%22);while(tr&&!tr.querySelector(%22.photo-circle%22))tr=tr.parentElement?.closest(%22tr%22);if(tr){tr.style.border=`2px%20solid%20${k[o]}`;const%20n=g(tr);l[o].push(n)}c[o]++}});const%20d=document.createElement(%22div%22);d.id=%22painelConceitosCopiar%22;d.style=%22position:fixed;top:10px;right:10px;z-index:9999;background:#000;border:2px%20solid%20#000;border-radius:8px;padding:12px;width:380px;max-height:90vh;overflow-y:auto;color:white;font-family:Arial,sans-serif%22;d.innerHTML=%60%3Ch3%20style='margin-top:0;'%3E%F0%9F%93%8B%20Alunos%20por%20conceito%3Cbr%3E%3Csmall%3E${nC2}%20-%20${nD}%3C/small%3E%3C/h3%3E%60;const%20t=Object.values(c).reduce((a,b)=%3Ea+b,0);let%20x=%60Resumo%20de%20conceitos\n${nD}\n${nC2}\n(total:%20${t})\n%60;[%22A%22,%22B%22,%22C%22,%22D%22].forEach(z=%3E{const%20L=l[z],p=q(L.length,t),r=k[z];x+=%60\n${z}%20(${L.length}%20-%20${p}):\n%60;const%20T=document.createElement(%22div%22);T.innerHTML=%60%3Cstrong%20style=%22color:${r};%20font-size:%2014px;%22%3E${z}%20(${L.length}%20-%20${p})%3C/strong%3E%60;d.appendChild(T);const%20U=document.createElement(%22ul%22);U.style.paddingLeft=%2220px%22;L.forEach((n,i)=%3E{const%20li=document.createElement(%22li%22);li.textContent=n;li.style.color=r;U.appendChild(li);x+=%60${i+1}.%20${n}\n%60});d.appendChild(U)});const%20b=document.createElement(%22button%22);b.textContent=%22%F0%9F%93%8B%20Copiar%22;b.style=%22margin-top:10px;padding:6px%2010px;border:none;border-radius:5px;background-color:#0066cc;color:#fff;cursor:pointer%22;b.onclick=()=%3E{navigator.clipboard.writeText(x).then(()=%3E{b.textContent=%22%E2%9C%85%20Copiado!%22;setTimeout(()=%3Eb.textContent=%60%F0%9F%93%8B%20Copiar%20tudo%20-%20${nC2}%20-%20${nD}%60,2e3)})};d.appendChild(b);const%20e=document.createElement(%22button%22);e.textContent=%22%F0%9F%93%A8%20Enviar%20SEPAE%22;e.style=%22margin-top:10px;margin-left:10px;padding:6px%2010px;background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer%22;e.onclick=()=%3E{const%20s=encodeURIComponent(%60Alunos%20com%20conceito%20D%20-%20${nD}%60),b=encodeURIComponent(%60Prezados,\n\nSolicito%20verifica%C3%A7%C3%A3o%20da%20seguinte%20lista%20de%20alunos%20da%20disciplina%20${nD},%20curso%20${nC2},%20que%20est%C3%A3o%20com%20conceito%20D:\n\n%60+l.D.map((n,i)=%3E%60${i+1}.%20${n}%60).join(%22\n%22)+%60\n\nAtenciosamente,\n${nP}%60),u=%60https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${s}&body=${b}%60;window.open(u,%22_blank%22)};d.appendChild(e);const%20f=document.createElement(%22button%22);f.textContent=%22%E2%9D%8C%20Fechar%22;f.style=%22margin-top:10px;margin-left:10px;padding:6px%2010px;background:#990000;color:#fff;border:none;border-radius:5px;cursor:pointer%22;f.onclick=()=%3Ed.remove();d.appendChild(f);document.body.appendChild(d);})()
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
