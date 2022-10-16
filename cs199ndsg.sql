--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12

-- Replace 'YOUR_USERNAME' to the created user

-- The original database with the following user and database

-- CREATE USER cs199ndsg WITH ENCRYPTED PASSWORD 'ndsg';

CREATE TABLE annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE annotations OWNER TO YOUR_USERNAME;


--
-- Name: backups; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE backups (
    id SERIAL,
    backup character varying
);


ALTER TABLE backups OWNER TO YOUR_USERNAME;


--
-- Name: batches; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE batches (
    batch integer,
    route character varying,
    retired integer DEFAULT 0
);


ALTER TABLE batches OWNER TO YOUR_USERNAME;


--
-- Name: codes; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE codes (
    code character varying NOT NULL,
    admin boolean DEFAULT false,
    accessed timestamp without time zone,
    surveyed boolean,
    route character varying(512),
    batch integer,
    threshold integer,
    CONSTRAINT codes_batch_check CHECK ((batch >= 0)),
    CONSTRAINT codes_threshold_check CHECK ((threshold > 0))
);

ALTER TABLE codes OWNER TO YOUR_USERNAME;

--
-- Name: stops; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric,
    batch integer,
    source_file character varying(512),
    number_of_annotations integer,
    "time" timestamp without time zone,
    CONSTRAINT stops_batch_check CHECK ((batch > 0))
);


ALTER TABLE stops OWNER TO YOUR_USERNAME;

--
-- Name: complete_stops; Type: VIEW; Schema: public; Owner: YOUR_USERNAME
--

CREATE VIEW complete_stops AS
 SELECT stops.location,
    stops.people,
    stops.url,
    stops.duration,
    stops.route,
    stops.batch,
    stops."time",
        CASE
            WHEN (a.annotated IS NULL) THEN (0)::numeric
            ELSE a.annotated
        END AS annotated,
        CASE
            WHEN (a.boarding IS NULL) THEN (0)::numeric
            ELSE a.boarding
        END AS boarding,
        CASE
            WHEN (a.alighting IS NULL) THEN (0)::numeric
            ELSE a.alighting
        END AS alighting,
    a.following,
        CASE
            WHEN (a.temp_number IS NULL) THEN (0)::numeric
            ELSE (a.temp_number)::numeric
        END AS temp_number
   FROM (stops
     FULL JOIN ( SELECT annotations.url,
            avg(annotations.annotated) AS annotated,
            avg(annotations.boarding) AS boarding,
            avg(annotations.alighting) AS alighting,
            count(*) AS temp_number,
            bool_and(annotations.following) AS following
           FROM annotations
          GROUP BY annotations.url) a ON (((a.url)::text = (stops.url)::text)));


ALTER TABLE complete_stops OWNER TO YOUR_USERNAME;

--
-- Name: tracking; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE tracking (
    id SERIAL,
    filename character varying,
    status character varying,
    route character varying,
    splices integer,
    duration numeric,
    resulting numeric,
    batch integer
);


ALTER TABLE tracking OWNER TO YOUR_USERNAME;

--
-- Name: dashboard; Type: VIEW; Schema: public; Owner: YOUR_USERNAME
--

CREATE VIEW dashboard AS
 SELECT a.stops,
    b.codes,
    c.annotations,
    d.uploaded_videos
   FROM (((( SELECT count(stops.*) AS stops
           FROM stops) a
     FULL JOIN ( SELECT count(codes.*) AS codes
           FROM codes) b ON (true))
     FULL JOIN ( SELECT count(annotations.*) AS annotations
           FROM annotations) c ON (true))
     FULL JOIN ( SELECT count(DISTINCT tracking.filename) AS uploaded_videos
           FROM tracking
          WHERE ((tracking.status)::text = 'Done!'::text)) d ON (true));


ALTER TABLE dashboard OWNER TO YOUR_USERNAME;

--
-- Name: instrumentation; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE instrumentation (
    code character varying,
    file character varying,
    "time" numeric,
    duration numeric
);


ALTER TABLE instrumentation OWNER TO YOUR_USERNAME;

--
-- Name: routes; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE routes (
    id SERIAL,
    route character varying
);


ALTER TABLE routes OWNER TO YOUR_USERNAME;


--
-- Name: survey; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--

CREATE TABLE survey (
    code character varying,
    name character varying,
    age integer,
    sex character varying,
    education character varying
);


ALTER TABLE survey OWNER TO YOUR_USERNAME;

--
-- Name: test; Type: TABLE; Schema: public; Owner: YOUR_USERNAME
--


