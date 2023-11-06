import * as cheerio from "cheerio";
import { CourseData, DepartmentInfo } from "../types";

const domain = "https://catalog.louisville.edu";

export async function getDepartmentUrlsAndNames(): Promise<DepartmentInfo[]> {
    const url = `${domain}/courses/`;
    const response = await fetch(url);

    const html = await response.text();
    const $ = cheerio.load(html);

    // flattens nested array
    return $(".letternav-head")
        .map((_, element) => {
            //under each letternav-head, there is a list of links to departments starting with that letter
            // Find the <ul> element for the current letter
            const ul = $(element).next("ul");

            return ul.find("li").map(listItemToUrl).toArray();
        })
        .toArray();

    function listItemToUrl(_: any, listItem: cheerio.Element) {
        const link = $(listItem).find("a").attr("href")!;
        return {
            departmentUrl: domain + link,
            departmentName: $(listItem).text().trim(),
        };
    }
}

export async function getDepeartmentCourses({
    departmentUrl,
    departmentName,
}: DepartmentInfo): Promise<{
    departmentName: string;
    courseData: CourseData[];
}> {
    const response = await fetch(departmentUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const courseBlocks = $(".courseblock");

    const courseData = courseBlocks.map(parseCourseBlock).toArray();

    return { departmentName, courseData };

    function parseCourseBlock(_: any, courseBlock: cheerio.Element) {
        const course = $(courseBlock);
        const title = course.find(".courseblocktitle").text().trim();
        const creditString = course.find(".credits").text().trim();
        const match = /\d+/.exec(creditString);
        const credits = match ? Number(match[0]) : -1;
        const [courseCode, courseName] = title
            .replace(creditString, "")
            // split on .$nbsp;
            .split(". ")
            .map((str) => str.trim());

        let termOffered: string[] = [];
        let prerequisites = "";
        let description = "";
        course
            .find("strong")
            .toArray()
            .forEach((element) => {
                const option = $(element).text().trim();

                switch (option) {
                    case "Term Typically Offered:":
                        termOffered = $(element)
                            .parent()
                            .text()
                            .replace("Term Typically Offered:", "")
                            .split(",")
                            .map((str) => str.trim());
                        break;
                    case "Prerequisite(s):":
                        prerequisites = $(element)
                            .parent()
                            .text()
                            .replace("Prerequisite(s):", "")
                            .trim();
                        break;
                    case "Description:":
                        description = $(element)
                            .parent()
                            .text()
                            .replace("Description:", "")
                            .trim();
                        break;
                }
            });

        return {
            courseCode,
            courseName,
            credits,
            termOffered,
            prerequisites,
            description,
        };
    }
}
