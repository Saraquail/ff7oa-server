BEGIN; 

TRUNCATE "monsters" RESTART IDENTITY CASCADE;

INSERT INTO "monsters"
  ("name", 
  "level", "hp", "mp", "exp", "ap", "gil",
  "weakness", "strength", "location",
  "steal", "drops", "morph", "enemy_skill")
  VALUES
    ('1st Ray',
    4, 18, 0, 12, 1, 5,
    'lightning', 'N/A', 'No. 1 Reactor',
    'N/A','N/A','potion','N/A'
    ),
    ('2-faced',
    18, 330, 80, 100, 10, 156,
    'N/A', 'earth', 'Corel Prison',
    'Phoenix Down', 'Hi-Potion', 'Hi-Potion', 'N/A'
    ),
    ('8 Eye',
    30, 500, 220, 1000, 100, 720,
    'Poison', 'Gravity', 'Temple of the Ancients, Battle Square',
    'N/A', 'N/A', 'Magic Source', 'N/A'),
    ('Acrophies', 
    35, 2400, 220, 800, 90, 1200,
    'Back-attack', 'Water', 'Corel Valley Cave, Battle Square', 
    'Water Ring', 'N/A', 'N/A', 'N/A'),
    ('Adamantaimai',
    30, 1600, 240, 720, 100, 2000,
    'Back-attack', 'Gravity', 'Wutai Area, Battle Square',
    'Adaman Bangle', 'Dragon Scales, Phoenix Down', 'N/A', 'Death Force'),
    ('Aero Combatant', 
    11, 160, 0, 40, 4, 110,
    'Gravity, Wind, Back-attack', 'Earth', 'Sector 7 Slums, Battle Square',
    'Potion', 'Potion', 'Potion', 'N/A'),
    ('Allemagne', 
    48, 8000, 200, 1300, 100, 1360,
    'Wind, Back-attack', 'Earth', 'Northern Cave',
    'Eye drop', 'Eye drop', 'N/A', 'N/A');

  COMMIT;