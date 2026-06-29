-- ============================================================
-- Migration: 0009_add_global_plan_id.sql
-- 説明：為 reading_plans 資料表加入 global_plan_id 欄位
--       用 UUID FK 連結 global_plans，取代舊的名稱式關聯
-- ============================================================

ALTER TABLE public.reading_plans
  ADD COLUMN IF NOT EXISTS global_plan_id UUID REFERENCES public.global_plans(id) ON DELETE SET NULL;

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_reading_plans_global_plan_id
  ON public.reading_plans(global_plan_id);

COMMENT ON COLUMN public.reading_plans.global_plan_id IS '關聯到 global_plans.id，用 UUID 確保計畫連結一致性，不依賴計畫名稱';
