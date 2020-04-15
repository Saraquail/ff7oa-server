BEGIN; 

TRUNCATE
  ff7oa_users,
  ff7oa_monsters,
  ff7oa_guides
  RESTART IDENTITY CASCADE;


INSERT INTO ff7oa_users 
  (user_name, password)
  VALUES
  ('guest', '$2a$12$B4PcXilPboWXbDV9accQoOyfu9QRTy743liQYSzx5JSDSq288xNam'),
  ('saraquail', '$2a$12$YgrSZjwovCeSNBKOr3i39Og6wcrGpq/Ye8NLVpEvRZMs9mbVntO2G'),
  ('test', '$2a$12$BJixN/N12F24ypiqwfvvc.lKNzHotMP5VL2qFPpYq.oj.5KUJJ2Cq');

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
  (user_id, monster_id, note, name)
  VALUES
  (1, 2, 'next boss', 'don''t forget'),
  (2, 3, 'tarsting', 'bloofed');

    COMMIT;

    
