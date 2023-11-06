import { removeStopwords } from "stopword";
import { PorterStemmer } from "natural";
import { CourseData, SearchableCourseData, StoredCourseData } from "../types";

function flattenCourses(data: StoredCourseData["data"][0][]) {
    return data
        .reduce<CourseData[]>((acc, val) => acc.concat(val.courseData), [])
        .map((course: CourseData) => ({
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: course.credits,
            prerequisites: course.prerequisites,
            description: course.description,
        }));
}

export default function generateSearchableCourseSchema(
    data: StoredCourseData["data"][0][]
): SearchableCourseData[] {
    // Flatten the course data and extract relevant information
    const flattenedCourses = flattenCourses(data);

    // Remove duplicate courses based on course code
    const uniqueCourses = flattenedCourses.filter(
        (entry, index, self) =>
            index ===
            self.findIndex((course) => course.courseCode === entry.courseCode)
    );

    return uniqueCourses.map((course) => {
        // Process and prepare the searchable course data
        const descriptionAsArray = course.description
            .split(" ")
            .map((word) => PorterStemmer.stem(word))
            .filter((word) => word.length > 0);

        const strippedCourseName = removeStopwords(course.courseName.split(" "))
            .map(PorterStemmer.stem)
            .join(" ");

        const strippedDescription = descriptionAsArray
            ? removeStopwords(descriptionAsArray).join(" ")
            : "";

        return {
            courseCode: course.courseCode,
            courseName: course.courseName,
            strippedCourseName: strippedCourseName,
            credits: course.credits,
            description: course.description,
            strippedDescription: strippedDescription,
            prerequisites: course.prerequisites,
        };
    });
}
