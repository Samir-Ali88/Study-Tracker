/**
 * Semester 3 Final-Exam Course Catalog
 * Rules: keep ids lower-case with dashes, start each topic id with its
 * course id, and never change an id after students start saving progress.
 */

// Builds [{ id: "<courseId>-f01", title }, ...] from a list of titles.
const makeTopics = (courseId, titles) =>
  titles.map((title, i) => ({
    id: `${courseId}-f${String(i + 1).padStart(2, "0")}`,
    title,
  }));

export const catalog = [
  {
    semester: 3,
    courses: [
      {
        id: "sem3-geed-2302",
        code: "GEED-2302",
        name: "GEED-2302 Course",
        title: "GEED-2302 Course",
        driveLink: "https://drive.google.com/drive/folders/geed-2302",
        finalTopics: makeTopics("sem3-geed-2302", ["Chapter 1", "Chapter 2", "Chapter 3"]),
      },
      {
        id: "sem3-cse-2323",
        code: "CSE-2323",
        name: "Digital Logic Design",
        driveUrl: "PLACEHOLDER", // Your CSE-2323 Notes Drive link
        finalTopics: [
          { id: "cse2323-f01", title: "JK Flip-Flop Design, Characteristic/Excitation Tables & Indeterminate State Removal" },
          { id: "cse2323-f02", title: "Master-Slave Flip-Flops & Race-Around Condition Resolution" },
          { id: "cse2323-f03", title: "Flip-Flop Conversions (SR to JK/D/T & Reverse) & Latch vs. Flip-Flop" },
          { id: "cse2323-f04", title: "Hierarchical Decoders (4x16, 5x32) & Full Adder via Decoder" },
          { id: "cse2323-f05", title: "Multiplexers (Boolean Functions, 8x1 MUX, Full Adder via MUX & MUX Bus)" },
          { id: "cse2323-f06", title: "Parallel Adders, Carry Propagation Delay & Carry Look-Ahead Generator" },
          { id: "cse2323-f07", title: "3-Bit Magnitude & Equality Comparators" },
          { id: "cse2323-f08", title: "Custom Synchronous Counters, Up-Down Counters & Async/BCD Counters" },
          { id: "cse2323-f09", title: "Clocked Sequential Circuit Synthesis (State Equations) & Circuit/Diagram Analysis" },
          { id: "cse2323-f10", title: "Shift Registers (SISO, SIPO, PISO, Universal) & Ring/Johnson Counters" },
          { id: "cse2323-f11", title: "Programmable Logic Arrays (PLA), PAL/ROM & RAM Cell/Address Line Design" },
        ],
      },
      {
        id: "sem3-stat-2311",
        code: "STAT-2311",
        name: "STAT-2311 Course",
        title: "STAT-2311 Course",
        driveLink: "https://drive.google.com/drive/folders/stat-2311",
        finalTopics: makeTopics("sem3-stat-2311", ["Chapter 1", "Chapter 2", "Chapter 3"]),
      },
      {
        id: "sem3-math-2307",
        code: "MATH-2307",
        name: "MATH-2307 Course",
        title: "MATH-2307 Course",
        driveLink: "https://drive.google.com/drive/folders/math-2307",
        finalTopics: makeTopics("sem3-math-2307", ["Chapter 1", "Chapter 2", "Chapter 3"]),
      },
      {
        id: "sem3-cse-2321",
        code: "CSE-2321",
        name: "CSE-2321 Course",
        title: "CSE-2321 Course",
        driveLink: "https://drive.google.com/drive/folders/cse-2321",
        finalTopics: makeTopics("sem3-cse-2321", ["Chapter 1", "Chapter 2", "Chapter 3"]),
      },
      {
        id: "sem3-chem-2301",
        code: "CHEM-2301",
        name: "CHEM-2301 Course",
        title: "CHEM-2301 Course",
        driveLink: "https://drive.google.com/drive/folders/chem-2301",
        finalTopics: makeTopics("sem3-chem-2301", ["Chapter 1", "Chapter 2", "Chapter 3"]),
      },
    ],
  },
];

export function getSemester3Courses() {
  const sem3 = catalog.find((entry) => entry.semester === 3);
  return sem3 ? sem3.courses : [];
}

export function findCourseById(courseId) {
  for (const sem of catalog) {
    const match = sem.courses.find((course) => course.id === courseId);
    if (match) return match;
  }
  return null;
}

export function findTopicTitle(courseId, topicId) {
  const course = findCourseById(courseId);
  if (!course) return topicId;
  const topic = course.finalTopics.find((t) => t.id === topicId);
  return topic ? topic.title : topicId;
}