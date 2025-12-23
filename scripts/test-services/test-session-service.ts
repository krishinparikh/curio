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

    // Test 3: createCourse() - Short beginner course
    console.log('\nTEST 3: createCourse() - Short Beginner Course');
    const shortCourseInput = {
      userId,
      topic: 'Things only Women would know',
      description: '',
      length: 'short' as const,
      complexity: 'beginner' as const,
    };
    console.log('Input:', shortCourseInput);
    console.log('Calling OpenAI API to generate modules...');

    const startTime1 = Date.now();
    const shortCourse = await createCourse(shortCourseInput);
    const endTime1 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime1 - startTime1}ms)`,
      shortCourse
    );

    // Test 4: createCourse() - Medium intermediate course
    console.log('\nTEST 4: createCourse() - Medium Intermediate Course');
    const mediumCourseInput = {
      userId,
      topic: 'RESTful API Design',
      description: 'Master the principles of designing RESTful APIs',
      length: 'medium' as const,
      complexity: 'intermediate' as const,
    };
    console.log('Input:', mediumCourseInput);
    console.log('Calling OpenAI API to generate modules...');

    const startTime2 = Date.now();
    const mediumCourse = await createCourse(mediumCourseInput);
    const endTime2 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime2 - startTime2}ms)`,
      mediumCourse
    );

    // Test 5: createCourse() - Long advanced course
    console.log('\nTEST 5: createCourse() - Long Advanced Course');
    const longCourseInput = {
      userId,
      topic: 'Distributed Systems Architecture',
      description: 'Deep dive into designing scalable distributed systems',
      length: 'long' as const,
      complexity: 'advanced' as const,
    };
    console.log('Input:', longCourseInput);
    console.log('Calling OpenAI API to generate modules...');

    const startTime3 = Date.now();
    const longCourse = await createCourse(longCourseInput);
    const endTime3 = Date.now();

    printResult(
      `Output - Course Created with AI-Generated Modules (${endTime3 - startTime3}ms)`,
      longCourse
    );

    // Test 6: createCourse() - Invalid user (should fail)
    console.log('\nTEST 6: createCourse() - Invalid User (Expected to Fail)');
    const invalidUserInput = {
      userId: '00000000-0000-0000-0000-000000000000',
      topic: 'Test Topic',
    };
    console.log('Input:', invalidUserInput);

    try {
      await createCourse(invalidUserInput);
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
    console.log(`Short course modules: ${shortCourse.modules.length}`);
    console.log(`Medium course modules: ${mediumCourse.modules.length}`);
    console.log(`Long course modules: ${longCourse.modules.length}`);
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
