-- Add missing user_id column and update structure for existing bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add guest_name and contact_info columns to match existing app structure
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS contact_info TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS check_in DATE,
ADD COLUMN IF NOT EXISTS check_out DATE,
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;

-- Update column names to match app expectations (if needed)
-- Note: We'll keep both old and new column names for compatibility

-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access (will fail if they already exist, which is fine)
DO $$ BEGIN
    CREATE POLICY "Users can view their own bookings" 
    ON public.bookings 
    FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create their own bookings" 
    ON public.bookings 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own bookings" 
    ON public.bookings 
    FOR UPDATE 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete their own bookings" 
    ON public.bookings 
    FOR DELETE 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;