# Recanto do Açaí — Landing Page de Eventos 🍧

Esta é a landing page oficial do **Recanto do Açaí** focada no setor de eventos corporativos, aniversários e festividades, ofertando serviços de buffet e carrinhos gourmet de açaí e sorvete sob demanda.

*   **Produção:** [https://recanto-acai-eventos-lp.vercel.app](https://recanto-acai-eventos-lp.vercel.app)

---

## 💻 Stack Tecnológica

*   **Frontend:** HTML5 semântico e CSS3 Vanilla (sem pré-processadores).
*   **Fontes:** Google Fonts (Lora para serifas elegantes e Outfit para leitura moderna).
*   **Ícones:** Biblioteca FontAwesome 6.4 integrada.
*   **Deploy:** Pipeline de publicação automática na Vercel a cada alteração da branch principal.

---

## 🚀 Como Executar e Deployar

### Execução Local
Por ser um site estático simples, basta abrir o arquivo `index.html` em qualquer navegador ou utilizar um servidor local rápido (como a extensão Live Server do VSCode ou `npx serve`).

### Deploy de Alterações
Para publicar novas atualizações de layout ou fotos no ambiente de produção:
```bash
git add .
git commit -m "feat: atualiza design da lp de eventos"
git push origin master  # Dispara o deploy automático na Vercel
```

---

## 📂 Estrutura de Diretórios

```
recanto-acai-eventos-lp/
├── css/             # Arquivos de estilo (style.css, responsividade)
├── js/              # Scripts auxiliares de animação e navegação
├── public/          # Ativos estáticos e logotipos do Recanto
├── index.html       # Arquivo HTML principal do portal
├── vercel.json      # Configuração de rotas e headers da Vercel
└── README.md        # Documentação do projeto
```
