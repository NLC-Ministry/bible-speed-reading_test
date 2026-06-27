-- =========================================================================
-- 教會速讀挑戰與統計系統 - 刪除所有虛擬/示範帳號資料 SQL 腳本 (網域辨識版)
-- =========================================================================
-- 說明：
-- 1. 請將此腳本內容複製到 Supabase Dashboard 中的 SQL Editor 並執行。
-- 2. 此版本使用 @church-bible.com 網域來精準識別與刪除 auth.users 中的虛擬帳號，
--    即使您的 public.profiles 資料表已被清空，也能順利刪除 auth.users 殘留帳號。
-- =========================================================================

BEGIN;

-- 1. 手動清除關聯子資料表 (以防萬一有殘留資料)
DELETE FROM public.devotional_notes 
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@church-bible.com');

DELETE FROM public.reading_logs 
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@church-bible.com');

DELETE FROM public.reading_plans 
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@church-bible.com');

DELETE FROM public.profiles 
WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%@church-bible.com');

-- 2. 刪除 auth.users 中的虛擬帳號 (使用專屬虛擬網域 @church-bible.com)
DELETE FROM auth.users 
WHERE email LIKE '%@church-bible.com';

-- 3. 刪除所有以 '示範' 開頭的組織架構 (大區)
-- （這會自動級聯刪除相關的牧區與小組）
DELETE FROM public.great_regions 
WHERE name LIKE '示範%';

COMMIT;
