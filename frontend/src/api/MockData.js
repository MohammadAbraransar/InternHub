// Mock Data for InternHub - Simulating Backend Response

export const MOCK_USERS = {
    "student@anurag.edu.in": {
        name: "Sai Krishna",
        email: "student@anurag.edu.in",
        role: "student",
        department: "CSE",
        enrollmentId: "22H61A0501"
    },
    "faculty@anurag.edu.in": {
        name: "Dr. P. Ravinder",
        email: "faculty@anurag.edu.in",
        role: "faculty",
        department: "CSE"
    },
    "hod@anurag.edu.in": {
        name: "Dr. S. Madhu",
        email: "hod@anurag.edu.in",
        role: "hod",
        department: "CSE"
    },
    "coordinator@anurag.edu.in": {
        name: "Placement Cell",
        email: "coordinator@anurag.edu.in",
        role: "coordinator"
    }
};

export const MOCK_DRIVES = [
    {
        id: 1,
        company: "Google",
        role: "Software Engineer Intern",
        ctc: "1.5 Lakh/Month",
        location: "Bangalore",
        date: "2025-02-15",
        deadline: "2025-02-10",
        eligibility: { minCGPA: 8.5, branches: ["CSE", "IT"] },
        status: "Open"
    },
    {
        id: 2,
        company: "Microsoft",
        role: "SDE Intern",
        ctc: "1.2 Lakh/Month",
        location: "Hyderabad",
        date: "2025-02-20",
        deadline: "2025-02-18",
        eligibility: { minCGPA: 8.0, branches: ["CSE", "ECE", "IT"] },
        status: "Open"
    },
    {
        id: 3,
        company: "Amazon",
        role: "Cloud Associate",
        ctc: "90k/Month",
        location: "Chennai",
        date: "2025-01-30",
        deadline: "2025-01-25",
        eligibility: { minCGPA: 7.5, branches: ["All"] },
        status: "Closed"
    }
];

export const MOCK_STATS = {
    year: 2025,
    totalStudents: 1240,
    placed: 450,
    activeDrives: 8,
    avgPackage: "8.5 LPA"
};

export const MOCK_APPROVALS = [
    { id: 101, student: "Rahul Sharma", company: "TCS", role: "Developer", status: "Pending" },
    { id: 102, student: "Priya Singh", company: "Infosys", role: "System Engineer", status: "Pending" },
    { id: 103, student: "Amit Kumar", company: "Wipro", role: "Analyst", status: "Approved" },
];
