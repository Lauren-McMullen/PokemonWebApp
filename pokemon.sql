DROP TABLE Berries;
DROP TABLE Medicine;
DROP TABLE Trainer_Badges;
DROP TABLE Badge;
DROP TABLE Gym_Challenges;
DROP TABLE Battle;
DROP TABLE Trainer_Items;
DROP TABLE Learned_Moves;
DROP TABLE Player_Pokemon;
DROP TABLE Trainer;
DROP TABLE Timezone;
DROP TABLE Items;
DROP TABLE Gym;
DROP TABLE Type_Versus;
DROP TABLE Evolutions;
DROP TABLE Pokemon_Type;
DROP TABLE Can_Learn;
DROP TABLE Pokemon;
DROP TABLE City_Region;
DROP TABLE Move;
DROP TABLE Type;


/*Type*/
CREATE TABLE Type(
  name VARCHAR(20) PRIMARY KEY
);
 
/*Move*/
CREATE TABLE Move(
  name VARCHAR(50) PRIMARY KEY,
  pp INTEGER,
  effect VARCHAR(160),
  damage INTEGER,
  accuracy INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  UNIQUE(effect),
  FOREIGN KEY(type) REFERENCES Type(name) ON DELETE CASCADE
);
 
/*Items*/
CREATE TABLE Items(
  name VARCHAR(30) PRIMARY KEY,
  effect VARCHAR(120),
  UNIQUE(effect)
);
 
/*Berries*/
CREATE TABLE Berries(
  name VARCHAR(30) PRIMARY KEY,
  flavour VARCHAR(20) NOT NULL,
  FOREIGN KEY(name) REFERENCES Items(name) ON DELETE CASCADE
);

/*Medicine*/
CREATE TABLE Medicine(
  name VARCHAR(30) PRIMARY KEY,
  hp_restored INTEGER DEFAULT 0,
  pp_restored INTEGER DEFAULT 0,
  cures VARCHAR(20),
  cost INTEGER,
  FOREIGN KEY(name) REFERENCES Items(name) ON DELETE CASCADE
);
 
/*Region_City*/
CREATE TABLE City_Region(
  city VARCHAR(30) PRIMARY KEY,
  region VARCHAR(20) NOT NULL
);
 
/*Gym*/
CREATE TABLE Gym(
  name VARCHAR(50) PRIMARY KEY,
  leader VARCHAR(20),
  type VARCHAR (20) NOT NULL,
  city VARCHAR (30) NOT NULL,
  UNIQUE(leader),
  FOREIGN KEY(type) REFERENCES Type(name),
  FOREIGN KEY(city) REFERENCES City_Region(city)
);
 
/*Badge*/
CREATE TABLE Badge(
  name VARCHAR(20),
  gym_name VARCHAR(50),
  PRIMARY KEY(name, gym_name),
  FOREIGN KEY(gym_name) REFERENCES Gym(name) ON DELETE CASCADE
);

/*Battle*/
CREATE TABLE Battle(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  battle_date DATE,
  winner CHAR(6)
);
 
/*Pokemon*/
CREATE TABLE Pokemon(
  name VARCHAR(30) PRIMARY KEY,
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defence INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  generation INTEGER
);

/*Timezones*/
CREATE TABLE Timezone(
  zip_postal_code VARCHAR(10) PRIMARY KEY,
  timezone VARCHAR(5)
);
 
/*Trainer*/
CREATE TABLE Trainer(
  username VARCHAR(50) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  password VARCHAR(20) NOT NULL,
  start_date Date,
  zip_postal_code VARCHAR(10),
  FOREIGN KEY (zip_postal_code) REFERENCES Timezone(zip_postal_code) ON DELETE SET NULL
);

/*Player_Pokemon*/
CREATE TABLE Player_Pokemon(
  name VARCHAR(30),
  nickname VARCHAR(50),
  tr_username VARCHAR(50),
  pp_level INTEGER NOT NULL,
  PRIMARY KEY(name, nickname, tr_username),
  FOREIGN KEY (name) REFERENCES Pokemon(name) ON DELETE CASCADE,
  FOREIGN KEY (tr_username) REFERENCES Trainer(username) ON DELETE CASCADE
);

/*Trainer_Items*/
CREATE TABLE Trainer_Items(
  name VARCHAR(30),
  username VARCHAR(50),
  quantity INTEGER DEFAULT 0,
  PRIMARY KEY(name, username),
  FOREIGN KEY (name) REFERENCES Items(name) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES Trainer(username) ON DELETE CASCADE
);
 
/*Trainer_Badges*/
CREATE TABLE Trainer_Badges(
  gym VARCHAR(50),
  username VARCHAR(50),
  badge VARCHAR(20),
  PRIMARY KEY(gym, username, badge),
  FOREIGN KEY (badge, gym) REFERENCES Badge(name, gym_name) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES Trainer(username) ON DELETE CASCADE
);
 
/*Gym_Challenges*/
CREATE TABLE Gym_Challenges(
  gym VARCHAR(50),
  username VARCHAR(50),
  battle_id INTEGER,
  PRIMARY KEY(gym, username, battle_id),
  FOREIGN KEY (gym) REFERENCES Gym(name) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES Trainer(username) ON DELETE CASCADE,
  FOREIGN KEY (battle_id) REFERENCES Battle(id) ON DELETE CASCADE
);

/*Type_Versus*/
CREATE TABLE Type_Versus(
  attack_type VARCHAR(20),
  defense_type VARCHAR(20),
  effect_multiplier FLOAT DEFAULT 1,
  PRIMARY KEY(attack_type, defense_type),
  FOREIGN KEY (attack_type) REFERENCES Type(name),
  FOREIGN KEY (defense_type) REFERENCES Type(name)
);
 
/*Evolutions*/
CREATE TABLE Evolutions(
  from_pokemon VARCHAR(30),
  to_pokemon VARCHAR(30),
  evolution_level INTEGER,
  PRIMARY KEY(from_pokemon, to_pokemon),
  FOREIGN KEY (from_pokemon) REFERENCES Pokemon(name) ON DELETE CASCADE,
  FOREIGN KEY (to_pokemon) REFERENCES Pokemon(name) ON DELETE CASCADE
);
 
/*Pokemon_Type*/
CREATE TABLE Pokemon_Type(
  name VARCHAR(30),
  type VARCHAR(20),
  PRIMARY KEY(name, type),
  FOREIGN KEY (name) REFERENCES Pokemon(name) ON DELETE CASCADE,
  FOREIGN KEY (type) REFERENCES Type(name)
);
 
/*Can_Learn*/
CREATE TABLE Can_Learn(
  move VARCHAR(50),
  pokemon VARCHAR(30),
  PRIMARY KEY(move, pokemon),
  FOREIGN KEY (move) REFERENCES Move(name) ON DELETE CASCADE,
  FOREIGN KEY (pokemon) REFERENCES Pokemon(name) ON DELETE CASCADE
);
 
/*Learned_Moves*/
CREATE TABLE Learned_Moves(
  move VARCHAR(50),
  name VARCHAR(30),
  nickname VARCHAR(50),
  tr_username VARCHAR(50),
  PRIMARY KEY(move, name, nickname, tr_username),
  FOREIGN KEY (move) REFERENCES Move(name) ON DELETE CASCADE,
  FOREIGN KEY (name, nickname, tr_username) REFERENCES Player_Pokemon(name, nickname, tr_username) ON DELETE CASCADE);


-- Type
INSERT INTO Type(name)
VALUES ('normal');

INSERT INTO Type(name)
VALUES ('fire');

INSERT INTO Type(name)
VALUES ('water');

INSERT INTO Type(name)
VALUES ('electric');

INSERT INTO Type(name)
VALUES ('grass');

INSERT INTO Type(name)
VALUES ('ice');

INSERT INTO Type(name)
VALUES ('fighting');

INSERT INTO Type(name)
VALUES ('poison');

INSERT INTO Type(name)
VALUES ('ground');

INSERT INTO Type(name)
VALUES ('flying');

INSERT INTO Type(name)
VALUES ('psychic');

INSERT INTO Type(name)
VALUES ('bug');

INSERT INTO Type(name)
VALUES ('rock');

INSERT INTO Type(name)
VALUES ('ghost');

INSERT INTO Type(name)
VALUES ('dragon');

INSERT INTO Type(name)
VALUES ('dark');

INSERT INTO Type(name)
VALUES ('steel');

INSERT INTO Type(name)
VALUES ('fairy');

-- ITEMS

INSERT INTO Items(name, effect)
VALUES('leppa berry', 'When one move reaches 0 PP, restores 10 PP of the move');

INSERT INTO Items(name, effect)
VALUES('persim berry', 'When confused, cures confusion');

INSERT INTO Items(name, effect)
VALUES('razz berry', 'Makes wild Pokemon easier to catch');

INSERT INTO Items(name, effect)
VALUES('oran berry', 'When holder has less than 1/2 of their max HP, restores 10 HP ');

INSERT INTO Items(name, effect)
VALUES('lum berry', 'When holder has a status effect or confusion, cures the status effect');

INSERT INTO Items(name, effect)
VALUES('sitrus berry', 'When holder has less than 1/2 of their max HP, restores 1/4 of max HP');

INSERT INTO Items(name, effect)
VALUES('antidote', NULL);

INSERT INTO Items(name, effect)
VALUES('potion', 'Restores 20 HP');

INSERT INTO Items(name, effect)
VALUES('super potion', 'Restores 60 HP');

INSERT INTO Items(name, effect)
VALUES('elixir', 'Restores 10 PP of all moves of a Pokemon');

INSERT INTO Items(name, effect)
VALUES('lemonade', 'Restores 70 HP');

-- BERRIES

INSERT INTO Berries(name, flavour)
VALUES('leppa berry', 'spicy');

INSERT INTO Berries(name, flavour)
VALUES('persim berry', 'sweet');

INSERT INTO Berries(name, flavour)
VALUES('razz berry', 'dry');

INSERT INTO Berries(name, flavour)
VALUES('oran berry', 'dry');

INSERT INTO Berries(name, flavour)
VALUES('lum berry', 'bitter');

INSERT INTO Berries(name, flavour)
VALUES('sitrus berry', 'sour');

-- MEDICINE

INSERT INTO Medicine(name, cures, cost)
VALUES('antidote', 'poison', 100);

INSERT INTO Medicine(name, hp_restored, cost)
VALUES('potion', 20, 300);

INSERT INTO Medicine(name, hp_restored, cost)
VALUES('super potion', 60, 700);

INSERT INTO Medicine(name, pp_restored, cost)
VALUES('elixir', 10, 1500);

INSERT INTO Medicine(name, hp_restored, cost)
VALUES('lemonade', 70, 350);

-- TYPE_VERSUS

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'rock', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'ghost', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('normal', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'water', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'grass', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'ice', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'bug', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'rock', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'dragon', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'steel', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fire', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'fire', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'water', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'grass', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'ground', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'rock', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'dragon', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'steel', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('water', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'water', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'electric', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'grass', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'ground', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'flying', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'dragon', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'steel', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('electric', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'water', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'grass', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'poison', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'ground', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'flying', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'bug', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'rock', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'dragon', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('grass', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'water', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'grass', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'ice', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'ground', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'flying', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'dragon', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ice', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'normal', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'ice', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'poison', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'flying', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'psychic', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'bug', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'rock', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'ghost', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'dark', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'steel', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fighting', 'fairy', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'grass', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'poison', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'ground', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'rock', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'ghost', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'steel', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('poison', 'fairy', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'fire', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'electric', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'grass', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'poison', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'flying', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'bug', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'rock', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'steel', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ground', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'electric', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'grass', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'fighting', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'bug', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'rock', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('flying', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'fighting', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'poison', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'psychic', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'dark', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('psychic', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'grass', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'fighting', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'poison', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'flying', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'psychic', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'ghost', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'dark', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('bug', 'fairy', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'fire', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'ice', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'fighting', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'ground', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'flying', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'bug', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('rock', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'normal', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'psychic', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'ghost', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'dark', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'steel', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('ghost', 'fairy', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'dragon', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dragon', 'fairy', 0);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'fire', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'fighting', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'psychic', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'ghost', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'dark', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'steel', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('dark', 'fairy', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'water', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'electric', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'ice', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'fighting', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'poison', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'rock', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'dragon', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'dark', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('steel', 'fairy', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'normal', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'fire', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'water', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'electric', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'grass', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'ice', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'fighting', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'poison', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'ground', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'flying', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'psychic', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'bug', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'rock', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'ghost', 1);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'dragon', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'dark', 2);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'steel', 0.5);

INSERT INTO Type_Versus(attack_type, defense_type, effect_multiplier)
VALUES('fairy', 'fairy', 1);

-- MOVE
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('absorb', 25, 'A nutrient-draining attack. The user''s HP is restored by half the damage taken by the target.', 20, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('accelerock', 20, 'The user smashes into the target at high speed. This move always goes first.', 40, 100, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('acid', 30, 'The foe is sprayed with a harsh, hide-melting acid that may lower DEFENSE.', 40, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('acrobatics', 15, 'The user nimbly strikes the target. If the user is not holding an item, this attack inflicts massive damage.', 55, 100, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('aeroblast', 5, 'A vortex of air is shot at the target to inflict damage. Critical hits land more easily.', 100, 95, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('air slash', 15, 'The user attacks with a blade of air that slices even the sky. It may also make the target flinch.', 75, 95, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('alluring voice', 10, 'The user attacks the target using its angelic voice. This also confuses opposing Pokemon.', 120, 100, 'ghost');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('attack order', 15, 'The user calls out its underlings to pummel the target. Critical hits land more easily.', 90, 100, 'bug');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('avalanche', 10, 'The power of this attack move is doubled if the user has been hurt by the target in the same turn.', 60, 100, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('barb barrage', 10, 'The user launches countless toxic barbs to inflict damage. This may also poison the target. This move''s power is doubled if the target is already poisoned.', 60, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('barrage', 20, 'Round objects are hurled at the target to strike two to five times in a row.', 15, 85, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('bind', 20, 'Things such as long bodies or tentacles are used to bind and squeeze the target for four to five turns.', 85, 20, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('bitter malice', 10, 'The user attacks the target with spine-chilling resentment. This also lowers the target''s Attack stat.', 75, 100, 'ghost');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('blaze kick', 10, 'The user launches a kick that lands a critical hit more easily. It may also leave the target with a burn.', 85, 90, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('blizzard', 5, 'A howling blizzard is summoned to strike opposing Pokémon. This may also leave the opposing Pokémon frozen.', 110, 70, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('body slam', 15, 'The user drops onto the target with its full body weight. This may also leave the target with paralysis.', 85, 100, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('bolt strike', 5, 'The user surrounds itself with a great amount of electricity and charges its target. This may also leave the target with paralysis.', 130, 85, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('brutal swing', 20, 'The user swings its body around violently to inflict damage on everything in its vicinity.', 60, 100, 'dark');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('bubble', 30, 'A spray of countless bubbles is jetted at the opposing Pokémon. This may also lower their Speed stat.', 40, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('bug bite', 20, 'The user bites the target. If the target is holding a Berry, the user eats it and gains its effect.', 60, 100, 'bug');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('charge beam', 10, 'The user attacks with an electric charge. The user may use any remaining electricity to raise its Sp. Atk stat.', 50, 90, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('chilling water', 20, 'The user attacks the target by showering it with water that''s so cold it saps the target''s power. This also lowers the target''s Attack stat.', 50, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('clanging scales', 5, 'The user rubs the scales on its entire body and makes a huge noise to attack opposing Pokémon. The user''s Defense stat goes down after the attack.', 110, 100, 'dragon');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('close combat', 5, 'The user fights the target up close without guarding itself. It also cuts the user''s Defense and Sp. Def.', 120, 100, 'fighting');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('comet punch', 15, 'The target is hit with a flurry of punches that strike two to five times in a row.', 18, 85, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('confusion', 25, 'The target is hit by a weak telekinetic force. This may also confuse the target.', 50, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dark pulse', 15, 'The user releases a horrible aura imbued with dark thoughts. This may also make the target flinch.', 80, 100, 'dark');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dazzling gleam', 10, 'The user damages opposing Pokémon by emitting a powerful flash.', 80, 100, 'fairy');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('discharge', 15, 'The user strikes everything around it by letting loose a flare of electricity. This may also cause paralysis.', 80, 100, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('doom desire', 5, 'Two turns after this move is used, a concentrated bundle of light blasts the target.', 140, 100, 'steel');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dragon meteor', 5, 'Comets are summoned down from the sky onto the target. The attack''s recoil harshly lowers the user''s Sp. Atk stat.', 130, 90, 'dragon');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dragon claw', 15, 'The user slashes the target with huge, sharp claws.', 80, 100, 'dragon');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dragon rush', 10, 'The user tackles the target while exhibiting overwhelming menace. This may also make the target flinch.', 100, 75, 'dragon');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('dream eater', 15, 'The user eats the dreams of a sleeping target. It absorbs half the damage caused to heal its own HP.', 100, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('earth power', 10, 'The user makes the ground under the target erupt with power. This may also lower the target''s Sp. Def.', 90, 100, 'ground');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('eerie spell', 5, 'The user attacks with its tremendous psychic power. This also removes 3 PP from the target''s last move.', 80, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('ember', 25, 'The target is attacked with small flames. This may also leave the target with a burn.', 40, 100, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('energy ball', 10, 'The user draws power from nature and fires it at the target. This may also lower the target''s Sp. Def stat.', 90, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('eruption', 5, 'The user attacks opposing Pokémon with explosive fury. The lower the user''s HP, the lower the move''s power.', 150, 100, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('expanding force', 10, 'The user attacks the target with its psychic power. When the ground is Psychic Terrain, this move''s power is boosted and it damages all opposing Pokémon.', 80, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('explosion', 5, 'The user attacks everything around it by causing a tremendous explosion. The user faints upon using this move.', 250, 100, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('fairy wind', 30, 'The user stirs up a fairy wind and strikes the target with it.', 40, 100, 'fairy');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('fire blast', 5, 'The target is attacked with an intense blast of all-consuming fire. This may also leave the target with a burn.', 110, 85, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('flame wheel', 25, 'The user cloaks itself in fire and charges at the target. It may also leave the target with a burn.', 60, 100, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('fly', 15, 'The user soars and then strikes its target on the next turn. This can also be used to fly to any familiar town.', 90, 95, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('freeze shock', 5, 'On the second turn, the user hits the target with electrically charged ice. This may also leave the target with paralysis.', 140, 90, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('frenzy plant', 5, 'The user slams the target with an enormous tree. The user can''t move on the next turn.', 150, 90, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('grass pledge', 10, 'A column of grass hits the target. When used with its water equivalent, its power increases and a vast swamp appears.', 80, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('gust', 35, 'A gust of wind is whipped up by wings and launched at the target to inflict damage.', 40, 100, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('head smash', 5, 'The user attacks the target with a hazardous, full-power headbutt. This also damages the user terribly.', 150, 80, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('heart stamp', 25, 'The user unleashes a vicious blow after its cute act makes the target less wary. This may also make the target flinch.', 60, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('hex', 10, 'This relentless attack does massive damage to a target affected by status conditions.', 65, 100, 'ghost');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('hydro cannon', 5, 'The target is hit with a watery blast. The user can''t move on the next turn.', 150, 90, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('ice fang', 15, 'The user bites with cold-infused fangs. This may also make the target flinch or leave it frozen.', 65, 95, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('icy wind', 15, 'The user attacks with a gust of chilled air. This also lowers the opposing Pokémon''s Speed stats.', 55, 95, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('infestation', 20, 'The target is infested and attacked for four to five turns. The target can''t flee during this time.', 20, 100, 'bug');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('iron tail', 15, 'The target is slammed with a steel-hard tail. This may also lower the target''s Defense stat.', 100, 75, 'steel');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('leaf blade', 15, 'The user handles a sharp leaf like a sword and attacks by cutting its target. Critical hits land more easily.', 90, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('light of ruin', 5, 'Drawing power from the Eternal Flower, the user fires a powerful beam of light. This also damages the user quite a lot.', 140, 90, 'fairy');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('low sweep', 20, 'The user makes a swift attack on the target''s legs, which lowers the target''s Speed stat.', 65, 100, 'fighting');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('lunge', 15, 'The user makes a lunge at the target, attacking with full force. This also lowers the target''s Attack stat.', 80, 100, 'bug');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('malignant chain', 5, 'The user pours toxins into the target by wrapping them in a toxic, corrosive chain. This may also leave the target badly poisoned.', 100, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('mega kick', 5, 'The target is attacked by a kick launched with muscle-packed power.', 120, 75, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('mega punch', 20, 'The target is slugged by a punch thrown with muscle-packed power.', 80, 85, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('metal claw', 35, 'The target is raked with steel claws. This may also raise the user''s Attack stat.', 50, 95, 'steel');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('meteor beam', 10, 'The user gathers energy from space and boosts its Sp. Atk stat on the first turn, then attacks on the next turn.', 120, 90, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('misty explosion', 5, 'The user attacks everything around it and faints upon using this move. This move''s power is boosted on Misty Terrain.', 100, 100, 'fairy');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('mud bomb', 10, 'The user launches a hard-packed mud ball to attack. This may also lower the target''s accuracy.', 65, 85, 'ground');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('night daze', 10, 'The user lets loose a pitch-black shock wave at its target. This may also lower the target''s accuracy.', 85, 95, 'dark');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('nuzzle', 20, 'The user attacks by nuzzling its electrified cheeks against the target. This also leaves the target with paralysis.', 100, 20, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('octazooka', 10, 'The user attacks by spraying ink in the target''s face or eyes. It may also lower the target''s accuracy.', 65, 85, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('outrage', 10, 'The user rampages and attacks for two to three turns. The user then becomes confused.', 120, 100, 'dragon');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('overheat', 5, 'The user attacks the target at full power. The attack''s recoil harshly lowers the user''s Sp. Atk stat.', 130, 90, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('peck', 35, 'The target is jabbed with a sharply pointed beak or horn.', 100, 35, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('petal blizzard', 15, 'The user stirs up a violent petal blizzard and attacks everything around it.', 90, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('poison fang', 15, 'The user bites the target with toxic fangs. This may also leave the target badly poisoned.', 50, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('poison sting', 35, 'The user stabs the target with a poisonous stinger. This may also poison the target.', 15, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('power gem', 20, 'The user attacks with a ray of light that sparkles as if it were made of gemstones.', 80, 100, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('powder snow', 25, 'The user attacks with a chilling gust of powdery snow. It may also freeze the targets.', 40, 100, 'ice');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('psychic fangs', 10, 'The user bites the target with its psychic capabilities. This can also destroy Light Screen and Reflect.', 85, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('psyshock', 10, 'The user materializes an odd psychic wave to attack the target. This attack does physical damage.', 80, 100, 'psychic');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('razor leaf', 25, 'Sharp-edged leaves are launched to slash at the opposing team. Critical hits land more easily.', 55, 95, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('razor shell', 10, 'The user cuts its target with sharp shells. This may also lower the target''s Defense stat.', 75, 95, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('rock slide', 10, 'Large boulders are hurled at the opposing team to inflict damage. It may also make the targets flinch.', 75, 90, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('sand tomb', 15, 'The user traps the target inside a harshly raging sandstorm for four to five turns.', 35, 85, 'ground');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('shadow claw', 15, 'The user slashes with a sharp claw made from shadows. Critical hits land more easily.', 70, 100, 'ghost');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('signal beam', 15, 'The user attacks with a sinister beam of light. This may also confuse the target.', 75, 100, 'bug');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('sizzly slide', 15, 'The user cloaks itself in fire and charges at the target. This also leaves the target with a burn.', 90, 100, 'fire');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('sky attack', 5, 'A second-turn attack move where critical hits land more easily. It may also make the target flinch.', 140, 90, 'flying');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('sludge', 20, 'Unsanitary sludge is hurled at the target. This may also poison the target.', 65, 100, 'poison');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('spark', 20, 'The user throws an electrically charged tackle at the target. This may also leave the target with paralysis.', 65, 100, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('sparkly swirl', 15, 'The user attacks the target by wrapping it with a whirlwind of an overpowering scent. This also heals all status conditions of the user''s party.', 90, 100, 'fairy');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('stone edge', 5, 'The user stabs the target with sharpened stones from below. Critical hits land more easily.', 100, 80, 'rock');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('surf', 15, 'It swamps the area around the user with a giant wave. It can also be used for crossing water.', 90, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('thrash', 10, 'The user rampages and attacks for two to three turns. It then becomes confused, however.', 120, 100, 'normal');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('thunder punch', 15, 'The target is punched with an electrified fist. This may also leave the target with paralysis.', 75, 100, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('volt switch', 20, 'After making its attack, the user rushes back to switch places with a party Pokémon in waiting.', 70, 100, 'electric');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('water gun', 25, 'The target is blasted with a forceful shot of water.', 40, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('water pulse', 20, 'The user attacks the target with a pulsing blast of water. This may also confuse the target.', 60, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('waterfall', 15, 'The user charges at the target and may make it flinch. It can also be used to climb a waterfall.', 80, 100, 'water');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('wood hammer', 15, 'The user slams its rugged body into the target to attack. This also damages the user quite a lot.', 120, 100, 'grass');
 
INSERT INTO Move(name, pp, effect, damage, accuracy, type)
VALUES('zippy zap', 15, 'The user attacks the target with bursts of electricity at high speed. This move always goes first and results in a critical hit.', 50, 100, 'electric');

-- POKEMON
INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('bulbasaur', 45, 49, 49,45, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('ivysaur', 60, 62, 63, 60, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('venusaur', 80, 82, 83, 80, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('charmander', 39, 52, 43, 65, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('charmeleon', 58, 64, 58, 80, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('charizard', 78, 84, 78, 100, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('squirtle', 44, 48, 65, 43, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('wartortle', 59, 63, 80, 58, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('blastoise', 79, 83, 100, 78, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('caterpie', 45, 30, 35, 45, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('metapod', 50, 20, 55, 30, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('butterfree', 60, 45, 50, 70, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('weedle', 40, 35, 30, 50, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('kakuna', 45, 25, 50, 35, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('beedrill', 65, 80, 40, 75, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('pidgey', 40, 45, 40, 56, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('pidgeotto', 63, 60, 55, 71, 1);

INSERT INTO Pokemon(name, hp, attack, defence, speed, generation)
VALUES('pidgeot', 83, 80, 75, 91, 1);


-- EVOLUTIONS

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('bulbasaur', 'ivysaur', 16);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('ivysaur', 'venusaur', 32);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('charmander', 'charmeleon', 16);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('charmeleon', 'charizard', 36);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('squirtle', 'wartortle', 16);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('wartortle', 'blastoise', 36);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('caterpie', 'metapod', 7);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('metapod', 'butterfree', 10);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('weedle', 'kakuna', 7);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('kakuna', 'beedrill', 10);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('pidgey', 'pidgeotto', 18);

INSERT INTO Evolutions(from_pokemon, to_pokemon, evolution_level)
VALUES('pidgeotto', 'pidgeot', 36);


-- POKEMON_TYPE

INSERT INTO Pokemon_Type(name, type)
VALUES('bulbasaur', 'grass');

INSERT INTO Pokemon_Type(name, type)
VALUES('bulbasaur', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('ivysaur', 'grass');

INSERT INTO Pokemon_Type(name, type)
VALUES('ivysaur', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('venusaur', 'grass');

INSERT INTO Pokemon_Type(name, type)
VALUES('venusaur', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('charmander', 'fire');

INSERT INTO Pokemon_Type(name, type)
VALUES('charmeleon', 'fire');

INSERT INTO Pokemon_Type(name, type)
VALUES('charizard', 'fire');

INSERT INTO Pokemon_Type(name, type)
VALUES('charizard', 'flying');

INSERT INTO Pokemon_Type(name, type)
VALUES('squirtle', 'water');

INSERT INTO Pokemon_Type(name, type)
VALUES('wartortle', 'water');

INSERT INTO Pokemon_Type(name, type)
VALUES('blastoise', 'water');

INSERT INTO Pokemon_Type(name, type)
VALUES('caterpie', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('metapod', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('butterfree', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('butterfree', 'flying');

INSERT INTO Pokemon_Type(name, type)
VALUES('weedle', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('weedle', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('kakuna', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('kakuna', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('beedrill', 'bug');

INSERT INTO Pokemon_Type(name, type)
VALUES('beedrill', 'poison');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgey', 'normal');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgey', 'flying');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgeotto', 'normal');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgeotto', 'flying');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgeot', 'normal');

INSERT INTO Pokemon_Type(name, type)
VALUES('pidgeot', 'flying');


-- REGION_CITY
INSERT INTO City_Region(city, region)
VALUES('Pewter City', 'Kanto');

INSERT INTO City_Region(city, region)
VALUES('Cerulean City', 'Kanto');

INSERT INTO City_Region(city, region)
VALUES('Violet City', 'Johto');

INSERT INTO City_Region(city, region)
VALUES('Lavaridge Town', 'Hoenn');

INSERT INTO City_Region(city, region)
VALUES('Canalave City', 'Sinnoh');

INSERT INTO City_Region(city, region)
VALUES('Santalune  City', 'Kalos');

INSERT INTO City_Region(city, region)
VALUES('Hammerlocke', 'Galar');

-- GYM
INSERT INTO Gym(name, leader, type, city)
VALUES('Pewter Gym', 'Brock', 'rock', 'Pewter City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Cerulean Gym', 'Misty', 'water', 'Cerulean City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Hidden Cerulean Gym', 'Jessie', 'water', 'Cerulean City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Violet Gym', 'Falkner', 'flying', 'Violet City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Lavaridge Gym', 'Flannery', 'fire', 'Lavaridge Town');

INSERT INTO Gym(name, leader, type, city)
VALUES('Canalave Gym', 'Byron', 'steel', 'Canalave City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Santalune Gym', 'Viola', 'bug', 'Santalune  City');

INSERT INTO Gym(name, leader, type, city)
VALUES('Hammerlocke Stadium', 'Raihan', 'dragon', 'Hammerlocke');

-- BADGE
INSERT INTO Badge(name, gym_name)
VALUES('Boulder Badge', 'Pewter Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Pewter Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Pewter Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Water Badge', 'Cerulean Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Cerulean Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Cerulean Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Rocket Badge', 'Hidden Cerulean Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Zephyr Badge', 'Violet Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Violet Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Violet Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Heat Badge', 'Lavaridge Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Lavaridge Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Lavaridge Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Mine Badge', 'Canalave Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Canalave Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Canalave Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Bug Badge', 'Santalune Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Santalune Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Santalune Gym');

INSERT INTO Badge(name, gym_name)
VALUES('Dragon Badge', 'Hammerlocke Stadium');

INSERT INTO Badge(name, gym_name)
VALUES('Basic Badge', 'Hammerlocke Stadium');

INSERT INTO Badge(name, gym_name)
VALUES('Gold Badge', 'Hammerlocke Stadium');
 

-- BATTLE
INSERT INTO Battle(battle_date, winner)
VALUES('10-JUL-24', 'leader');

INSERT INTO Battle(battle_date, winner)
VALUES('10-JUL-24', 'player');

INSERT INTO Battle(battle_date, winner)
VALUES('14-JUL-24', 'player');

INSERT INTO Battle(battle_date, winner)
VALUES('15-JUL-24', 'leader');

INSERT INTO Battle(battle_date, winner)
VALUES('16-JUL-24', 'player');

INSERT INTO Battle(battle_date, winner)
VALUES('16-JUL-24', 'player');

INSERT INTO Battle(battle_date, winner)
VALUES('17-JUL-24', 'player');

-- TIMEZONE
INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('V5Y 1C8', 'PST');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('V5T 6N9', 'PST');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('T8N 1V9', 'MST');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('T8N 0M8', 'MST');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('C1A 9B6', 'ADT');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('C1C 7T6', 'ADT');

INSERT INTO Timezone(zip_postal_code, timezone)
VALUES('X1A 5P3', 'PST');
 
-- TRAINER
INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('pokemonLvr', 'William', 'TA_Time', '30-JUN-24', 'V5Y 1C8');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('DatabasePro', 'Seva', 'd@t@b@seGuy101', '20-JUL-24', 'V5T 6N9');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('TheVeryBest', 'Joe', 'awesomePass99', '07-JUL-24',  'T8N 1V9');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('pikachu', 'Sarah', 'aSHw8nakd78bs', '09-JUL-24', 'T8N 0M8');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('redOctapus', 'Octo', 'kslfA843gg3eq2', '09-JUL-24', 'C1A 9B6');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('Bob', 'Bob', '123456Abc', '10-JUL-24',  'C1C 7T6');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('Suicune7', 'Jamie', 'cpsc304', '10-JUL-24',  'X1A 5P3');

INSERT INTO Trainer(username, name, password, start_date, zip_postal_code)
VALUES('admin', 'admin', '1234', '31-JUL-24',  'V5Y 1C8');


-- PLAYER POKEMON
INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmander', 'Char', 'pikachu', 1);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('bulbasaur', 'Bob', 'Bob', 1);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmander', 'Char', 'TheVeryBest', 3);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('squirtle', 'Squirrel', 'Suicune7', 14);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('ivysaur', 'Thorn', 'Suicune7', 1);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmander', 'Helios', 'Suicune7', 11);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('bulbasaur', 'Pog Champ', 'Suicune7', 20);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('venusaur', 'Leafy', 'Suicune7', 23);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmeleon', 'Melon', 'Suicune7', 26);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charizard', 'Dragon Overlord', 'Suicune7', 99);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('wartortle', 'Tuttie', 'Suicune7', 16);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('blastoise', 'blastoise', 'Suicune7', 30);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('caterpie', 'Leggy', 'Suicune7', 3);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('metapod', 'zukerburg', 'Suicune7', 13);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('butterfree', 'Free Bird', 'Suicune7', 10);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('weedle', 'Sting', 'Suicune7', 9);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('kakuna', 'Kat', 'Suicune7', 6);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('beedrill', 'Queeny', 'Suicune7', 18);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgey', 'Wings', 'Suicune7', 9);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgeotto', 'Wings2', 'Suicune7', 19);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgeot', 'Wings3', 'Suicune7', 27);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('squirtle', 'Mario', 'DatabasePro', 4);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('ivysaur', 'Flora', 'DatabasePro', 10);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmander', 'Sparky', 'DatabasePro', 15);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('bulbasaur', 'Belly', 'DatabasePro', 2);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('venusaur', 'Dino', 'DatabasePro', 3);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charmeleon', 'Melly', 'DatabasePro', 16);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('charizard', 'Hot Wings', 'DatabasePro', 85);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('wartortle', 'Hank', 'DatabasePro', 56);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('blastoise', 'Fraser River', 'DatabasePro', 33);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('caterpie', 'Pumpkin', 'DatabasePro', 31);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('metapod', 'Facebook', 'DatabasePro', 83);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('butterfree', 'King', 'DatabasePro', 1);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('weedle', 'weedle', 'DatabasePro', 19);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('kakuna', 'Dr. Bacon', 'DatabasePro', 26);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('beedrill', 'Epipen', 'DatabasePro', 8);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgey', 'Floor Worker', 'DatabasePro', 9);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgeotto', 'Lower Management', 'DatabasePro', 19);

INSERT INTO Player_Pokemon(name, nickname, tr_username, pp_level)
VALUES('pidgeot', 'CEO', 'DatabasePro', 26);


-- TRAINER_ITEMS
INSERT INTO Trainer_Items(name, username, quantity)
VALUES('potion', 'TheVeryBest', 5);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('super potion', 'TheVeryBest', 1);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('lum berry', 'TheVeryBest', 3);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('lum berry', 'redOctapus', 2);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('lemonade', 'redOctapus', 1);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('oran berry', 'redOctapus', 3);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('persim berry', 'redOctapus', 4);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('razz berry', 'pokemonLvr', 1);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('antidote', 'pokemonLvr', 2);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('elixir', 'pokemonLvr', 3);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('elixir', 'DatabasePro', 2);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('sitrus berry', 'DatabasePro', 7);

INSERT INTO Trainer_Items(name, username, quantity)
VALUES('potion', 'DatabasePro', 8);

-- TRAINER BADGES
INSERT INTO Trainer_Badges(gym, username, badge)
VALUES('Cerulean Gym', 'pikachu', 'Basic Badge');

INSERT INTO Trainer_Badges(gym, username, badge)
VALUES('Hidden Cerulean Gym', 'Suicune7', 'Rocket Badge');

INSERT INTO Trainer_Badges(gym, username, badge)
VALUES('Violet Gym', 'Suicune7', 'Gold Badge');

INSERT INTO Trainer_Badges(gym, username, badge)
VALUES('Pewter Gym', 'pikachu', 'Boulder Badge');

INSERT INTO Trainer_Badges(gym, username, badge)
VALUES('Cerulean Gym', 'TheVeryBest', 'Basic Badge');

-- GYM CHALLENGES
INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Cerulean Gym', 'pokemonLvr', 1);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Cerulean Gym', 'pikachu', 2);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Hidden Cerulean Gym', 'Suicune7', 3);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Cerulean Gym', 'pikachu', 4);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Violet Gym', 'Suicune7', 5);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Pewter Gym', 'pikachu', 6);

INSERT INTO Gym_Challenges(gym, username, battle_id)
VALUES('Cerulean Gym', 'TheVeryBest', 7);


-- CAN_LEARN
INSERT INTO Can_Learn(move, pokemon)
VALUES('energy ball', 'bulbasaur');

INSERT INTO Can_Learn(move, pokemon)
VALUES('razor leaf','ivysaur');

INSERT INTO Can_Learn(move, pokemon)
VALUES('energy ball','ivysaur');

INSERT INTO Can_Learn(move, pokemon)
VALUES('energy ball','venusaur'); 

INSERT INTO Can_Learn(move, pokemon)
VALUES('razor leaf','venusaur');

INSERT INTO Can_Learn(move, pokemon)
VALUES('petal blizzard','venusaur');

INSERT INTO Can_Learn(move, pokemon)
VALUES('ember','charmander');

INSERT INTO Can_Learn(move, pokemon)
VALUES('ember','charmeleon');

INSERT INTO Can_Learn(move, pokemon)
VALUES('rock slide','charmeleon');

INSERT INTO Can_Learn(move, pokemon)
VALUES('thunder punch','charmeleon');

INSERT INTO Can_Learn(move, pokemon)
VALUES('outrage','charmeleon');

INSERT INTO Can_Learn(move, pokemon)
VALUES('ember','charizard');

INSERT INTO Can_Learn(move, pokemon)
VALUES('air slash','charizard');

INSERT INTO Can_Learn(move, pokemon)
VALUES('dragon claw','charizard');

INSERT INTO Can_Learn(move, pokemon)
VALUES('shadow claw','charizard');

INSERT INTO Can_Learn(move, pokemon)
VALUES('overheat','charizard');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water gun','squirtle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bubble','squirtle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water pulse','squirtle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water gun','wartortle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bubble','wartortle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water pulse','wartortle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water gun','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bubble','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('water pulse','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('dark pulse','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('rock slide','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('blizzard','blastoise');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','caterpie');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','metapod');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','butterfree');

INSERT INTO Can_Learn(move, pokemon)
VALUES('air slash','butterfree');

INSERT INTO Can_Learn(move, pokemon)
VALUES('confusion','butterfree');

INSERT INTO Can_Learn(move, pokemon)
VALUES('gust','butterfree');

INSERT INTO Can_Learn(move, pokemon)
VALUES('poison sting','weedle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','weedle');

INSERT INTO Can_Learn(move, pokemon)
VALUES('poison sting','kakuna');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','kakuna');

INSERT INTO Can_Learn(move, pokemon)
VALUES('bug bite','beedrill');

INSERT INTO Can_Learn(move, pokemon)
VALUES('poison sting','beedrill');

INSERT INTO Can_Learn(move, pokemon)
VALUES('confusion','beedrill');

INSERT INTO Can_Learn(move, pokemon)
VALUES('air slash','pidgey');

INSERT INTO Can_Learn(move, pokemon)
VALUES('acrobatics','pidgey');

INSERT INTO Can_Learn(move, pokemon)
VALUES('air slash','pidgeotto');

INSERT INTO Can_Learn(move, pokemon)
VALUES('acrobatics','pidgeotto');

INSERT INTO Can_Learn(move, pokemon)
VALUES('fly','pidgeotto');

INSERT INTO Can_Learn(move, pokemon)
VALUES('air slash','pidgeot');

INSERT INTO Can_Learn(move, pokemon)
VALUES('acrobatics','pidgeot');

INSERT INTO Can_Learn(move, pokemon)
VALUES('fly','pidgeot');

INSERT INTO Can_Learn(move, pokemon)
VALUES('gust','pidgeot');

-- LEARNED_MOVES
INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('ember','charmander', 'Char', 'pikachu');

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('energy ball','bulbasaur', 'Bob', 'Bob'); 

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('ember','charmander', 'Char', 'TheVeryBest');

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('water gun','squirtle', 'Squirrel', 'Suicune7');

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('bubble','squirtle', 'Squirrel', 'Suicune7');

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('energy ball','ivysaur', 'Thorn', 'Suicune7');

INSERT INTO Learned_Moves(move,name,nickname,tr_username)
VALUES('razor leaf','ivysaur', 'Thorn', 'Suicune7');

COMMIT;
