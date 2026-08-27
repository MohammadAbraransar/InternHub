const mongoose = require("../backend/node_modules/mongoose");
const bcrypt = require("../backend/node_modules/bcryptjs");
const Student = require("../backend/modules/users/student.model");
const Faculty = require("../backend/modules/users/faculty.model");
const HOD = require("../backend/modules/users/hod.model");
const Coordinator = require("../backend/modules/users/coordinator.model");
require("../backend/node_modules/dotenv").config({ path: "../backend/.env" });

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB...");

        // Clear existing data
        await Student.deleteMany({});
        await Faculty.deleteMany({});
        await HOD.deleteMany({});
        await Coordinator.deleteMany({});

        const password = await bcrypt.hash("password123", 10);

        const student = new Student({
            name: "Test Student",
            email: "student@anurag.edu.in",
            password,
            enrollmentId: "123456",
            department: "CSE",
        });

        const faculty = new Faculty({
            name: "Test Faculty",
            email: "faculty@anurag.edu.in",
            password,
            department: "CSE",
        });

        const hod = new HOD({
            name: "Test HOD",
            email: "hod@anurag.edu.in",
            password,
            department: "CSE",
        });

        const coordinator = new Coordinator({
            name: "Test Coordinator",
            email: "coordinator@anurag.edu.in",
            password,
        });

        await student.save();
        await faculty.save();
        await hod.save();
        await coordinator.save();

        console.log("Database seeded successfully!");
        console.log("Users created:");
        console.log("Student: student@anurag.edu.in / password123");
        console.log("Faculty: faculty@anurag.edu.in / password123");
        console.log("HOD: hod@anurag.edu.in / password123");
        console.log("Coordinator: coordinator@anurag.edu.in / password123");

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
