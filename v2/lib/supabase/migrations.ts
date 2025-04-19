import { createClient } from '@supabase/supabase-js';

// Use service role key for admin-level operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Creates the necessary database tables for the application
 */
export async function createTables() {
  try {
    // Create user_metadata table
    const { error: metadataError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'user_metadata',
      columns: `
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        writing_style JSONB NOT NULL,
        hashtag_pattern JSONB NOT NULL,
        emoji_usage JSONB NOT NULL,
        sentence_and_vocab JSONB NOT NULL,
        top_performing_tweets JSONB NOT NULL,
        engagement_trends JSONB NOT NULL
      `
    });

    if (metadataError) throw metadataError;

    // Create web_content table
    const { error: webContentError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'web_content',
      columns: `
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    });

    if (webContentError) throw webContentError;
    
    // Create indexes for performance
    await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS user_metadata_user_id_idx ON user_metadata(user_id);
        CREATE INDEX IF NOT EXISTS web_content_user_id_idx ON web_content(user_id);
        CREATE INDEX IF NOT EXISTS web_content_url_idx ON web_content(url);
      `
    });

    console.log('Database tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating database tables:', error);
    return { success: false, error };
  }
}

/**
 * Sets up row level security policies for the tables
 */
export async function setupRLS() {
  try {
    // Enable RLS on tables
    await supabaseAdmin.rpc('execute_sql', {
      sql: `
        ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;
        ALTER TABLE web_content ENABLE ROW LEVEL SECURITY;
      `
    });

    // Create policies for user_metadata
    await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE POLICY "Users can view their own metadata" 
          ON user_metadata FOR SELECT 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own metadata" 
          ON user_metadata FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own metadata" 
          ON user_metadata FOR UPDATE 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own metadata" 
          ON user_metadata FOR DELETE 
          USING (auth.uid() = user_id);
      `
    });

    // Create policies for web_content
    await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE POLICY "Users can view their own web content" 
          ON web_content FOR SELECT 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own web content" 
          ON web_content FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own web content" 
          ON web_content FOR UPDATE 
          USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own web content" 
          ON web_content FOR DELETE 
          USING (auth.uid() = user_id);
      `
    });

    console.log('RLS policies set up successfully');
    return { success: true };
  } catch (error) {
    console.error('Error setting up RLS policies:', error);
    return { success: false, error };
  }
}

/**
 * Run all migrations
 */
export async function runMigrations() {
  try {
    // Create tables
    const { success: tablesSuccess, error: tablesError } = await createTables();
    if (!tablesSuccess) throw tablesError;
    
    // Set up RLS
    const { success: rlsSuccess, error: rlsError } = await setupRLS();
    if (!rlsSuccess) throw rlsError;
    
    console.log('All migrations completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error running migrations:', error);
    return { success: false, error };
  }
}