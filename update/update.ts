import fs from "fs";
import {getDepartmentUrlsAndNames, getDepeartmentCourses,} from "./scrape-course-data";
import generateSearchableCourseSchema from "./generate-searchable-course-schema";
import {SearchableCourseData, StoredCourseData} from "../types";

function ensureDirectoryExistence(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, {recursive: true});
    }
}

async function writeAllCourseDataToFile(
    allCourseDataToFile: StoredCourseData["data"]
): Promise<StoredCourseData["data"]> {
    const directoryPath = "../data";
    ensureDirectoryExistence(directoryPath);

    // Serialize data to JSON and write to file using async writeFile
    fs.writeFileSync(
        directoryPath + "/courses.json",
        JSON.stringify({data: allCourseDataToFile})
    );
    return allCourseDataToFile;
}

async function writeSearchableCoursesToFile(
    searchableCourses: SearchableCourseData[]
): Promise<SearchableCourseData[]> {
    const directoryPath = "../data";
    ensureDirectoryExistence(directoryPath);

    // Serialize data to JSON and write to file using async writeFile
    const data = JSON.stringify({data: searchableCourses});
    fs.writeFileSync(directoryPath + "/searchableCourses.json", data);
    return searchableCourses;
}

export default async function update() {
    try {
        const departmentUrlsAndNames = await getDepartmentUrlsAndNames();

        const departmentCoursesPromises = departmentUrlsAndNames.map(
            getDepeartmentCourses
        );
        const allCoursesData = await Promise.all(departmentCoursesPromises);

        const searchableCourses: SearchableCourseData[] =
            generateSearchableCourseSchema(allCoursesData);

        await writeAllCourseDataToFile(allCoursesData);
        await writeSearchableCoursesToFile(searchableCourses);
        console.log("Updated");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
