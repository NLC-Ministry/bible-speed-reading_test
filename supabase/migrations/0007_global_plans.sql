-- ==========================================================
-- Migration: 0007_global_plans.sql
-- 說明：建立全域計畫管理資料表 (global_plans) 並設定安全政策 (RLS)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.global_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_books TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 啟用行層級安全性 (RLS)
ALTER TABLE public.global_plans ENABLE ROW LEVEL SECURITY;

-- 政策 1: 允許所有已驗證使用者讀取全域計畫
CREATE POLICY "Allow authenticated read access to global_plans" 
ON public.global_plans FOR SELECT 
TO authenticated 
USING (true);

-- 政策 2: 僅允許系統管理員 (admin 或 senior_pastor) 新增全域計畫
CREATE POLICY "Allow admins to insert global_plans" 
ON public.global_plans FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);

-- 政策 3: 僅允許系統管理員 (admin 或 senior_pastor) 修改全域計畫
CREATE POLICY "Allow admins to update global_plans" 
ON public.global_plans FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);

-- 政策 4: 僅允許系統管理員 (admin 或 senior_pastor) 刪除全域計畫
CREATE POLICY "Allow admins to delete global_plans" 
ON public.global_plans FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'senior_pastor')
  )
);
