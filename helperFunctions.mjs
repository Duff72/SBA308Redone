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
  let result = [];
  let student = 0;
  let newArray = array.sort((a, b) => a.learner_id - b.learner_id);
  //sort objects in array by learner id
  for (let i = 0; i < newArray.length; i++) {
    if (newArray[i].learner_id > student) {
      //if this is a new student, create a new object in result array
      result[i] = {
        id: newArray[i].learner_id,
        avg: null,
        1: null,
        2: null,
        maxScore: newArray[i].maxScore,
        total1: newArray[i].submission.score - newArray[i].latePenalty,
        total2: null,
      };
      result[i][newArray[i].assignment_id] =
        (newArray[i].submission.score - newArray[i].latePenalty) /
        newArray[i].submission.maxPoints;
      student = newArray[i].learner_id;
    } else if ((newArray[i].learner_id = student)) {
      // if same student, update result array
      result[i] = null;
      result[i - 1][newArray[i].assignment_id] =
        (newArray[i].submission.score - newArray[i].latePenalty) /
        newArray[i].submission.maxPoints;
      result[i - 1].maxScore =
        parseInt([newArray[i - 1].maxScore]) + parseInt([newArray[i].maxScore]);
      result[i - 1].total2 =
        newArray[i].submission.score - newArray[i].latePenalty;
    } //[i-1] is a very inelegant way to do this but it's working. i'm sure this would cause problems with larger data sets
  }
  return result;
}

function refineResult(array) {
  let filteredArray = array.filter((element) => element !== null);
  let finalArray = [];
  for (let i = 0; i < filteredArray.length; i++) {
    filteredArray[i].avg =
      (filteredArray[i].total1 + filteredArray[i].total2) /
      filteredArray[i].maxScore;
    finalArray[i] = {
      id: filteredArray[i].id,
      avg: filteredArray[i].avg,
      1: filteredArray[i][1],
      2: filteredArray[i][2],
    };
  }

  return finalArray;
}

export { dueYet, isLate, getResult, refineResult };
