// const { PrismaClient } = require("@prisma/client");
import { PrismaClient } from "@prisma/client";
import fs from "fs";

let data = JSON.parse(fs.readFileSync("customers.json"));
data = data.map((item) => ({
  firstName: item["First Name"].toString(),
  lastName: item["Last Name"].toString(),
  phone: (item["Mobile Number"] || item.Telephone).toString(),
  email: item.Email.toString(),
  note: item.Note.toString(),
  createdAt: new Date(item.Added),
}));

const prisma = new PrismaClient();
await prisma.client.deleteMany({});
await prisma.client.createMany({ data: data });
