let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('myButterflyDB')

// create table to store all datas
db.serialize(function () {  
  // survey table
  db.run('create table if not exists survey(id integer primary key autoincrement, firstname text not null, lastname text not null, Email text not null, favouritebutterflylist text not null, comment text not null, committime datetime)');

  // member table
  db.run('create table if not exists member(id integer primary key autoincrement, username text not null, password text not null, email text not null, grandCode integer not null, registertime datetime);')

  // butterfly table
  db.run('create table if not exists butterfly(id integer primary key autoincrement, commonName text not null, scientificName text not null, imgSrc text not null, sumLike text not null);');

  // initialise some butterflies
  db.run("insert into butterfly (id, commonName, scientificName, imgSrc, sumLike) values (0, 'Black-veined White', 'Aporia crataegi', 'images/black-viened-white.jpg', 0),(1, 'Brimstone', 'Gonepteryx rhamni', 'images/brimstone.jpg', 0),(2, 'Chequered Skipper', 'Carterocephalus palaemon', 'images/chequered-skipper.jpg', 0),(3, 'Clouded Yellow', 'Colias croceus', 'images/clouded-white.jpg', 0),(4, 'Dingy Skipper', 'Erynnis tages', 'images/dingy-skipper-erynnis-tages.jpg', 0),(5, 'Essex Skipper', 'Thymelicus lineola', 'images/essex-skipper-thymelicus-lineola.jpg', 0),(6, 'Green-veined White', 'Pieris napi', 'images/green-viened-white.jpg', 0),(7, 'Grizzled Skipper', 'Pyrgus malvae', 'images/grizzled-skipper.jpg', 0),(8, 'Large Heath', 'Coenonympha tullia', 'images/large-heath-coenonympha-tullia-ssp-davus.jpg', 0),(9, 'Large Skipper', 'Ochlodes sylvanus', 'images/large-skipper.jpg', 0),(10, 'Large White', 'Pieris brassicae', 'images/large-white.jpg', 0),(11, 'Lulworth Skipper', 'Thymelicus acteon', 'images/lulworth-skipper.jpg', 0),(12, 'Orange-tip', 'Anthocharis cardamines', 'images/orange-tip-anthocharis-cardamines.jpg', 0),(13, 'Silver-spotted Skipper', 'Hesperia comma', 'images/silver-spotted-skipper.jpg', 0),(14, 'Small Skipper', 'Thymelicus sylvestris', 'images/small-skipper.jpg', 0),(15, 'Small White', 'Pieris rapae', 'images/small-white.jpg', 0),(16, 'Speckled Wood', 'Parage aegeria', 'images/speckled-wood.jpg', 0),(17, 'Swallowtail', 'Papilio machaon', 'images/swallowtail-papilio-machaon.jpg', 0),(18, 'Wall', 'Lasiommata megera', 'images/wall-lasiommata-megera.jpg', 0),(19, 'Wood White', 'Leptidea sinapis', 'images/wood-white.jpg', 0);");

})

db.close();