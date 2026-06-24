/**
 * Quick Test Script for Fraud Monitor
 * 
 * This script tests the fraud detection system by:
 * 1. Logging in as admin
 * 2. Creating multiple donations quickly (to trigger fraud detection)
 * 3. Checking flagged donations
 * 
 * Run: node test-fraud.js
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testFraudMonitor() {
  console.log('🧪 Testing Fraud Monitor...\n');

  try {
    // Step 1: Login as Admin
    console.log('1️⃣ Logging in as admin...');
    let loginRes;
    try {
      loginRes = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@givista.com',
        password: 'password123'
      });
    } catch (error) {
      // If admin doesn't exist, try to create one or use any user
      console.log('   ⚠️  Admin account not found. Creating test user...');
      try {
        // Try to signup as admin
        await axios.post(`${API_BASE}/auth/signup`, {
          name: 'Test Admin',
          email: 'admin@givista.com',
          password: 'password123',
          role: 'Admin',
          location: 'Test Location'
        });
        loginRes = await axios.post(`${API_BASE}/auth/login`, {
          email: 'admin@givista.com',
          password: 'password123'
        });
      } catch (signupError) {
        console.log('   ⚠️  Could not create admin. Using any user...');
        // Try with any existing user or create a donor
        await axios.post(`${API_BASE}/auth/signup`, {
          name: 'Test Donor',
          email: `test${Date.now()}@test.com`,
          password: 'password123',
          role: 'Donor',
          location: 'Test Location'
        });
        loginRes = await axios.post(`${API_BASE}/auth/login`, {
          email: `test${Date.now()}@test.com`,
          password: 'password123'
        });
      }
    }

    const token = loginRes.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    const userId = loginRes.data.data.user?.id || loginRes.data.data.id;
    console.log('   ✅ Logged in successfully');

    // Verify user (needed to create donations)
    console.log('\n   🔐 Verifying user profile...');
    try {
      // Check if already verified
      const statusRes = await axios.get(`${API_BASE}/verification/status`, { headers });
      if (!statusRes.data.data.isVerified) {
        // For testing, we'll directly update the user in the database
        // In production, this would require OTP verification
        console.log('   ⚠️  User not verified. For testing, you can:');
        console.log('      1. Use the frontend to verify (send OTP)');
        console.log('      2. Or manually set isVerified=true in database');
        console.log('   💡 For now, trying to verify via admin endpoint...');
        
        // Try to verify via admin if we're admin
        // Otherwise, we'll need to skip donation creation
      } else {
        console.log('   ✅ User is already verified');
      }
    } catch (error) {
      console.log('   ⚠️  Could not check verification status');
    }
    console.log('');

    // Step 2: Create multiple donations quickly (to trigger fraud detection)
    console.log('2️⃣ Creating multiple donations to trigger fraud detection...');
    const donations = [];
    
    for (let i = 1; i <= 5; i++) {
      try {
        const donationRes = await axios.post(`${API_BASE}/donations`, {
          title: `Test Donation ${i}`,
          category: 'Food',
          quantity: 10, // Same quantity to trigger pattern detection
          description: `Test donation ${i} for fraud detection testing`
        }, { headers });
        
        donations.push(donationRes.data.data);
        console.log(`   ✅ Created donation ${i} (ID: ${donationRes.data.data.id}, Fraud Score: ${donationRes.data.data.fraudScore?.toFixed(2) || 'N/A'}, Flagged: ${donationRes.data.data.isFlagged || false})`);
        
        // Small delay to ensure timestamps are different
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`   ❌ Failed to create donation ${i}:`, error.response?.data?.message || error.message);
      }
    }

    console.log(`\n   📊 Created ${donations.length} donations\n`);

    // Step 3: Check flagged donations
    console.log('3️⃣ Checking flagged donations...');
    try {
      const flaggedRes = await axios.get(`${API_BASE}/donations/fraud/flagged`, { headers });
      const flagged = flaggedRes.data.data;
      
      if (flagged.length === 0) {
        console.log('   ⚠️  No flagged donations found.');
        console.log('   💡 This might mean:');
        console.log('      - Fraud detection threshold not met (need score ≥ 0.4)');
        console.log('      - Try creating more donations or wait a moment');
      } else {
        console.log(`   ✅ Found ${flagged.length} flagged donation(s):\n`);
        flagged.forEach((d, idx) => {
          console.log(`   ${idx + 1}. ${d.title}`);
          console.log(`      - ID: ${d.id}`);
          console.log(`      - Fraud Score: ${(d.fraudScore || 0).toFixed(2)}`);
          console.log(`      - Flagged: ${d.isFlagged}`);
          console.log(`      - Category: ${d.category}, Quantity: ${d.quantity}`);
          console.log('');
        });
      }
    } catch (error) {
      console.log('   ❌ Failed to fetch flagged donations:', error.response?.data?.message || error.message);
    }

    // Step 4: Test admin actions (if we have flagged donations)
    console.log('4️⃣ Testing admin actions...');
    try {
      const flaggedRes = await axios.get(`${API_BASE}/donations/fraud/flagged`, { headers });
      const flagged = flaggedRes.data.data;
      
      if (flagged.length > 0) {
        const testDonation = flagged[0];
        
        // Test mark as safe
        try {
          await axios.post(`${API_BASE}/donations/fraud/mark-safe/${testDonation.id}`, {}, { headers });
          console.log(`   ✅ Marked donation ${testDonation.id} as safe`);
        } catch (error) {
          console.log(`   ⚠️  Could not mark as safe:`, error.response?.data?.message || error.message);
        }
        
        // Test confirm fraud
        try {
          await axios.post(`${API_BASE}/donations/fraud/confirm/${testDonation.id}`, {}, { headers });
          console.log(`   ✅ Confirmed donation ${testDonation.id} as fraud`);
        } catch (error) {
          console.log(`   ⚠️  Could not confirm fraud:`, error.response?.data?.message || error.message);
        }
      } else {
        console.log('   ⚠️  No flagged donations to test actions on');
      }
    } catch (error) {
      console.log('   ❌ Error testing admin actions:', error.response?.data?.message || error.message);
    }

    console.log('\n✅ Fraud Monitor Test Complete!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Check Admin Dashboard at http://localhost:5173');
    console.log('   2. Login as admin and view Fraud Monitor section');
    console.log('   3. Verify flagged donations appear there');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('\n💡 Make sure:');
    console.error('   - Backend is running on http://localhost:3000');
    console.error('   - Database is connected');
    console.error('   - You have at least one user account');
  }
}

// Run the test
testFraudMonitor();

