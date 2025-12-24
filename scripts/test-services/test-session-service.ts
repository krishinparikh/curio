/**
 * Session Service Test Script
 *
 * Tests all session service methods with sample data
 * Run with: npm run test:session
 */

import {
  createCourse,
  getCourses,
  getCourseById,
} from '@/lib/actions/courseActions';
import { prisma } from '@/lib/prisma/db';

// Helper function to print formatted output
function printResult(label: string, data: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${label}`);
  console.log('='.repeat(60));
  console.log(JSON.stringify(data, null, 2));
}

function printError(label: string, error: any) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${label}`);
  console.log('='.repeat(60));
  console.log(`Error: ${error.message}`);
}

async function testCourseService() {
  console.log('Testing Course Service Methods\n');

  try {
    // Get a sample user ID from the database
    const sampleUser = await prisma.user.findFirst();

    if (!sampleUser) {
      console.log('No users found in database. Please run: npm run seed');
      return;
    }

    const userId = sampleUser.id;
    console.log(`Using sample user ID: ${userId}\n`);

    // Test 1: getCourses() - Get all courses for user
    console.log('TEST 1: getCourses() - Get All User Courses');
    console.log('Input:', { userId });
    const courses = await getCourses(userId);
    printResult(`Output - Found ${courses.length} Courses`, courses);

    // Test 2: getCourseById() - Get specific course
    if (courses.length > 0) {
      console.log('\nTEST 2: getCourseById() - Get Specific Course');
      const courseId = courses[0].id;
      console.log('Input:', { courseId, userId });
      const course = await getCourseById(courseId, userId);
      printResult('Output - Course Details with Modules', course);
    }

    // Test 3: createCourse() - Simple prompt
    console.log('\nTEST 3: createCourse() - Simple Prompt');
    const prompt1 = 'Things only Women would know';
    console.log('Input:', { userId, originalPrompt: prompt1 });
    console.log('Calling OpenAI API to generate course and modules...');

    const startTime1 = Date.now();
    const course1 = await createCourse(userId, prompt1);
    const endTime1 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime1 - startTime1}ms)`,
      course1
    );

    // Test 4: createCourse() - Technical topic
    console.log('\nTEST 4: createCourse() - Technical Topic');
    const prompt2 = 'RESTful API Design - Master the principles of designing RESTful APIs';
    console.log('Input:', { userId, originalPrompt: prompt2 });
    console.log('Calling OpenAI API to generate course and modules...');

    const startTime2 = Date.now();
    const course2 = await createCourse(userId, prompt2);
    const endTime2 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime2 - startTime2}ms)`,
      course2
    );

    // Test 5: createCourse() - Advanced topic
    console.log('\nTEST 5: createCourse() - Advanced Topic');
    const prompt3 = 'Distributed Systems Architecture - Deep dive into designing scalable distributed systems';
    console.log('Input:', { userId, originalPrompt: prompt3 });
    console.log('Calling OpenAI API to generate course and modules...');

    const startTime3 = Date.now();
    const course3 = await createCourse(userId, prompt3);
    const endTime3 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime3 - startTime3}ms)`,
      course3
    );

    // Test 6: createCourse() - Invalid user (should fail)
    console.log('\nTEST 6: createCourse() - Invalid User (Expected to Fail)');
    const invalidUserId = '00000000-0000-0000-0000-000000000000';
    const testPrompt = 'Test Topic';
    console.log('Input:', { userId: invalidUserId, originalPrompt: testPrompt });

    try {
      await createCourse(invalidUserId, testPrompt);
      printError('Output - This should have failed!', new Error('Expected user not found error'));
    } catch (error: any) {
      printResult('Output - Error Caught (Expected)', {
        message: error.message,
        status: 'Test passed - error handling working',
      });
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Course Creation Summary:');
    console.log('='.repeat(60));
    console.log(`Course 1 modules: ${course1.modules.length}`);
    console.log(`Course 2 modules: ${course2.modules.length}`);
    console.log(`Course 3 modules: ${course3.modules.length}`);
    console.log('\nCourse Service Tests Completed Successfully!');
    console.log('='.repeat(60));

  } catch (error: any) {
    printError('Unexpected Error in Test Suite', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testCourseService()
  .then(() => {
    console.log('\nAll tests finished\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nTest suite failed:', error);
    process.exit(1);
  });
