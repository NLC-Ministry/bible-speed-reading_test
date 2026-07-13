-- Migration 0013: Dynamically insert monthly reading plan presets for 2026-2027
-- This matches months and categories dynamically, generating stable custom UUIDs.

DO $$
DECLARE
  categories JSONB := '[
    {"name": "摩西五經", "books": ["創世記", "出埃及記", "利未記", "民數記", "申命記"]},
    {"name": "歷史書", "books": ["約書亞記", "士師記", "路得記", "撒母耳記上", "撒母耳記下", "列王紀上", "列王紀下", "歷代志上", "歷代志下", "以斯拉記", "尼希米記", "以斯帖記"]},
    {"name": "詩歌智慧書", "books": ["約伯記", "詩篇 1-110", "詩篇 111-150", "箴言", "傳道書", "雅歌"]},
    {"name": "大先知書", "books": ["以賽亞書", "耶利米書", "耶利米哀歌", "以西結書", "但以理書"]},
    {"name": "小先知書", "books": ["何西阿書", "約珥書", "阿摩司書", "俄巴底亞書", "約拿書", "彌迦書", "那鴻書", "哈巴谷書", "西番雅書", "哈該書", "撒迦利亞書", "瑪拉基書"]},
    {"name": "福音書+徒", "books": ["馬太福音", "馬可福音", "路加福音", "約翰福音", "使徒行傳"]},
    {"name": "保羅書信一", "books": ["羅馬書", "哥林多前書", "哥林多後書", "加拉太書", "以弗所書", "腓立比書"]},
    {"name": "保羅書信二", "books": ["歌羅西書", "帖撒羅尼迦前書", "帖撒羅尼迦後書", "提摩太前書", "提摩太後書", "提多書", "腓利門書"]},
    {"name": "普通書信+啟", "books": ["希伯來書", "雅各書", "彼得前書", "彼得後書", "約翰一書", "約翰二書", "約翰三書", "猶大書", "啟示錄"]}
  ]'::jsonb;
  
  months JSONB := '[
    {"y": 2026, "m": 8},
    {"y": 2026, "m": 9},
    {"y": 2026, "m": 10},
    {"y": 2026, "m": 11},
    {"y": 2026, "m": 12},
    {"y": 2027, "m": 1},
    {"y": 2027, "m": 2},
    {"y": 2027, "m": 3},
    {"y": 2027, "m": 4}
  ]'::jsonb;

  m_record RECORD;
  c_idx INT;
  cat RECORD;
  
  uuid_str TEXT;
  plan_id UUID;
  plan_name TEXT;
  plan_desc TEXT;
  start_d DATE;
  end_d DATE;
  books_arr TEXT[];
BEGIN
  -- Loop through months
  FOR m_record IN SELECT * FROM jsonb_to_recordset(months) AS (y INT, m INT)
  LOOP
    -- Loop through categories (1 to 9)
    FOR c_idx IN 1..9
    LOOP
      -- 8月鎖定一類 (cat1) 摩西五經，其餘 8 類跳過不寫入
      IF m_record.y = 2026 AND m_record.m = 8 AND c_idx > 1 THEN
        CONTINUE;
      END IF;

      -- Get category properties
      SELECT name, array_agg(book::text) AS books
      INTO cat
      FROM (
        SELECT (categories->(c_idx - 1)->>'name') AS name,
               jsonb_array_elements_text(categories->(c_idx - 1)->'books') AS book
      ) sub
      GROUP BY name;

      -- Construct dates
      start_d := (m_record.y || '-' || lpad(m_record.m::text, 2, '0') || '-01')::DATE;
      end_d := (start_d + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

      -- Construct dynamic UUID (format: 00000000-YYYY-MM00-a000-00000000000C)
      uuid_str := '00000000-' || m_record.y || '-' || lpad(m_record.m::text, 2, '0') || '00-a000-00000000000' || c_idx;
      plan_id := uuid_str::uuid;

      plan_name := m_record.y || '年' || m_record.m || '月：' || cat.name;
      plan_desc := m_record.y || '年' || m_record.m || '月讀經計畫：' || cat.name;
      books_arr := cat.books;

      -- Insert into global_plans
      INSERT INTO public.global_plans (id, name, description, start_date, end_date, target_books, is_hidden)
      VALUES (plan_id, plan_name, plan_desc, start_d, end_d, books_arr, false)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        target_books = EXCLUDED.target_books,
        is_hidden = EXCLUDED.is_hidden;

    END LOOP;
  END LOOP;
END $$;
