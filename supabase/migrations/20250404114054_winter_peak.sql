/*
  # Initial Schema Setup for Huda Colony Website

  1. New Tables
    - members
      - id (uuid, primary key)
      - full_name (text)
      - email (text, unique)
      - phone (text)
      - block_number (text)
      - is_executive (boolean)
      - created_at (timestamp)
      
    - news
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - created_at (timestamp)
      - created_by (uuid, references members)
      
    - services
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - contact_info (text)
      
    - service_requests
      - id (uuid, primary key)
      - service_id (uuid, references services)
      - member_id (uuid, references members)
      - description (text)
      - status (text)
      - created_at (timestamp)
      
    - gallery
      - id (uuid, primary key)
      - title (text)
      - image_url (text)
      - created_at (timestamp)
      
    - issues
      - id (uuid, primary key)
      - member_id (uuid, references members)
      - title (text)
      - description (text)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  block_number text,
  is_executive boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members are viewable by authenticated users"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Members can be created by admin"
  ON members FOR INSERT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM members WHERE is_executive = true));

-- News table
CREATE TABLE news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES members(id)
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News is viewable by all users"
  ON news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "News can be created by executive members"
  ON news FOR INSERT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM members WHERE is_executive = true));

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  contact_info text
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by all users"
  ON services FOR SELECT
  TO authenticated
  USING (true);

-- Service requests table
CREATE TABLE service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  member_id uuid REFERENCES members(id),
  description text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service requests are viewable by the requesting member"
  ON service_requests FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Service requests can be created by authenticated users"
  ON service_requests FOR INSERT
  TO authenticated
  USING (member_id = auth.uid());

-- Gallery table
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is viewable by all users"
  ON gallery FOR SELECT
  TO authenticated
  USING (true);

-- Issues table
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issues are viewable by the creating member"
  ON issues FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Issues can be created by authenticated users"
  ON issues FOR INSERT
  TO authenticated
  USING (member_id = auth.uid());