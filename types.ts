export type SearchableCourseData = {
    courseCode: string,
    courseName: string,
    strippedCourseName: string,
    credits: number,
    prerequisites: string,
    description: string,
    strippedDescription: string,
}

export type StoredCourseData = {
    data: {
        departmentName: string,
        courseData: {
            courseCode: string,
            courseName: string,
            credits: number,
            termOffered: string[],
            prerequisites: string,
            description: string
        }[],
    }[],
};

// Define a type for the return value of getDepartmentUrlsAndNames function
export type DepartmentInfo = {
    departmentUrl: string;
    departmentName: string;
};

// Define a type for the course data
export type CourseData = {
    courseCode: string;
    courseName: string;
    credits: number;
    termOffered: string[];
    prerequisites: string;
    description: string;
};
