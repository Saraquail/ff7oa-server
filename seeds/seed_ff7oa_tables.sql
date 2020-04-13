BEGIN; 

-- TRUNCATE
  -- ff7oa_users,
  -- ff7oa_monsters;
  -- ff7oa_guides;

INSERT INTO ff7oa_users 
  (user_name, password)
  VALUES
  ('guest', 'guest');

INSERT INTO ff7oa_monsters
  (user_id, name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill)
  VALUES
    (1, 'Airbuster', 
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
    (1, 'Midgar Zolom', 
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
    (1, 'Rufus',
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

    COMMIT;