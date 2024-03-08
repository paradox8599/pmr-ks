// remove spaces in client phone numbers

import { keystoneContext as ctx } from "../src/keystone/context";

const prisma = ctx.prisma;

const clients = await prisma.client.findMany({
  where: { phone: { contains: " " } },
});

console.log(`Updating phone for ${clients.length} clients`);

await Promise.all(
  clients.map((c) =>
    prisma.client.update({
      where: { id: c.id },
      data: { phone: c.phone.replaceAll(/\s/g, "") },
    }),
  ),
);
