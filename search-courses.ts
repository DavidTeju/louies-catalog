import MiniSearch from "minisearch";
import { data } from "./data/searchableCourses.json";
import { removeStopwords } from "stopword";
import { PorterStemmer } from "natural";
import { SearchableCourseData } from "./types";

async function fetchThesaurus(word: string) {
    return await fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, {
        headers: {
            "X-Api-Key": "B6s1iTUkvwhaW9AjoIA6pg==s0v74raMkWvaEQ6U",
        },
    })
        .then((response) => response.json())
        .then((body: { synonyms: string[] }) => body.synonyms)
        .catch((error) => {
            console.error(error);
        });
}

const resolvedData: SearchableCourseData[] = data;

let miniSearch: MiniSearch<SearchableCourseData> = new MiniSearch({
    idField: "courseCode",
    fields: ["strippedCourseName", "strippedDescription"],
    storeFields: [
        "courseCode",
        "courseName",
        "credits",
        "prerequisites",
        "description",
    ],
    searchOptions: {
        boost: { courseName: 2 },
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
