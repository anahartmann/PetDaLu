create table pessoa(
    email varchar(50) not null,
    pnome varchar(50) not null,
    senha varchar(255) not null,
    cpf varchar(14) not null,
    telefone varchar(15) not null,
    administrador char,
    constraint pk_pessoa primary key(email),
    constraint uk_pessoa unique(cpf)
);

create table endereco(
    eid serial not null,
    num integer not null,
    cidade varchar(50) not null,
    logradouro varchar(50) not null,
    email varchar(50) not null,
    constraint pk_endereco primary key(eid),
    constraint fk_endereco_pessoa foreign key(email) references pessoa(email)
);

create table animal(
    aid serial not null,
    nome varchar(50) not null,
    especie varchar(50) not null,
    porte varchar(20) not null, 
    comp varchar(200) not null, 
    sexo char not null,
    permissao char not null ,
    email varchar(50) not null,
    constraint pk_animal primary key(aid),
    constraint fk_animal_pessoa foreign key(email) references pessoa(email)
);

create table data (
    ddata date not null,
    ddescr varchar(50) not null,
    constraint pk_data primary key(ddata)
);

create table horarios(
    hhora time not null,
    constraint pk_horarios primary key(hhora)
);

create table agendamento(
    ddata date not null,
    hhora time not null,
    pagamento char,
    met_pagamento varchar(10) not null,
    tipo_tosa varchar(100),
    preco_total real not null,
    aid integer not null,
    eid_entrega integer,
    eid_busca integer,
    constraint pk_agendamento primary key (ddata, hhora),
    constraint fk_agendamento_data foreign key(ddata) references data(ddata),
    constraint fk_agendamento_horarios foreign key(hhora) references horarios(hhora),
    constraint fk_agendamento_endereco_entrega foreign key(eid_entrega) references endereco(eid),
    constraint fk_agendamento_endereco_busca foreign key(eid_busca) references endereco(eid),
    constraint fk_agendamento_animal foreign key(aid) references animal(aid)
);

create table servico(
    sid serial not null,
    preco real not null,
    sdescr varchar(100) not null,
    porte varchar(50) not null,
    constraint pk_servico primary key(sid)
);

create table processo(
    sid integer not null,
    ddata date not null,
    hhora time not null,
    constraint pk_processo primary key(sid, ddata, hhora),
    constraint fk_processo_data foreign key(ddata) references agendamento(ddata),
    constraint fk_processo_horarios foreign key(hhora) references agendamento(hhora),
    constraint fk_processo_servico foreign key(sid) references servico(sid)
);

create table anotacoes(
    anid serial not null,
    andescr varchar(200) not null,
    feito char,
    constraint pk_anotacoes primary key(anid)
);
