function filterPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false); // Use filter to return only pending tasks
}

const tasks = [
  { task: "Wash the dishes", completed: true },
  { task: "Exercise", completed: false },
  { task: "Study programming", completed: false },
  { task: "Clean the house", completed: true },
];

const result = filterPendingTasks(tasks);
console.log(result);
/**
 * // Expected Output:
 *  [ { task: "Exercise", completed: false },
 *    { task: "Study programming", completed: false } ]
 */
