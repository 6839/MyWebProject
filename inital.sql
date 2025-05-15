


create database sit774;

use sit774;

drop table survey;

create table survey(
id int auto_increment primary key,
firstname varchar(20) not null, 
lastname varchar(20) not null, 
Email varchar(20) not null, 
favouritebutterflylist varchar(50) not null,
comment varchar(100),
committime datetime
);

drop table member;

create table member (
id int auto_increment primary key,
username varchar(50) not null,
password varchar(100) not null,
email varchar(50) not null,
grandCode int not null,
registertime datetime
);

drop table butterfly;

create table butterfly (
id int not null primary key,
commonName varchar(100) not null,
scientificName varchar(100) not null,
imgSrc varchar(100) not null,
sumLike int not null default 0
);

insert into butterfly (id, commonName, scientificName, imgSrc, sumLike) values
(0, 'Black-veined White', 'Aporia crataegi', 'images/black-viened-white.jpg', 0),
(1, 'Brimstone', 'Gonepteryx rhamni', 'images/brimstone.jpg', 0),
(2, 'Chequered Skipper', 'Carterocephalus palaemon', 'images/chequered-skipper.jpg', 0),
(3, 'Clouded Yellow', 'Colias croceus', 'images/clouded-white.jpg', 0),
(4, 'Dingy Skipper', 'Erynnis tages', 'images/dingy-skipper-erynnis-tages.jpg', 0),
(5, 'Essex Skipper', 'Thymelicus lineola', 'images/essex-skipper-thymelicus-lineola.jpg', 0),
(6, 'Green-veined White', 'Pieris napi', 'images/green-viened-white.jpg', 0),
(7, 'Grizzled Skipper', 'Pyrgus malvae', 'images/grizzled-skipper.jpg', 0),
(8, 'Large Heath', 'Coenonympha tullia', 'images/large-heath-coenonympha-tullia-ssp-davus.jpg', 0),
(9, 'Large Skipper', 'Ochlodes sylvanus', 'images/large-skipper.jpg', 0),
(10, 'Large White', 'Pieris brassicae', 'images/large-white.jpg', 0),
(11, 'Lulworth Skipper', 'Thymelicus acteon', 'images/lulworth-skipper.jpg', 0),
(12, 'Orange-tip', 'Anthocharis cardamines', 'images/orange-tip-anthocharis-cardamines.jpg', 0),
(13, 'Silver-spotted Skipper', 'Hesperia comma', 'images/silver-spotted-skipper.jpg', 0),
(14, 'Small Skipper', 'Thymelicus sylvestris', 'images/small-skipper.jpg', 0),
(15, 'Small White', 'Pieris rapae', 'images/small-white.jpg', 0),
(16, 'Speckled Wood', 'Parage aegeria', 'images/speckled-wood.jpg', 0),
(17, 'Swallowtail', 'Papilio machaon', 'images/swallowtail-papilio-machaon.jpg', 0),
(18, 'Wall', 'Lasiommata megera', 'images/wall-lasiommata-megera.jpg', 0),
(19, 'Wood White', 'Leptidea sinapis', 'images/wood-white.jpg', 0);

