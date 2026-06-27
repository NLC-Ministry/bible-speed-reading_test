-- ==========================================================
-- Migration: 0006_announcements.sql
-- 說明：建立教會公告資料表並設定安全政策 (RLS)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.church_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 啟用行層級安全性 (RLS)
ALTER TABLE public.church_announcements ENABLE ROW LEVEL SECURITY;

-- 政策 1: 允許任何人 (包括未登入使用者) 讀取公告
CREATE POLICY "Allow public read access to announcements" 
ON public.church_announcements FOR SELECT 
TO public 
USING (true);

-- 政策 2: 僅允許系統管理員 (admin 或 senior_pastor) 發布公告
CREATE POLICY "Allow admins to insert announcements" 
ON public.church_announcements FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);

-- 政策 3: 僅允許系統管理員 (admin 或 senior_pastor) 修改公告
CREATE POLICY "Allow admins to update announcements" 
ON public.church_announcements FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);

-- 政策 4: 僅允許系統管理員 (admin 或 senior_pastor) 刪除公告
CREATE POLICY "Allow admins to delete announcements" 
ON public.church_announcements FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);
