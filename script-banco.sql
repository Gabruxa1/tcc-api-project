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

select*from pessoas rp;
select*from funcionarios f;
select*from registros_pontos rp;

-- Inserir 10 pessoas distintas na tabela pessoas com nomes fictícios
insert into pessoas (nome, cpf, telefone)
values
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
   
   
insert into funcionarios (pessoa_id, email, senha, funcao, admin, ativo, custo_hora)
values
    (1, 'email1@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Gerente', true, true, 20.0), --user admin, senha "teste123"
    (2, 'email2@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Analista', false, true, 25.0), --user normal, senha "teste123"
    (3, 'email3@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Desenvolvedor', true, false, 22.0),
    (4, 'email4@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Designer', false, false, 18.0),
    (5, 'email5@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Analista de Marketing', true, true, 30.0),
    (6, 'email6@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Engenheiro de Software', false, false, 28.0),
    (7, 'email7@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Analista de RH', true, true, 23.0),
    (8, 'email8@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Administrador de Sistemas', false, true, 26.0),
    (9, 'email9@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Suporte Técnico', false, false, 21.0),
    (10, 'email10@example.com', '$2b$10$6nAegm525fqTsrd/CqEeiukHypD8LJAR2RlzXspVfLONtklePxMiO', 'Coordenador de Projetos', true, true, 24.0);