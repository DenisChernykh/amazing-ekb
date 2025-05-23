import 'dotenv/config'; // Добавьте эту строку в самом начале файла
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Supabase URL and anon key are required');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;