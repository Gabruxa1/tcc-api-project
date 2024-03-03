--script da criação das tabelas
CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    telefone VARCHAR(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS funcionarios (
    pessoa_id INTEGER PRIMARY KEY REFERENCES pessoas(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(100) NOT NULL,
    admin BOOLEAN NOT NULL,
    ativo BOOLEAN NOT NULL,
    custo_hora FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS registros_pontos (
    pessoa_id INTEGER REFERENCES pessoas(id) ON DELETE CASCADE,
    data DATE,
    entrada TIME,
    saida TIME
);

--funcao para inserção em ambas as tabelas
CREATE OR REPLACE FUNCTION inserir_pessoa_funcionario(
    nome_p VARCHAR(255),
    cpf_p VARCHAR(11),
    telefone_p VARCHAR(11),
    email_f VARCHAR(255),
    senha_f VARCHAR(255),
    funcao_f VARCHAR(100),
    admin_f BOOLEAN,
    ativo_f BOOLEAN,
    custo_hora_f FLOAT
)
RETURNS INTEGER AS $$
DECLARE
    id_pessoa INTEGER;
BEGIN
    INSERT INTO pessoas (nome, cpf, telefone) VALUES (nome_p, cpf_p, telefone_p) RETURNING id INTO id_pessoa;
    
    INSERT INTO funcionarios (pessoa_id, email, senha, funcao, admin, ativo, custo_hora) 
        VALUES (id_pessoa, email_f, senha_f, funcao_f, admin_f, ativo_f, custo_hora_f);
    
    RETURN id_pessoa; -- Retorna o id_pessoa gerado
END;
$$ LANGUAGE PLPGSQL;

--script de deleção se necessário
drop table registros_pontos;
drop table funcionarios;
drop table pessoas;


-- Inserir 10 pessoas distintas na tabela pessoas com nomes fictícios
INSERT INTO pessoas (nome, cpf, telefone)
VALUES
    ('João Silva', '11111111111', '12345678901'),
    ('Maria Oliveira', '22222222222', '23456789012'),
    ('José Santos', '33333333333', '34567890123'),
    ('Ana Pereira', '44444444444', '45678901234'),
    ('Carlos Souza', '55555555555', '56789012345'),
    ('Fernanda Lima', '66666666666', '67890123456'),
    ('Ricardo Martins', '77777777777', '78901234567'),
    ('Camila Almeida', '88888888888', '89012345678'),
    ('Lucas Costa', '99999999999', '90123456789'),
    ('Isabela Rodrigues', '10101010101', '01234567890');


INSERT INTO funcionarios (pessoa_id, email, senha, funcao, admin, ativo, custo_hora)
VALUES
    (1, 'email1@example.com', 'senha1', 'Gerente', RANDOM() > 0.5, RANDOM() > 0.5, 20.0),
    (2, 'email2@example.com', 'senha2', 'Analista', RANDOM() > 0.5, RANDOM() > 0.5, 25.0),
    (3, 'email3@example.com', 'senha3', 'Desenvolvedor', RANDOM() > 0.5, RANDOM() > 0.5, 22.0),
    (4, 'email4@example.com', 'senha4', 'Designer', RANDOM() > 0.5, RANDOM() > 0.5, 18.0),
    (5, 'email5@example.com', 'senha5', 'Analista de Marketing', RANDOM() > 0.5, RANDOM() > 0.5, 30.0),
    (6, 'email6@example.com', 'senha6', 'Engenheiro de Software', RANDOM() > 0.5, RANDOM() > 0.5, 28.0),
    (7, 'email7@example.com', 'senha7', 'Analista de RH', RANDOM() > 0.5, RANDOM() > 0.5, 23.0),
    (8, 'email8@example.com', 'senha8', 'Administrador de Sistemas', RANDOM() > 0.5, RANDOM() > 0.5, 26.0),
    (9, 'email9@example.com', 'senha9', 'Suporte Técnico', RANDOM() > 0.5, RANDOM() > 0.5, 21.0),
    (10, 'email10@example.com', 'senha10', 'Coordenador de Projetos', RANDOM() > 0.5, RANDOM() > 0.5, 24.0);