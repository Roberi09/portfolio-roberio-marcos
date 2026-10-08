// ===== 1. MENU RESPONSIVO (mobile) =====
const menu = document.getElementById('menu');
const botaoMenu = document.getElementById('botao-menu');

botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', aberto);
});

menu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  })
);

// ===== 2. TEMA CLARO / ESCURO =====
const botaoTema = document.getElementById('botao-tema');
const raiz = document.documentElement;

function aplicarTema(tema) {
  raiz.setAttribute('data-tema', tema);
  localStorage.setItem('tema', tema);
}

const temaSalvo = localStorage.getItem('tema');
const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
aplicarTema(temaSalvo || (prefereEscuro ? 'escuro' : 'claro'));

botaoTema.addEventListener('click', () => {
  aplicarTema(raiz.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro');
});

// ===== 3. DESTACAR O ITEM DO MENU DA SEÇÃO VISÍVEL =====
const secoes = document.querySelectorAll('main section');
const links = document.querySelectorAll('.menu a');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      links.forEach(l =>
        l.classList.toggle('ativo', l.getAttribute('href') === '#' + entrada.target.id)
      );
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

secoes.forEach(s => observador.observe(s));

// ===== 4. FORMULÁRIO DE CONTATO =====
const formulario = document.getElementById('formulario-contato');
const modal = document.getElementById('modal');

function definirErro(campo, mensagem) {
  document.getElementById('erro-' + campo.id).textContent = mensagem;
  campo.classList.toggle('invalido', Boolean(mensagem));
}

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const nome = formulario.nome;
  const email = formulario.email;
  const mensagem = formulario.mensagem;
  let valido = true;

  // Valida nome
  if (nome.value.trim().length < 2) {
    definirErro(nome, 'Informe seu nome.'); valido = false;
  } else definirErro(nome, '');

  // Valida e-mail (obrigatório + formato)
  if (email.value.trim() === '') {
    definirErro(email, 'Informe seu e-mail.'); valido = false;
  } else if (!emailValido(email.value.trim())) {
    definirErro(email, 'E-mail inválido. Exemplo: usuario@dominio.com'); valido = false;
  } else definirErro(email, '');

  // Valida mensagem
  if (mensagem.value.trim().length < 10) {
    definirErro(mensagem, 'A mensagem precisa ter pelo menos 10 caracteres.'); valido = false;
  } else definirErro(mensagem, '');

  if (!valido) return;

  formulario.reset();
  modal.hidden = false;
});

const fecharModal = () => (modal.hidden = true);
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

// ===== 5. ANO AUTOMÁTICO NO RODAPÉ =====
document.getElementById('ano').textContent = new Date().getFullYear();