# Projeto de Linha do Tempo da História Bíblica

Este projeto Node.js utiliza Webpack para gerar páginas estáticas que compõem uma linha do tempo da história bíblica, desde Adão até os dias atuais. O objetivo deste projeto é demonstrar uma arquitetura de componentização para reutilização de código, semelhante aos frameworks populares, permitindo uma compreensão mais profunda do que tais frameworks realizam "por baixo dos panos".

## Funcionalidades

- Geração de páginas estáticas da linha do tempo da história bíblica.
- Arquitetura de componentização para reutilização de código.
- Utilização de HTML para layouts, importados nos arquivos JavaScript.
- Estilo CSS importado nos arquivos JavaScript.
- Utilização de Node.js 18 ou superior.
- Inicialização do projeto com `npm start`, que executa `webpack serve --open`.

## Pré-requisitos

- Node.js 18 ou superior instalado no sistema.

## Instalação

1. Clone este repositório para sua máquina local:

```bash
git clone https://github.com/henriquediascampos/chronology.git
```

2. Navegue até o diretório do projeto:

```bash
cd chronology
```

3. Instale as dependências do projeto:

```bash
npm install
```

## Uso

Para iniciar o servidor de desenvolvimento e visualizar o projeto:

```bash
npm start
```

Isso iniciará o servidor local e abrirá automaticamente a página no navegador padrão.

## Estrutura de Arquivos

- `src/`: Contém todos os arquivos fonte do projeto.
  - `components/`: Diretório para componentes reutilizáveis.
  - `assets/`: Contém arquivos estáticos, como imagens, fontes, etc.
  - `index.html`: Página principal da aplicação.
  - `styles.css`: Arquivo de estilos CSS.
  - `index.js`: Arquivo JavaScript principal.
- `webpack.config.js`: Configuração do Webpack para empacotamento dos arquivos.

## Contribuindo

Contribuições são bem-vindas! Para maiores detalhes, por favor, confira [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

**Nota:** Este projeto é desenvolvido apenas para fins educacionais e de aprendizado.
