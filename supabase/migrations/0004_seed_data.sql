-- ==========================================================
-- Migration: 0004_seed_data.sql
-- 說明：匯入教會的官方大區、牧區與小組基礎組織架構種子資料
-- ==========================================================

-- 1. 插入大區
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '東區') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '南區') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '西區') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '北區') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '青少年') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '慶典') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.great_regions (id, name) VALUES (gen_random_uuid(), '創藝') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;

-- 2. 插入牧區與小組
DO $$
DECLARE
  r_id_0 UUID;
  z_id_0_0 UUID;
  z_id_0_1 UUID;
  z_id_0_2 UUID;
  z_id_0_3 UUID;
  z_id_0_4 UUID;
  z_id_0_5 UUID;
  z_id_0_6 UUID;
  z_id_0_7 UUID;
  z_id_0_8 UUID;
  z_id_0_9 UUID;
  z_id_0_10 UUID;
  z_id_0_11 UUID;
  r_id_1 UUID;
  z_id_1_0 UUID;
  z_id_1_1 UUID;
  z_id_1_2 UUID;
  z_id_1_3 UUID;
  z_id_1_4 UUID;
  z_id_1_5 UUID;
  z_id_1_6 UUID;
  z_id_1_7 UUID;
  r_id_2 UUID;
  z_id_2_0 UUID;
  z_id_2_1 UUID;
  z_id_2_2 UUID;
  z_id_2_3 UUID;
  z_id_2_4 UUID;
  z_id_2_5 UUID;
  z_id_2_6 UUID;
  z_id_2_7 UUID;
  r_id_3 UUID;
  z_id_3_0 UUID;
  z_id_3_1 UUID;
  z_id_3_2 UUID;
  z_id_3_3 UUID;
  z_id_3_4 UUID;
  z_id_3_5 UUID;
  z_id_3_6 UUID;
  z_id_3_7 UUID;
  r_id_4 UUID;
  z_id_4_0 UUID;
  z_id_4_1 UUID;
  z_id_4_2 UUID;
  z_id_4_3 UUID;
  r_id_5 UUID;
  z_id_5_0 UUID;
  z_id_5_1 UUID;
  r_id_6 UUID;
  z_id_6_0 UUID;
BEGIN
  -- 東區
  SELECT id INTO r_id_0 FROM public.great_regions WHERE name = '東區';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安1', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '馬鈴', z_id_0_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '安利', z_id_0_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '玉君', z_id_0_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安2', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '名雅', z_id_0_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '韋彤', z_id_0_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '文文', z_id_0_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Eason', z_id_0_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安3', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_2;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '兆尹', z_id_0_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '朱朱', z_id_0_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '絢伊', z_id_0_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '嘉宥', z_id_0_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安4', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_3;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '天韻', z_id_0_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '怡信', z_id_0_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '旭雯', z_id_0_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安7', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_4;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '曉萍', z_id_0_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '楊桃', z_id_0_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '鈺書', z_id_0_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安8', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_5;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '倩如', z_id_0_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '莊導/Isa', z_id_0_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '佳靜/Isa', z_id_0_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安9', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_6;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '明耀', z_id_0_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '玉銓', z_id_0_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '惠英', z_id_0_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安10', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_7;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '意茹', z_id_0_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '福智', z_id_0_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '桂心', z_id_0_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安11', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_8;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '秋桂', z_id_0_8) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '夙珠', z_id_0_8) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安12', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_9;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '芝綺', z_id_0_9) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '子媛', z_id_0_9) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '東宏', z_id_0_9) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '信義2', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_10;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Gary', z_id_0_10) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '衍如', z_id_0_10) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '小葉', z_id_0_10) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '阿鐘', z_id_0_10) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '南港', r_id_0) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_0_11;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '逸賢', z_id_0_11) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '慧甜', z_id_0_11) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '秋如', z_id_0_11) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 南區
  SELECT id INTO r_id_1 FROM public.great_regions WHERE name = '南區';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大安6', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '郁君', z_id_1_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Jeff', z_id_1_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '無敵', z_id_1_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '瑞玉', z_id_1_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '信義3', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '保羅', z_id_1_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '易展', z_id_1_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '太郎', z_id_1_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '稚鈞辰辰', z_id_1_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '松山', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_2;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '小美', z_id_1_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Stacy', z_id_1_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '維靜', z_id_1_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '正道', z_id_1_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '育萍', z_id_1_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '文山', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_3;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '千惠', z_id_1_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '雯菁', z_id_1_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Kelly', z_id_1_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '毛姐', z_id_1_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新烏1', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_4;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '秀鳳', z_id_1_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '旻柔', z_id_1_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '家興', z_id_1_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新烏2', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_5;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '達威', z_id_1_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '櫻蒨', z_id_1_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '俊雄', z_id_1_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '怡惠', z_id_1_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新烏3', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_6;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Erika', z_id_1_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '雨農', z_id_1_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新烏4', r_id_1) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_1_7;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '亭筑', z_id_1_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '秀枝', z_id_1_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 西區
  SELECT id INTO r_id_2 FROM public.great_regions WHERE name = '西區';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中正1', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '詠溱', z_id_2_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Marisa', z_id_2_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '濰瑄', z_id_2_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '文如', z_id_2_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中正2', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Dolly', z_id_2_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '旻鴻', z_id_2_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Ingrid', z_id_2_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '韻芝/馨柳', z_id_2_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Irene', z_id_2_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中正3', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_2;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '鍾傑', z_id_2_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '老人', z_id_2_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '小紅', z_id_2_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中正4', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_3;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '達哥', z_id_2_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '孟玲', z_id_2_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中永和', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_4;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '季樺', z_id_2_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '婷羽', z_id_2_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '維新培霖', z_id_2_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '右聖', z_id_2_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '小萍', z_id_2_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新莊1', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_5;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '翠欗', z_id_2_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '阿淳', z_id_2_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新莊2', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_6;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '慧雯', z_id_2_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '都都', z_id_2_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '佳欣', z_id_2_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '新莊3', r_id_2) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_2_7;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '善揚', z_id_2_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '比嗨', z_id_2_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '家榕+瑞典', z_id_2_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 北區
  SELECT id INTO r_id_3 FROM public.great_regions WHERE name = '北區';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中正5', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '樹人', z_id_3_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '毓倩', z_id_3_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '琇誼', z_id_3_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中山1', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '建安', z_id_3_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '愉琍琬婷', z_id_3_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '壹晴', z_id_3_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '鳳如', z_id_3_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中山2', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_2;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '培貞', z_id_3_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '昌賢', z_id_3_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '凱仲', z_id_3_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '宛瑜', z_id_3_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '琬婷培貞', z_id_3_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中山3', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_3;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '華誠', z_id_3_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '梅雋', z_id_3_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '儷友', z_id_3_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '中山5', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_4;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '依庭', z_id_3_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '易姍', z_id_3_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '阿康', z_id_3_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '裕昇', z_id_3_4) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '士林', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_5;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '哲蓉', z_id_3_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '盈蒨', z_id_3_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '小菜', z_id_3_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '爸爸', z_id_3_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '金宛', z_id_3_5) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '內湖', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_6;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '育玲', z_id_3_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '瑋琦', z_id_3_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '雅鈴', z_id_3_6) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '板三蘆', r_id_3) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_3_7;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '彥宇', z_id_3_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), 'Cindy', z_id_3_7) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 青少年
  SELECT id INTO r_id_4 FROM public.great_regions WHERE name = '青少年';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '青少年教會', r_id_4) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_4_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '第一組', z_id_4_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '第二組', z_id_4_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '第三組', z_id_4_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '第四組', z_id_4_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '第五組', z_id_4_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '活校1', r_id_4) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_4_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '高嘉鴻', z_id_4_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '盧冠毓', z_id_4_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '活嗨', r_id_4) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_4_2;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '干靖', z_id_4_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '沛恩', z_id_4_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '予芯', z_id_4_2) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '大學', r_id_4) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_4_3;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '朵拉', z_id_4_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '又銓永祥', z_id_4_3) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 慶典
  SELECT id INTO r_id_5 FROM public.great_regions WHERE name = '慶典';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '慶典1', r_id_5) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_5_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '威宇', z_id_5_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '瑋佑', z_id_5_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '雯樺', z_id_5_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '佳樺', z_id_5_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '姿穎', z_id_5_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '慶典2', r_id_5) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_5_1;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '唐寧', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '乃華/裕順', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '宥宥', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '政緯', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '競文', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '秀怡', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '科技', z_id_5_1) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

  -- 創藝
  SELECT id INTO r_id_6 FROM public.great_regions WHERE name = '創藝';
  INSERT INTO public.pastoral_zones (id, name, great_region_id) 
  VALUES (gen_random_uuid(), '創藝', r_id_6) 
  ON CONFLICT (name, great_region_id) DO UPDATE SET name = EXCLUDED.name 
  RETURNING id INTO z_id_6_0;

  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '嘎嘎', z_id_6_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '宸瑋', z_id_6_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;
  INSERT INTO public.small_groups (id, name, pastoral_zone_id) 
  VALUES (gen_random_uuid(), '美珠', z_id_6_0) 
  ON CONFLICT (name, pastoral_zone_id) DO NOTHING;

END $$;
