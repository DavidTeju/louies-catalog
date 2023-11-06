import React, {useState} from "react";
import {Analytics} from "@vercel/analytics/react";
import {SearchResult} from "minisearch";
import Image from "next/image";
import Head from "next/head";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import {FormControl} from "react-bootstrap";
import styles from "./index.module.scss";

function CourseSearchResult({
                                courseCode,
                                courseName,
                                credits,
                                description,
                            }: Readonly<{
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
}>) {
    return (
        <Container className={styles.courseBlock}>
            <h2>
                {courseCode}: {courseName}
            </h2>
            <p>{credits} credits</p>
            <p style={{color: "#000000C0"}}>{description}</p>
        </Container>
    );
}

const domain = "https://louie-backend.davidteju.dev";

function Search() {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const results = await fetch(`${domain}/search?prompt=${e.target.value}`);
            if (!results.ok) {
                console.log(results);
                throw new Error("Failed to fetch data");
            }
            const data: SearchResult[] = await results.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error while fetching data:", error);
            // Handle the error, e.g., show an error message to the user.
        }
    };

    return <Container
        style={{
            backgroundColor: "#C41E3A",
            padding: "5%",
            borderRadius: "10px",
        }}
    >
        <Container style={{display: "flex", justifyContent: "center"}}>
            <h1 style={{textAlign: "center", paddingRight: "6px"}}>
                Louie&apos;s Catalog
            </h1>
            <Image
                style={{
                    width: "clamp(2em, 4vw, 4em)",
                    height: "clamp(2em, 4vw, 4em)",
                }}
                width={100}
                height={100}
                src={"/images/Louie.svg.png"}
                alt={"Picture of Louie logo"}
            />
        </Container>
        <InputGroup
            style={{minHeight: "3em", borderRadius: "1em", margin: "2em 0"}}
        >
            <FormControl
                type="text"
                onChange={handleInput}
                placeholder="Search courses..."
            />
        </InputGroup>
        <Container className={styles.searchHint}>
            <p>Try searching...</p>
            <p>&quot;How to build a robot&quot;</p>
            <p>&quot;Criminal psychology&quot;</p>
        </Container>
        {searchResults.map(courseResult => (<CourseSearchResult
            key={courseResult["courseCode"]}
            courseCode={courseResult["courseCode"]}
            courseName={courseResult["courseName"]}
            credits={courseResult["credits"]}
            description={courseResult["description"]}
        />))}
    </Container>;
}

export default function SearchApp() {
    return (
        <>
            <Head>
                <title>UofL Course Search</title>
                <meta name="description"
                      content="Fast and Flexible course search for The University of Louisville. Unlike Ulink, you can explore and discover new classes."/>
                <meta name="keywords" content="course search, UofL, catalog"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="google-site-verification" content="6pzhcHTA1ilwCKAx34J_2uESpoOWoOOKZeNQZBgsU7E"/>


                <link rel="shortcut icon" href="/favicon/favicon.ico"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin={"anonymous"}
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Playfair+Display&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Image
                className={styles.backgroundImage}
                height={500}
                width={500}
                src={"/images/campus.png"}
                alt={"image of campus"}
            />
            <div
                style={{
                    backgroundSize: "cover",
                    background: "url('') no-repeat center center fixed",
                }}
            ></div>
            <div
                style={{
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: "transparent",
                    padding: "5% 10%",
                    minHeight: "100vh",
                    color: "white",
                }}
            >
                <Search/>
                <Analytics/>
            </div>
        </>
    );
}
