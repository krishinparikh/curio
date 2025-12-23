/**
 * Module Service Test Script
 *
 * Tests all module service methods with sample data
 * Run with: npm run test:module
 */

import {
  getModules,
  getModuleById,
  markModuleComplete,
  getModuleTitle,
} from '@/lib/actions/moduleActions';
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

async function testModuleService() {
  console.log('Testing Module Service Methods\n');

  try {
    // Get a sample course from the database with user info
    const sampleCourse = await prisma.course.findFirst({
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!sampleCourse || sampleCourse.modules.length === 0) {
      console.log('WARNING: No courses with modules found in database. Please run: npm run seed');
      return;
    }

    const courseId = sampleCourse.id;
    const userId = sampleCourse.userId;
    const moduleId = sampleCourse.modules[0].id;

    console.log(`Using course ID: ${courseId}`);
    console.log(`Using user ID: ${userId}`);
    console.log(`Using module ID: ${moduleId}\n`);

    // Test 1: getModules() - Get all modules for a course
    console.log('TEST 1: getModules() - Get All Modules for Course');
    console.log('Input:', { courseId, userId });
    const modules = await getModules(courseId, userId);
    printResult(`Output - Found ${modules.length} Modules`, modules);

    // Test 2: getModuleById() - Get specific module with course context
    console.log('\nTEST 2: getModuleById() - Get Specific Module Details');
    console.log('Input:', { moduleId, userId });
    const moduleDetails = await getModuleById(moduleId, userId);
    printResult('Output - Module with Course Context', moduleDetails);

    // Test 3: getModuleTitle() - Get module title
    console.log('\nTEST 3: getModuleTitle() - Get Module Title');
    console.log('Input:', { moduleId });
    const moduleTitle = await getModuleTitle(moduleId);
    printResult('Output - Module Title', { title: moduleTitle });

    // Test 4: markModuleComplete() - Mark first incomplete module as complete
    const incompleteModule = sampleCourse.modules.find((m) => !m.isComplete);

    if (incompleteModule) {
      console.log('\nTEST 4: markModuleComplete() - Mark Module as Complete');
      console.log('Input:', { moduleId: incompleteModule.id });
      const result = await markModuleComplete(incompleteModule.id, userId);
      printResult('Output - Module Marked Complete', {
        moduleId: result.module.id,
        moduleName: result.module.name,
        isComplete: result.module.isComplete,
        courseComplete: result.courseComplete,
        totalModulesInCourse: result.module.course.modules.length,
        completedModules: result.module.course.modules.filter((m) => m.isComplete).length,
      });
    } else {
      console.log('\nWARNING: TEST 4 SKIPPED: All modules are already complete');
    }

    // Test 5: markModuleComplete() - Complete all modules to trigger course completion
    console.log('\nTEST 5: markModuleComplete() - Test Course Completion Detection');
    console.log('Marking all remaining modules as complete...');

    const allModules = await getModules(courseId, userId);
    let courseCompleteResult = null;

    for (const module of allModules) {
      if (!module.isComplete) {
        console.log(`  Completing: ${module.name}`);
        courseCompleteResult = await markModuleComplete(module.id, userId);
      }
    }

    if (courseCompleteResult) {
      printResult('Output - Final Module Completion Result', {
        allModulesComplete: courseCompleteResult.courseComplete,
        lastModuleName: courseCompleteResult.module.name,
        totalModules: courseCompleteResult.module.course.modules.length,
        message: courseCompleteResult.courseComplete
          ? 'Course completed! All modules are done.'
          : 'Course still has incomplete modules',
      });
    } else {
      console.log('  INFO: All modules were already complete');
    }

    // Test 6: getModuleById() - Non-existent module (should fail)
    console.log('\nTEST 6: getModuleById() - Non-existent Module (Expected to Fail)');
    const fakeModuleId = '00000000-0000-0000-0000-000000000000';
    console.log('Input:', { moduleId: fakeModuleId });

    try {
      const result = await getModuleById(fakeModuleId, userId);
      if (!result) {
        printResult('Output - Module Not Found (Expected)', {
          message: 'Module not found',
          status: 'Test passed - null returned as expected',
        });
      }
    } catch (error: any) {
      printResult('Output - Error Caught (Expected)', {
        message: error.message,
        status: 'Test passed - error handling working',
      });
    }

    // Test 7: getModuleTitle() - Non-existent module (should fail)
    console.log('\nTEST 7: getModuleTitle() - Non-existent Module (Expected to Fail)');
    console.log('Input:', { moduleId: fakeModuleId });

    try {
      await getModuleTitle(fakeModuleId);
      printError('Output - This should have failed!', new Error('Expected module not found error'));
    } catch (error: any) {
      printResult('Output - Error Caught (Expected)', {
        message: error.message,
        status: 'Test passed - error handling working',
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('Module Service Tests Completed Successfully!');
    console.log('='.repeat(60));

  } catch (error: any) {
    printError('Unexpected Error in Test Suite', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testModuleService()
  .then(() => {
    console.log('\nAll tests finished\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nTest suite failed:', error);
    process.exit(1);
  });
