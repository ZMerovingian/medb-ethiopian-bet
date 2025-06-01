/*
  # Additional Features Migration

  1. New Tables
    - notifications
      - Stores user notifications
    - chat_messages
      - Stores global chat and private messages
    - user_settings
      - Stores user preferences and limits
    - support_tickets
      - Stores customer support tickets
    - vip_levels
      - Defines VIP program tiers
    - referrals
      - Tracks user referrals

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('transaction', 'game', 'system', 'support')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  data jsonb
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_global boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view global chat"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (is_global = true OR sender_id = auth.uid() OR receiver_id = auth.uid());

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true}',
  deposit_limit decimal(15,2),
  loss_limit decimal(15,2),
  self_exclusion_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- VIP Levels Table
CREATE TABLE IF NOT EXISTS vip_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  level integer NOT NULL UNIQUE,
  requirements jsonb NOT NULL,
  benefits jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vip_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view VIP levels"
  ON vip_levels
  FOR SELECT
  TO authenticated
  USING (true);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  commission_earned decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vip_level_id uuid REFERENCES vip_levels(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_wagered decimal(15,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;