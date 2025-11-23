let cardConteiner = document.querySelector('.card-conteiner');
let lista = [];
const campoBusca = document.querySelector('#pesquisa');
const botaoBusca = document.querySelector('#botao-busca');
const detalhe = document.querySelector('#detalhe-pokemon');

if (campoBusca) campoBusca.addEventListener('input', Buscar);
if (botaoBusca) botaoBusca.addEventListener('click', Buscar);

async function carregarPokemons() {
    try {
        let show = await fetch('ppokedex.json');
        lista = await show.json();
    } catch (err) {
        console.error('Erro ao carregar pokemons:', err);
        cardConteiner.innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

async function Buscar() {
    const termo = (campoBusca && campoBusca.value) ? campoBusca.value.trim().toLowerCase() : '';

    // se não há termo, não mostrar todos — apenas instrução
    if (!termo) {
        cardConteiner.innerHTML = '<p>Digite algo e pressione Enter ou clique na pokebola para ver resultados.</p>';
        closeDetail();
        return;
    }

    if (!lista || lista.length === 0) {
        await carregarPokemons();
    }

    const listaFiltrada = lista.filter(p => {
        return (
            (p.pokemon && p.pokemon.toLowerCase().includes(termo)) ||
            (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
            (p.tipos && p.tipos.toLowerCase().includes(termo)) ||
            (p.num && p.num.toLowerCase().includes(termo)) ||
            (p.linhaevolutiva && p.linhaevolutiva.toLowerCase().includes(termo)) ||
            (p.treinador && p.treinador.toLowerCase().includes(termo))
        );
    });

    renderizarCards(listaFiltrada);

    // se houver exatamente um resultado, mostrar detalhe automaticamente
    if (listaFiltrada.length === 1) {
        showDetail(listaFiltrada[0]);
    } else {
        closeDetail();
    }
}

function renderizarCards(listaParaRender) {
    cardConteiner.innerHTML = '';
    if (!listaParaRender || listaParaRender.length === 0) {
        cardConteiner.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }
    for (let dados of listaParaRender) {
        let article = document.createElement('article');
        article.classList.add('card');
        article.style.cursor = 'pointer';
        article.innerHTML = `
        <h3>${dados.pokemon}</h3>
        <p>${dados.num}</p>
        <p>${dados.linhaevolutiva || ''}</p>
        <p>Treinador: ${dados.treinador || '—'}</p>
        <p>Geração: ${dados.geração || '—'}</p>
        <p>Tipo: ${dados.tipos || '—'}</p>
        <p class="descricao-pequena">${dados.descricao || ''}</p>
        <p><img height="100" width="100" src='${dados.img}'/></p>
        `;

        article.addEventListener('click', () => showDetail(dados));
        cardConteiner.appendChild(article);
    }
}

function showDetail(dados) {
    if (!detalhe) return;
    detalhe.style.display = 'block';
    detalhe.innerHTML = `
        <button id="fechar-detalhe" style="float:right;">Fechar</button>
        <h2>${dados.pokemon} <small>#${dados.num}</small></h2>
        <small>${dados.linhaevolutiva || ''}<small>
        <img src='${dados.img || ''}' alt='${dados.pokemon}' style='max-width:200px' />
        <p><strong>Treinador:</strong> ${dados.treinador || '—'}</p>
        <p><strong>Geração:</strong> ${dados.geração || '—'}</p>
        <p><strong>Tipo:</strong> ${dados.tipos || '—'}</p>
        <p><strong>Descrição:</strong> ${dados.descricao || ''}</p>
        ${dados.video ? `<p><a href="${dados.video}" target="_blank">Ver vídeo</a></p>` : ''}
    `;
    const btn = document.querySelector('#fechar-detalhe');
    if (btn) btn.addEventListener('click', closeDetail);
    detalhe.scrollIntoView({behavior: 'smooth'});
}

function closeDetail() {
    if (!detalhe) return;
    detalhe.style.display = 'none';
    detalhe.innerHTML = '';
}

// fechar com ESC
document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeDetail();
});

// carregar inicialmente
carregarPokemons();