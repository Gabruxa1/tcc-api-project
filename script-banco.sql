select * from funcionarios;

select * from pessoas;

select*from registros_pontos rp
where pessoa_id =14;

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
