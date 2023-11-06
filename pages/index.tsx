import React, {useState} from "react";
import {SearchResult} from "minisearch";
import Image from 'next/image'
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import {FormControl} from "react-bootstrap";


function CourseSearchResult({
                                courseName,
                                credits,
                                description,
                            }: {
    courseName: string;
    credits: number;
    description: string;
}) {
    return (
        <Container
            style={{
                backgroundColor: "white",
                color: "black",
                margin: "1em 0",
                boxShadow: "0px 0px 2px 2px #00000050",
                padding: "2em 1.5em",
                borderRadius: "10px"
            }}>
            <h2 style={{
                fontSize: "1.2rem",
            }}>{courseName}</h2>
            <p>{credits} credits</p>
            <p style={{color: "#000000C0"}}>{description}</p>
        </Container>
    );
}

const domain = "https://louies-catalog-production.up.railway.app";

export default function SearchApp() {
    const [courseResults, setCourseResults] = useState<SearchResult[]>([]);

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const results = await fetch(`${domain}/search?prompt=${e.target.value}`);
            if (!results.ok) {
                console.log(results);
                throw new Error("Failed to fetch data");
            }
            const data: SearchResult[] = await results.json();
            setCourseResults(data!);
        } catch (error) {
            console.error("Error while fetching data:", error);
            // Handle the error, e.g., show an error message to the user.
        }
    };

    return (
        <>
            <Image style={{
                height: "100vh",
                width: "100vw",
                position: "fixed",
                zIndex: -1,
                objectFit: "cover"
            }}
                   height={500}
                   width={500}
                   src={"/images/campus.png"}
                   alt={"image of campus"}/>
            <div
                style={{
                    backgroundSize: "cover",
                    background: "url('') no-repeat center center fixed",
                }}></div>
            <div style={{
                margin: 0,
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "transparent",
                padding: "5% 10%",
                minHeight: "100vh",
                color: "white",
            }}>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"}/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Playfair+Display&display=swap"
                    rel="stylesheet"/>
                <Container style={{backgroundColor: "#C41E3A", padding: "5%", borderRadius: "10px"}}>
                    <div style={{display: "flex", justifyContent: "center"}}><h1
                        style={{textAlign: "center", fontSize: "clamp(2em, 4vw)", paddingRight: "6px"}}>Louie's
                        Catalog</h1>
                        <Image
                            style={{width: "clamp(2em, 4vw, 4em)", height: "clamp(2em, 4vw, 4em)"}}
                            width={100}
                            height={100}
                            src={"/images/Louie.svg.png"}
                            alt={"Picture of Louie logo"}/>
                    </div>
                    <InputGroup style={{minHeight: "3em", borderRadius: "1em", margin: "2em 0"}}>
                        <FormControl type="text" onChange={handleInput} placeholder="Search courses..."/>
                    </InputGroup>
                    {courseResults.map((result) => {
                        const course = result;
                        return (
                            <CourseSearchResult
                                key={course['courseCode']}
                                courseName={course['courseName']}
                                credits={course["credits"]}
                                description={course["description"]}/>
                        );
                    })}
                </Container>
            </div>
        </>
    );
}
