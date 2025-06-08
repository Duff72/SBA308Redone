function dueYet(ag, ls) {
  let dueAssignments = []; //initialize empty array of only assingments that are due
  for (let entry of ag.assignments) {
    //for every element in assignment group
    let dueDate = new Date(entry.due_at);
    let currentDate = Date.now();
    if (dueDate < currentDate) {
      //compare due date of assignment to current date
      for (let submit of ls) {
        if (submit.assignment_id == entry.id) {
          submit.submission.maxPoints = entry.points_possible; // add maxPoints key to objects pushed to dueAssignments
          dueAssignments.push(submit); //push the corresponding submission (by assignment_id) to dueAssignments array
        }
      }
    }
  }
  return dueAssignments;
}

// const submittedDueAssignments = dueYet(AssignmentGroup, LearnerSubmissions);

function isLate(ag, ls) {
  for (let entry of ag.assignments) {
    //for every element in assignment group
    let dueDate = new Date(entry.due_at);
    for (let submit of ls) {
      if (submit.assignment_id === entry.id) {
        let submissionDate = new Date(submit.submission.submitted_at);
        if (submissionDate > dueDate) {
          //compare due date of assignment to submission date
          submit.isLate = true;
          submit.latePenalty = 0.1 * entry.points_possible; //adds a latePenalty key equal to 10% of maximum points
          submit.maxScore = entry.points_possible;
        } else {
          submit.isLate = false;
          submit.latePenalty = 0;
          submit.maxScore = entry.points_possible;
        }
      }
    }
  }
  return ls;
}
// const checkOnTime = isLate(AssignmentGroup, submittedDueAssignments);

function getResult(array) {
  const results = {};

  for (const entry of array) {
    const learnerId = entry.learner_id;
    const assignmentId = entry.assignment_id;
    const score = entry.submission.score - entry.latePenalty;
    const maxPoints = entry.submission.maxPoints;

    if (!results[learnerId]) {
      results[learnerId] = {
        id: learnerId,
        totalScore: 0,
        totalMax: 0,
        assignments: {},
      };
    }

    results[learnerId].totalScore += score;
    results[learnerId].totalMax += maxPoints;
    results[learnerId].assignments[assignmentId] = score / maxPoints;
  }

  // Convert to array and format output
  return Object.values(results).map((res) => {
    return {
      id: res.id,
      avg: res.totalMax ? res.totalScore / res.totalMax : 0,
      ...res.assignments,
    };
  });
}

export { dueYet, isLate, getResult, refineResult };
