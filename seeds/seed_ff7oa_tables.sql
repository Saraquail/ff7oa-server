BEGIN; 

TRUNCATE
"limits", "weapons", "materia"
RESTART IDENTITY CASCADE;

INSERT INTO "users" 
  ("user_name", "password")
  VALUES
  ('test', '$2a$12$jmjk0fWgKl8Ig6ZJ7epxvecI6FP9GekiwpQ8ieRSjXYkxtyRh0xiO'),
  ('saraquail', '$2a$12$FUmTW.CFvl1DwelNDEipSOuBAy4KigHVGof9Ffav/GdUqqWlSSVFS');

INSERT INTO "guides" 
  ("monster_id", "name", "note")
  VALUES
  (1, 'next boss', 'watch out for the cannons'),
  (1, 'Rufio', 'a very unkind man');

INSERT INTO "limits"
()
VALUES
();

INSERT INTO "weapons"
()
VALUES
();

INSERT INTO "materia"
()
VALUES
();

COMMIT;