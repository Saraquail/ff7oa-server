BEGIN; 

TRUNCATE
"guides", "limits", "weapons", "materia", "users"
RESTART IDENTITY CASCADE;


INSERT INTO users 
  (user_name, password)
  VALUES
  ('test', '$2a$12$jmjk0fWgKl8Ig6ZJ7epxvecI6FP9GekiwpQ8ieRSjXYkxtyRh0xiO'),
  ('saraquail', '$2a$12$FUmTW.CFvl1DwelNDEipSOuBAy4KigHVGof9Ffav/GdUqqWlSSVFS');

INSERT INTO guides 
  (user_id, monster_id, name, note)
  VALUES
  (1, 1, 'next boss', 'watch out for the cannons'),
  (1, 3, 'Rufio', 'a very unkind man');

COMMIT;

    

