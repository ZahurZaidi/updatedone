// Fix Database Schema Issues
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vnfdetnvevlykyufppgx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZmRldG52ZXZseWt5dWZwcGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTk0MTYsImV4cCI6MjA2NTk3NTQxNn0.ncWM1LJ1vNMiD5tzwug3YKeaZSK1L9XTVWWi2_SDb_0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        
        // Test basic connection
        const { data: tables, error } = await supabase
            .from('user_profiles')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('Database connection error:', error);
        } else {
            console.log('✅ Database connection successful');
        }
        
        // Test if user_profiles table exists and has the required columns
        const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('user_id, comfortable_routine_length, known_allergies, skin_type')
            .limit(1);
            
        if (profileError) {
            console.error('User profiles table error:', profileError);
        } else {
            console.log('✅ User profiles table accessible');
        }
        
        // Test if skin_assessments table exists
        const { data: assessmentData, error: assessmentError } = await supabase
            .from('skin_assessments')
            .select('*')
            .limit(1);
            
        if (assessmentError) {
            console.error('Skin assessments table error:', assessmentError);
        } else {
            console.log('✅ Skin assessments table accessible');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Database test failed:', error);
        return { success: false, error };
    }
}

async function testUserSignup() {
    try {
        console.log('Testing user signup...');
        
        // Try to create a test user
        const testEmail = `test_${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: 'testpassword123',
            options: {
                data: {
                    full_name: 'Test User',
                    username: 'testuser'
                }
            }
        });
        
        if (error) {
            console.error('User signup error:', error);
            return false;
        } else {
            console.log('✅ User signup successful');
            console.log('User ID:', data.user?.id);
            return true;
        }
    } catch (error) {
        console.error('User signup test failed:', error);
        return false;
    }
}

async function runTests() {
    console.log('=== Database Schema Testing ===');
    
    await testDatabaseConnection();
    await testUserSignup();
    
    console.log('=== Testing Complete ===');
}

if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testDatabaseConnection, testUserSignup };