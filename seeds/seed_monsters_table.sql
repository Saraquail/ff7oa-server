BEGIN; 

TRUNCATE
"monsters"
RESTART IDENTITY CASCADE;

INSERT INTO monsters
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