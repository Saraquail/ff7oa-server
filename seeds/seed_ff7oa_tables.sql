BEGIN; 

TRUNCATE
"limits", "weapons", "materia", "walkthroughs", "guides", "users"
RESTART IDENTITY CASCADE;

INSERT INTO "users" 
  ("user_name", "password")
  VALUES
  ('test', '$2a$12$jmjk0fWgKl8Ig6ZJ7epxvecI6FP9GekiwpQ8ieRSjXYkxtyRh0xiO'),
  ('saraquail', '$2a$12$FUmTW.CFvl1DwelNDEipSOuBAy4KigHVGof9Ffav/GdUqqWlSSVFS');

INSERT INTO "limits"
("character", "name", "level", "description", "obtain_by")
VALUES
('Cloud', 'Braver', 1, 'One downward swing deals normal damage x3', 'Initial'),
('Cloud', 'Cross-slash', 1, 'Three blows deal normal damage x3 and can cause paralysis', 'Using Braver 8 times');

INSERT INTO "weapons"
("name", "character", "location", "slots", "growth")
VALUES
('Buster Sword', 'Cloud', 'initial', 2, 'Normal'),
('Mythril Saber', 'Cloud', 'Buying at Kalm or Junon', 3, 'Normal');

INSERT INTO "materia"
("name", "type",
  "description",
  "skills",
  "ap",
  "mp",
  "sell", "location")
VALUES
('Cure', 'magic', 
  'Equips Cure magic',
  ARRAY ['Cure 1', 'Cure 2', 'regen', 'Cure 3'],
  ARRAY [5, 24, 30, 64],
  ARRAY [2500, 17000, 25000, 40000],
  52500, 'No. 1 Reactor, various shops'),
('Added Cut', 'support', 
  'Use of linked Materia followed by physical attack',
  NULL,
  ARRAY [200000],
  ARRAY [0],
  1, 'Great Glacier'
  );

INSERT INTO "walkthroughs"
("type", "monster_id", "weapon_id", "limit_id", "materia_id", "user_name",
  "body")
VALUES
('materia', NULL, NULL, NULL, 2, 'saraquail', 
  'Once at the hot springs, go south. You will come across an area with four exits. Take the path to the northeast, it is a one-way path. On the second screen you will see a hilly area with bare rock exposed. The added-cut materia is on the upper edge of this screen. It blends in with the snow, but will shimmer every few seconds.');

INSERT INTO "guides" 
  ("user_id","walkthrough_id", "name", "note")
  VALUES
  (1, 1, 'next boss', 'watch out for the cannons'),
  (1, 1, 'Rufio', 'a very unkind man');

COMMIT;