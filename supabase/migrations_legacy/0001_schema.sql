-- ==========================================================
-- Migration: 0001_schema.sql
-- 說明：建立基礎組織架構、使用者檔案與讀經計畫與紀錄之資料表
-- ==========================================================

-- 1. 建立組織架構表 (大區、牧區、小組)
CREATE TABLE IF NOT EXISTS public.great_regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pastoral_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  great_region_id UUID REFERENCES public.great_regions(id) ON DELETE CASCADE,
  UNIQUE(name, great_region_id)
);

CREATE TABLE IF NOT EXISTS public.small_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pastoral_zone_id UUID REFERENCES public.pastoral_zones(id) ON DELETE CASCADE,
  UNIQUE(name, pastoral_zone_id)
);

-- 2. 建立使用者個人資料表 (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  great_region_id UUID REFERENCES public.great_regions(id) ON DELETE SET NULL,
  pastoral_zone_id UUID REFERENCES public.pastoral_zones(id) ON DELETE SET NULL,
  small_group_id UUID REFERENCES public.small_groups(id) ON DELETE SET NULL,
  great_region TEXT NOT NULL, -- 所屬大區
  pastoral_zone TEXT NOT NULL,
  small_group TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 權限角色
  is_demo BOOLEAN NOT NULL DEFAULT FALSE, -- 是否為示範帳號
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  CONSTRAINT check_valid_role CHECK (role IN ('member', 'group_leader', 'zone_leader', 'great_zone_leader', 'admin', 'senior_pastor'))
);

-- 3. 建立讀經計畫表 (Reading Plans)
CREATE TABLE IF NOT EXISTS public.reading_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_books TEXT[] NOT NULL,
  preset_key TEXT,
  level TEXT DEFAULT 'normal' NOT NULL,
  current_round INTEGER DEFAULT 1 NOT NULL,
  was_downgraded BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. 建立已讀章節紀錄表 (Reading Logs)
CREATE TABLE IF NOT EXISTS public.reading_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  round INTEGER DEFAULT 1 NOT NULL,
  
  CONSTRAINT unique_user_plan_book_chapter_round UNIQUE (user_id, plan_id, book, chapter, round)
);
