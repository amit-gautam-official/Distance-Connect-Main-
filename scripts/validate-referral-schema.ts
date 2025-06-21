// This script validates the Prisma schema for the referral system
// Run this script to ensure all models and relations are properly set up

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateReferralSchema() {
  console.log('Validating referral system schema...');
  
  try {
    // Check if the ReferralRequest model exists
    try {
      const referralCount = await prisma.referralRequest.count();
      console.log(`ReferralRequest model: OK (${referralCount} records found)`);
    } catch (e) {
      console.log('ReferralRequest model: Missing or invalid');
    }
    
    // Check Student relation
    try {
      const student = await prisma.student.findFirst({
        include: {
          referralRequests: true,
        },
      });
      
      console.log('Student.referralRequests relation:', 
        student && 'referralRequests' in student ? 'OK' : 'Missing');
    } catch (e) {
      console.log('Student.referralRequests relation: Missing or invalid');
    }
    
    // Check Mentor relation
    try {
      const mentor = await prisma.mentor.findFirst({
        include: {
          referralRequests: true,
        },
      });
      
      console.log('Mentor.referralRequests relation:', 
        mentor && 'referralRequests' in mentor ? 'OK' : 'Missing');
    } catch (e) {
      console.log('Mentor.referralRequests relation: Missing or invalid');
    }
    
    // Check RazorpayOrder relation
    try {
      const order = await prisma.razorpayOrder.findFirst({
        include: {
          referralRequest: true,
        },
      });
      
      console.log('RazorpayOrder.referralRequest relation:', 
        order && 'referralRequest' in order ? 'OK' : 'Missing');
    } catch (e) {
      console.log('RazorpayOrder.referralRequest relation: Missing or invalid');
    }
    
    console.log('Schema validation completed.');
  } catch (error) {
    console.error('Error validating schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateReferralSchema()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
