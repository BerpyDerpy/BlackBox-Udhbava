-- DANGER: This will delete the existing 'users' table and all its data
DROP TABLE IF EXISTS public.users;

-- Create the users table with the CORRECT structure (UUID for id)
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    roll_no TEXT UNIQUE NOT NULL,
    current_level INTEGER DEFAULT 1,
    score INTEGER DEFAULT 0,
    level_start_time TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access"
ON public.users FOR SELECT
USING (true);

-- Create a policy to allow public insert access
CREATE POLICY "Allow public insert access"
ON public.users FOR INSERT
WITH CHECK (true);

-- Create a policy to allow public delete access
CREATE POLICY "Allow public delete access"
ON public.users FOR DELETE
USING (true);

-- Create a policy to allow public update access
CREATE POLICY "Allow public update access"
ON public.users FOR UPDATE
USING (true);

-- Insert initial test data
INSERT INTO public.users (roll_no, current_level)
VALUES
    ('12345', 1),    -- Test Student
    ('6568', 99);    -- Admin User
