import * as data from "./data.mjs";
import * as func from "./helperFunctions.mjs";

function getLearnerData(course, ag, submissions) {
  try {
    if (course.id === ag.course_id) {
      let res1 = func.dueYet(ag, submissions);
      let res2 = func.isLate(ag, res1);
      let res3 = func.getResult(res2);
      let result = func.refineResult(res3);
      return result;
    } else {
      throw "Error - Assignments do not match course";
    }
  } catch (error) {
    console.log(error);
  }
}

const result = getLearnerData(
  data.CourseInfo,
  data.AssignmentGroup,
  data.LearnerSubmissions
);

console.log(result);
