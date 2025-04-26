import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zphrhryidixwwungtcny.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwaHJocnlpZGl4d3d1bmd0Y255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTA5NjcsImV4cCI6MjA2MTIyNjk2N30.sFRWoeQD0X6EhgyRG6eEc9LmncMmbR_vUAuGaLwNWc4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 