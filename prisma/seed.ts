import { PrismaClient, Role, SrudentRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Create Users with different roles


  const mentorUser = await prisma.user.create({
    data: {
      kindeId: "kinde_mentor1",
      email: "mentor@example.com",
      name: "Jane Mentor",
      avatarUrl: "https://ui-avatars.com/api/?name=Jane+Mentor",
      role: Role.MENTOR,
      isRegistered: true,
      mentor: {
        create: {
          mentorName: "Jane Mentor",
          currentCompany: "Tech Corp",
          jobTitle: "Senior Software Engineer",
          experience: "8 years",
          industry: "Technology",
          pinCode: 400002,
          state: "Maharashtra",
          hiringFields: ["Full Stack", "Machine Learning", "Cloud Computing"],
          availability: {
            create: {
              daysAvailable: ["Monday", "Wednesday", "Friday"],
              startTime: "10:00",
              endTime: "18:00"
            }
          }
        }
      }
    }
  });



  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });