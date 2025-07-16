import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://vnfdetnvevlykyufppgx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZmRldG52ZXZseWt5dWZwcGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTk0MTYsImV4cCI6MjA2NTk3NTQxNn0.ncWM1LJ1vNMiD5tzwug3YKeaZSK1L9XTVWWi2_SDb_0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
    try {
        console.log('Starting migration...')
        
        // Read the migration file
        const migrationSQL = readFileSync('./supabase/migrations/20250116_fix_assessment_schema.sql', 'utf8')
        
        // Split the migration into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
        
        console.log(`Found ${statements.length} statements to execute`)
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i]
            if (statement.trim()) {
                console.log(`Executing statement ${i + 1}/${statements.length}`)
                console.log(`Statement: ${statement.substring(0, 100)}...`)
                
                const { error } = await supabase.rpc('exec_sql', { sql: statement })
                if (error) {
                    console.error(`Error in statement ${i + 1}:`, error)
                } else {
                    console.log(`✅ Statement ${i + 1} executed successfully`)
                }
            }
        }
        
        console.log('Migration completed!')
        
    } catch (error) {
        console.error('Migration failed:', error)
    }
}

runMigration()