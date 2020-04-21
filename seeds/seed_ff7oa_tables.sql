BEGIN; 

TRUNCATE
  ff7oa_users,
  ff7oa_monsters,
  ff7oa_guides
  RESTART IDENTITY CASCADE;


INSERT INTO ff7oa_users 
  (user_name, password)
  VALUES
  ('test', '$2a$12$jmjk0fWgKl8Ig6ZJ7epxvecI6FP9GekiwpQ8ieRSjXYkxtyRh0xiO'),
  ('saraquail', '$2a$12$FUmTW.CFvl1DwelNDEipSOuBAy4KigHVGof9Ffav/GdUqqWlSSVFS');


INSERT INTO ff7oa_monsters
  (user_id, name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill)
  VALUES
    (2, 'Airbuster', 
    1200, 
    0,
    180, 
    150, 
    'Lightning', 
    'Fire', 
    'Sector 5, Outside Reactor', 
    15, 
    'N/A', 
    'Titan Bangle',
    'N/A'
    ),
    (2, 'Midgar Zolom', 
    4000, 
    348, 
    250, 
    400, 
    'N/A', 
    'N/A', 
    'Marshes', 
    26, 
    'N/A', 
    'N/A',
    'Beta'
    ),
    (2, 'Rufus',
    500,
    0,
    240,
    400,
    'N/A',
    'Gravity',
    'Shinra Building, Heliport',
    21, 
    'N/A',
    'Protect Vest',
    'N/A'
    );

INSERT INTO ff7oa_guides 
  (user_id, monster_id, name, note)
  VALUES
  (1, 1, 'next boss', 'watch out for the cannons'),
  (1, 3, 'Rufio', 'a very unkind man');

    COMMIT;

    

