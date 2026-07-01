-- ==========================================================
-- Migration: 0005_devotional_notes.sql
-- 說明：建立每日靈修心得資料表 (Devotional Notes) 與安全政策
-- ==========================================================

-- 1. 建立每日靈修心得資料表
CREATE TABLE IF NOT EXISTS public.devotional_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, note_date)
);

-- 2. 啟用行級安全策略 (Row Level Security)
ALTER TABLE public.devotional_notes ENABLE ROW LEVEL SECURITY;

-- 3. 限制每位使用者僅能存取與編輯自己的靈修心得
CREATE POLICY "Users can manage their own devotional notes" ON public.devotional_notes
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.devotional_notes IS '使用者每日靈修心得紀錄，屬於私人隱私內容。';
