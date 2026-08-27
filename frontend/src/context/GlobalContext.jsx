import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

// --- 🏔️ INSTITUTIONAL CLOUD CONFIG ---
const firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

export const GlobalProvider = ({ children }) => {
    const [cloudActive, setCloudActive] = useState(false);
    const [db, setDb] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [activeEmail, setActiveEmail] = useState("");
    const [globalSync, setGlobalSync] = useState({
        jobs: [
            { co: "AMAZON", tier: "ELITE", role: "Full Stack Software Engineer", desc: "Skills: Java, Spring Boot, React, NoSQL. Package: 32 LPA.", color: "indigo" },
            { co: "GOOGLE", tier: "CORE", role: "System Design Architect", desc: "Skills: Distributed Systems, CAP, Python. Package: 48 LPA.", color: "emerald" }
        ],
        drives: [
            { title: "MICROSOFT HIGH-SCALE", desc: "1,200 Registered | Tomorrow 10:00 AM", status: "Active" }
        ],
        broadcasts: []
    });

    // --- 🧬 CORE DATA ---
    const DB_ROLES = {
        student: { id: "ST", name: "Student Excellence", tabs: ["Readiness Stats", "AI Interview", "Resume Hub", "Resume Builder", "Job Board"] },
        faculty: { id: "FA", name: "Faculty Oversight", tabs: ["Verification Cell", "Resume Audit", "Reporting Engine"] },
        hod: { id: "HOD", name: "Institutional Authority", tabs: ["Dept Analytics", "Drive Control", "Staff Monitoring"] },
        admin: { id: "AD", name: "System Administrator", tabs: ["Security Log", "Global Metrics", "System Config"] },
        coordinator: { id: "PC", name: "Placement Cell", tabs: ["Drive Management", "Skill Intelligence", "Broadcasting"] }
    };

    const AI_DATA = {
        state: "idle",
        subState: "",
        tempSelection: { co: "", ro: "", rd: "" },
        questionIndex: 0,
        scoreTracker: 0,
        sessionData: [],
        sessionMistakes: [],
        metrics: { awareness: 65, precision: 72, professionalism: 80 },
        greetings: ["hello", "hi", "hey", "sir", "greetings"],
        interviewTriggers: ["interview", "start", "company", "level", "test", "interveiw", "interveew"],
        doubtTriggers: ["what is", "how to", "explain", "why", "difference between", "doubt", "help with", "usage", "use of", "tell me about"],
        conceptCloud: [
            { k: ["java", "operators"], r: "Java operators include Arithmetic (+, -, *, /), Relational (==, !=, <, >), and Logical (&&, ||, !) types. They are used to perform operations on variables and values." },
            { k: ["java", "web dev", "backend"], r: "Java is a cornerstone of enterprise web development. It is used in the backend for building high-performance, multithreaded servers using frameworks like Spring Boot. It ensures scalability, security, and type-safety for complex banking and e-commerce systems." },
            // ... (rest of the concept cloud from original code)
        ],
        dataset: {
            "Amazon": {
                "Python Developer": {
                    "Technical": [
                        { q: "How would you design a <b>Real-Time Tracking System</b> for millions of concurrent orders using Python?", k: ["sharding", "kafka", "distributed", "nosql", "fastapi", "redis"], sol: "A T1 Python approach involves using FastAPI for async handling, Kafka for event streaming, and Redis for sub-millisecond tracking." },
                        { q: "Explain how <b>Python's Global Interpreter Lock (GIL)</b> affects multi-threaded applications at scale.", k: ["gil", "thread", "concurrency", "multiprocessing", "cpu"], sol: "The GIL allows only one thread to execute at a time. To scale CPU-bound Python apps, we use 'multiprocessing' instead of 'threading'." }
                    ],
                    "System Design": [
                        { q: "Design a <b>Scalable Notification Service</b> for Amazon using a Microservices architecture.", k: ["pubsub", "sqs", "lambda", "dynamodb", "fanout"], sol: "Use SQS for decoupling, Lambda for processing, and DynamoDB for persistence with a Pub/Sub fan-out pattern." }
                    ]
                },
                "Frontend Developer": {
                    "Technical": [
                        { q: "How would you optimize <b>First Contentful Paint (FCP)</b> for a heavy Amazon product page?", k: ["critical", "css", "lazy", "defer", "bundle", "splitting"], sol: "Optimize FCP by inlining critical CSS, lazy loading non-critical assets, and using Route-based bundle splitting." }
                    ]
                }
            },
            "Google": {
                "Software Engineer": {
                    "Technical": [
                        { q: "How does a <b>B-Tree</b> structure improve database performance compared to a standard binary search tree?", k: ["disk", "io", "branching", "factor", "height"], sol: "B-Trees minimize Disk I/O by having a high branching factor, which significantly reduces the tree height compared to BSTs." }
                    ]
                }
            },
            "System Design": {
                "General": {
                    "Architecture": [
                        { q: "Analyze the <b>CAP Theorem</b> and explain which property you would sacrifice for a Global Banking System.", k: ["consistency", "availability", "partition", "cp", "strict"], sol: "In a Global Banking System, we sacrifice Availability (CP) for strict Consistency to ensure transactions are never mismatched." }
                    ]
                }
            }
        }
    };

    const seed = {
        "24eg107h@anurag.edu.in": { name: "Rahul Student", pass: "stu123", role: "student" },
        "ttrupthi@anurag.edu.in": { name: "Prof. Trupthi", pass: "fac123", role: "faculty" },
        "hod.cse@anurag.edu.in": { name: "Dr. K. Rao", pass: "hod123", role: "hod" },
        "admin.it@anurag.edu.in": { name: "Super Admin", pass: "adm123", role: "admin" },
        "pc.placement@anurag.edu.in": { name: "Placement Cell", pass: "pc123", role: "coordinator" }
    };

    useEffect(() => {
        const initCloud = async () => {
            let _db = null;
            try {
                if (firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE") {
                    const app = initializeApp(firebaseConfig);
                    _db = getDatabase(app);
                    setDb(_db);
                    setCloudActive(true);
                    console.log("Neural Cloud Link: ESTABLISHED");
                }
            } catch (e) {
                console.error("Neural Cloud Sync Error:", e);
            }

            const stored = localStorage.getItem('ih_cloud');
            if (stored) {
                // Already seeded
            } else {
                localStorage.setItem('ih_cloud', JSON.stringify(seed));
            }

            if (_db) {
                // Cloud Sync Logic
                const globalRef = ref(_db, 'ih_global');
                onValue(globalRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) setGlobalSync(data);
                });
            } else {
                // Offline Fallback - check local storage if we want? 
                // For now, simpler to just rely on state for session or localStorage
            }
        };
        initCloud();
    }, []);

    // Helper to push updates
    const ih_push = async (path, data) => {
        if (cloudActive && db) {
            try {
                await set(ref(db, path), data);
            } catch (e) { console.error("Cloud Push Failure:", e); }
        }
        // Also update local storage for redundancy
        const cloud = JSON.parse(localStorage.getItem('ih_cloud')) || {};
        // Deep merge logic simplified for this context:
        // This is tricky as path can be 'ih_cloud/email/resume'. 
        // For now, we mainly use this for specific updates.
    };

    return (
        <GlobalContext.Provider value={{
            cloudActive,
            activeUser,
            setActiveUser,
            activeEmail,
            setActiveEmail,
            globalSync,
            setGlobalSync,
            DB_ROLES,
            AI_DATA,
            ih_push
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
