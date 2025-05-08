# 📋 SUAP Notas & Conceitos (Bookmarklet)

Este é um **Bookmarklet** que facilita a visualização e exportação de **notas por conceito (A, B, C, D)** de alunos no SUAP (Sistema Unificado de Administração Pública), além de permitir o envio automático para o e-mail institucional da assistência estudantil (`sepae.tb@ifpr.edu.br`) dos alunos com conceito D.

## ✨ Funcionalidades

- Cria um painel na própria página do SUAP com o resumo dos alunos por conceito (A, B, C, D)
- Copia a lista para a área de transferência
- Envia e-mail para a SEPAE com os alunos com conceito D
- Identifica automaticamente:
  - Nome da disciplina
  - Nome do curso (sem o campus)
  - Nome do professor

## 📌 Pré-requisitos

Você precisa estar logado no [SUAP IFPR](https://suap.ifpr.edu.br/) e com a aba de **notas aberta** para o script funcionar corretamente.

## 🛠️ Como instalar e usar

### Instalar como Bookmarklet

1. Copie o código abaixo (linha única):
2. Crie um novo favorito no seu navegador.
3. Edite o favorito
4. No campo Nome, coloque SUAP Notas(ou outro que preferir)
5. No campo de URL, Copie todo o código abaixo e cole esse código:
   ```javascript
    javascript:(function(){const p=document.getElementById("painelConceitosCopiar");if(p)p.remove();let c={A:0,B:0,C:0,D:0},aA=[],aB=[],aC=[],aD=[],l={A:aA,B:aB,C:aC,D:aD},k={A:"blue",B:"green",C:"yellow",D:"red"};function q(v,t){return t>0?((v/t)*100).toFixed(2)+%22%%22:%220.00%%22}function%20g(t){try{const%20d=t.querySelector(%22td:nth-child(2)%20dd%22);if(d)return%20d.textContent.trim().split(%22(%22)[0].trim()}catch(e){}return%22Aluno%20n%C3%A3o%20identificado%22}const%20u=Array.from(document.querySelectorAll(%22.list-item%20dt%22)).find(e=%3Ee.textContent.trim()===%22Curso%22),nC=u?u.nextElementSibling.textContent.trim().split(%22%20-%20%22)[1]:%22%22,nC2=nC.replace(/\s*\(Campus.*?\)/i,%22%22).trim(),h2=document.querySelector(%22.title-container%20h2%22),nD=h2?h2.textContent.trim().split(%22%20-%20%22)[2]:%22%22,pE=Array.from(document.querySelectorAll(%22.list-item%20dt%22)).find(e=%3Ee.textContent.trim()===%22Professores%22),nP=pE?pE.nextElementSibling.textContent.trim().split(%22%20(%22)[0]:%22%22;document.querySelectorAll(%22td%20.hint-bottom,td%20.hint%22).forEach(h=%3E{if(h.textContent.trim()===%22CF%22){const%20t=h.closest(%22tr%22);if(!t)return;const%20i=t.querySelector(%22input%22);if(!i)return;const%20o=i.value.trim().toUpperCase();if(![%22A%22,%22B%22,%22C%22,%22D%22].includes(o))return;i.style.border=`2px%20solid%20${k[o]}`;let%20tr=i.closest(%22tr%22);while(tr&&!tr.querySelector(%22.photo-circle%22))tr=tr.parentElement?.closest(%22tr%22);if(tr){tr.style.border=`2px%20solid%20${k[o]}`;const%20n=g(tr);l[o].push(n)}c[o]++}});const%20d=document.createElement(%22div%22);d.id=%22painelConceitosCopiar%22;d.style=%22position:fixed;top:10px;right:10px;z-index:9999;background:#000;border:2px%20solid%20#000;border-radius:8px;padding:12px;width:380px;max-height:90vh;overflow-y:auto;color:white;font-family:Arial,sans-serif%22;d.innerHTML=%60%3Ch3%20style='margin-top:0;'%3E%F0%9F%93%8B%20Alunos%20por%20conceito%3Cbr%3E%3Csmall%3E${nC2}%20-%20${nD}%3C/small%3E%3C/h3%3E%60;const%20t=Object.values(c).reduce((a,b)=%3Ea+b,0);let%20x=%60Resumo%20de%20conceitos\n${nD}\n${nC2}\n(total:%20${t})\n%60;[%22A%22,%22B%22,%22C%22,%22D%22].forEach(z=%3E{const%20L=l[z],p=q(L.length,t),r=k[z];x+=%60\n${z}%20(${L.length}%20-%20${p}):\n%60;const%20T=document.createElement(%22div%22);T.innerHTML=%60%3Cstrong%20style=%22color:${r};%20font-size:%2014px;%22%3E${z}%20(${L.length}%20-%20${p})%3C/strong%3E%60;d.appendChild(T);const%20U=document.createElement(%22ul%22);U.style.paddingLeft=%2220px%22;L.forEach((n,i)=%3E{const%20li=document.createElement(%22li%22);li.textContent=n;li.style.color=r;U.appendChild(li);x+=%60${i+1}.%20${n}\n%60});d.appendChild(U)});const%20b=document.createElement(%22button%22);b.textContent=%22%F0%9F%93%8B%20Copiar%22;b.style=%22margin-top:10px;padding:6px%2010px;border:none;border-radius:5px;background-color:#0066cc;color:#fff;cursor:pointer%22;b.onclick=()=%3E{navigator.clipboard.writeText(x).then(()=%3E{b.textContent=%22%E2%9C%85%20Copiado!%22;setTimeout(()=%3Eb.textContent=%60%F0%9F%93%8B%20Copiar%20tudo%20-%20${nC2}%20-%20${nD}%60,2e3)})};d.appendChild(b);const%20e=document.createElement(%22button%22);e.textContent=%22%F0%9F%93%A8%20Enviar%20SEPAE%22;e.style=%22margin-top:10px;margin-left:10px;padding:6px%2010px;background:#28a745;color:#fff;border:none;border-radius:5px;cursor:pointer%22;e.onclick=()=%3E{const%20s=encodeURIComponent(%60Alunos%20com%20conceito%20D%20-%20${nD}%60),b=encodeURIComponent(%60Prezados,\n\nSolicito%20verifica%C3%A7%C3%A3o%20da%20seguinte%20lista%20de%20alunos%20da%20disciplina%20${nD},%20curso%20${nC2},%20que%20est%C3%A3o%20com%20conceito%20D:\n\n%60+l.D.map((n,i)=%3E%60${i+1}.%20${n}%60).join(%22\n%22)+%60\n\nAtenciosamente,\n${nP}%60),u=%60https://mail.google.com/mail/?view=cm&fs=1&to=sepae.tb@ifpr.edu.br&su=${s}&body=${b}%60;window.open(u,%22_blank%22)};d.appendChild(e);const%20f=document.createElement(%22button%22);f.textContent=%22%E2%9D%8C%20Fechar%22;f.style=%22margin-top:10px;margin-left:10px;padding:6px%2010px;background:#990000;color:#fff;border:none;border-radius:5px;cursor:pointer%22;f.onclick=()=%3Ed.remove();d.appendChild(f);document.body.appendChild(d);})()
   ```

8. Com a página de notas aberta no SUAP, clique no favorito para rodar o painel.

### 📨 Exemplo de envio de e-mail
O botão 📨 Enviar SEPAE abrirá uma aba no Gmail com a seguinte estrutura:

```yaml
Para: sepae.tb@ifpr.edu.br
Assunto: Alunos com conceito D - NOME_DA_DISCIPLINA

Corpo:
Prezados,

Solicito verificação da seguinte lista de alunos da disciplina NOME_DA_DISCIPLINA, curso NOME_DO_CURSO, que estão com conceito D:

1. Aluno A
2. Aluno B
...

Atenciosamente,  
NOME_DO_PROFESSOR
```

## 👨‍🏫 Autor
- Luiz Carlos Pinheiro Junior
- Professor do IFPR - Campus Telêmaco Borba
- Curso Técnico em Programação de Jogos Digitais

## 📄 Licença
Este projeto é de uso livre e colaborativo para fins educacionais. Contribuições são bem-vindas!
