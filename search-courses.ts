import MiniSearch from "minisearch";
import { data } from "./data/searchableCourses.json";
import { removeStopwords } from "stopword";
import { PorterStemmer } from "natural";
import { SearchableCourseData } from "./types";
const resolvedData: SearchableCourseData[] = data;

let miniSearch: MiniSearch<SearchableCourseData> = new MiniSearch({
    idField: "courseCode",
    fields: ["courseCode", "strippedCourseName", "strippedDescription"],
    storeFields: [
        "courseCode",
        "courseName",
        "credits",
        "prerequisites",
        "description",
    ],
    searchOptions: {
        boost: { strippedCourseName: 2, courseCode: 4 },
        fuzzy: 2,
    },
});

miniSearch.addAll(resolvedData);

export default function search(searchQuery: string) {
    try {
        let searchQueryAsArray = searchQuery.split(/[., ]/gm);
        searchQuery = removeStopwords(searchQueryAsArray)
            .map(PorterStemmer.stem)
            .join(" ");

        // Perform and return the search
        return miniSearch.search(searchQuery);
    } catch (error) {
        // Handle any errors that may occur during the promise resolution
        console.error(error);
    }
}
