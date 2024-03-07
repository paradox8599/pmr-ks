import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";

let data = JSON.parse(fs.readFileSync("customers.json").toString());
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
data  = data.map((item: any) => ({
  // name: `${item["First Name"]} ${item["Last Name"]}`.trim(),
  firstName: item["First Name"].toString(),
  lastName: item["Last Name"].toString(),
  phone: (item["Mobile Number"] || item.Telephone).toString(),
  email: item.Email.toString(),
  note: item.Note.toString(),
  createdAt: new Date(item.Added),
}));

await prisma.client.deleteMany({});
await prisma.client.createMany({ data: data });
