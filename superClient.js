import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
<<<<<<< HEAD
);
=======
);
>>>>>>> 07fa4f27cec295dad4dbdb457bb3806433f3a5ac
