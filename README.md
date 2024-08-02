# Criador de API Express automático

Esse serviço tem como propósito facilitar o processo de criação de uma REST API em express, seja em JS ou TS, usando como base o arquivo schema.prisma.
Quando executado ele cria os arquivos principais como _controllers_, _repositories_ e _routes_ dentro da pasta `src/`.
Além disso, ele também cria um json padrão da API no formato Postman Collection, que pode ser facilmente importado no Postman, facilitando e agilizando o processo de criação e documentação de API.

O prisma é uma biblioteca que lida com a conexão de banco de dados, independente qual seja ele.

Ao preencher o schema.prisma com seu schema do seu banco, basta executar o comando `npm start` para a criação dos arquivos.  
Arquivos da API ficam em `src/`, enquanto a collection é criada dentro da pasta `postman/`.