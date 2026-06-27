-- =========================================================================
-- 教會速讀挑戰與統計系統 - 刪除所有虛擬/示範帳號資料 SQL 腳本 (修復版)
-- =========================================================================
-- 說明：
-- 1. 請將此腳本內容複製到 Supabase Dashboard 中的 SQL Editor 並執行。
-- 2. 此版本會自動檢查並補上 profiles 中缺少的 is_demo 欄位，以防範 schema 不一致。
-- 3. 此操作為破壞性刪除，將永久清除所有虛擬/示範使用者及其讀經紀錄。
-- =========================================================================

BEGIN;

-- 1. 確保 profiles 表中存在 is_demo 欄位 (修復部分環境 schema 缺失問題)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. 將大區為 '示範%' 的使用者的 is_demo 標記為 TRUE (防範先前匯入時未正確寫入)
UPDATE public.profiles
SET is_demo = TRUE
WHERE great_region LIKE '示範%';

-- 3. 刪除所有虛擬/示範帳號對應的 auth.users 紀錄
-- 由於有 ON DELETE CASCADE 外鍵約束，這將自動級聯刪除：
--    - public.profiles
--    - public.reading_plans
--    - public.reading_logs
--    - public.devotional_notes (若存在)
DELETE FROM auth.users 
WHERE id IN (
  SELECT id FROM public.profiles 
  WHERE is_demo = TRUE OR great_region LIKE '示範%'
);

-- 4. 刪除所有以 '示範' 開頭的組織架構 (大區)
-- 由於有 ON DELETE CASCADE 外鍵約束，這將自動級聯刪除相關的：
--    - public.pastoral_zones (牧區)
--    - public.small_groups (小組)
DELETE FROM public.great_regions 
WHERE name LIKE '示範%';

COMMIT;
